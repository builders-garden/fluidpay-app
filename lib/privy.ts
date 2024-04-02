import { PrivyEmbeddedWalletProvider } from "@privy-io/expo";

export const signMessageWithPrivy = async (
  provider: PrivyEmbeddedWalletProvider,
  message: `0x${string}`
) => {
  // Get the wallet address
  const accounts = await provider.request({
    method: "eth_requestAccounts",
  });

  return await provider.request({
    method: "personal_sign",
    params: [message, accounts[0]],
  });
};
