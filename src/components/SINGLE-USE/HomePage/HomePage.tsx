"use client";
import dynamic from "next/dynamic";
import { APP_API_URL } from "@/lib/APP_API_URL";
import handleError from "@/lib/handleError";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faVolumeLow } from "@fortawesome/free-solid-svg-icons";
// ! zustand states
import audioFilesStore from "@/zustand/audioFiles.store";
import searchAudioStore from "@/zustand/searchAudio.store";
import loadingStore from "@/zustand/loading.store";
import audioInstanceStore from "@/zustand/audioInstance.store";
import { Slider } from "@/components/ui/slider";
import audioVolumeStore from "@/zustand/audioVolume.store";

//
const DynamicHomePageRenderItem = dynamic(
  () => import("@/components/REUSABLE/HomePageRenderItem/HomePageRenderItem")
);

export default function HomePage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { audioFiles, editAudioFiles } = audioFilesStore((state) => state);
  const { editLoading } = loadingStore((state) => state);
  const { searchAudio } = searchAudioStore((state) => state);
  const getAudios = async () => {
    try {
      if (isSignedIn) {
        editLoading(true);
        const res = await axios.get(
          `${APP_API_URL}/api/media?userId=${user?.id}`
        );
        editAudioFiles(res.data);
      }
    } catch (error) {
      handleError(error);
    } finally {
      editLoading(false);
    }
  };

  useEffect(() => {
    isSignedIn && isLoaded ? getAudios() : editAudioFiles([]);
  }, [isSignedIn]);
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
        Files : <span>{audioFiles.length}</span>
      </article>
    </section>
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
