import { arbitrum, base, polygon, optimism } from 'viem/chains';
import { createPublicClient, http } from 'viem';
export const chains = {
    [arbitrum.id]: {
        chain: arbitrum,
        rpcUrl: process.env.NEXT_PUBLIC_VITE_ARBITRUM_RPC_URL,
        poolFactoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
        quoterAddress: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
        swapRouterAddress01: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
        swapRouterAddress02: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    },
    [base.id]: {
        chain: base,
        rpcUrl: process.env.NEXT_PUBLIC_VITE_BASE_RPC_URL,
        poolFactoryAddress: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD',
        quoterAddress: '0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a',
        swapRouterAddress02: '0x2626664c2603336E57B271c5C0b26F421741e481',
        swapRouterAddress01: '',
    },
    [polygon.id]: {
        chain: polygon,
        rpcUrl: process.env.NEXT_PUBLIC_VITE_POLYGON_RPC_URL,
        poolFactoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
        quoterAddress: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
        swapRouterAddress01: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
        swapRouterAddress02: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    },
    [optimism.id]: {
        chain: optimism,
        rpcUrl: process.env.NEXT_PUBLIC_VITE_OPTIMISM_RPC_URL,
        poolFactoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
        quoterAddress: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
        swapRouterAddress01: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
        swapRouterAddress02: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    },
}

export const tokenAddresses = {
    [arbitrum.id]: {
        USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
        WETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
        // PEPE: '0x25d887Ce7a35172C62FeBFD67a1856F20FaEbB00',
        WBTC: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
        USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        DAI: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    },
    [base.id]: {
        USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        WETH: '0x4200000000000000000000000000000000000006',
        // PEPE: '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
        WBTC: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
        USDT: '',
        DAI: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    },
    [polygon.id]: {
        USDC: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
        WETH: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        // PEPE: '0xDE9089d4c4546AEe90E51951Af76BB3bCFC5380E',
        WBTC: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
        USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    },
    [optimism.id]: {
        USDC: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
        WETH: '0x4200000000000000000000000000000000000006',
        // PEPE: '0x12ff4a259e14D4DCd239C447D23C9b00F7781d8F',
        WBTC: '0x68f180fcCe6836688e9084f035309E29Bf0A2095',
        USDT: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
        DAI: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
        WLD: '0xdC6fF44d5d932Cbd77B52E5612Ba0529DC6226F1'
    },
};

export const tokenDecimals = {
    USDC: 6,
    WETH: 18,
    PEPE: 18,
    WBTC: 8,
    USDT: 6,
    DAI: 18,
    WLD: 18,
};


export function getPublicClient(chainId: number) {
    if (!Object.keys(chains).includes(chainId?.toString())) {
        throw new Error('Chain not supported')
    }
    return createPublicClient({
        chain: chains[chainId as keyof typeof chains].chain,
        transport: http(chains[chainId as keyof typeof chains].rpcUrl),
    })
}