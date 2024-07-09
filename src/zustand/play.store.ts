import { create } from "zustand";

type playStoreProps = {
  play: boolean;
  editPlay: (st: boolean) => void;
};

const playStore = create<playStoreProps>((set) => ({
  play: false,
  editPlay: (st) => set({ play: st }),
}));

export default playStore;
