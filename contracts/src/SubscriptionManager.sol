// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title SubscriptionManager
/// @notice Accepts native currency payments to activate or extend a team's subscription.
contract SubscriptionManager is AccessControl, ReentrancyGuard {
    // Custom errors for better gas efficiency and debugging
    error IncorrectPaymentAmount(uint256 received, uint256 expected);
    error PlanNotFound(uint8 planKey);
    error PlanAlreadyExists(uint8 planKey);
    error InvalidAddress(address provided);
    error InsufficientEarnings(uint256 requested, uint256 available);
    error InvalidWithdrawalAmount();
    error TokenNotSupported(address token);
    error InvalidRange(uint256 startIndex, uint256 endIndex);
    error IndexOutOfBounds(uint256 index, uint256 length);
    error EmptyName(string field);
    error CannotDeleteFreePlan();
    error WithdrawalFailed();
    error TransferFailed();
    /* -------------------------------------------------------------------------- */
    /*                                   ROLES                                    */
    /* -------------------------------------------------------------------------- */

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    /* -------------------------------------------------------------------------- */
    /*                                 CONSTANTS                                  */
    /* -------------------------------------------------------------------------- */

    /// @dev All plans grant 30 days of service per payment.
    uint256 public constant PERIOD = 30 days;

    /* -------------------------------------------------------------------------- */
    /*                                 STORAGE                                    */
    /* -------------------------------------------------------------------------- */

    /// team wallet → Unix timestamp (seconds) until which the subscription is active
    mapping(address => uint256) private _paidUntil;
    
    /// team wallet → active plan key
    mapping(address => uint8) private _activePlan;

    /// planKey (1 = Pro, 2 = Enterprise, others reserved) → price in wei
    mapping(uint8 => uint256) public planPriceWei;

    /// @dev Plan details structure
    struct Plan {
        uint8 planKey;
        string name;
        string displayName;
        string description;
        uint256 priceWei;
        uint256 maxMembers;
        string[] features;
        bool isActive;
        uint256 sortOrder;
        bool isTeamPlan;
        uint256 feeTierBasisPoints; // Fee tier in basis points (e.g., 250 = 2.5%)
    }

    /// @dev planKey → Plan details
    mapping(uint8 => Plan) public plans;

    /// @dev Array of all plan keys for enumeration
    uint8[] public planKeys;

    /// @dev Track if a plan key exists
    mapping(uint8 => bool) public planExists;

    /// @dev Total earnings accumulated from subscription payments
    uint256 public totalEarnings;

    /// @dev Total earnings withdrawn by admin
    uint256 public totalWithdrawn;

    /// @dev Supported ERC20 token addresses for payments
    mapping(address => bool) public supportedTokens;

    /// @dev Token address → total earnings for that token
    mapping(address => uint256) public tokenEarnings;

    /// @dev Token address → total withdrawn for that token
    mapping(address => uint256) public tokenWithdrawn;

    /// @dev Earnings history for tracking individual payments
    struct EarningRecord {
        address payer;
        address team;
        uint8 planKey;
        uint256 amount;
        address token; // address(0) for native currency
        uint256 timestamp;
    }

    /// @dev Array of all earning records
    EarningRecord[] public earningRecords;

    /* -------------------------------------------------------------------------- */
    /*                                   EVENTS                                   */
    /* -------------------------------------------------------------------------- */

    event SubscriptionPaid(address indexed team, uint8 indexed planKey, uint256 paidUntil);
    event EarningsWithdrawn(address indexed to, uint256 amount, address indexed token);
    event TokenSupportUpdated(address indexed token, bool supported);
    event PlanCreated(uint8 indexed planKey, string name, uint256 priceWei);
    event PlanUpdated(uint8 indexed planKey, string name, uint256 priceWei);
    event PlanDeleted(uint8 indexed planKey);

    /* -------------------------------------------------------------------------- */
    /*                                CONSTRUCTOR                                 */
    /* -------------------------------------------------------------------------- */

    /// @param admin         Address receiving DEFAULT_ADMIN_ROLE and ADMIN_ROLE.
    /// @param priceWeiPro  Initial price for the Pro plan (planKey = 1).
    /// @param priceWeiEnterprise  Initial price for the Enterprise plan (planKey = 2).
    constructor(address admin, uint256 priceWeiPro, uint256 priceWeiEnterprise) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);

        planPriceWei[1] = priceWeiPro;
        planPriceWei[2] = priceWeiEnterprise;

        // Initialize default plans
        _createDefaultPlans(priceWeiPro, priceWeiEnterprise);
    }

    /// @dev Initialize default plans during deployment
    function _createDefaultPlans(uint256 priceWeiPro, uint256 priceWeiEnterprise) internal {
        // Free Plan (planKey = 0)
        string[] memory freeFeatures = new string[](2);
        freeFeatures[0] = "Basic escrow protection";
        freeFeatures[1] = "Community support";
        
        plans[0] = Plan({
            planKey: 0,
            name: "free",
            displayName: "Free",
            description: "Perfect for getting started",
            priceWei: 0,
            maxMembers: 3,
            features: freeFeatures,
            isActive: true,
            sortOrder: 1,
            isTeamPlan: false,
            feeTierBasisPoints: 250 // 2.5%
        });
        planKeys.push(0);
        planExists[0] = true;

        // Pro Plan (planKey = 1)
        string[] memory proFeatures = new string[](3);
        proFeatures[0] = "Priority dispute resolution";
        proFeatures[1] = "Advanced escrow features";
        proFeatures[2] = "Priority support";
        
        plans[1] = Plan({
            planKey: 1,
            name: "pro",
            displayName: "Pro",
            description: "For growing teams",
            priceWei: priceWeiPro,
            maxMembers: 25,
            features: proFeatures,
            isActive: true,
            sortOrder: 2,
            isTeamPlan: false,
            feeTierBasisPoints: 200 // 2.0%
        });
        planKeys.push(1);
        planExists[1] = true;

        // Enterprise Plan (planKey = 2)
        string[] memory enterpriseFeatures = new string[](4);
        enterpriseFeatures[0] = "API access for integrations";
        enterpriseFeatures[1] = "24/7 premium support";
        enterpriseFeatures[2] = "Priority dispute resolution";
        enterpriseFeatures[3] = "Custom smart contract features";
        
        plans[2] = Plan({
            planKey: 2,
            name: "enterprise",
            displayName: "Enterprise",
            description: "For large organizations",
            priceWei: priceWeiEnterprise,
            maxMembers: type(uint256).max, // Unlimited
            features: enterpriseFeatures,
            isActive: true,
            sortOrder: 3,
            isTeamPlan: false,
            feeTierBasisPoints: 150 // 1.5%
        });
        planKeys.push(2);
        planExists[2] = true;
        
        // Team Pro Plan (planKey = 3)
        string[] memory teamProFeatures = new string[](4);
        teamProFeatures[0] = "Shared escrow management";
        teamProFeatures[1] = "Team dispute resolution";
        teamProFeatures[2] = "Consolidated billing";
        teamProFeatures[3] = "Team activity tracking";
        
        plans[3] = Plan({
            planKey: 3,
            name: "team_pro",
            displayName: "Team Pro",
            description: "Pro features for your entire team",
            priceWei: priceWeiPro * 3, // 3x individual price
            maxMembers: 25,
            features: teamProFeatures,
            isActive: true,
            sortOrder: 4,
            isTeamPlan: true,
            feeTierBasisPoints: 200 // 2.0%
        });
        planKeys.push(3);
        planExists[3] = true;
        planPriceWei[3] = priceWeiPro * 3;
        
        // Team Enterprise Plan (planKey = 4)
        string[] memory teamEnterpriseFeatures = new string[](5);
        teamEnterpriseFeatures[0] = "Unlimited team members";
        teamEnterpriseFeatures[1] = "Team API access";
        teamEnterpriseFeatures[2] = "White-label options";
        teamEnterpriseFeatures[3] = "Dedicated team support";
        teamEnterpriseFeatures[4] = "Custom contract deployment";
        
        plans[4] = Plan({
            planKey: 4,
            name: "team_enterprise",
            displayName: "Team Enterprise",
            description: "Enterprise features for large teams",
            priceWei: priceWeiEnterprise * 3, // 3x individual price
            maxMembers: type(uint256).max,
            features: teamEnterpriseFeatures,
            isActive: true,
            sortOrder: 5,
            isTeamPlan: true,
            feeTierBasisPoints: 150 // 1.5%
        });
        planKeys.push(4);
        planExists[4] = true;
        planPriceWei[4] = priceWeiEnterprise * 3;
    }

    /* -------------------------------------------------------------------------- */
    /*                               ADMIN ACTIONS                                */
    /* -------------------------------------------------------------------------- */

    /// @notice Update the wei price for a given plan.
    function setPlanPrice(uint8 planKey, uint256 newPriceWei) external onlyRole(ADMIN_ROLE) {
        if (!planExists[planKey]) {
            revert PlanNotFound(planKey);
        }
        planPriceWei[planKey] = newPriceWei;
        plans[planKey].priceWei = newPriceWei;
        emit PlanUpdated(planKey, plans[planKey].name, newPriceWei);
    }

    /// @notice Create a new subscription plan
    function createPlan(
        uint8 planKey,
        string memory name,
        string memory displayName,
        string memory description,
        uint256 priceWei,
        uint256 maxMembers,
        string[] memory features,
        bool isActive,
        uint256 sortOrder,
        bool isTeamPlan,
        uint256 feeTierBasisPoints
    ) external onlyRole(ADMIN_ROLE) {
        if (planExists[planKey]) {
            revert PlanAlreadyExists(planKey);
        }
        if (bytes(name).length == 0) {
            revert EmptyName("name");
        }
        if (bytes(displayName).length == 0) {
            revert EmptyName("displayName");
        }

        plans[planKey] = Plan({
            planKey: planKey,
            name: name,
            displayName: displayName,
            description: description,
            priceWei: priceWei,
            maxMembers: maxMembers,
            features: features,
            isActive: isActive,
            sortOrder: sortOrder,
            isTeamPlan: isTeamPlan,
            feeTierBasisPoints: feeTierBasisPoints
        });

        planKeys.push(planKey);
        planExists[planKey] = true;
        planPriceWei[planKey] = priceWei;

        emit PlanCreated(planKey, name, priceWei);
    }

    /// @notice Update an existing subscription plan
    function updatePlan(
        uint8 planKey,
        string memory name,
        string memory displayName,
        string memory description,
        uint256 priceWei,
        uint256 maxMembers,
        string[] memory features,
        bool isActive,
        uint256 sortOrder,
        bool isTeamPlan,
        uint256 feeTierBasisPoints
    ) external onlyRole(ADMIN_ROLE) {
        if (!planExists[planKey]) {
            revert PlanNotFound(planKey);
        }
        if (bytes(name).length == 0) {
            revert EmptyName("name");
        }
        if (bytes(displayName).length == 0) {
            revert EmptyName("displayName");
        }

        plans[planKey].name = name;
        plans[planKey].displayName = displayName;
        plans[planKey].description = description;
        plans[planKey].priceWei = priceWei;
        plans[planKey].maxMembers = maxMembers;
        plans[planKey].features = features;
        plans[planKey].isActive = isActive;
        plans[planKey].sortOrder = sortOrder;
        plans[planKey].isTeamPlan = isTeamPlan;
        plans[planKey].feeTierBasisPoints = feeTierBasisPoints;

        planPriceWei[planKey] = priceWei;

        emit PlanUpdated(planKey, name, priceWei);
    }

    /// @notice Delete a subscription plan
    function deletePlan(uint8 planKey) external onlyRole(ADMIN_ROLE) {
        if (!planExists[planKey]) {
            revert PlanNotFound(planKey);
        }
        if (planKey == 0) {
            revert CannotDeleteFreePlan();
        }

        // Remove from planKeys array
        for (uint256 i = 0; i < planKeys.length; i++) {
            if (planKeys[i] == planKey) {
                planKeys[i] = planKeys[planKeys.length - 1];
                planKeys.pop();
                break;
            }
        }

        delete plans[planKey];
        delete planPriceWei[planKey];
        planExists[planKey] = false;

        emit PlanDeleted(planKey);
    }

    /// @notice Add or remove support for an ERC20 token
    function setSupportedToken(address token, bool supported) external onlyRole(ADMIN_ROLE) {
        if (token == address(0)) {
            revert InvalidAddress(token);
        }
        supportedTokens[token] = supported;
        emit TokenSupportUpdated(token, supported);
    }

    /// @notice Withdraw native currency earnings to specified address
    function withdrawEarnings(address payable to, uint256 amount) external onlyRole(ADMIN_ROLE) nonReentrant {
        if (to == address(0)) {
            revert InvalidAddress(to);
        }
        if (amount == 0) {
            revert InvalidWithdrawalAmount();
        }
        
        uint256 available = totalEarnings - totalWithdrawn;
        if (amount > available) {
            revert InsufficientEarnings(amount, available);
        }
        
        totalWithdrawn += amount;
        
        (bool success, ) = to.call{value: amount}("");
        if (!success) {
            revert WithdrawalFailed();
        }
        
        emit EarningsWithdrawn(to, amount, address(0));
    }

    /// @notice Withdraw ERC20 token earnings to specified address
    function withdrawTokenEarnings(address token, address to, uint256 amount) external onlyRole(ADMIN_ROLE) nonReentrant {
        if (token == address(0)) {
            revert InvalidAddress(token);
        }
        if (to == address(0)) {
            revert InvalidAddress(to);
        }
        if (amount == 0) {
            revert InvalidWithdrawalAmount();
        }
        
        uint256 available = tokenEarnings[token] - tokenWithdrawn[token];
        if (amount > available) {
            revert InsufficientEarnings(amount, available);
        }
        
        tokenWithdrawn[token] += amount;
        
        bool success = IERC20(token).transfer(to, amount);
        if (!success) {
            revert TransferFailed();
        }
        
        emit EarningsWithdrawn(to, amount, token);
    }

    /* -------------------------------------------------------------------------- */
    /*                           P U B L I C  A C T I O N                          */
    /* -------------------------------------------------------------------------- */

    /**
     * @dev Pay exactly the plan price in wei to activate or extend a subscription.
     *      If the team is already active, the new period is appended to the current
     *      expiry; otherwise it starts from `block.timestamp`.
     *
     * @param team     Wallet that owns the Team (can differ from `msg.sender`).
     * @param planKey  Pricing tier identifier (1 = Pro, 2 = Enterprise).
     */
    function paySubscription(address team, uint8 planKey) external payable {
        uint256 price = planPriceWei[planKey];
        if (price == 0 && !planExists[planKey]) {
            revert PlanNotFound(planKey);
        }
        if (msg.value != price) {
            revert IncorrectPaymentAmount(msg.value, price);
        }

        uint256 startTime = _paidUntil[team] > block.timestamp ? _paidUntil[team] : block.timestamp;
        uint256 newExpiry = startTime + PERIOD;
        _paidUntil[team] = newExpiry;
        _activePlan[team] = planKey; // Track the active plan

        // Track earnings
        totalEarnings += msg.value;
        
        // Record the earning
        earningRecords.push(EarningRecord({
            payer: msg.sender,
            team: team,
            planKey: planKey,
            amount: msg.value,
            token: address(0), // native currency
            timestamp: block.timestamp
        }));

        emit SubscriptionPaid(team, planKey, newExpiry);
    }

    /**
     * @dev Pay for subscription using ERC20 tokens
     * @param team     Wallet that owns the Team (can differ from `msg.sender`).
     * @param planKey  Pricing tier identifier (1 = Pro, 2 = Enterprise).
     * @param token    Address of the ERC20 token to use for payment
     * @param amount   Amount of tokens to pay
     */
    function paySubscriptionWithToken(address team, uint8 planKey, address token, uint256 amount) external {
        if (!supportedTokens[token]) {
            revert TokenNotSupported(token);
        }
        uint256 price = planPriceWei[planKey];
        if (price == 0 && !planExists[planKey]) {
            revert PlanNotFound(planKey);
        }
        if (amount != price) {
            revert IncorrectPaymentAmount(amount, price);
        }

        uint256 startTime = _paidUntil[team] > block.timestamp ? _paidUntil[team] : block.timestamp;
        uint256 newExpiry = startTime + PERIOD;
        _paidUntil[team] = newExpiry;
        _activePlan[team] = planKey; // Track the active plan

        // Track token earnings
        tokenEarnings[token] += amount;
        
        // Record the earning
        earningRecords.push(EarningRecord({
            payer: msg.sender,
            team: team,
            planKey: planKey,
            amount: amount,
            token: token,
            timestamp: block.timestamp
        }));

        // Transfer tokens from user to contract
        IERC20(token).transferFrom(msg.sender, address(this), amount);

        emit SubscriptionPaid(team, planKey, newExpiry);
    }

    /* -------------------------------------------------------------------------- */
    /*                                   VIEWS                                    */
    /* -------------------------------------------------------------------------- */

    /// @return Unix timestamp until which the subscription is active (0 if never paid)
    function paidUntil(address team) external view returns (uint256) {
        return _paidUntil[team];
    }

    /// @return Available earnings for native currency
    function getAvailableEarnings() external view returns (uint256) {
        return totalEarnings - totalWithdrawn;
    }

    /// @return Available earnings for a specific token
    function getAvailableTokenEarnings(address token) external view returns (uint256) {
        return tokenEarnings[token] - tokenWithdrawn[token];
    }

    /// @return Total number of earning records
    function getEarningRecordsCount() external view returns (uint256) {
        return earningRecords.length;
    }

    /// @return Earning record at specific index
    function getEarningRecord(uint256 index) external view returns (EarningRecord memory) {
        if (index >= earningRecords.length) {
            revert IndexOutOfBounds(index, earningRecords.length);
        }
        return earningRecords[index];
    }

    /// @return Multiple earning records within a range
    function getEarningRecords(uint256 startIndex, uint256 endIndex) external view returns (EarningRecord[] memory) {
        if (startIndex > endIndex) {
            revert InvalidRange(startIndex, endIndex);
        }
        if (endIndex >= earningRecords.length) {
            revert IndexOutOfBounds(endIndex, earningRecords.length);
        }
        
        uint256 length = endIndex - startIndex + 1;
        EarningRecord[] memory records = new EarningRecord[](length);
        
        for (uint256 i = 0; i < length; i++) {
            records[i] = earningRecords[startIndex + i];
        }
        
        return records;
    }

    /// @notice Get earnings summary with totals and available amounts
    /// @return totalNativeEarnings Total native currency earnings
    /// @return totalNativeWithdrawn Total native currency withdrawn
    /// @return availableNativeEarnings Available native currency for withdrawal
    /// @return recordsCount Total number of earning records
    function getEarningsSummary() external view returns (
        uint256 totalNativeEarnings,
        uint256 totalNativeWithdrawn,
        uint256 availableNativeEarnings,
        uint256 recordsCount
    ) {
        return (
            totalEarnings,
            totalWithdrawn,
            totalEarnings - totalWithdrawn,
            earningRecords.length
        );
    }

    /// @notice Get all plan keys
    /// @return Array of all existing plan keys
    function getAllPlanKeys() external view returns (uint8[] memory) {
        return planKeys;
    }

    /// @notice Get plan details by plan key
    /// @param planKey The plan key to retrieve
    /// @return Plan details
    function getPlan(uint8 planKey) external view returns (Plan memory) {
        if (!planExists[planKey]) {
            revert PlanNotFound(planKey);
        }
        return plans[planKey];
    }

    /// @notice Get all active plans
    /// @return Array of all active plans
    function getAllActivePlans() external view returns (Plan[] memory) {
        uint256 activeCount = 0;
        
        // Count active plans
        for (uint256 i = 0; i < planKeys.length; i++) {
            if (plans[planKeys[i]].isActive) {
                activeCount++;
            }
        }
        
        Plan[] memory activePlans = new Plan[](activeCount);
        uint256 index = 0;
        
        // Fill active plans array
        for (uint256 i = 0; i < planKeys.length; i++) {
            if (plans[planKeys[i]].isActive) {
                activePlans[index] = plans[planKeys[i]];
                index++;
            }
        }
        
        return activePlans;
    }

    /// @notice Get all plans (active and inactive)
    /// @return Array of all plans
    function getAllPlans() external view returns (Plan[] memory) {
        Plan[] memory allPlans = new Plan[](planKeys.length);
        
        for (uint256 i = 0; i < planKeys.length; i++) {
            allPlans[i] = plans[planKeys[i]];
        }
        
        return allPlans;
    }

    /// @notice Check if a plan exists
    /// @param planKey The plan key to check
    /// @return Whether the plan exists
    function planExistsCheck(uint8 planKey) external view returns (bool) {
        return planExists[planKey];
    }

    /// @notice Get plan features for a specific plan
    /// @param planKey The plan key
    /// @return Array of feature strings
    function getPlanFeatures(uint8 planKey) external view returns (string[] memory) {
        if (!planExists[planKey]) {
            revert PlanNotFound(planKey);
        }
        return plans[planKey].features;
    }

    /// @notice Get fee tier in basis points for a specific plan
    /// @param planKey The plan key
    /// @return Fee tier in basis points (e.g., 250 = 2.5%)
    function getPlanFeeTier(uint8 planKey) external view returns (uint256) {
        if (!planExists[planKey]) {
            revert PlanNotFound(planKey);
        }
        return plans[planKey].feeTierBasisPoints;
    }

    /// @notice Get fee tier for a user based on their active subscription
    /// @param team The team address to check
    /// @return Fee tier in basis points
    function getUserFeeTier(address team) external view returns (uint256) {
        // Check if team has active subscription
        if (_paidUntil[team] > block.timestamp && planExists[_activePlan[team]]) {
            return plans[_activePlan[team]].feeTierBasisPoints;
        }
        // Return free tier for users without active subscription
        if (!planExists[0]) {
            revert PlanNotFound(0);
        }
        return plans[0].feeTierBasisPoints;
    }

    /// @notice Get active subscription plan for a team
    /// @param team The team address
    /// @return planKey The active plan key (0 if no active subscription)
    function getActiveSubscriptionPlan(address team) external view returns (uint8) {
        if (_paidUntil[team] > block.timestamp) {
            return _activePlan[team];
        }
        return 0; // Free plan
    }

    /* -------------------------------------------------------------------------- */
    /*                                ERC-165                                     */
    /* -------------------------------------------------------------------------- */

    function supportsInterface(bytes4 id) public view override returns (bool) {
        return super.supportsInterface(id) || id == type(IERC165).interfaceId;
    }
}