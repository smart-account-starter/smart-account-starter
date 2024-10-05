import { Address, encodeFunctionData } from 'viem';
import { aaveV3PoolAddresses, getPoolAddress } from './utils';

export class AaveSupplyEncodeService {
  // Aave V3 Pool ABI (only the supply function)
  public aavePoolAbi = [
    {
      inputs: [
        { name: 'asset', type: 'address' },
        { name: 'amount', type: 'uint256' },
        { name: 'onBehalfOf', type: 'address' },
        { name: 'referralCode', type: 'uint16' },
      ],
      name: 'supply',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ] as const;

  // ERC20 ABI (only the approve function)
  public erc20Abi = [
    {
      inputs: [
        { name: 'spender', type: 'address' },
        { name: 'amount', type: 'uint256' },
      ],
      name: 'approve',
      outputs: [{ name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ] as const;


  encodeApproveCalldata(
    chainId: number,
    amount: bigint,
  ): `0x${string}` {
    if (!aaveV3PoolAddresses[chainId]) {
      throw new Error(`Unsupported chain ID: ${chainId}`);
    }

    return encodeFunctionData({
      abi: this.erc20Abi,
      functionName: 'approve',
      args: [aaveV3PoolAddresses[chainId], amount],
    });
  }

  encodeSupplyCalldata(
    tokenAddress: Address,
    chainId: number,
    amount: bigint,
    userAddress: Address,
  ): `0x${string}` {
    if (!aaveV3PoolAddresses[chainId]) {
      throw new Error(`Unsupported chain ID: ${chainId}`);
    }

    return encodeFunctionData({
      abi: this.aavePoolAbi,
      functionName: 'supply',
      args: [tokenAddress, amount, userAddress, 0],
    });
  }

  encodeSupplyTxs(
    tokenAddress: Address,
    chainId: number,
    amount: bigint,
    userAddress: Address,
  ): RawTransaction[] {
    const approveAaveTx = rawTx({
      to: tokenAddress,
      gasLimit: BigInt(150000),
      data: this.encodeApproveCalldata(chainId, amount),
    });

    const supplyAaveTx = rawTx({
      to: getPoolAddress(chainId),
      gasLimit: BigInt(300000),
      data: this.encodeSupplyCalldata(
        tokenAddress,
        chainId,
        amount,
        userAddress,
      ),
    });

    return [approveAaveTx, supplyAaveTx];
  }
}

export interface RawTransaction {
  to: Address;
  value?: bigint;
  data?: string;
  gasLimit: bigint;
}

export function rawTx(tx: RawTransaction) {
  return tx;
}
