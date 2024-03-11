export interface Tokens {
  [name: string]: {
    sepolia: string;
    base: string;
  };
}
const tokens: Tokens = {
  USDC: {
    sepolia: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
    base: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
  },
};

export default tokens;
