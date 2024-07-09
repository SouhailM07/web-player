import { create } from "zustand";

interface selectedAudioStoreProps {
  selectedAudio: any;
  editSelectedAudio: (st: any) => void;
}

const selectedAudioStore = create<selectedAudioStoreProps>((set) => ({
  selectedAudio: "",
  editSelectedAudio: (st) => set({ selectedAudio: st }),
}));

export default selectedAudioStore;
