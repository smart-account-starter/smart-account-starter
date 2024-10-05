import { Token } from '@uniswap/sdk-core';
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json';
import { fromReadableAmount, toReadableAmount } from '../../utils/conversion';
import { Address } from 'viem';
import { getPublicClient, chains } from '../../utils/constants';
import { getPoolInfo, getOutputQuote } from './TradeService';
import { Pool, Route, FeeAmount } from '@uniswap/v3-sdk';

export async function getQuote(
    amountIn: string,
    tokenIn: Token,
    tokenOut: Token,
    fee: number,
    chainId: number
): Promise<string> {
    const publicClient = getPublicClient(chainId);
    const amountInConverted = fromReadableAmount(amountIn, tokenIn.decimals)

    try {
        const quoterResult = await publicClient.readContract({
            address: chains[chainId as keyof typeof chains].quoterAddress as Address,
            abi: Quoter.abi,
            functionName: 'quoteExactInputSingle',
            args: [{
                tokenIn: tokenIn.address,
                tokenOut: tokenOut.address,
                fee: fee,
                amountIn: amountInConverted,
                sqrtPriceLimitX96: 0n
            }],
        }) as [bigint, bigint, number, bigint];
        const [amountOut, , ,] = quoterResult;

        const amount = toReadableAmount(amountOut, tokenOut.decimals);
        return amount;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return getQuoteWithRoute(amountIn, tokenIn, tokenOut, chainId);
    }
}

export async function getQuoteWithRoute(
    amountIn: string,
    tokenIn: Token,
    tokenOut: Token,
    chainId: number
): Promise<string> {
    const poolInfo = await getPoolInfo(tokenIn, tokenOut, chainId);

    const pool = new Pool(
        tokenIn,
        tokenOut,
        FeeAmount.MEDIUM,
        poolInfo.sqrtPriceX96.toString(),
        poolInfo.liquidity.toString(),
        poolInfo.tick
    );

    const swapRoute = new Route([pool], tokenIn, tokenOut);

    try {
        const quote = await getOutputQuote(swapRoute, amountIn, tokenIn, chainId);
        const amount = toReadableAmount(quote, tokenOut.decimals);
        return amount;
    } catch (error) {
        console.error(error);
        throw error;
    }
}