import { Address, encodeFunctionData, parseAbi, PublicClient } from 'viem';
import { Chain, optimism, arbitrum, polygon, base } from 'viem/chains';
import { getPublicClient } from '../../utils/constants';
import { mcUSDC } from './utils';

interface SuppliedPosition {
  chainId: number;
  token: 'USDC' | 'USDT';
  amount: string;
  tokenAddress: Address
}

interface ATokenInfo {
  chainId: number;
  usdcAToken: Address;
  usdtAToken?: Address;
}

export class AaveGetSuppliesService {
  private clients: Map<number, PublicClient> = new Map();
  private aTokens: ATokenInfo[] = [
    { chainId: optimism.id, usdcAToken: '0x38d693cE1dF5AaDF7bC62595A37D667aD57922e5', usdtAToken: '0x6ab707Aca953eDAeFBc4fD23bA73294241490620' },
    { chainId: arbitrum.id, usdcAToken: '0x724dc807b04555b71ed48a6896b6F41593b8C637', usdtAToken: '0x6ab707Aca953eDAeFBc4fD23bA73294241490620' },
    { chainId: polygon.id, usdcAToken: '0xA4D94019934D8333Ef880ABFFbF2FDd611C762BD', usdtAToken: '0x6ab707Aca953eDAeFBc4fD23bA73294241490620' },
    { chainId: base.id, usdcAToken: '0x4e65fE4DbA92790696d040ac24Aa414708F5c0AB' }
  ];

  constructor() {
    this.initializeClients();
  }

  private initializeClients() {
    const chains: Chain[] = [optimism, arbitrum, polygon, base];
    chains.forEach(chain => {
      const client = getPublicClient(chain.id) as PublicClient;
      if (client) {
        this.clients.set(chain.id, client);
      }
    });
  }

  async getSuppliedPositions(userAddress: string): Promise<SuppliedPosition[]> {
    const positions: SuppliedPosition[] = [];

    for (const mapping of mcUSDC) {
      const usdcPositions = await this.fetchPosition(userAddress, mapping, 'USDC');
      positions.push(...usdcPositions);
    }

    return positions;
  }

  private async fetchPosition(userAddress: string, mapping: { chainId: number; address: Address }, token: 'USDC' | 'USDT'): Promise<SuppliedPosition[]> {
    const client = this.clients.get(mapping.chainId);
    if (!client) {
      console.error(`No client found for chain ${mapping.chainId}`);
      return [];
    }

    const aTokenInfo = this.aTokens.find(info => info.chainId === mapping.chainId);
    if (!aTokenInfo) {
      console.error(`No aToken info found for chain ${mapping.chainId}`);
      return [];
    }

    const aTokenAddress = token === 'USDC' ? aTokenInfo.usdcAToken : aTokenInfo.usdtAToken;

    if (!aTokenAddress) {
      console.error(`No aToken address found for ${token} on chain ${mapping.chainId}`);
      return [];
    }

    try {
      const balance = await client.readContract({
        address: aTokenAddress,
        abi: [
          {
            name: 'balanceOf',
            type: 'function',
            inputs: [{ name: 'account', type: 'address' }],
            outputs: [{ name: '', type: 'uint256' }],
            stateMutability: 'view'
          }
        ],
        functionName: 'balanceOf',
        args: [userAddress as Address]
      }) as bigint;

      const amount = balance.toString();
      return amount !== '0' ? [{
        chainId: mapping.chainId,
        token: token,
        amount: amount,
        tokenAddress: aTokenAddress
      }] : [];
    } catch (error) {
      console.error(`Error fetching position for ${token} on chain ${mapping.chainId}:`, error);
      return [];
    }
  }

  getAavePoolAddress(chainId: number): Address {
    switch (chainId) {
      case optimism.id: return '0x794a61358D6845594F94dc1DB02A252b5b4814aD';
      case base.id: return '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5';
      case polygon.id: return '0x794a61358D6845594F94dc1DB02A252b5b4814aD';
      case arbitrum.id: return '0x794a61358D6845594F94dc1DB02A252b5b4814aD';
    }
    throw Error(`No aave pool found for ${chainId}`)
  }

  encodeAaveWithdrawalData(
    _chainId: number,
    assetAddress: Address,
    amount: bigint,
    userAddress: Address
  ): string {
    const aavePoolABI = parseAbi([
      'function withdraw(address asset, uint256 amount, address to) returns (uint256)'
    ]);

    return encodeFunctionData({
      abi: aavePoolABI,
      functionName: 'withdraw',
      args: [assetAddress, amount, userAddress],
    });
  }
}