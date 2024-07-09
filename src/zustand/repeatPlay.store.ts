import { create } from "zustand";

interface repeatPlayStoreProps {
  repeatPlay: number;
  editRepeatPlay: (st: number) => void;
}

const repeatPlayStore = create<repeatPlayStoreProps>((set) => ({
  repeatPlay: 0,
  editRepeatPlay: (st) => set({ repeatPlay: st }),
}));

export default repeatPlayStore;
