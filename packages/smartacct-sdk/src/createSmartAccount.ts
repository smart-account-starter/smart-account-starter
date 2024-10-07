import { createZeroDevAccount } from './zerodev';
import { createPimlicoAccount } from './pimlico';
import { createBiconomyAccount } from './biconomy';
import { createThirdwebAccount } from './thirdweb';
import { createAlchemyAccount } from './alchemy';

// Export these types so they can be used by consumers of the SDK
export type AccountProvider = 'zerodev' | 'pimlico' | 'biconomy' | 'thirdweb' | 'alchemy';
export type SignerProvider = 'privy' | 'dynamic' | 'magic' | 'capsule';

export interface Signer {
  type: SignerProvider;
  // Add any necessary properties or methods for the signer
}

export class SmartAcct {
  private accountProvider: AccountProvider;
  private signer: Signer;

  constructor(accountProvider: AccountProvider, signer: Signer) {
    this.accountProvider = accountProvider;
    this.signer = signer;
  }

  async createAccount(): Promise<string> {
    switch (this.accountProvider) {
      case 'zerodev':
        return await createZeroDevAccount(this.signer);
      case 'pimlico':
        return await createPimlicoAccount(this.signer);
      case 'biconomy':
        return await createBiconomyAccount(this.signer);
      case 'thirdweb':
        return await createThirdwebAccount(this.signer);
      case 'alchemy':
        return await createAlchemyAccount(this.signer);
      default:
        throw new Error('Invalid account provider');
    }
  }
}

export default SmartAcct;
