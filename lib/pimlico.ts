import {
  ENTRYPOINT_ADDRESS_V07,
  SmartAccountClient,
  createSmartAccountClient,
  walletClientToSmartAccountSigner,
} from "permissionless";
import { signerToSimpleSmartAccount } from "permissionless/accounts";
import {
  createPimlicoBundlerClient,
  createPimlicoPaymasterClient,
} from "permissionless/clients/pimlico";
import { Chain, createPublicClient, encodeFunctionData, erc20Abi } from "viem";
import { http } from "wagmi";
import { getWalletClient } from "./smart-accounts";
import { EmbeddedWalletState } from "@privy-io/expo";
import tokens from "../constants/tokens";
import { signerToSafeSmartAccount } from "permissionless/_types/accounts";

const transportUrl = (chain: Chain) =>
  `https://api.pimlico.io/v2/${chain.id}/rpc?apikey=${process.env.EXPO_PUBLIC_PIMLICO_API_KEY}`;

export const publicClient = createPublicClient({
  transport: http("https://rpc.ankr.com/eth_sepolia"),
});

export const paymasterClient = (chain: Chain) =>
  createPimlicoPaymasterClient({
    transport: http(transportUrl(chain)),
    entryPoint: ENTRYPOINT_ADDRESS_V07,
  });

export const pimlicoBundlerClient = (chain: Chain) =>
  createPimlicoBundlerClient({
    transport: http(transportUrl(chain)),
    entryPoint: ENTRYPOINT_ADDRESS_V07,
  });

export const getPimlicoSmartAccountClient = async (
  address: `0x${string}`,
  chain: Chain,
  wallet: EmbeddedWalletState
) => {
  const walletClient = getWalletClient(address, chain, wallet);
  const signer = walletClientToSmartAccountSigner(walletClient);

  const simpleSmartAccountClient = await signerToSimpleSmartAccount(
    publicClient,
    {
      entryPoint: ENTRYPOINT_ADDRESS_V07,
      signer: signer,
      factoryAddress: "0x91E60e0613810449d098b0b5Ec8b51A0FE8c8985",
    }
  );

  return createSmartAccountClient({
    account: simpleSmartAccountClient,
    entryPoint: ENTRYPOINT_ADDRESS_V07,
    chain,
    bundlerTransport: http(transportUrl(chain)),
    middleware: {
      gasPrice: async () =>
        (await pimlicoBundlerClient(chain).getUserOperationGasPrice()).fast, // use pimlico bundler to get gas prices
      sponsorUserOperation: paymasterClient(chain).sponsorUserOperation, // optional
    },
  });
};

export const transferUSDC = async (
  smartAccountClient: any,
  amount: number,
  chain: Chain,
  toAddress: string
) => {
  const USDC_ADDRESS = tokens.USDC[chain.id] as `0x${string}`;
  return await smartAccountClient.sendTransaction({
    to: USDC_ADDRESS,
    value: BigInt(0),
    data: encodeFunctionData({
      abi: erc20Abi,
      functionName: "transfer",
      args: [toAddress as `0x${string}`, BigInt(amount * 10 ** 6)],
    }),
  });
};
