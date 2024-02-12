import { create } from "zustand";
import { DBTransaction } from "./interfaces";

type TransactionStore = {
  transactions: DBTransaction[];
  addTransaction: (transaction: DBTransaction) => void;
  clearTransactions: () => void;
  setTransactions: (transactions: DBTransaction[]) => void;
};

export const useTransactionsStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  addTransaction: (transaction) =>
    set((state) => ({ transactions: [...state.transactions, transaction] })),
  clearTransactions: () => set({ transactions: [] }),
  setTransactions: (transactions) => set({ transactions }),
}));
