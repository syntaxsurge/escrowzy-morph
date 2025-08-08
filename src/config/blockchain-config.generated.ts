// This file is auto-generated. Do not edit directly.
// Generated from: ./config/blockchains.yaml

import type { BlockchainConfig } from './blockchain-config-loader'

export const blockchainConfig: BlockchainConfig = {
  subscriptionPricing: {
    pro: 3,
    enterprise: 5
  },
  chains: {
    morphTestnet: {
      chainId: 2810,
      name: 'Morph Testnet',
      rpcUrl: 'https://rpc-quicknode-holesky.morphl2.io',
      explorerUrl: 'https://explorer-holesky.morphl2.io',
      logo: 'https://i.ibb.co/CKRDCMPP/Frame-1597882262.webp',
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18
      },
      coingeckoId: 'ethereum',
      isTestnet: true,
      contractAddresses: {
        subscriptionManager: '0x9a667b845034dDf18B7a5a9b50e2fe8CD4e6e2C1',
        escrowCore: '0xF5FCDBe9d4247D76c7fa5d2E06dBA1e77887F518',
        achievementNFT: '0x761D0dbB45654513AdF1BF6b5D217C0f8B3c5737'
      }
    },
    morphMainnet: {
      chainId: 2818,
      name: 'Morph',
      rpcUrl: 'https://rpc-quicknode.morphl2.io',
      explorerUrl: 'https://explorer.morphl2.io',
      logo: 'https://i.ibb.co/CKRDCMPP/Frame-1597882262.webp',
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18
      },
      coingeckoId: 'ethereum',
      isTestnet: false,
      contractAddresses: {
        subscriptionManager: '',
        escrowCore: '',
        achievementNFT: ''
      }
    }
  }
}
