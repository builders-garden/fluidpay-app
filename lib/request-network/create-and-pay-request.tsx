import { PrivyEmbeddedWalletProvider } from "@privy-io/expo";
import { getRequestClient } from ".";
import { CreateRequestParams, createRequestParameters } from "./create-request";
import { preparePayment, sendPaymentTransaction } from "./pay-request";
import { getRequestData } from "./retrieve-requests";
import { getEthersProvider, getEthersSigner } from "../privy";
import { randomBytes } from "ethers/lib/utils";

export const createAndPayRequest = async (
  requestParams: CreateRequestParams,
  eoaProvider: PrivyEmbeddedWalletProvider,
  smartAccountSigner: any
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
  const requestData = await getRequestData(
    requestClient,
    confirmedRequestData.requestId
  );

  console.log("Request data", requestData);
  console.log("Preparing payment...");
  const ethersProvider = getEthersProvider(eoaProvider);
  const ethersSigner = getEthersSigner(eoaProvider);
  const { success, message } = await preparePayment(
    requestData,
    requestParams.payerIdentity,
    smartAccountSigner,
    smartAccountSigner
  );
  console.log({ success, message });
  if (!success) {
    console.error(message);
    throw new Error(message);
  }
  // Send payment transaction
  const paymentTx = await sendPaymentTransaction(
    requestData,
    smartAccountSigner!
  );
  return paymentTx;
};
