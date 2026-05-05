// CCTP V2 Testnet chain configurations
// TokenMessengerV2: 0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA (all chains)
// MessageTransmitterV2: 0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275 (all chains)

const CCTP_TOKEN_MESSENGER = '0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA';
const CCTP_MSG_TRANSMITTER = '0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275';
const IRIS_API = 'https://iris-api-sandbox.circle.com';

// ─── Chain logo SVGs ──────────────────────────────────────
// Each is a self-contained 24×24 SVG that scales to any size.
// Reproduced from each chain's official brand mark.

const CHAIN_LOGOS = {
  ethereum: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#627EEA"/><g fill="#fff"><path d="M12.4 4v6.05l5.1 2.27z" fill-opacity=".6"/><path d="M12.4 4L7.3 12.32l5.1-2.27z"/><path d="M12.4 16.05V20l5.1-7.06z" fill-opacity=".6"/><path d="M12.4 20v-3.96L7.3 12.95z"/><path d="M12.4 15.05l5.1-2.73-5.1-2.27z" fill-opacity=".2"/><path d="M7.3 12.32l5.1 2.73V10z" fill-opacity=".6"/></g></svg>`,

  avalanche: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#E84142"/><path d="M14.85 7.7l5.45 9.45h-3.5L14.6 13.7l-1.35 2.4-2.05-3.55 1.7-2.95.95-1.55a1.2 1.2 0 011.05-.6 1.2 1.2 0 011.05.6zM10.65 15l-2.05 3.55a1.2 1.2 0 01-1.05.6H4.05a1.2 1.2 0 01-1.05-.6 1.2 1.2 0 010-1.2L7.55 9.5a1.2 1.2 0 011.05-.6 1.2 1.2 0 011.05.6L11.7 11.5z" fill="#fff"/></svg>`,

  optimism: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#FF0420"/><path d="M8.4 15.4q-1.5 0-2.4-.85-.85-.9-.85-2.45 0-.3.05-.7.2-1.65 1.05-2.6.85-1 2.5-1 1.5 0 2.4.9t.9 2.4q0 .35-.05.7-.25 1.7-1.1 2.65-.85.95-2.5.95zm.15-1.45q.65 0 1.1-.4.45-.4.65-1.2.05-.3.1-.65.05-.4.05-.65 0-.7-.35-1.1-.35-.4-1-.4-.65 0-1.1.4-.5.4-.7 1.2-.05.25-.1.65-.05.35-.05.65 0 .7.35 1.1.35.4 1.05.4zm6.3-2.45h1.2q.55 0 .85-.25.3-.25.4-.7l.05-.4q.05-.4-.15-.6-.2-.25-.7-.25h-1.2zM12.45 15l1.05-7h2.4q1.4 0 2.05.6.65.6.45 1.85l-.05.4q-.2 1.1-.95 1.65-.75.5-2 .5h-1.45l-.35 2z" fill="#fff"/></svg>`,

  arbitrum: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#213147"/><circle cx="12" cy="12" r="11" fill="#12AAFF" fill-opacity="0"/><path d="M12.85 5.5l5.5 8.95-2.4 1.4-3.1-5-2.6 4.2-2.4-1.4z" fill="#28A0F0"/><path d="M14.65 13.65l-1 1.65 2.4 1.4 1-1.65z" fill="#fff"/><path d="M5 12.7v3.65L8.5 18.5l1.4-2.3-3.45-2-1.45-1.5z" fill="#96BEDC"/></svg>`,

  base: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#0052FF"/><path d="M11.95 19.5a7.5 7.5 0 100-15 7.5 7.5 0 00-7.45 6.75h11.05v1.5H4.5a7.5 7.5 0 007.45 6.75z" fill="#fff"/></svg>`,

  polygon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#8247E5"/><path d="M15.7 9.5l-2.05-1.18a.5.5 0 00-.5 0L11 9.5l-1.45.85-2.05 1.18a.5.5 0 01-.5 0L5.4 10.5a.5.5 0 01-.25-.43V8.42a.5.5 0 01.25-.43l1.6-.93a.5.5 0 01.5 0l1.6.93a.5.5 0 01.25.43v1.18l1.45-.85V7.55a.5.5 0 00-.25-.43L7.55 5.5a.5.5 0 00-.5 0l-3 1.7a.5.5 0 00-.25.42v3.4a.5.5 0 00.25.43l3 1.7a.5.5 0 00.5 0L9.6 12 11 11.13l2.05-1.18a.5.5 0 01.5 0L15.2 11a.5.5 0 01.25.43v1.65a.5.5 0 01-.25.43l-1.6.93a.5.5 0 01-.5 0l-1.6-.93a.5.5 0 01-.25-.43v-1.18L9.8 12.7v1.18a.5.5 0 00.25.43l3 1.7a.5.5 0 00.5 0l3-1.7a.5.5 0 00.25-.43v-3.4a.5.5 0 00-.25-.43l-1.85-1.05z" fill="#fff"/></svg>`,

  unichain: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#FC72FF"/><path d="M12 4.5L5.5 8.5v7L12 19.5l6.5-4v-7zm0 1.85l4.5 2.65v6L12 17.65 7.5 15v-6zM12 9.5l-2.5 1.5v3l2.5 1.5 2.5-1.5v-3z" fill="#fff"/></svg>`,

  linea: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#121212"/><path d="M7 7v10h10v-2.5h-7.5V7H7z" fill="#fff"/><circle cx="15" cy="9" r="2" fill="#61DFFF"/></svg>`,

  sonic: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#FE9A4D"/><path d="M14.5 4.5L7 13.5h4l-2 6 7.5-9h-4l2-6z" fill="#fff"/></svg>`,

  worldchain: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#000"/><circle cx="12" cy="12" r="6" stroke="#fff" stroke-width="1.4" fill="none"/><path d="M6 12h12" stroke="#fff" stroke-width="1.4"/><path d="M12 6c1.8 1.5 2.7 3.5 2.7 6s-.9 4.5-2.7 6c-1.8-1.5-2.7-3.5-2.7-6s.9-4.5 2.7-6z" stroke="#fff" stroke-width="1.4" fill="none"/></svg>`,

  monad: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#836EF9"/><path d="M12 4.5c-2.6 1.5-4 4.4-4 7.5s1.4 6 4 7.5c-1.5-2.1-2.3-4.7-2.3-7.5s.8-5.4 2.3-7.5z" fill="#fff"/><path d="M12 4.5c2.6 1.5 4 4.4 4 7.5s-1.4 6-4 7.5c1.5-2.1 2.3-4.7 2.3-7.5s-.8-5.4-2.3-7.5z" fill="#FBFAF9"/><ellipse cx="12" cy="12" rx="1.6" ry="6.5" fill="#A0055D"/></svg>`,

  hyperevm: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#072724"/><path d="M3.5 13c2.5-3.5 5-3.5 8.5 0s6 3.5 8.5 0v3c-2.5 3.5-5 3.5-8.5 0s-6-3.5-8.5 0v-3z" fill="#97FCE4"/></svg>`,

  ink: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#7132F5"/><path d="M12 4.5c-1.4 3.4-4.5 5.7-4.5 9.5 0 2.5 2 4.5 4.5 4.5s4.5-2 4.5-4.5c0-3.8-3.1-6.1-4.5-9.5z" fill="#fff"/></svg>`,

  arc: `<svg viewBox="0 0 164 171" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="arcgrad-icon" x1="29" y1="-26" x2="32" y2="222" gradientUnits="userSpaceOnUse"><stop stop-color="#1B3158"/><stop offset=".63" stop-color="#3E2B63"/><stop offset="1" stop-color="#942753"/></linearGradient></defs><path fill="url(#arcgrad-icon)" d="M0 171C1.4 129.1 8.5 90.1 20.4 59.7 35.5 21.2 57.4 0 82 0s46.4 21.2 61.5 59.7c7.9 20 13.6 43.8 17 69.7.3 2.3.6 4.6.9 7 .1.1.1.3.1.4 0 0 2 12.5 2.5 34.2h-.2c-3-2.4-38.2-29.9-96.5-22a366 366 0 0 1 4-30.4c22.9-.7 42.9 2 58.3 5.4 0-.4-.1-.7-.2-1.1-3.1-19.6-7.8-37.5-13.8-52.8C105.6 45.6 92.8 30 82 30s-23.6 15.6-33.5 40.6c-2.3 6.1-4.5 12.5-6.5 19.3-2.7 9.6-5 19.8-6.8 30.5-2.7 15.9-4.4 32.9-5 50.6H0z"/></svg>`,

  morph: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#00D88A"/><path d="M5.5 17.5V7.2l3.7 4.6 1.85-2.05 1.85 2.05 3.7-4.6V17.5h-2.05V12.5l-1.65 1.85-1.85-2-1.85 2-1.65-1.85V17.5z" fill="#000"/></svg>`,
};

