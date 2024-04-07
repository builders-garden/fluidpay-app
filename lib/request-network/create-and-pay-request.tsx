import { PrivyEmbeddedWalletProvider } from "@privy-io/expo";
import { getRequestClient } from ".";
import { CreateRequestParams, createRequestParameters } from "./create-request";
import { processPayment, sendPaymentTransaction } from "./pay-request";
import { getRequestData } from "./retrieve-requests";
import { getEthersProvider, getEthersSigner } from "../privy";

export const createAndPayRequest = async (
  requestParams: CreateRequestParams,
  provider: PrivyEmbeddedWalletProvider
) => {
  const requestCreateParameters = createRequestParameters(requestParams);
  console.log("Getting request client...");
  const requestClient = getRequestClient(provider);

  console.log("Creating request..." + requestCreateParameters);
  const createdRequest = await requestClient.createRequest(
    requestCreateParameters
  );

  console.log("Waiting confirmation...");
  const confirmedRequestData = await createdRequest.waitForConfirmation();

  console.log("Request created", confirmedRequestData.requestId);

  // Prepare for payment
  const requestData = await getRequestData(
    requestClient,
    confirmedRequestData.requestId
  );

  console.log("Request data", requestData);
  console.log("Processing payment...");
  const ethersProvider = getEthersProvider(provider);
  const ethersSigner = getEthersSigner(provider);
  const { success, message } = await processPayment(
    requestData,
    requestParams.payerIdentity,
    ethersProvider,
    ethersSigner!
  );
  if (!success) {
    console.error(message);
    throw new Error(message);
  }

  // Send payment transaction
  await sendPaymentTransaction(requestData, ethersSigner!);
};
