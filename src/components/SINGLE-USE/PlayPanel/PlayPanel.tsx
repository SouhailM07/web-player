"use client";
import "./playpanel.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPause,
  faPlay,
  faBackwardStep,
  faRepeat,
  faForwardStep,
  faShuffle,
  faVolumeLow,
} from "@fortawesome/free-solid-svg-icons";
import { links_t } from "@/types";
import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import formatTime from "@/lib/formatTime";
import { toast } from "@/components/ui/use-toast";
import selectedAudioStore from "@/zustand/selectedAudio.store";
import playStore from "@/zustand/play.store";
import audioFilesStore from "@/zustand/audioFiles.store";
import randomPlayStore from "@/zustand/randomPlay.store";
import repeatPlayStore from "@/zustand/repeatPlay.store";
import audioInstanceStore from "@/zustand/audioInstance.store";
import audioVolumeStore from "@/zustand/audioVolume.store";

/*==============================================================================================*/
// main component section
/*==============================================================================================*/

export default function PlayPanel() {
  const { selectedAudio } = selectedAudioStore((state) => state);
  const { audioInstance, editAudioInstance } = audioInstanceStore(
    (state) => state
  );

  const { play, editPlay } = playStore((state) => state);
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

  return (
    <section className="md:grid md:grid-cols-3   max-md:space-y-2 lg:grid-cols-[15rem_10rem_15rem] justify-between gap-x-[1rem] fixed text-white  bottom-0 w-full  py-[0.5rem] px-[2rem] bg-black">
      <SoundControl />
      <Controls />
      <TrackLine />
    </section>
  );
}

/*==============================================================================================*/
// small components
/*==============================================================================================*/

const Controls = () => {
  const { selectedAudio, editSelectedAudio } = selectedAudioStore(
    (state) => state
  );
  const { audioInstance } = audioInstanceStore((state) => state);
  const { repeatPlay, editRepeatPlay } = repeatPlayStore((state) => state);
  const { randomPlay, editRandomPlay } = randomPlayStore((state) => state);
  const { audioFiles } = audioFilesStore((state) => state);

  const handlePlay = () => {
    if (selectedAudio.src) {
      play ? audioInstance?.pause() : audioInstance?.play();
      editPlay(!play);
    }
  };
  const handleRepeat = () => {
    console.log(repeatPlay);
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
      if (selectedAudio.index !== 0)
        editSelectedAudio({
          src: audioFiles[selectedAudio.index - 1].mediaSrc,
          index: selectedAudio.index - 1,
        });
    }
  };
  const { play, editPlay } = playStore((state) => state);
  let controls: links_t[] = [
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
      customStyle: ` bg-white text-black h-[1.2rem] p-2 grid place-items-center aspect-square rounded-full`,
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
  // const { audioVolume, editAudioVolume } = audioVolumeStore((state) => state);

  useEffect(() => {
    console.log("check render from controls");
  }, [selectedAudio, play]);

  return (
    <article className="w-[12rem] max-md:mx-auto  space-y-2 place-self-center">
      <ul role="list" className="flexBetween w-full">
        {controls.map((e, i) => (
          <motion.li
            whileHover={{ scale: 1.2 }}
            key={i}
            role="listitem"
            className="select-none"
          >
            <FontAwesomeIcon
              role="button"
              icon={e.icon}
              onClick={e?.handler}
              className={`${e.customStyle} h-[1rem] aspect-square `}
            />
          </motion.li>
        ))}
      </ul>
    </article>
  );
};

const TrackLine = () => {
  const { audioInstance, editAudioInstance } = audioInstanceStore(
    (state) => state
  );
  const [sliderValue, setSliderValue] = useState(0);
  const { play } = playStore((state) => state);
  const { selectedAudio, editSelectedAudio } = selectedAudioStore(
    (state) => state
  );
  const { randomPlay } = randomPlayStore((state) => state);
  const { audioFiles } = audioFilesStore((state) => state);
  // Update sliderValue when audioInstance or play state changes
  const { repeatPlay, editRepeatPlay } = repeatPlayStore((state) => state);

  useEffect(() => {
    if (!audioInstance) {
      setSliderValue(0);
      return;
    }

    console.log("check render from interval");
    const intervalId = setInterval(async () => {
      if (audioInstance && play) {
        if (audioInstance.currentTime === audioInstance.duration) {
          if (repeatPlay == 2) {
            console.log(repeatPlay);
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

    // Cleanup function to clear the interval when component unmounts or play state changes
    return () => clearInterval(intervalId);
  }, [audioInstance, play, randomPlay, repeatPlay]);

  const handleSliderChange = (value) => {
    if (audioInstance && selectedAudio) {
      setSliderValue(value[0]);
      audioInstance.currentTime = (value[0] / 100) * audioInstance.duration;
    }
  };

  return (
    <div className="  w-full   flexBetween gap-x-2 select-none">
      <span className="text-[0.6rem]">
        {formatTime(audioInstance?.currentTime || 0)}
      </span>
      <Slider
        onValueChange={handleSliderChange}
        value={[sliderValue]}
        max={100}
        step={0.1}
      />
      <span className="text-[0.6rem]">
        {formatTime(audioInstance?.duration || 0)}
      </span>
    </div>
  );
};

const SoundControl = () => {
  const { audioVolume, editAudioVolume } = audioVolumeStore((state) => state);

  const { audioInstance } = audioInstanceStore((state) => state);
  let handleVolume = (e) => {
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
    <article className="flexBetween gap-x-2 w-[6rem] max-md:hidden">
      <FontAwesomeIcon icon={faVolumeLow} className="h-[1rem] aspect-square" />
      <Slider
        onValueChange={handleVolume}
        value={[audioVolume * 100]}
        max={100}
        step={1}
      />
    </article>
  );
};
