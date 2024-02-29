import { RequestNetwork } from "@requestnetwork/request-client.js";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";

export const getRequestClient = (provider: any) => {
  const web3SignatureProvider = new Web3SignatureProvider(provider);
  return new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: "https://xdai.gateway.request.network", //all the requests are stored on gnosis chain and can be retrieved using this public Request node gateway
    },
    signatureProvider: web3SignatureProvider,
  });
};
