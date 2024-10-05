import { Address, encodeFunctionData, parseAbi } from 'viem';
import { getPoolAddress } from './utils';

export class AaveWithdrawService {
    private aavePoolAbi = parseAbi([
        'function withdraw(address asset, uint256 amount, address to) returns (uint256)'
    ]);

    constructor() { }

    encodeWithdrawTx(
        tokenAddress: Address,
        chainId: number,
        amount: bigint,
        userAddress: Address,
    ): RawTransaction {
        const calldata = encodeFunctionData({
            abi: this.aavePoolAbi,
            functionName: 'withdraw',
            args: [tokenAddress, amount, userAddress],
        });
        return {
            to: getPoolAddress(chainId),
            gasLimit: BigInt(300000),
            data: calldata,
        };
    }
}

export interface RawTransaction {
    to: Address;
    value?: bigint;
    data?: string;
    gasLimit: bigint;
}