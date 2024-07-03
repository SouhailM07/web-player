import { create } from "zustand"

const loadingStore = create((set) => ({
    loading: false,
    editLoading: (st) => set({ loading: st })
}))

export default loadingStore