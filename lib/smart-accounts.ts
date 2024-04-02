import { PrivyEmbeddedWalletProvider } from "@privy-io/expo";
import { createWalletClient, custom, Chain } from "viem";
import { createSmartAccountClient } from "@biconomy/account";

export const getSmartAccountClient = async (
  ownerAddress: string,
  chain: Chain,
  provider: PrivyEmbeddedWalletProvider
) => {
  const client = createWalletClient({
    account: ownerAddress as `0x${string}`,
    chain,
    transport: custom({
      async request({ method, params }) {
        return await provider?.request({ method, params });
      },
    }),
  });
  const smartAccount = await createSmartAccountClient({
    signer: client as any,
    bundlerUrl: process.env.EXPO_PUBLIC_BUNDLER_URL || "",
    biconomyPaymasterApiKey: process.env.EXPO_PUBLIC_PAYMASTER_KEY,
    chainId: chain.id,
  });
};


