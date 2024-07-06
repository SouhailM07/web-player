import { create } from "zustand"

const repeatPlayStore = create((set) => ({
    repeatPlay: 0,
    editRepeatPlay: (st) => set({ repeatPlay: st })
}))

export default repeatPlayStore