import { create } from "zustand"

const selectedAudioStore = create((set) => ({
    selectedAudio: "",
    editSelectedAudio: (st) => set({ selectedAudio: st })
}))

export default selectedAudioStore