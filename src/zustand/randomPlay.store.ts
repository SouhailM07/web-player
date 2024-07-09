import { create } from "zustand";

interface randomPlayStoreProps {
  randomPlay: boolean;
  editRandomPlay: (st: boolean) => void;
}

const randomPlayStore = create<randomPlayStoreProps>((set) => ({
  randomPlay: false,
  editRandomPlay: (st) => set({ randomPlay: st }),
}));

export default randomPlayStore;
