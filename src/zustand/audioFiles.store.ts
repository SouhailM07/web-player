import { create } from "zustand";

interface audioFilesStoreProps {
  audioFiles: any[];
  editAudioFiles: (st: any) => void;
}

const audioFilesStore = create<audioFilesStoreProps>((set) => ({
  audioFiles: [],
  editAudioFiles: (st) => set({ audioFiles: st }),
}));

export default audioFilesStore;
