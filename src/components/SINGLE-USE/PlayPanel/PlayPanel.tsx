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
import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import selectedAudioStore from "@/zustand/selectedAudio.store";
import playStore from "@/zustand/play.store";
/*==============================================================================================*/
// main component section
/*==============================================================================================*/

export default function PlayPanel() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { selectedAudio, editSelectedAudio } = selectedAudioStore(
    (state) => state
  );
  return (
    <section className="grid grid-cols-[1fr_3fr_1fr] fixed text-white  bottom-0 w-full  py-[0.5rem] px-[2rem] bg-black">
      <audio ref={audioRef} src={selectedAudio.src}></audio>
      <SoundControl audioRef={audioRef} />
      <Controls audioRef={audioRef} />
      <article></article>
    </section>
  );
}

/*==============================================================================================*/
// small components
/*==============================================================================================*/

const Controls = ({ audioRef }) => {
  const { selectedAudio, editSelectedAudio } = selectedAudioStore(
    (state) => state
  );
  let controls: links_t[] = [
    { icon: faShuffle, ariaLabel: "play random", handler: "" },
    { icon: faBackwardStep, ariaLabel: "backward btn", handler: "" },
  ];
  let controls_2: links_t[] = [
    { icon: faForwardStep, ariaLabel: "forward", handler: "" },
    { icon: faRepeat, ariaLabel: "repeat btn", handler: "" },
  ];
  const { play, editPlay } = playStore((state) => state);
  useEffect(() => {
    console.log("check render from controls");
    play ? audioRef.current?.play() : audioRef.current?.pause();
  }, [selectedAudio, play]);
  const handlePlay = () => {
    if (selectedAudio.src) {
      editPlay(!play);
    }
  };
  return (
    <article className="w-[20rem] space-y-2 place-self-center">
      <ul role="list" className="flexBetween w-[10rem]  mx-auto">
        {controls.map((e, i) => (
          <li key={i} role="listitem" className="select-none">
            <FontAwesomeIcon
              role="button"
              icon={e.icon}
              className="h-[1rem] aspect-square "
            />
          </li>
        ))}
        <li
          role="button"
          onClick={handlePlay}
          className="bg-white text-black h-[1.8rem] aspect-square rounded-full grid place-items-center select-none"
        >
          {play ? (
            <FontAwesomeIcon
              icon={faPause}
              className="h-[1rem] aspect-square"
            />
          ) : (
            <FontAwesomeIcon
              icon={faPlay}
              className="h-[1rem] aspect-square translate-x-[2px]"
            />
          )}
        </li>
        {controls_2.map((e, i) => (
          <li role="listitem" key={i}>
            <FontAwesomeIcon
              role="button"
              icon={e.icon}
              className="h-[1rem] aspect-square"
            />
          </li>
        ))}
      </ul>
      <TrackLine audioDetails={audioRef} />
    </article>
  );
};

const TrackLine = ({ audioDetails }) => {
  const getCurrentTime = (): number => {
    return (
      (audioDetails.current?.currentTime * 100) / audioDetails.current?.duration
    );
  };
  return (
    <div className="w-full flexBetween gap-x-2 select-none">
      <span className="text-[0.6rem] ">0.00</span>
      <Slider
        onValueCommit={(e) => (audioDetails.current.currentTime = e[0])}
        defaultValue={[getCurrentTime()]}
        max={audioDetails.current?.duration}
        step={1}
      />
      <span className="text-[0.6rem] ">
        {(audioDetails.current?.duration / 60 || 0.0).toFixed(2)}
      </span>
    </div>
  );
};

const SoundControl = ({ audioRef }) => {
  let handleVolume = (e) => {
    audioRef.current.volume = e[0] / 100;
  };

  return (
    <article className="flexBetween gap-x-2 w-[6rem]">
      <FontAwesomeIcon icon={faVolumeLow} className="h-[1rem] aspect-square" />
      <Slider
        onValueChange={handleVolume}
        defaultValue={[audioRef.current?.volume || 1 * 100]}
        max={100}
        step={1}
      />
    </article>
  );
};
