import { createPublicClient, http, zeroAddress } from "viem";
import { sepolia } from "viem/chains";
import { ENTRYPOINT_ADDRESS_V07, bundlerActions } from "permissionless";
import { KERNEL_V3_1 } from "@zerodev/sdk/constants";
import {
  createKernelAccount,
  createZeroDevPaymasterClient,
  createKernelAccountClient,
} from "@zerodev/sdk";
import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator";
import { Signer } from './createSmartAccount';

export async function createZeroDevAccount(signer: Signer): Promise<string> {
  if (!process.env.BUNDLER_RPC || !process.env.PAYMASTER_RPC) {
    throw new Error("BUNDLER_RPC or PAYMASTER_RPC is not set");
  }

  const chain = sepolia;
  const publicClient = createPublicClient({
    transport: http(process.env.BUNDLER_RPC),
    chain
  });

  const entryPoint = ENTRYPOINT_ADDRESS_V07;
  const kernelVersion = KERNEL_V3_1;

  // Convert the Signer to an ECDSA validator
  const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
    signer: signer as any, // Type assertion needed as the Signer type might not match exactly
    entryPoint,
    kernelVersion,
  });

  const account = await createKernelAccount(publicClient, {
    plugins: {
      sudo: ecdsaValidator,
    },
    entryPoint,
    kernelVersion,
  });

  const kernelClient = createKernelAccountClient({
    account,
    entryPoint,
    chain,
    bundlerTransport: http(process.env.BUNDLER_RPC),
    middleware: {
      sponsorUserOperation: async ({ userOperation }) => {
        const paymasterClient = createZeroDevPaymasterClient({
          chain,
          transport: http(process.env.PAYMASTER_RPC),
          entryPoint,
        });
        return paymasterClient.sponsorUserOperation({
          userOperation,
          entryPoint,
        });
      },
    },
  });

  // Send a test user operation to ensure the account is working
  const userOpHash = await kernelClient.sendUserOperation({
    userOperation: {
      callData: await account.encodeCallData({
        to: zeroAddress,
        value: BigInt(0),
        data: "0x",
      }),
    },
  });

  const bundlerClient = kernelClient.extend(bundlerActions(entryPoint));
  await bundlerClient.waitForUserOperationReceipt({
    hash: userOpHash,
  });

  return account.address;
}