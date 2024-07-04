"use client";
import { APP_API_URL } from "@/lib/APP_API_URL";
import handleError from "@/lib/handleError";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
import selectedAudioStore from "@/zustand/selectedAudio.store";
import audioFilesStore from "@/zustand/audioFiles.store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import playStore from "@/zustand/play.store";

export default function HomePage() {
  const { user } = useUser();
  const { audioFiles, editAudioFiles } = audioFilesStore((state) => state);
  const { selectedAudio, editSelectedAudio } = selectedAudioStore(
    (state) => state
  );

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
  const { play, editPlay } = playStore((state) => state);

  useEffect(() => {
    if (user?.id) {
      getAudios();
    }
  }, [user]);

  return (
    <main className="flexCenter text-white px-[2rem]">
      <ul className="text-black text-[0.7rem]  w-full flex flex-col gap-y-[1rem]">
        {audioFiles.map((e, i) => (
          <li
            key={i}
            className="bg-white rounded-full h-[3rem] px-[1rem] flexBetween cursor-pointer"
            onClick={() => {
              editSelectedAudio({ src: e.mediaSrc, index: i });
              editPlay(true);
            }}
          >
            <p className="w-full overflow-hidden max-h-[1rem]">
              {e.mediaName.slice(6)}
            </p>
            <div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="text-[1.2rem] w-[2.5rem] aspect-square rounded-full shadow-2xl"
              >
                <FontAwesomeIcon icon={faTrash} className="text-red-500" />
              </motion.button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
