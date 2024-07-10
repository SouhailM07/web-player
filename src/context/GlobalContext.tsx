"use client";
import { APP_API_URL } from "@/lib/APP_API_URL";
import handleError from "@/lib/handleError";
import audioFilesStore from "@/zustand/audioFiles.store";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { createContext, useContext, ReactNode } from "react";

const GlobalContext = createContext({ getAudios: async () => {} });

export default function GlobalContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { editAudioFiles } = audioFilesStore((state) => state);
  const { user } = useUser();

  const getAudios = async () => {
    if (!user?.id) {
      console.log("No user ID available");
      return;
    }
    try {
      const res = await axios.get(`${APP_API_URL}/api/media?userId=${user.id}`);
      editAudioFiles(res.data);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <GlobalContext.Provider value={{ getAudios }}>
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobalContext = () => useContext(GlobalContext);
