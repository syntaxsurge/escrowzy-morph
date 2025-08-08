#!/usr/bin/env tsx
// Deployment script for Morph networks using ethers.js
// This bypasses Foundry's chain validation issues

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import dotenv from 'dotenv'
import { ethers } from 'ethers'

// Get __dirname equivalent for ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') })

// Contract ABIs and bytecodes
const SubscriptionManagerArtifact = JSON.parse(
  fs.readFileSync(
    path.join(
      __dirname,
      '../contracts/out/SubscriptionManager.sol/SubscriptionManager.json'
    ),
    'utf-8'
  )
)

const EscrowCoreArtifact = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../contracts/out/EscrowCore.sol/EscrowCore.json'),
    'utf-8'
  )
)

const AchievementNFTArtifact = JSON.parse(
  fs.readFileSync(
    path.join(
      __dirname,
      '../contracts/out/AchievementNFT.sol/AchievementNFT.json'
    ),
    'utf-8'
  )
)

// Network configuration
const NETWORKS = {
  morphTestnet: {
    rpc: 'https://rpc-quicknode-holesky.morphl2.io',
    chainId: 2810,
    proPriceWei: '648972784244671',
    enterprisePriceWei: '1081621307074453',
    name: 'Morph Holesky Testnet'
  },
  morphMainnet: {
    rpc: 'https://rpc-quicknode.morphl2.io',
    chainId: 2818,
    proPriceWei: '648410314046729',
    enterprisePriceWei: '1080683856744548',
    name: 'Morph Mainnet'
  }
}

async function main() {
  const networkName = process.argv[2] || 'morphTestnet'
  const network = NETWORKS[networkName as keyof typeof NETWORKS]

  if (!network) {
    console.error(`Unknown network: ${networkName}`)
    console.log('Available networks:', Object.keys(NETWORKS).join(', '))
    process.exit(1)
  }

  const privateKey = process.env.ADMIN_PRIVATE_KEY
  const adminAddress = process.env.ADMIN_ADDRESS

  if (!privateKey || !adminAddress) {
    console.error(
      'Missing required environment variables: ADMIN_PRIVATE_KEY, ADMIN_ADDRESS'
    )
    process.exit(1)
  }

  console.log(`\n🚀 Deploying to ${network.name}`)
  console.log(`Chain ID: ${network.chainId}`)
  console.log(`RPC URL: ${network.rpc}`)
  console.log(`Admin: ${adminAddress}\n`)

  // Create provider and wallet
  const provider = new ethers.JsonRpcProvider(network.rpc)
  const wallet = new ethers.Wallet(privateKey, provider)

  // Check balance
  const balance = await provider.getBalance(wallet.address)
  console.log(`Deployer balance: ${ethers.formatEther(balance)} ETH\n`)

  if (balance === 0n) {
    console.error('❌ Insufficient balance for deployment')
    process.exit(1)
  }

  try {
    // Deploy SubscriptionManager
    console.log('1. Deploying SubscriptionManager...')
    const SubscriptionManagerFactory = new ethers.ContractFactory(
      SubscriptionManagerArtifact.abi,
      SubscriptionManagerArtifact.bytecode.object,
      wallet
    )

    const subscriptionManager = await SubscriptionManagerFactory.deploy(
      adminAddress,
      network.proPriceWei,
      network.enterprisePriceWei,
      {
        gasLimit: 10000000
      }
    )

    await subscriptionManager.waitForDeployment()
    const subscriptionAddress = await subscriptionManager.getAddress()
    console.log(`✅ SubscriptionManager deployed at: ${subscriptionAddress}\n`)

    // Deploy EscrowCore
    console.log('2. Deploying EscrowCore...')
    const EscrowCoreFactory = new ethers.ContractFactory(
      EscrowCoreArtifact.abi,
      EscrowCoreArtifact.bytecode.object,
      wallet
    )

    const escrowCore = await EscrowCoreFactory.deploy(adminAddress, {
      gasLimit: 10000000
    })

    await escrowCore.waitForDeployment()
    const escrowAddress = await escrowCore.getAddress()
    console.log(`✅ EscrowCore deployed at: ${escrowAddress}\n`)

    // Deploy AchievementNFT
    console.log('3. Deploying AchievementNFT...')
    const AchievementNFTFactory = new ethers.ContractFactory(
      AchievementNFTArtifact.abi,
      AchievementNFTArtifact.bytecode.object,
      wallet
    )

    const achievementNFT = await AchievementNFTFactory.deploy({
      gasLimit: 10000000
    })

    await achievementNFT.waitForDeployment()
    const nftAddress = await achievementNFT.getAddress()
    console.log(`✅ AchievementNFT deployed at: ${nftAddress}\n`)

    // Link EscrowCore with SubscriptionManager
    console.log('4. Linking EscrowCore with SubscriptionManager...')
    const escrowContract = new ethers.Contract(
      escrowAddress,
      EscrowCoreArtifact.abi,
      wallet
    )
    const tx = await escrowContract.setSubscriptionManager(
      subscriptionAddress,
      {
        gasLimit: 1000000
      }
    )
    await tx.wait()
    console.log('✅ Contracts linked successfully!\n')

    // Save deployment info
    const deploymentInfo = {
      subscriptionManager: subscriptionAddress,
      escrowCore: escrowAddress,
      achievementNFT: nftAddress,
      chainId: network.chainId,
      adminAddress,
      timestamp: Math.floor(Date.now() / 1000),
      network: networkName
    }

    const deploymentsDir = path.join(__dirname, '../contracts/deployments')
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true })
    }

    const deploymentFile = path.join(
      deploymentsDir,
      `${network.chainId}-latest.json`
    )
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2))

    // Print summary
    console.log('='.repeat(60))
    console.log('✨ All contracts deployed successfully!')
    console.log('='.repeat(60))
    console.log('')
    console.log('Contract Addresses:')
    console.log(`  SubscriptionManager: ${subscriptionAddress}`)
    console.log(`  EscrowCore: ${escrowAddress}`)
    console.log(`  AchievementNFT: ${nftAddress}`)
    console.log('')
    console.log('Next steps:')
    console.log('1. Update config/blockchains.yaml with these addresses:')
    console.log('')
    console.log('  contractAddresses:')
    console.log(`    subscriptionManager: '${subscriptionAddress}'`)
    console.log(`    escrowCore: '${escrowAddress}'`)
    console.log(`    achievementNFT: '${nftAddress}'`)
    console.log('')
    console.log('2. Run "npm run prebuild" to regenerate configuration')
    console.log('')
  } catch (error) {
    console.error('❌ Deployment failed:', error)
    process.exit(1)
  }
}

main().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
