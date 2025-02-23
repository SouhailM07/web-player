"use client";
import dynamic from "next/dynamic";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faVolumeLow } from "@fortawesome/free-solid-svg-icons";
import { Slider } from "@/components/ui/slider";
// ! context api
import { useGlobalContext } from "@/context/GlobalContext";
import { useAudio } from "@/context/AudioContext";
// ! zustand states
import audioFilesStore from "@/zustand/audioFiles.store";
import searchAudioStore from "@/zustand/searchAudio.store";

//
const DynamicHomePageRenderItem = dynamic(
  () => import("@/components/REUSABLE/HomePageRenderItem/HomePageRenderItem")
);

export default function HomePage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { audioFiles } = audioFilesStore((state) => state);
  const { searchAudio } = searchAudioStore((state) => state);
  const { getAudios }: any = useGlobalContext();

  useEffect(() => {
    if (user) getAudios();
  }, [user]);
  let arrOfFiles = audioFiles.filter((e) =>
    e.customName.toLowerCase().includes(searchAudio.toLowerCase())
  );
  return (
    <main className="max-w-[90rem] mx-auto  flexCenter flex-col gap-y-[1rem] text-white max-md:px-[1rem] px-[2rem]">
      <HeadPanel />
      <ul
        role="list"
        className="max-h-audioContainer max-md:max-h-autoContainerSm scrollable-component overflow-y-auto  bg-neutral-800 pt-[1rem] rounded-lg text-[0.7rem]  w-full flex flex-col "
      >
        {!arrOfFiles.length || !isSignedIn ? (
          <li className="text-center h-[3rem]">Empty</li>
        ) : (
          arrOfFiles.map((e, i) => (
            <DynamicHomePageRenderItem {...e} key={i} i={i} />
          ))
        )}
      </ul>
    </main>
  );
}

const HeadPanel = () => {
  const { isSignedIn, isLoaded } = useUser();
  const { audioFiles, editAudioFiles } = audioFilesStore((state) => state);
  const { searchAudio, editSearchAudio } = searchAudioStore((state) => state);
  return (
    <section className="flexBetween w-full max-md:flex-col gap-y-3">
      <article className="md:hidden flexBetween w-full">
        <SoundControl />
        <div>
          Files : <span>{audioFiles.length}</span>
        </div>
      </article>
      <article className="flexCenter max-md:w-full  bg-neutral-800 p-2 rounded-lg h-[2.5rem]">
        <FontAwesomeIcon
          icon={faSearch}
          className="h-[1rem] aspect-square text-neutral-400 text-[1rem]"
        />
        <input
          value={searchAudio}
          onChange={(e) => editSearchAudio(e.target.value)}
          className=" rounded-sm indent-[1rem] text-[0.7rem] h-full outline-none border-none w-full md:min-w-[20rem] text-white bg-transparent"
          placeholder="search..."
          type="text"
        />
      </article>
      <article className="max-md:hidden">
        Files : <span>{!isSignedIn ? 0 : audioFiles.length}</span>
      </article>
    </section>
  );
};

const SoundControl = () => {
  const { handleVolume, audioVolume }: any = useAudio();

  return (
    <article className="flexBetween gap-x-2 w-[6rem] ">
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
