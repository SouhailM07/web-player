"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  faPause,
  faPlay,
  faBackwardStep,
  faRepeat,
  faForwardStep,
  faShuffle,
  faVolumeLow,
} from "@fortawesome/free-solid-svg-icons";
import selectedAudioStore from "@/zustand/selectedAudio.store";
import playStore from "@/zustand/play.store";
import audioFilesStore from "@/zustand/audioFiles.store";
import randomPlayStore from "@/zustand/randomPlay.store";
import repeatPlayStore from "@/zustand/repeatPlay.store";
import audioInstanceStore from "@/zustand/audioInstance.store";
import audioVolumeStore from "@/zustand/audioVolume.store";

const AudioContext: any = createContext("");

export function AudioProvider({ children }) {
  const { selectedAudio, editSelectedAudio } = selectedAudioStore(
    (state) => state
  );
  const { audioInstance, editAudioInstance } = audioInstanceStore(
    (state) => state
  );
  const { play, editPlay } = playStore((state) => state);
  const { repeatPlay, editRepeatPlay } = repeatPlayStore((state) => state);
  const { randomPlay, editRandomPlay } = randomPlayStore((state) => state);
  const { audioFiles } = audioFilesStore((state) => state);
  const { audioVolume, editAudioVolume } = audioVolumeStore((state) => state);
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    if (audioInstance) {
      audioInstance.pause();
      audioInstance.currentTime = 0;
      editPlay(false);
    }
    const newAudio = new Audio();
    if (selectedAudio.src) {
      newAudio.src = selectedAudio.src;
      newAudio.play();
      editPlay(true);
    }
    editAudioInstance(newAudio);
    return () => {
      if (newAudio) {
        newAudio.pause();
        newAudio.currentTime = 0;
        editPlay(false);
      }
    };
  }, [selectedAudio]);

  const handlePlay = () => {
    if (selectedAudio.src) {
      play ? audioInstance?.pause() : audioInstance?.play();
      editPlay(!play);
    }
  };

  const handleRepeat = () => {
    editRandomPlay(false);
    repeatPlay < 2 ? editRepeatPlay(repeatPlay + 1) : editRepeatPlay(0);
  };

  const handleForward = () => {
    if (selectedAudio.src) {
      if (selectedAudio.index !== audioFiles.length - 1) {
        let randomNumber = Math.floor(Math.random() * audioFiles.length);
        editSelectedAudio({
          src: audioFiles[randomPlay ? randomNumber : selectedAudio.index + 1]
            .mediaSrc,
          index: randomPlay ? randomNumber : selectedAudio.index + 1,
        });
      }
    }
  };

  const handleBackward = () => {
    if (selectedAudio.src) {
      if (selectedAudio.index !== 0) {
        editSelectedAudio({
          src: audioFiles[selectedAudio.index - 1].mediaSrc,
          index: selectedAudio.index - 1,
        });
      }
    }
  };

  const handleSliderChange = (value) => {
    if (audioInstance && selectedAudio) {
      setSliderValue(value[0]);
      audioInstance.currentTime = (value[0] / 100) * audioInstance.duration;
    }
  };

  useEffect(() => {
    if (!audioInstance) {
      setSliderValue(0);
      return;
    }

    const intervalId = setInterval(async () => {
      if (audioInstance && play) {
        if (audioInstance.currentTime === audioInstance.duration) {
          if (repeatPlay == 2) {
            audioInstance.play();
          } else if (
            selectedAudio.index == audioFiles.length - 1 &&
            repeatPlay == 1
          ) {
            await editSelectedAudio({
              src: audioFiles[0].mediaSrc,
              index: 0,
            });

            toast({
              title: "now playing",
              description: audioFiles[0].customName,
              duration: 2000,
            });
          } else if (
            (selectedAudio.index !== audioFiles.length - 1 &&
              repeatPlay == 0) ||
            randomPlay ||
            (selectedAudio.index !== audioFiles.length - 1 && repeatPlay == 1)
          ) {
            let randomNumber = Math.floor(Math.random() * audioFiles.length);
            await editSelectedAudio({
              src: audioFiles[
                randomPlay ? randomNumber : selectedAudio.index + 1
              ].mediaSrc,
              index: randomPlay ? randomNumber : selectedAudio.index + 1,
            });
            toast({
              title: "now playing",
              description:
                audioFiles[randomPlay ? randomNumber : selectedAudio.index + 1]
                  .customName,
              duration: 2000,
            });
          }
        }
        setSliderValue(
          (audioInstance.currentTime * 100) / audioInstance.duration
        );
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [audioInstance, play, randomPlay, repeatPlay]);

  let controls = [
    {
      icon: faShuffle,
      ariaLabel: "play random",
      handler: () => {
        editRepeatPlay(0);
        editRandomPlay(!randomPlay);
      },
      customStyle: `${randomPlay && "text-cyan-300"}`,
    },
    {
      icon: faBackwardStep,
      ariaLabel: "backward btn",
      handler: () => setTimeout(handleBackward, 100),
    },
    {
      icon: play ? faPause : faPlay,
      ariaLabel: "play btn",
      handler: handlePlay,
      customStyle: `bg-white text-black h-[1.2rem] text-[1rem] p-2 grid place-items-center aspect-square rounded-full`,
    },
    {
      icon: faForwardStep,
      ariaLabel: "forward",
      handler: () => setTimeout(handleForward, 100),
    },
    {
      icon: faRepeat,
      ariaLabel: "repeat btn",
      handler: handleRepeat,
      customStyle: `${
        repeatPlay == 1 ? "text-cyan-300" : repeatPlay == 2 && "text-red-500"
      }`,
    },
  ];

  const handleVolume = (e) => {
    // @ts-ignore
    audioInstance.volume = e[0] / 100;
    editAudioVolume(e[0] / 100);
  };

  useEffect(() => {
    if (audioInstance) {
      audioInstance.volume = audioVolume;
    }
  }, [audioInstance]);

  return (
    <AudioContext.Provider
      value={{
        play,
        handlePlay,
        handleRepeat,
        handleForward,
        handleBackward,
        handleSliderChange,
        handleVolume,
        sliderValue,
        controls,
        audioInstance,
        audioVolume,
        editAudioVolume,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => useContext(AudioContext);
