import { create } from "zustand";

type GroupsStore = {
  groups: any[];
  addGroup: (group: any) => void;
  setGroups: (groups: any[]) => void;
};

export const useGroupsStore = create<GroupsStore>((set, get) => ({
  groups: [],
  addGroup: (group) => set((state) => ({ groups: [...state.groups, group] })),
  setGroups: (groups) => set({ groups }),
}));
