
// ... existing imports ...
// Export these types so they can be used by consumers of the SDK
export type AccountProvider = 'zerodev' | 'pimlico' | 'biconomy' | 'thirdweb' | 'alchemy';
export type SignerProvider = 'privy' | 'dynamic' | 'magic' | 'capsule';


// ... rest of the file remains unchanged ...

export async function createZeroDevAccount(): Promise<string> {
  return '0x0'
}
