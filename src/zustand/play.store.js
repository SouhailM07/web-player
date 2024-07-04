import { create } from "zustand";

const playStore = create((set) => ({
    play: false,
    editPlay: (st) => set({ play: st })
}))

export default playStore