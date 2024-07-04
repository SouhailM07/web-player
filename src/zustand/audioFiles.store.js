import { create } from "zustand"

const audioFilesStore = create((set) => ({
    audioFiles: [],
    editAudioFiles: (st) => set({ audioFiles: st })
}))

export default audioFilesStore;