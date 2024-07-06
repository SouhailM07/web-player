"use client";
import "./homepage.css";
import { APP_API_URL } from "@/lib/APP_API_URL";
import handleError from "@/lib/handleError";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect } from "react";
// import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faSearch,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
// ! zustand states
import selectedAudioStore from "@/zustand/selectedAudio.store";
import audioFilesStore from "@/zustand/audioFiles.store";
import playStore from "@/zustand/play.store";
import MyDialog from "@/components/REUSABLE/MyDialog/MyDialog";

export default function HomePage() {
  const { user } = useUser();
  const { audioFiles, editAudioFiles } = audioFilesStore((state) => state);

  const getAudios = async () => {
    try {
      const res = await axios.get(
        `${APP_API_URL}/api/media?userId=${user?.id}`
      );
      editAudioFiles(res.data);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      getAudios();
    }
  }, [user]);

  return (
    <main className="flexCenter flex-col gap-y-[1rem] text-white px-[2rem]">
      <HeadPanel />
      <ul className="max-h-maxHeight  bg-neutral-800 pt-[1rem] rounded-lg text-[0.7rem]  w-full flex flex-col ">
        {audioFiles.map((e, i) => (
          <HomePageRenderItem {...e} key={i} i={i} />
        ))}
      </ul>
    </main>
  );
}

const HeadPanel = () => {
  const { audioFiles, editAudioFiles } = audioFilesStore((state) => state);

  return (
    <section className="flexBetween w-full">
      <article className="flexCenter  bg-neutral-800 p-2 rounded-lg h-[2.5rem]">
        <FontAwesomeIcon icon={faSearch} className="text-neutral-400" />
        <input
          className=" rounded-md indent-[1rem] text-[0.7rem] h-full outline-none border-none min-w-[20rem] text-white bg-transparent"
          placeholder="search..."
          type="text"
        />
      </article>
      <article>
        Files : <span>{audioFiles.length}</span>
      </article>
    </section>
  );
};

const HomePageRenderItem = ({ i, mediaSrc, mediaName }) => {
  const { play, editPlay } = playStore((state) => state);
  const { audioFiles } = audioFilesStore((state) => state);

  const { selectedAudio, editSelectedAudio } = selectedAudioStore(
    (state) => state
  );
  return (
    <li
      className={`${selectedAudio.index === i && "text-cyan-300"} ${
        i != audioFiles.length - 1 && "border-b"
      } h-[3rem] gap-x-5  border-white pl-[1.5rem] pr-[0.8rem] flexBetween cursor-pointer`}
    >
      <p
        onClick={() => {
          editSelectedAudio({ src: mediaSrc, index: i });
          editPlay(true);
        }}
        className="w-full overflow-hidden flex items-center h-full text-nowrap "
      >
        {mediaName.slice(6)}
      </p>
      <div className="flex gap-x-[1.5rem] items-center text-[1rem]">
        <FontAwesomeIcon icon={faPenToSquare} className="text-neutral-300" />
        <MyDialog
          trigger={<FontAwesomeIcon icon={faTrash} className="text-red-500" />}
        >
          <div>hello how are you</div>
        </MyDialog>
      </div>
    </li>
  );
};
