import { Address, PublicClient, getContract, formatUnits } from 'viem';
import { getPublicClient } from '../../utils/constants';
import { mcUSDC } from './utils';
import { aaveV3PoolAbi } from './generated';
import { polygon, arbitrum, optimism, base } from 'viem/chains';
import { aaveV3PoolAddresses } from './utils';

export interface YieldInfo {
    symbol: string;
    chainId: number;
    supplyYield: number;
    borrowYield: number;
    tokenAddress: Address;
    chainName: string;
    marketAddress: Address;
}

type YieldAggr = {
    bestSupplyYield: YieldInfo;
    bestBorrowYield: YieldInfo;
};

type MultichainTokenMapping = { chainId: number; address: Address }[];

export type ChainRpcInfo = {
    chainId: number;
    rpcUrl: string;
};

const ABI = aaveV3PoolAbi;

type ChainNames = { [chainId: number]: string };

export class AaveV3YieldService {
    private clients: Map<number, PublicClient> = new Map();

    private readonly chainNames: ChainNames = {
        137: 'Polygon',
        42161: 'Arbitrum',
        10: 'Optimism',
        8453: 'Base',
    };

    constructor() {
        this.initializeClients();
    }

    private initializeClients(): void {
        const chains = [polygon, arbitrum, optimism, base];
        chains.forEach(chain => {
            const client = getPublicClient(chain.id) as PublicClient;
            if (client) {
                this.clients.set(chain.id, client);
            }
        });
    }

    public async getBestYields(tokenMapping: MultichainTokenMapping): Promise<YieldAggr> {
        const yieldInfos = await Promise.all(
            tokenMapping.map((token) => this.getYieldInfo(token.chainId, token.address))
        );
        return this.processBestYields(yieldInfos.flat());
    }

    async getBestYieldsForSymbol(symbol: 'USDC' | 'USDT'): Promise<YieldAggr> {
        if (symbol !== 'USDC') {
            throw new Error('Only USDC is supported');
        }
        return this.getBestYields(mcUSDC);
    }

    async getSortedYieldsForSymbol(symbol: 'USDC' | 'USDT'): Promise<YieldInfo[]> {
        if (symbol !== 'USDC') {
            throw new Error('Only USDC is supported');
        }
        const yieldInfos = await this.getYieldInfoForSymbol(symbol);
        return yieldInfos.sort((a, b) => b.supplyYield - a.supplyYield);
    }

    public async getYieldInfoForSymbol(symbol: 'USDC' | 'USDT'): Promise<YieldInfo[]> {
        if (symbol !== 'USDC') {
            throw new Error('Only USDC is supported');
        }
        const yieldInfos = await Promise.all(
            mcUSDC.map((token) => this.getYieldInfo(token.chainId, token.address))
        );
        return yieldInfos.flat();
    }

    private async getYieldInfo(chainId: number, tokenAddress: Address): Promise<YieldInfo[]> {
        const client: PublicClient | undefined = this.clients.get(chainId);
        if (!client) {
            console.warn(`No Viem client found for chain ID ${chainId}`);
            return [];
        }

        const poolAddress: Address | undefined = aaveV3PoolAddresses[chainId];
        if (!poolAddress) {
            console.warn(`No Aave V3 Pool address found for chain ID ${chainId}`);
            return [];
        }

        const poolContract = getContract({
            address: poolAddress,
            abi: ABI,
            client: client,
        });

        try {
            const reserveData = await poolContract.read.getReserveData([tokenAddress]);
            const symbol: string = await this.getTokenSymbol(client, tokenAddress);

            return [{
                symbol,
                chainId,
                supplyYield: Number(formatUnits(reserveData.currentLiquidityRate, 27)),
                borrowYield: Number(formatUnits(reserveData.currentVariableBorrowRate, 27)),
                tokenAddress,
                chainName: this.chainNames[chainId] || `Unknown Chain ${chainId}`,
                marketAddress: reserveData.aTokenAddress
            }];
        } catch (error) {
            console.error(`Error fetching yield info for chain ${chainId}:`, error);
            return [];
        }
    }

    private async getTokenSymbol(client: PublicClient, tokenAddress: Address): Promise<string> {
        try {
            const tokenContract = getContract({
                address: tokenAddress,
                abi: [{ inputs: [], name: 'symbol', outputs: [{ type: 'string' }], stateMutability: 'view', type: 'function' }],
                client: client,
            });

            return await tokenContract.read.symbol() as string;
        } catch (error) {
            console.error(`Error fetching token symbol for ${tokenAddress}:`, error);
            return 'UNKNOWN';
        }
    }

    private processBestYields(yieldInfos: YieldInfo[]): YieldAggr {
        let bestSupplyYield: YieldInfo = yieldInfos[0];
        let bestBorrowYield: YieldInfo = yieldInfos[0];

        yieldInfos.forEach((info: YieldInfo) => {
            if (info.supplyYield > bestSupplyYield.supplyYield) {
                bestSupplyYield = info;
            }
            if (info.borrowYield < bestBorrowYield.borrowYield) {
                bestBorrowYield = info;
            }
        });

        return {
            bestSupplyYield,
            bestBorrowYield
        };
    }
}