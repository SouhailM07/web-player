import { create } from "zustand";

interface searchAudioStoreProps {
  searchAudio: string;
  editSearchAudio: (st: string) => void;
}

const searchAudioStore = create<searchAudioStoreProps>((set) => ({
  searchAudio: "",
  editSearchAudio: (st) => set({ searchAudio: st }),
}));

export default searchAudioStore;
