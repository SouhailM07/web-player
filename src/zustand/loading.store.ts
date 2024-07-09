import { create } from "zustand";

interface loadingStoreProps {
  loading: boolean;
  editLoading: (st: boolean) => void;
}

const loadingStore = create<loadingStoreProps>((set) => ({
  loading: false,
  editLoading: (st) => set({ loading: st }),
}));

export default loadingStore;
