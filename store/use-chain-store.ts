import { Chain } from "viem";
import { sepolia } from "viem/chains";
import { create } from "zustand";

type ChainStore = {
  chain: Chain;
  setChain: (chain: Chain) => void;
};

export const useChainStore = create<ChainStore>((set, get) => ({
  chain: sepolia,
  setChain: (chain) => set({ chain }),
}));
