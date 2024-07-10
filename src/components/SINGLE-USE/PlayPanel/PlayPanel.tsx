"use client";
import { Slider } from "@/components/ui/slider";
import { AudioProvider } from "@/context/AudioContext";
import { useAudio } from "@/context/AudioContext";
import formatTime from "@/lib/formatTime";
import { faVolumeLow } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";

export default function PlayPanel() {
  return (
    <AudioProvider>
      <section className="md:grid md:grid-cols-3 max-md:space-y-2 lg:grid-cols-[15rem_10rem_15rem] justify-between gap-x-[1rem] fixed text-white bottom-0 w-full py-[0.5rem] px-[2rem] bg-black">
        <SoundControl />
        <Controls />
        <TrackLine />
      </section>
    </AudioProvider>
  );
}

const Controls = () => {
  const { controls }: any = useAudio();

  return (
    <article className="w-[12rem] max-md:mx-auto space-y-2 place-self-center">
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
              onClick={e.handler}
              className={`${e.customStyle} h-[1rem] aspect-square`}
            />
          </motion.li>
        ))}
      </ul>
    </article>
  );
};

const TrackLine = () => {
  const { handleSliderChange, sliderValue, audioInstance }: any = useAudio();

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

const SoundControl = () => {
  const { handleVolume, audioVolume }: any = useAudio();

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
