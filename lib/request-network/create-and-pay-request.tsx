import { PrivyEmbeddedWalletProvider } from "@privy-io/expo";
import { getRequestClient } from ".";
import { CreateRequestParams, createRequestParameters } from "./create-request";
import { preparePayment, sendPaymentTransaction } from "./pay-request";
import { getRequestData } from "./retrieve-requests";
import { getEthersProvider, getEthersSigner } from "../privy";
import { randomBytes } from "ethers/lib/utils";
import { sepolia } from "viem/chains";
import { getPaymentReference } from "@requestnetwork/payment-detection";
import {
  payERC20Request,
  walletClientToProvider,
  walletClientToSigner,
} from "../pimlico";

export const createAndPayRequest = async (
  requestParams: CreateRequestParams,
  eoaProvider: PrivyEmbeddedWalletProvider,
  smartAccountSigner: any
) => {
  const requestCreateParameters = createRequestParameters(requestParams);
  console.log("Getting request client...");
  const requestClient = getRequestClient(eoaProvider);

  /*console.log("Creating request...");
  const createdRequest = await requestClient.createRequest(
    requestCreateParameters
  );

  console.log("Waiting confirmation...");
  const confirmedRequestData = await createdRequest.waitForConfirmation();

  console.log("Request created", confirmedRequestData.requestId);*/

  // Prepare for payment
  console.log("Retrieving request data...");
  const requestData = await getRequestData(
    requestClient,
    // confirmedRequestData.requestId
    "01178feb4e4b4d00aaa14c8b3ca543d2b0c48c535b684747e1586e689f0a718fcd"
  );

  console.log("Getting payment reference...");
  const paymentReference = await getPaymentReference(requestData);
  console.log("Payment reference", paymentReference);

  console.log("Request data", requestData);
  console.log("Preparing payment...");
  const { success, message } = await preparePayment(
    smartAccountSigner,
    sepolia,
    requestParams.amount
  );
  console.log({ success, message });
  if (!success) {
    console.error(message);
    throw new Error(message);
  }
  // Send payment transaction
  /*const paymentTx = await sendPaymentTransaction(
    requestData,
    walletClientToProvider(smartAccountSigner)
  );*/
  const paymentTx = await payERC20Request(
    smartAccountSigner,
    sepolia,
    requestParams.payeeIdentity as `0x${string}`,
    requestParams.amount,
    paymentReference as `0x${string}`
  );
  return paymentTx;
};
