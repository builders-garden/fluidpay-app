import { PrivyEmbeddedWalletProvider } from "@privy-io/expo";
import { getRequestClient } from ".";
import { CreateRequestParams, createRequestParameters } from "./create-request";
import { approvePayment, sendPayment } from "./pay-request";
import { getRequestData } from "./retrieve-requests";
import { Chain, sepolia } from "viem/chains";
import { getPaymentReference } from "@requestnetwork/payment-detection";

export const createAndPayRequest = async (
  requestParams: CreateRequestParams,
  eoaProvider: PrivyEmbeddedWalletProvider,
  smartAccountSigner: any,
  chain: Chain
) => {
  const requestCreateParameters = createRequestParameters(requestParams);
  console.log("Getting request client...");
  const requestClient = getRequestClient(eoaProvider);

  console.log("Creating request...");
  const createdRequest = await requestClient.createRequest(
    requestCreateParameters
  );

  console.log("Waiting confirmation...");
  const confirmedRequestData = await createdRequest.waitForConfirmation();

  console.log("Request created", confirmedRequestData.requestId);

  // Prepare for payment
  console.log("Retrieving request data...");
  const requestData = await getRequestData(
    requestClient,
    confirmedRequestData.requestId
  );

  //console.log("Request data", requestData);
  console.log("Preparing payment...");
  const isApproved = await approvePayment(
    smartAccountSigner,
    chain,
    requestParams.amount
  );
  console.log("Token transfer approved");
  if (!isApproved) {
    throw new Error("Token transfer not approved");
  }

  console.log("Getting payment reference...");
  const paymentReference = await getPaymentReference(requestData);
  if (!paymentReference) {
    throw new Error("Payment reference not found");
  }
  console.log("Payment reference", paymentReference);

  // Send payment transaction
  const hash = await sendPayment(
    smartAccountSigner,
    chain,
    requestParams.payeeIdentity as `0x${string}`,
    requestParams.amount,
    paymentReference as string
  );
  return {
    hash,
    requestId: confirmedRequestData.requestId,
  };
};
