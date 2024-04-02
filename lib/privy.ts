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

export const switchChain = async (
  provider: PrivyEmbeddedWalletProvider,
  chainId: number
) => {
  console.log({
    method: "wallet_switchEthereumChain",
    provider,
    params: [{ chainId: `${chainId}` }],
  });
  return await provider.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: `${chainId}` }],
  });
};
