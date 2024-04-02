import { base, sepolia } from "viem/chains";

export interface Tokens {
  [token: string]: {
    [chainId: number]: string;
  };
}
const tokens: Tokens = {
  USDC: {
    [sepolia.id]: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
    [base.id]: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
  },
};

export default tokens;
