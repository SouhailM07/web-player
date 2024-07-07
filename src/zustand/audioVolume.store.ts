import { create } from "zustand";
import { persist } from "zustand/middleware";

type AudioVolumeStoreProps = {
  audioVolume: number;
  editAudioVolume: (volume: number) => void;
};

const audioVolumeStore = create<AudioVolumeStoreProps>()(
  persist(
    (set) => ({
      audioVolume: 0.5,
      editAudioVolume: (volume: number) => set({ audioVolume: volume }),
    }),
    { name: "audioVolume" }
  )
);

export default audioVolumeStore;