const CHAINS = {
  // Ethereum Sepolia
  11155111: {
    id: 11155111,
    name: 'Ethereum Sepolia',
    shortName: 'Sepolia',
    domain: 0,
    icon: CHAIN_LOGOS.ethereum,
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
    icon: CHAIN_LOGOS.avalanche,
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
    icon: CHAIN_LOGOS.optimism,
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
    icon: CHAIN_LOGOS.arbitrum,
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
    icon: CHAIN_LOGOS.base,
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
    icon: CHAIN_LOGOS.polygon,
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
    icon: CHAIN_LOGOS.unichain,
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
    icon: CHAIN_LOGOS.linea,
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
    icon: CHAIN_LOGOS.sonic,
    color: '#FE9A4D',
    usdc: '0x29219dd400f2Bf60E5a23d13Be72B486D4038894',
    tokenMessenger: CCTP_TOKEN_MESSENGER,
    msgTransmitter: CCTP_MSG_TRANSMITTER,
    rpc: 'https://rpc.blaze.soniclabs.com',
    explorer: 'https://testnet.soniclabs.com',
    nativeCurrency: { name: 'Sonic', symbol: 'S', decimals: 18 },
    params: {
      chainId: '0xDEDE',
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
    icon: CHAIN_LOGOS.worldchain,
    color: '#000000',
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
    icon: CHAIN_LOGOS.monad,
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
    icon: CHAIN_LOGOS.hyperevm,
    color: '#97FCE4',
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
    icon: CHAIN_LOGOS.ink,
    color: '#7132F5',
    usdc: '0x3f0D3b0E7AbB5F9bD8e6B9e3e60A4F6F2c5f3f5A',
    tokenMessenger: CCTP_TOKEN_MESSENGER,
    msgTransmitter: CCTP_MSG_TRANSMITTER,
    rpc: 'https://rpc-gel-sepolia.inkonchain.com',
    explorer: 'https://explorer-sepolia.inkonchain.com',
    nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
    params: {
      chainId: '0xBA5ED',
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
    icon: CHAIN_LOGOS.arc,
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
    icon: CHAIN_LOGOS.morph,
    color: '#00D88A',
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
