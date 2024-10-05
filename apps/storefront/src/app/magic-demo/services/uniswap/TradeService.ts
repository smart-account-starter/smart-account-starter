import { Token, CurrencyAmount, Percent, TradeType, Currency } from '@uniswap/sdk-core';
import { Pool, Route, SwapOptions, SwapRouter, SwapQuoter, Trade } from '@uniswap/v3-sdk';
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import { computePoolAddress } from '@uniswap/v3-sdk';
import { fromReadableAmount } from '../../utils/conversion';
import { getContract, decodeAbiParameters, parseAbiParameters, erc20Abi, encodeFunctionData } from 'viem';
import { FeeAmount } from '@uniswap/v3-sdk'
import { getPublicClient, chains } from '../../utils/constants';

export async function getTradeTransactions(
    tokenIn: Token,
    tokenOut: Token,
    amount: string,
    from: string,
    chainId: number
) {
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

    const amountIn = fromReadableAmount(amount, tokenIn.decimals).toString()
    const quote = await getOutputQuote(swapRoute, amount, tokenIn, chainId);
    const amountt = CurrencyAmount.fromRawAmount(
        tokenOut,
        quote.toString()
    )
    console.log(amountt)
    const uncheckedTrade = Trade.createUncheckedTrade({
        route: swapRoute,
        inputAmount: CurrencyAmount.fromRawAmount(
            tokenIn,
            amountIn
        ),
        outputAmount: CurrencyAmount.fromRawAmount(
            tokenOut,
            quote.toString()
        ),
        tradeType: TradeType.EXACT_OUTPUT,
    });

    const tokenApprovalTx = await getTokenTransferApproval(tokenIn, amount, from as `0x${string}`, chainId);

    const options: SwapOptions = {
        slippageTolerance: new Percent(500, 10_000),
        deadline: Math.floor(Date.now() / 1000) + 1800,
        recipient: from,
    };

    const methodParameters = SwapRouter.swapCallParameters([uncheckedTrade], options);

    const transaction = {
        data: methodParameters.calldata,
        to: chains[chainId as keyof typeof chains].swapRouterAddress01,
        value: methodParameters.value,
        from,
    };

    return [tokenApprovalTx, transaction];
}

export async function getPoolInfo(tokenIn: Token, tokenOut: Token, chainId: number) {
    const currentPoolAddress = computePoolAddress({
        factoryAddress: chains[chainId as keyof typeof chains].poolFactoryAddress,
        tokenA: tokenIn,
        tokenB: tokenOut,
        fee: FeeAmount.MEDIUM,
    });

    const publicClient = getPublicClient(chainId);
    const poolContract = getContract({
        address: currentPoolAddress as `0x${string}`,
        abi: IUniswapV3PoolABI.abi,
        client: publicClient,
    });

    const [token0, token1, fee, tickSpacing, liquidity, slot0] =
        await Promise.all([
            poolContract.read.token0(),
            poolContract.read.token1(),
            poolContract.read.fee(),
            poolContract.read.tickSpacing(),
            poolContract.read.liquidity(),
            poolContract.read.slot0(),
        ]);

    return {
        token0,
        token1,
        fee,
        tickSpacing,
        liquidity: liquidity as bigint,
        // @ts-expect-error type error
        sqrtPriceX96: slot0[0],
        // @ts-expect-error type error
        tick: slot0[1],
    };
}

export async function getOutputQuote(route: Route<Currency, Currency>, amountIn: string, tokenIn: Token, chainId: number) {
    const publicClient = getPublicClient(chainId);
    if (!publicClient) {
        throw new Error('Public client required to get pool state');
    }

    const amountInConverted = fromReadableAmount(amountIn, tokenIn.decimals).toString()
    console.log({ amountInConverted });

    const { calldata } = await SwapQuoter.quoteCallParameters(
        route,
        CurrencyAmount.fromRawAmount(
            tokenIn,
            amountInConverted
        ),
        TradeType.EXACT_INPUT,
        {
            useQuoterV2: true,
        }
    );

    const quoteCallReturnData = await publicClient.call({
        to: chains[chainId as keyof typeof chains].quoterAddress as `0x${string}`,
        data: calldata as `0x${string}`,
    });

    const decodedResult = decodeAbiParameters(
        parseAbiParameters('uint256'),
        quoteCallReturnData.data!
    )

    return decodedResult[0];
}

export async function getTokenTransferApproval(token: Token, amount: string, address: `0x${string}`, chainId: number): Promise<{ to: `0x${string}`, data: `0x${string}`, from: `0x${string}` }> {
    const publicClient = getPublicClient(chainId);
    if (!publicClient) {
        throw new Error('Public client required');
    }

    const amountToApprove = fromReadableAmount(amount, token.decimals)

    try {
        const data = encodeFunctionData({
            abi: erc20Abi,
            functionName: 'approve',
            args: [
                chains[chainId as keyof typeof chains].swapRouterAddress01 as `0x${string}`,
                amountToApprove,
            ],
        });

        const transaction = {
            to: token.address as `0x${string}`,
            data,
            from: address,
        };

        return transaction;
    } catch (e) {
        console.error(e);
        throw new Error('Failed to get token transfer approval');
    }
}