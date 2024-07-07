import { create } from "zustand"

const searchAudioStore = create((set) => ({
    searchAudio: "",
    editSearchAudio: (st) => set({ searchAudio: st })
}))

export default searchAudioStore