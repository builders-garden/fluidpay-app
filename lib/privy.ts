import {
  EmbeddedWalletState,
  PrivyEmbeddedWalletProvider,
} from "@privy-io/expo";
import { ethers } from "ethers";

export const signMessageWithPrivy = async (
  provider: PrivyEmbeddedWalletProvider,
  message: string
): Promise<string> => {
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

export const getEthersProvider = (provider: PrivyEmbeddedWalletProvider) => {
  return new ethers.providers.Web3Provider(provider);
};

export const getEthersSigner = (provider: PrivyEmbeddedWalletProvider) => {
  return getEthersProvider(provider).getSigner();
};
