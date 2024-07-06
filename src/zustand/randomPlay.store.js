import { create } from "zustand"

const randomPlayStore = create((set) => ({
    randomPlay: false,
    editRandomPlay: (st) => set({ randomPlay: st })
}))

export default randomPlayStore