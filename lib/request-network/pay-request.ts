import {
  approveErc20,
  hasErc20Approval,
  hasSufficientFunds,
  payRequest,
} from "@requestnetwork/payment-processor";
import { Types } from "@requestnetwork/request-client.js";
import { Signer, providers } from "ethers";
import {
  approveUSDCTransfer,
  walletClientToProvider,
  walletClientToSigner,
} from "../pimlico";
import { Chain } from "viem";
import { ERC20_FEE_PROXY_ADDRESS_SEPOLIA } from ".";

// This function checks the balance and approval (if not it calls the approve) of the payer passing a requestData.
// So getRequestData in retrieve-request should be called first
export const preparePayment = async (
  //requestData: Types.IRequestData,
  smartAccountClient: any,
  chain: Chain,
  //payerAddress: string,
  amount: number
): Promise<{ success: boolean; message: string }> => {
  /*const provider = walletClientToProvider(smartAccountClient);

  // Check ERC20 token approval
  /*const hasApproval = await hasErc20Approval(
    requestData,
    payerAddress,
    provider
  );

  // If approval is not yet given, then approve
  if (!hasApproval) {
    const approvalTx = await approveErc20(requestData, provider);
    await approvalTx.wait(); // wait for the transaction to be confirmed
  }*/

  await approveUSDCTransfer(
    smartAccountClient,
    chain,
    ERC20_FEE_PROXY_ADDRESS_SEPOLIA as `0x${string}`,
    amount
  );

  // Return some success response or the next action
  return { success: true, message: "Ready for payment" };
};

export const sendPaymentTransaction = async (
  requestData: Types.IRequestData,
  signer: any
) => {
  const paymentTx = await payRequest(requestData, signer);
  console.log(JSON.stringify(paymentTx, null, 2));
  return await paymentTx.wait(0); // wait for the transaction to be confirmed
};
