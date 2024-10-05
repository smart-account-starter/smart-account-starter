import { formatUnits, Address } from 'viem';
import { getPublicClient } from '../../utils/constants';
import { tokenAddresses, tokenDecimals, chains } from '../../utils/constants';
import { erc20Abi } from 'viem';


export async function getTokenBalance(
    address: `0x${string}`,
    chainId: number,
    token: keyof typeof tokenAddresses[keyof typeof tokenAddresses]
): Promise<string> {
    const tokenAddress = tokenAddresses[chainId as keyof typeof tokenAddresses][token] as Address;

    if (!address) {
        return '0';
    }
    if (!tokenAddress) {
        throw new Error(`Token ${token} not supported on chain ${chainId}`);
    }

    const publicClient = getPublicClient(chainId);

    try {
        const balance = await publicClient.readContract({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [address],
        });

        const decimals = tokenDecimals[token];
        return formatUnits(balance, decimals);
    } catch (error) {
        console.error(`Error fetching ${token} balance:`, error);
        return '0';
    }
}

export async function getTokenBalances(address: string, chainId: number): Promise<Record<string, number>> {
    const chain = chains[chainId as keyof typeof chains];
    if (!chain) {
        throw new Error('Chain not supported');
    }

    const fetchURL = chain.rpcUrl;

    const tokenAddressesArray = Object.entries(tokenAddresses[chainId as keyof typeof tokenAddresses])
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([token, _]) => !(
            (chainId === 8453 && token === 'USDT') || // Ignore USDT on Base (chainId 8453)
            token === 'USDC' // Ignore USDC on all chains
        ))
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(([_, address]) => address);

    const raw = JSON.stringify({
        jsonrpc: "2.0",
        method: "alchemy_getTokenBalances",
        params: [address, tokenAddressesArray],
        id: 1
    });

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: raw
    };

    try {
        const response = await fetch(fetchURL, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        const formattedBalances: Record<string, number> = {};
        result.result.tokenBalances.forEach((balance: { contractAddress: string; tokenBalance: string }) => {
            const tokenSymbol = Object.keys(tokenAddresses[chainId as keyof typeof tokenAddresses]).find(
                key => (tokenAddresses[chainId as keyof typeof tokenAddresses] as Record<string, string>)[key].toLowerCase() === balance.contractAddress.toLowerCase()
            );
            if (tokenSymbol) {
                const decimals = tokenDecimals[tokenSymbol as keyof typeof tokenDecimals];
                const formattedBalance = parseInt(balance.tokenBalance) / Math.pow(10, decimals);
                formattedBalances[tokenSymbol] = formattedBalance;
            }
        });

        return formattedBalances;
    } catch (error) {
        console.error('Error fetching token balances:', error);
        throw error;
    }
}