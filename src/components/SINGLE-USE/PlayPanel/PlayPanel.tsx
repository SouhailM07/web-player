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
import selectedAudioStore from "@/zustand/selectedAudio.store";
import playStore from "@/zustand/play.store";
import formatTime from "@/lib/formatTime";
import audioFilesStore from "@/zustand/audioFiles.store";
import { toast, useToast } from "@/components/ui/use-toast";

/*==============================================================================================*/
// main component section
/*==============================================================================================*/

export default function PlayPanel() {
  const { selectedAudio, editSelectedAudio } = selectedAudioStore(
    (state) => state
  );
  // const [duration, setDuration] = useState(0);
  // const [currentTime, setCurrentTime] = useState(0);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(
    null
  );
  // const [isPlaying, setIsPlaying] = useState<boolean>(false);
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
    setAudioInstance(newAudio);
    return () => {
      if (newAudio) {
        newAudio.pause();
        newAudio.currentTime = 0;
        editPlay(false);
      }
    };
  }, [selectedAudio]);
  return (
    <section className="grid grid-cols-[1fr_3fr_1fr] fixed text-white  bottom-0 w-full  py-[0.5rem] px-[2rem] bg-black">
      <SoundControl audioInstance={audioInstance} />
      <Controls audioInstance={audioInstance} />
      <TrackLine audioInstance={audioInstance} />
    </section>
  );
}

/*==============================================================================================*/
// small components
/*==============================================================================================*/

const Controls = ({ audioInstance }) => {
  const { selectedAudio, editSelectedAudio } = selectedAudioStore(
    (state) => state
  );
  const handlePlay = () => {
    if (selectedAudio.src) {
      play ? audioInstance.pause() : audioInstance.play();
      editPlay(!play);
    }
  };
  const { play, editPlay } = playStore((state) => state);
  let controls: links_t[] = [
    { icon: faShuffle, ariaLabel: "play random", handler: "" },
    { icon: faBackwardStep, ariaLabel: "backward btn", handler: "" },
    {
      icon: play ? faPause : faPlay,
      ariaLabel: "play btn",
      handler: handlePlay,
      customStyle: ` bg-white text-black p-2 grid place-items-center aspect-square rounded-full`,
    },
    { icon: faForwardStep, ariaLabel: "forward", handler: "" },
    { icon: faRepeat, ariaLabel: "repeat btn", handler: "" },
  ];

  useEffect(() => {
    console.log("check render from controls");
  }, [selectedAudio, play]);

  return (
    <article className="w-[20rem] space-y-2 place-self-center">
      <ul role="list" className="flexBetween w-[10rem]  mx-auto">
        {controls.map((e, i) => (
          <li key={i} role="listitem" className="select-none">
            <FontAwesomeIcon
              role="button"
              icon={e.icon}
              onClick={e?.handler}
              className={`${e.customStyle} h-[1rem] aspect-square `}
            />
          </li>
        ))}
      </ul>
    </article>
  );
};

const TrackLine = ({ audioInstance }) => {
  const [sliderValue, setSliderValue] = useState(0);
  const { play, editPlay } = playStore((state) => state);
  const { selectedAudio, editSelectedAudio } = selectedAudioStore(
    (state) => state
  );
  const { audioFiles } = audioFilesStore((state) => state);
  // Update sliderValue when audioInstance or play state changes
  useEffect(() => {
    if (!audioInstance) return;
    console.log("check render from interval");
    const intervalId = setInterval(async () => {
      if (audioInstance && play) {
        // ! if repeat reset to 0 , else check if this is the last and stop it
        if (
          audioInstance.currentTime === audioInstance.duration &&
          selectedAudio.index !== audioFiles.length - 1
        ) {
          await editSelectedAudio({
            src: audioFiles[selectedAudio.index + 1].mediaSrc,
            index: selectedAudio.index + 1,
          });
        }
        setSliderValue(
          (audioInstance.currentTime * 100) / audioInstance.duration
        );
      }
    }, 1000);

    // Cleanup function to clear the interval when component unmounts or play state changes
    return () => clearInterval(intervalId);
  }, [audioInstance, play]);

  const handleSliderChange = (value) => {
    setSliderValue(value[0]);
    if (audioInstance) {
      // Adjust currentTime of audioInstance based on slider value
      audioInstance.currentTime = (value[0] / 100) * audioInstance.duration;
    }
  };

  return (
    <div className="w-full flexBetween gap-x-2 select-none">
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

const SoundControl = ({ audioInstance }) => {
  let handleVolume = (e) => {
    audioInstance.volume = e[0] / 100;
  };

  return (
    <article className="flexBetween gap-x-2 w-[6rem]">
      <FontAwesomeIcon icon={faVolumeLow} className="h-[1rem] aspect-square" />
      <Slider
        onValueChange={handleVolume}
        defaultValue={[audioInstance?.volume || 1 * 100]}
        max={100}
        step={1}
      />
    </article>
  );
};
