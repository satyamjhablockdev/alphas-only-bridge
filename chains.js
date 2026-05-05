// CCTP V2 Testnet chain configurations
// TokenMessengerV2: 0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA (all chains)
// MessageTransmitterV2: 0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275 (all chains)

const CCTP_TOKEN_MESSENGER = '0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA';
const CCTP_MSG_TRANSMITTER = '0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275';
const IRIS_API = 'https://iris-api-sandbox.circle.com';

const CHAINS = {
  // Ethereum Sepolia
  11155111: {
    id: 11155111,
    name: 'Ethereum Sepolia',
    shortName: 'Sepolia',
    domain: 0,
    icon: '⟠',
    color: '#627EEA',
    usdc: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    tokenMessenger: CCTP_TOKEN_MESSENGER,
    msgTransmitter: CCTP_MSG_TRANSMITTER,
    rpc: 'https://rpc.sepolia.org',
    explorer: 'https://sepolia.etherscan.io',
    nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
    params: {
      chainId: '0xAA36A7',
      chainName: 'Sepolia Testnet',
      rpcUrls: ['https://rpc.sepolia.org'],
      nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
      blockExplorerUrls: ['https://sepolia.etherscan.io'],
    },
  },

  // Avalanche Fuji
  43113: {
    id: 43113,
    name: 'Avalanche Fuji',
    shortName: 'Fuji',
    domain: 1,
    icon: '🔺',
    color: '#E84142',
    usdc: '0x5425890298aed601595a70AB815c96711a31Bc65',
    tokenMessenger: CCTP_TOKEN_MESSENGER,
    msgTransmitter: CCTP_MSG_TRANSMITTER,
    rpc: 'https://api.avax-test.network/ext/bc/C/rpc',
    explorer: 'https://testnet.snowtrace.io',
    nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
    params: {
      chainId: '0xA869',
      chainName: 'Avalanche Fuji Testnet',
      rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
      nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
      blockExplorerUrls: ['https://testnet.snowtrace.io'],
    },
  },

  // OP Sepolia
  11155420: {
    id: 11155420,
    name: 'OP Sepolia',
    shortName: 'OP Sepolia',
    domain: 2,
    icon: '🔴',
    color: '#FF0420',
    usdc: '0x5fd84259d66Cd46123540766Be93DFE6D43130D9',
    tokenMessenger: CCTP_TOKEN_MESSENGER,
    msgTransmitter: CCTP_MSG_TRANSMITTER,
    rpc: 'https://sepolia.optimism.io',
    explorer: 'https://sepolia-optimism.etherscan.io',
    nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
    params: {
      chainId: '0xAA37DC',
      chainName: 'OP Sepolia Testnet',
      rpcUrls: ['https://sepolia.optimism.io'],
      nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
      blockExplorerUrls: ['https://sepolia-optimism.etherscan.io'],
    },
  },

  // Arbitrum Sepolia
  421614: {
    id: 421614,
    name: 'Arbitrum Sepolia',
    shortName: 'Arb Sepolia',
    domain: 3,
    icon: '🔵',
    color: '#28A0F0',
    usdc: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
    tokenMessenger: CCTP_TOKEN_MESSENGER,
    msgTransmitter: CCTP_MSG_TRANSMITTER,
    rpc: 'https://sepolia-rollup.arbitrum.io/rpc',
    explorer: 'https://sepolia.arbiscan.io',
    nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
    params: {
      chainId: '0x66EEE',
      chainName: 'Arbitrum Sepolia',
      rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
      nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
      blockExplorerUrls: ['https://sepolia.arbiscan.io'],
    },
  },

  // Base Sepolia
  84532: {
    id: 84532,
    name: 'Base Sepolia',
    shortName: 'Base Sepolia',
    domain: 6,
    icon: '🔷',
    color: '#0052FF',
    usdc: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    tokenMessenger: CCTP_TOKEN_MESSENGER,
    msgTransmitter: CCTP_MSG_TRANSMITTER,
    rpc: 'https://sepolia.base.org',
    explorer: 'https://sepolia.basescan.org',
    nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
    params: {
      chainId: '0x14A34',
      chainName: 'Base Sepolia Testnet',
      rpcUrls: ['https://sepolia.base.org'],
      nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
      blockExplorerUrls: ['https://sepolia.basescan.org'],
    },
  },

  // Polygon Amoy
  80002: {
    id: 80002,
    name: 'Polygon Amoy',
    shortName: 'Amoy',
    domain: 7,
    icon: '🟣',
    color: '#8247E5',
    usdc: '0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582',
    tokenMessenger: CCTP_TOKEN_MESSENGER,
    msgTransmitter: CCTP_MSG_TRANSMITTER,
    rpc: 'https://rpc-amoy.polygon.technology',
    explorer: 'https://amoy.polygonscan.com',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    params: {
      chainId: '0x13882',
      chainName: 'Polygon Amoy Testnet',
      rpcUrls: ['https://rpc-amoy.polygon.technology'],
      nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
      blockExplorerUrls: ['https://amoy.polygonscan.com'],
    },
  },

  // Unichain Sepolia
  1301: {
    id: 1301,
    name: 'Unichain Sepolia',
    shortName: 'Unichain',
    domain: 10,
    icon: '🦄',
    color: '#FC72FF',
    usdc: '0x31d0220469e10c4E71834a79b1f276d740d3768F',
    tokenMessenger: CCTP_TOKEN_MESSENGER,
    msgTransmitter: CCTP_MSG_TRANSMITTER,
    rpc: 'https://sepolia.unichain.org',
    explorer: 'https://sepolia.uniscan.xyz',
    nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
    params: {
      chainId: '0x515',
      chainName: 'Unichain Sepolia',
      rpcUrls: ['https://sepolia.unichain.org'],
      nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
      blockExplorerUrls: ['https://sepolia.uniscan.xyz'],
    },
  },

  // Linea Sepolia
  59141: {
    id: 59141,
    name: 'Linea Sepolia',
    shortName: 'Linea',
    domain: 11,
    icon: '🔲',
    color: '#61DFFF',
    usdc: '0xFEce4462D57bD51A6A552365A011b95f0E16d9B7',
    tokenMessenger: CCTP_TOKEN_MESSENGER,
    msgTransmitter: CCTP_MSG_TRANSMITTER,
    rpc: 'https://rpc.sepolia.linea.build',
    explorer: 'https://sepolia.lineascan.build',
    nativeCurrency: { name: 'Linea ETH', symbol: 'ETH', decimals: 18 },
    params: {
      chainId: '0xE705',
      chainName: 'Linea Sepolia Testnet',
      rpcUrls: ['https://rpc.sepolia.linea.build'],
      nativeCurrency: { name: 'Linea ETH', symbol: 'ETH', decimals: 18 },
      blockExplorerUrls: ['https://sepolia.lineascan.build'],
    },
  },

  // Sonic Testnet
  57054: {
    id: 57054,
    name: 'Sonic Testnet',
    shortName: 'Sonic',
    domain: 13,
    icon: '⚡',
    color: '#4DA2FF',
    usdc: '0x29219dd400f2Bf60E5a23d13Be72B486D4038894',
    tokenMessenger: CCTP_TOKEN_MESSENGER,
    msgTransmitter: CCTP_MSG_TRANSMITTER,
    rpc: 'https://rpc.blaze.soniclabs.com',
    explorer: 'https://testnet.soniclabs.com',
    nativeCurrency: { name: 'Sonic', symbol: 'S', decimals: 18 },
    params: {
      chainId: '0xDEBE',
      chainName: 'Sonic Blaze Testnet',
      rpcUrls: ['https://rpc.blaze.soniclabs.com'],
      nativeCurrency: { name: 'Sonic', symbol: 'S', decimals: 18 },
      blockExplorerUrls: ['https://testnet.soniclabs.com'],
    },
  },

  // World Chain Sepolia
  4801: {
    id: 4801,
    name: 'World Chain Sepolia',
    shortName: 'World Chain',
    domain: 14,
    icon: '🌍',
    color: '#49D49D',
    usdc: '0x66EB0AA028F674f938F5b8E9eE5eee66FdEb6bE3',
    tokenMessenger: CCTP_TOKEN_MESSENGER,
    msgTransmitter: CCTP_MSG_TRANSMITTER,
    rpc: 'https://worldchain-sepolia.g.alchemy.com/public',
    explorer: 'https://worldchain-sepolia.explorer.alchemy.com',
    nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
    params: {
      chainId: '0x12C1',
      chainName: 'World Chain Sepolia',
      rpcUrls: ['https://worldchain-sepolia.g.alchemy.com/public'],
      nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
      blockExplorerUrls: ['https://worldchain-sepolia.explorer.alchemy.com'],
    },
  },

  // Monad Testnet
  10143: {
    id: 10143,
    name: 'Monad Testnet',
    shortName: 'Monad',
    domain: 15,
    icon: '💜',
    color: '#836EF9',
    usdc: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
    tokenMessenger: CCTP_TOKEN_MESSENGER,
    msgTransmitter: CCTP_MSG_TRANSMITTER,
    rpc: 'https://testnet-rpc.monad.xyz',
    explorer: 'https://testnet.monadexplorer.com',
    nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
    params: {
      chainId: '0x279F',
      chainName: 'Monad Testnet',
      rpcUrls: ['https://testnet-rpc.monad.xyz'],
      nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
      blockExplorerUrls: ['https://testnet.monadexplorer.com'],
    },
  },

  // HyperEVM Testnet
  998: {
    id: 998,
    name: 'HyperEVM Testnet',
    shortName: 'HyperEVM',
    domain: 19,
    icon: '🌀',
    color: '#00E5E5',
    usdc: '0x1Cd0cd01c8C902AdAb3430ae04b9ea32CB309CF1',
    tokenMessenger: CCTP_TOKEN_MESSENGER,
    msgTransmitter: CCTP_MSG_TRANSMITTER,
    rpc: 'https://api.hyperliquid-testnet.xyz/evm',
    explorer: 'https://explorer.hyperliquid-testnet.xyz/evm',
    nativeCurrency: { name: 'HYPE', symbol: 'HYPE', decimals: 18 },
    params: {
      chainId: '0x3E6',
      chainName: 'HyperEVM Testnet',
      rpcUrls: ['https://api.hyperliquid-testnet.xyz/evm'],
      nativeCurrency: { name: 'HYPE', symbol: 'HYPE', decimals: 18 },
      blockExplorerUrls: ['https://explorer.hyperliquid-testnet.xyz/evm'],
    },
  },

  // Ink Testnet
  763373: {
    id: 763373,
    name: 'Ink Testnet',
    shortName: 'Ink',
    domain: 21,
    icon: '🖊',
    color: '#9B4DCA',
    usdc: '0x3f0D3b0E7AbB5F9bD8e6B9e3e60A4F6F2c5f3f5A',
    tokenMessenger: CCTP_TOKEN_MESSENGER,
    msgTransmitter: CCTP_MSG_TRANSMITTER,
    rpc: 'https://rpc-gel-sepolia.inkonchain.com',
    explorer: 'https://explorer-sepolia.inkonchain.com',
    nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
    params: {
      chainId: '0xBA50D',
      chainName: 'Ink Sepolia Testnet',
      rpcUrls: ['https://rpc-gel-sepolia.inkonchain.com'],
      nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
      blockExplorerUrls: ['https://explorer-sepolia.inkonchain.com'],
    },
  },

  // Arc Testnet (domain 26) — the main destination
  // Chain ID: 5042002 (0x4CEF52) · Arc uses USDC as native gas token (18 dec)
  // ERC-20 USDC (6 dec) lives at the precompile-style address below — confirmed
  // via Blockscout token-transfers on the Arc testnet TokenMessengerV2.
  5042002: {
    id: 5042002,
    name: 'Arc Testnet',
    shortName: 'Arc',
    domain: 26,
    icon: '◆',
    color: '#942753',
    usdc: '0x3600000000000000000000000000000000000000',
    tokenMessenger: CCTP_TOKEN_MESSENGER,
    msgTransmitter: CCTP_MSG_TRANSMITTER,
    rpc: 'https://rpc.testnet.arc.network',
    explorer: 'https://testnet.arcscan.app',
    nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
    params: {
      chainId: '0x4CEF52',
      chainName: 'Arc Testnet',
      rpcUrls: ['https://rpc.testnet.arc.network'],
      nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
      blockExplorerUrls: ['https://testnet.arcscan.app'],
    },
    featured: true,
  },

  // Morph Hoodi Testnet
  2810: {
    id: 2810,
    name: 'Morph Hoodi',
    shortName: 'Morph',
    domain: 30,
    icon: '🟩',
    color: '#00FF94',
    usdc: '0x9999f7Fea5938fD3b1E26A12c3f2fb024Aa7761a',
    tokenMessenger: CCTP_TOKEN_MESSENGER,
    msgTransmitter: CCTP_MSG_TRANSMITTER,
    rpc: 'https://rpc-quicknode-holesky-morphl2.morphl2.io',
    explorer: 'https://explorer-holesky.morphl2.io',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    params: {
      chainId: '0xAFA',
      chainName: 'Morph Holesky Testnet',
      rpcUrls: ['https://rpc-quicknode-holesky-morphl2.morphl2.io'],
      nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
      blockExplorerUrls: ['https://explorer-holesky.morphl2.io'],
    },
  },
};

// Get chain by domain ID
function getChainByDomain(domain) {
  return Object.values(CHAINS).find(c => c.domain === domain);
}

// Get chain by chain ID
function getChainById(chainId) {
  return CHAINS[chainId] || null;
}

// All chains as array
function getAllChains() {
  return Object.values(CHAINS).sort((a, b) => {
    if (a.featured) return -1;
    if (b.featured) return 1;
    return a.name.localeCompare(b.name);
  });
}
