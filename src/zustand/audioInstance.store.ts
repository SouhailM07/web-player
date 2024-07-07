import { create } from "zustand";

type AudioState = {
  audioInstance: HTMLAudioElement | null;
  editAudioInstance: (audio: HTMLAudioElement | null) => void;
};

const audioInstanceStore = create<AudioState>((set) => ({
  audioInstance: null,
  editAudioInstance: (audio) => set({ audioInstance: audio }),
}));

export default audioInstanceStore;