import { PrivyEmbeddedWalletProvider } from "@privy-io/expo";
import { RequestNetwork } from "@requestnetwork/request-client.js";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";

export const getRequestClient = (provider: PrivyEmbeddedWalletProvider) => {
  const web3SignatureProvider = new Web3SignatureProvider(provider);
  return new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: "https://gnosis.gateway.request.network", //all the requests are stored on gnosis chain and can be retrieved using this public Request node gateway
    },
    signatureProvider: web3SignatureProvider,
  });
};
