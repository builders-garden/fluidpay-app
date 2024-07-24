import { executeTransaction } from "../pimlico";
import { Chain, createPublicClient, erc20Abi, http, parseUnits } from "viem";
import { ERC20_FEE_PROXY_ADDRESS } from "../../constants/request-network-contracts";
import {
  approveERC20TxData,
  payERC20FeeRequestTxData,
} from "./smart-contracts";
import tokens from "../../constants/tokens";

// This function checks the allowance for USDC (if not enough it calls the approve) of the payer.
export const approvePayment = async (
  smartAccountClient: any,
  chain: Chain,
  amount: number
): Promise<boolean> => {
  const usdcAddress = tokens.USDC[chain.id] as `0x${string}`;
  const erc20FeeProxyAddress = ERC20_FEE_PROXY_ADDRESS[
    chain.id
  ] as `0x${string}`;
  // Check if the payer approved the ERC20 transfer
  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });
  const erc20Allowance = await publicClient.readContract({
    address: usdcAddress,
    abi: erc20Abi,
    functionName: "allowance",
    args: [smartAccountClient.account.address, erc20FeeProxyAddress],
  });
  // if the allowance is not enough, approve the ERC20 transfer
  if (erc20Allowance < parseUnits(amount.toString(), 6)) {
    await executeTransaction(
      smartAccountClient,
      usdcAddress,
      BigInt(0),
      approveERC20TxData(erc20FeeProxyAddress, amount)
    );
  }

  // Return some success response or the next action
  return true;
};

export const sendPayment = async (
  smartAccountClient: any,
  chain: Chain,
  payeeAddress: `0x${string}`,
  amount: number,
  paymentReference: string
) => {
  const usdcAddress = tokens.USDC[chain.id] as `0x${string}`;
  const erc20FeeProxyAddress = ERC20_FEE_PROXY_ADDRESS[
    chain.id
  ] as `0x${string}`;
  return await executeTransaction(
    smartAccountClient,
    erc20FeeProxyAddress,
    BigInt(0),
    payERC20FeeRequestTxData(
      {
        address: usdcAddress,
        decimals: 6,
      },
      payeeAddress,
      amount,
      paymentReference
    )
  ); // wait for the transaction to be confirmed
};
