import { defineChain } from '@reown/appkit/networks'
 
export const vBaseSepolia = defineChain({
  id: 84532,  
  caipNetworkId: 'eip155:84532',
  chainNamespace: 'eip155',
  name: 'Base Sepolia Test network',
  nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default:{
      http: ["sepolia.base.org"],
    }
  },
  blockExplorers: {
    default:{
      name:'Sepolia Explorer',
      url: 'https://sepolia.basescan.org', // replace this with your Virtual TestNet's explorer URL
    }
  },
  contracts: {
    // ensRegistry: {
    //   address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
    // },
    // ensUniversalResolver: {
    //   address: '0xE4Acdd618deED4e6d2f03b9bf62dc6118FC9A4da',
    //   blockCreated: 16773775
    // },
    // multicall3: {
    //   address: '0xca11bde05977b3631167028862be2a173976ca11',
    //   blockCreated: 14353601
    // }
  }
})