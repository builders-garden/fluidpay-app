import { create } from "zustand";
import { DBUser } from "./interfaces";

type SendStore = {
  user?: DBUser;
  setSendUser: (user?: DBUser) => void;
};

export const useSendStore = create<SendStore>((set) => ({
  user: undefined,
  setSendUser: (user) => set({ user }),
}));
