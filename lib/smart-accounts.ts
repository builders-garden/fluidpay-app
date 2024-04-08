import {
  EmbeddedWalletState,
  PrivyEmbeddedWalletProvider,
} from "@privy-io/expo";
import { createWalletClient, custom, Chain } from "viem";

export const getLightSigner = (
  address: string,
  chain: Chain,
  provider: PrivyEmbeddedWalletProvider
) => {
  return {
    async getAddress() {
      return address!;
    },
    async signMessage(message: string) {
      const walletClient = createWalletClient({
        account: address as `0x${string}`,
        chain,
        transport: custom({
          async request({ method, params }) {
            return await provider?.request({ method, params });
          },
        }),
      });
      return walletClient.signMessage({
        account: address as `0x${string}`,
        message,
      });
    },
  };
};

export const getWalletClient = (
  ownerAddress: string,
  chain: Chain,
  wallet: EmbeddedWalletState
) => {
  return createWalletClient({
    account: ownerAddress as `0x${string}`,
    chain,
    transport: custom({
      async request({ method, params }) {
        return (await wallet.getProvider!()).request({ method, params });
      },
    }),
  });
};
