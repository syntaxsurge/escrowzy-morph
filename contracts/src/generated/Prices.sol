// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

// Auto-generated price constants
// Generated at: 2025-08-15T05:37:31.258Z
// USD Prices: Pro=$3, Enterprise=$5

library Prices {
    // Chain IDs
    uint256 public constant CHAIN_MORPHTESTNET = 2810;
    uint256 public constant CHAIN_MORPHMAINNET = 2818;

    // Get subscription prices for a specific chain
    function getPrices(uint256 chainId) internal pure returns (uint256 proPrice, uint256 enterprisePrice) {
        if (chainId == 2810) {
            // morphTestnet (ETH)
            return (649602335103861, 1082670558506434);
        }
        else if (chainId == 2818) {
            // morphMainnet (ETH)
            return (649602335103861, 1082670558506434);
        }
        else {
            // Default fallback prices
            revert("Unsupported chain ID");
        }
    }
    
    // Get pro subscription price for a specific chain
    function getProPrice(uint256 chainId) internal pure returns (uint256) {
        (uint256 proPrice, ) = getPrices(chainId);
        return proPrice;
    }
    
    // Get enterprise subscription price for a specific chain
    function getEnterprisePrice(uint256 chainId) internal pure returns (uint256) {
        (, uint256 enterprisePrice) = getPrices(chainId);
        return enterprisePrice;
    }
    
    // Get native currency symbol for a specific chain
    function getNativeCurrencySymbol(uint256 chainId) internal pure returns (string memory) {
        if (chainId == 2810) {
            return "ETH";
        }
        else if (chainId == 2818) {
            return "ETH";
        }
        else {
            return "NATIVE";
        }
    }
}
