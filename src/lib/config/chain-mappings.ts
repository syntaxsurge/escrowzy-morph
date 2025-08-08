/**
 * Centralized chain configuration and mappings
 * Single source of truth for all chain-related data
 */

export interface ChainConfig {
  chainId: string
  name: string
  shortName?: string
  nativeCurrency: {
    symbol: string
    decimals: number
  }
  isTestnet: boolean
  mainnetId?: string // For testnets, points to mainnet equivalent
  okxSupported: boolean
  coingeckoId?: string // For price lookups
}

// Complete chain configuration
export const CHAINS: Record<string, ChainConfig> = {
  // ============ MAINNETS ============
  '1': {
    chainId: '1',
    name: 'Ethereum',
    shortName: 'eth',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'ethereum'
  },
  '56': {
    chainId: '56',
    name: 'BSC',
    shortName: 'bsc',
    nativeCurrency: { symbol: 'BNB', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'binancecoin'
  },
  '137': {
    chainId: '137',
    name: 'Polygon',
    shortName: 'polygon',
    nativeCurrency: { symbol: 'MATIC', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'matic-network'
  },
  '42161': {
    chainId: '42161',
    name: 'Arbitrum',
    shortName: 'arbitrum',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'ethereum'
  },
  '10': {
    chainId: '10',
    name: 'Optimism',
    shortName: 'optimism',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'ethereum'
  },
  '43114': {
    chainId: '43114',
    name: 'Avalanche',
    shortName: 'avalanche',
    nativeCurrency: { symbol: 'AVAX', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'avalanche-2'
  },
  '8453': {
    chainId: '8453',
    name: 'Base',
    shortName: 'base',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'ethereum'
  },
  '324': {
    chainId: '324',
    name: 'zkSync Era',
    shortName: 'zksync',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'ethereum'
  },
  '59144': {
    chainId: '59144',
    name: 'Linea',
    shortName: 'linea',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'ethereum'
  },
  '534352': {
    chainId: '534352',
    name: 'Scroll',
    shortName: 'scroll',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'ethereum'
  },
  '250': {
    chainId: '250',
    name: 'Fantom',
    shortName: 'fantom',
    nativeCurrency: { symbol: 'FTM', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'fantom'
  },
  '25': {
    chainId: '25',
    name: 'Cronos',
    shortName: 'cronos',
    nativeCurrency: { symbol: 'CRO', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'crypto-com-chain'
  },
  '169': {
    chainId: '169',
    name: 'Manta Pacific',
    shortName: 'manta',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'ethereum'
  },
  '81457': {
    chainId: '81457',
    name: 'Blast',
    shortName: 'blast',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'ethereum'
  },
  '196': {
    chainId: '196',
    name: 'X Layer',
    shortName: 'xlayer',
    nativeCurrency: { symbol: 'OKB', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'okb'
  },
  '100': {
    chainId: '100',
    name: 'Gnosis',
    shortName: 'gnosis',
    nativeCurrency: { symbol: 'XDAI', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'xdai'
  },
  '5000': {
    chainId: '5000',
    name: 'Mantle',
    shortName: 'mantle',
    nativeCurrency: { symbol: 'MNT', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'mantle'
  },
  '1101': {
    chainId: '1101',
    name: 'Polygon zkEVM',
    shortName: 'polygon-zkevm',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'ethereum'
  },
  '66': {
    chainId: '66',
    name: 'OKTC',
    shortName: 'oktc',
    nativeCurrency: { symbol: 'OKT', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'oec-token'
  },
  '204': {
    chainId: '204',
    name: 'opBNB',
    shortName: 'opbnb',
    nativeCurrency: { symbol: 'BNB', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'binancecoin'
  },
  '167000': {
    chainId: '167000',
    name: 'Taiko',
    shortName: 'taiko',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'ethereum'
  },
  '34443': {
    chainId: '34443',
    name: 'Mode',
    shortName: 'mode',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'ethereum'
  },
  '7000': {
    chainId: '7000',
    name: 'Zeta',
    shortName: 'zeta',
    nativeCurrency: { symbol: 'ZETA', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'zetachain'
  },
  '4200': {
    chainId: '4200',
    name: 'Merlin',
    shortName: 'merlin',
    nativeCurrency: { symbol: 'BTC', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'bitcoin'
  },
  '369': {
    chainId: '369',
    name: 'PulseChain',
    shortName: 'pulsechain',
    nativeCurrency: { symbol: 'PLS', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'pulsechain'
  },
  '1329': {
    chainId: '1329',
    name: 'Sei EVM',
    shortName: 'sei-evm',
    nativeCurrency: { symbol: 'SEI', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'sei-network'
  },
  '33139': {
    chainId: '33139',
    name: 'ApeChain',
    shortName: 'apechain',
    nativeCurrency: { symbol: 'APE', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'apecoin'
  },
  '88888': {
    chainId: '88888',
    name: 'Chiliz Chain',
    shortName: 'chiliz',
    nativeCurrency: { symbol: 'CHZ', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'chiliz'
  },
  '13371': {
    chainId: '13371',
    name: 'Immutable zkEVM',
    shortName: 'immutable-zkevm',
    nativeCurrency: { symbol: 'IMX', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'immutable-x'
  },
  '130': {
    chainId: '130',
    name: 'Unichain',
    shortName: 'unichain',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'ethereum'
  },
  '1030': {
    chainId: '1030',
    name: 'Conflux eSpace',
    shortName: 'conflux',
    nativeCurrency: { symbol: 'CFX', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'conflux-token'
  },
  '200901': {
    chainId: '200901',
    name: 'Bitlayer',
    shortName: 'bitlayer',
    nativeCurrency: { symbol: 'BTC', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'bitcoin'
  },
  '60808': {
    chainId: '60808',
    name: 'BOB',
    shortName: 'bob',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'ethereum'
  },
  '10001': {
    chainId: '10001',
    name: 'EthereumPoW',
    shortName: 'ethw',
    nativeCurrency: { symbol: 'ETHW', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'ethereum-pow'
  },
  '4689': {
    chainId: '4689',
    name: 'IoTeX',
    shortName: 'iotex',
    nativeCurrency: { symbol: 'IOTX', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'iotex'
  },
  '146': {
    chainId: '146',
    name: 'Sonic',
    shortName: 'sonic',
    nativeCurrency: { symbol: 'S', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'sonic'
  },
  '223': {
    chainId: '223',
    name: 'B² Network',
    shortName: 'b2',
    nativeCurrency: { symbol: 'BTC', decimals: 18 },
    isTestnet: false,
    okxSupported: true,
    coingeckoId: 'bitcoin'
  },
  '2818': {
    chainId: '2818',
    name: 'Morph',
    shortName: 'morph',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    isTestnet: false,
    okxSupported: false,
    coingeckoId: 'ethereum'
  },

  // ============ TESTNETS ============
  '11155111': {
    chainId: '11155111',
    name: 'Sepolia',
    shortName: 'sepolia',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    isTestnet: true,
    mainnetId: '1',
    okxSupported: false
  },
  '17000': {
    chainId: '17000',
    name: 'Holesky',
    shortName: 'holesky',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    isTestnet: true,
    mainnetId: '1',
    okxSupported: false
  },
  '5': {
    chainId: '5',
    name: 'Goerli',
    shortName: 'goerli',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    isTestnet: true,
    mainnetId: '1',
    okxSupported: false
  },
  '97': {
    chainId: '97',
    name: 'BSC Testnet',
    shortName: 'bsc-testnet',
    nativeCurrency: { symbol: 'BNB', decimals: 18 },
    isTestnet: true,
    mainnetId: '56',
    okxSupported: false
  },
  '80002': {
    chainId: '80002',
    name: 'Polygon Amoy',
    shortName: 'amoy',
    nativeCurrency: { symbol: 'MATIC', decimals: 18 },
    isTestnet: true,
    mainnetId: '137',
    okxSupported: false
  },
  '80001': {
    chainId: '80001',
    name: 'Mumbai',
    shortName: 'mumbai',
    nativeCurrency: { symbol: 'MATIC', decimals: 18 },
    isTestnet: true,
    mainnetId: '137',
    okxSupported: false
  },
  '421614': {
    chainId: '421614',
    name: 'Arbitrum Sepolia',
    shortName: 'arbitrum-sepolia',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    isTestnet: true,
    mainnetId: '42161',
    okxSupported: false
  },
  '421613': {
    chainId: '421613',
    name: 'Arbitrum Goerli',
    shortName: 'arbitrum-goerli',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    isTestnet: true,
    mainnetId: '42161',
    okxSupported: false
  },
  '11155420': {
    chainId: '11155420',
    name: 'Optimism Sepolia',
    shortName: 'optimism-sepolia',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    isTestnet: true,
    mainnetId: '10',
    okxSupported: false
  },
  '420': {
    chainId: '420',
    name: 'Optimism Goerli',
    shortName: 'optimism-goerli',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    isTestnet: true,
    mainnetId: '10',
    okxSupported: false
  },
  '43113': {
    chainId: '43113',
    name: 'Avalanche Fuji',
    shortName: 'fuji',
    nativeCurrency: { symbol: 'AVAX', decimals: 18 },
    isTestnet: true,
    mainnetId: '43114',
    okxSupported: false
  },
  '84532': {
    chainId: '84532',
    name: 'Base Sepolia',
    shortName: 'base-sepolia',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    isTestnet: true,
    mainnetId: '8453',
    okxSupported: false
  },
  '84531': {
    chainId: '84531',
    name: 'Base Goerli',
    shortName: 'base-goerli',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    isTestnet: true,
    mainnetId: '8453',
    okxSupported: false
  },
  '300': {
    chainId: '300',
    name: 'zkSync Sepolia',
    shortName: 'zksync-sepolia',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    isTestnet: true,
    mainnetId: '324',
    okxSupported: false
  },
  '280': {
    chainId: '280',
    name: 'zkSync Goerli',
    shortName: 'zksync-goerli',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    isTestnet: true,
    mainnetId: '324',
    okxSupported: false
  },
  '59141': {
    chainId: '59141',
    name: 'Linea Sepolia',
    shortName: 'linea-sepolia',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    isTestnet: true,
    mainnetId: '59144',
    okxSupported: false
  },
  '59140': {
    chainId: '59140',
    name: 'Linea Goerli',
    shortName: 'linea-goerli',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    isTestnet: true,
    mainnetId: '59144',
    okxSupported: false
  },
  '534351': {
    chainId: '534351',
    name: 'Scroll Sepolia',
    shortName: 'scroll-sepolia',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    isTestnet: true,
    mainnetId: '534352',
    okxSupported: false
  },
  '195': {
    chainId: '195',
    name: 'X Layer Testnet',
    shortName: 'xlayer-testnet',
    nativeCurrency: { symbol: 'OKB', decimals: 18 },
    isTestnet: true,
    mainnetId: '196',
    okxSupported: false
  },
  '80094': {
    chainId: '80094',
    name: 'Berachain Testnet',
    shortName: 'berachain-testnet',
    nativeCurrency: { symbol: 'BERA', decimals: 18 },
    isTestnet: true,
    okxSupported: true
  },
  '2810': {
    chainId: '2810',
    name: 'Morph Testnet',
    shortName: 'morph-testnet',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    isTestnet: true,
    mainnetId: '2818',
    okxSupported: false
  }
}

// ============ HELPER FUNCTIONS ============

/**
 * Get chain configuration by ID
 */
export function getChainConfig(
  chainId: string | number
): ChainConfig | undefined {
  return CHAINS[String(chainId)]
}

/**
 * Get chain ID from chain name (handles various formats)
 */
export function getChainIdByName(chainName: string): string | null {
  const normalizedName = chainName.toLowerCase().trim()

  // First check if it's already a chain ID
  if (CHAINS[normalizedName]) {
    return normalizedName
  }

  // Search by name or shortName
  for (const [chainId, config] of Object.entries(CHAINS)) {
    if (
      config.name.toLowerCase() === normalizedName ||
      config.shortName?.toLowerCase() === normalizedName ||
      // Handle special cases
      (normalizedName === 'ethereum' && chainId === '1') ||
      (normalizedName === 'eth' && chainId === '1') ||
      (normalizedName === 'binance' && chainId === '56') ||
      (normalizedName === 'matic' && chainId === '137') ||
      (normalizedName === 'avax' && chainId === '43114')
    ) {
      return chainId
    }
  }

  return null
}

/**
 * Get chain name from ID
 */
export function getChainName(chainId: string | number): string {
  const config = getChainConfig(chainId)
  return config?.name || `Chain ${chainId}`
}

/**
 * Get native currency for a chain
 */
export function getChainNativeCurrency(chainId: string | number): {
  symbol: string
  decimals: number
} {
  const config = getChainConfig(chainId)
  return config?.nativeCurrency || { symbol: 'ETH', decimals: 18 }
}

/**
 * Check if chain is supported by OKX
 */
export function isChainSupportedByOKX(chainId: string | number): boolean {
  const config = getChainConfig(chainId)
  if (!config) return false

  // If it's a testnet, check if its mainnet is supported
  if (config.isTestnet && config.mainnetId) {
    const mainnetConfig = getChainConfig(config.mainnetId)
    return mainnetConfig?.okxSupported || false
  }

  return config.okxSupported
}

/**
 * Get mainnet chain ID for a given chain (returns same ID for mainnets)
 */
export function getMainnetChainId(chainId: string | number): string {
  const config = getChainConfig(chainId)
  if (!config) return String(chainId)

  // If it's a testnet with a mainnet mapping, return the mainnet ID
  if (config.isTestnet && config.mainnetId) {
    return config.mainnetId
  }

  // Otherwise return the same chain ID
  return config.chainId
}

/**
 * Get CoinGecko ID for price lookups
 */
export function getCoingeckoId(chainId: string | number): string | undefined {
  const config = getChainConfig(chainId)

  // If it's a testnet, get the coingecko ID from its mainnet
  if (config?.isTestnet && config.mainnetId) {
    const mainnetConfig = getChainConfig(config.mainnetId)
    return mainnetConfig?.coingeckoId
  }

  return config?.coingeckoId
}

/**
 * Get chain index for OKX API (maps testnets to mainnets)
 */
export function getChainIndex(chainId: string | number): string {
  const config = getChainConfig(chainId)

  // Only return a mainnet mapping if the chain is supported by OKX
  if (config?.okxSupported) {
    return getMainnetChainId(chainId)
  }

  // For unsupported chains, throw an error instead of returning a wrong chain ID
  throw new Error(`Chain ${chainId} is not supported by OKX DEX`)
}

/**
 * Get all supported mainnet chain IDs
 */
export function getSupportedMainnetChainIds(): string[] {
  return Object.entries(CHAINS)
    .filter(([_, config]) => !config.isTestnet && config.okxSupported)
    .map(([chainId]) => chainId)
}

/**
 * Check if a chain is a testnet
 */
export function isTestnet(chainId: string | number): boolean {
  const config = getChainConfig(chainId)
  return config?.isTestnet || false
}
