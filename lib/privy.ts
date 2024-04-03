import {
  EmbeddedWalletState,
  PrivyEmbeddedWalletProvider,
} from "@privy-io/expo";

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

export const getAddress = async (provider: PrivyEmbeddedWalletProvider) => {
  try {
    const accounts = await provider.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  } catch (error) {
    console.log("error: ", error);
  }
};
