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
import { useState } from "react";
import { Slider } from "@/components/ui/slider";

/*==============================================================================================*/
// main component section
/*==============================================================================================*/

export default function PlayPanel() {
  return (
    <section className="grid grid-cols-[1fr_3fr_1fr] fixed text-white  bottom-0 w-full  py-[0.5rem] px-[2rem] bg-black">
      <SoundControl />
      <Controls />
      <article></article>
    </section>
  );
}

/*==============================================================================================*/
// small components
/*==============================================================================================*/

const Controls = () => {
  let controls: links_t[] = [
    { icon: faShuffle, ariaLabel: "play random", handler: "" },
    { icon: faBackwardStep, ariaLabel: "backward btn", handler: "" },
  ];
  let controls_2: links_t[] = [
    { icon: faForwardStep, ariaLabel: "forward", handler: "" },
    { icon: faRepeat, ariaLabel: "repeat btn", handler: "" },
  ];
  let [play, setPlay] = useState<boolean>(false);
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
          role="listitem"
          className="bg-white text-black h-[1.8rem] aspect-square rounded-full grid place-items-center select-none"
        >
          {play ? (
            <FontAwesomeIcon
              icon={faPause}
              role="button"
              onClick={() => setPlay(!play)}
              className="h-[1rem] aspect-square"
            />
          ) : (
            <FontAwesomeIcon
              onClick={() => setPlay(!play)}
              role="button"
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
      <TrackLine />
    </article>
  );
};

const TrackLine = () => {
  return (
    <div className="w-full flexBetween gap-x-2 select-none">
      <span className="text-[0.6rem] ">0.00</span>
      <Slider defaultValue={[33]} max={100} step={1} />
      <span className="text-[0.6rem]">3.50</span>
    </div>
  );
};

const SoundControl = () => {
  return (
    <article className="flexBetween gap-x-2 w-[6rem]">
      <FontAwesomeIcon icon={faVolumeLow} className="h-[1rem] aspect-square" />
      <Slider defaultValue={[33]} max={100} step={1} />
    </article>
  );
};
