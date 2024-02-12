import { create } from "zustand";
import { DBUser } from "./interfaces";

type UserStore = {
  user?: DBUser;
  setUser: (user?: DBUser) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
}));
