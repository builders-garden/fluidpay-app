import { create } from "zustand";
import { DBTransaction, SimpleUser } from "./interfaces";

type ProfileStore = {
  user?: SimpleUser;
  transactions?: DBTransaction[];
  setProfileUser: (user?: SimpleUser) => void;
  setProfileUserTransactions: (transactions?: DBTransaction[]) => void;
};

export const useProfileStore = create<ProfileStore>((set) => ({
  user: undefined,
  transactions: undefined,
  setProfileUser: (user) => set({ user }),
  setProfileUserTransactions: (transactions) => set({ transactions }),
}));
