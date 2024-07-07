"use client";
import "./homepage.css";
import { APP_API_URL } from "@/lib/APP_API_URL";
import handleError from "@/lib/handleError";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faDownload,
  faEllipsis,
  faHeart,
  faPenToSquare,
  faSearch,
  faTrash,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
// ! zustand states
import selectedAudioStore from "@/zustand/selectedAudio.store";
import audioFilesStore from "@/zustand/audioFiles.store";
import playStore from "@/zustand/play.store";
import searchAudioStore from "@/zustand/searchAudio.store";
import MyDialog from "@/components/REUSABLE/MyDialog/MyDialog";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import loadingStore from "@/zustand/loading.store";
import { deleteAudio } from "@/lib/fb_hanlders";
import { useToast } from "@/components/ui/use-toast";
import MyButton from "@/components/REUSABLE/MyButton/MyButton";
import MyPopover from "@/components/REUSABLE/MyPopover/MyPopover";
import { OptionProps } from "@/types";
import OptionBtn from "@/components/REUSABLE/OptionBtn/OptionBtn";
import RenameAudio from "@/components/REUSABLE/RenameAudio/RenameAudio";

export default function HomePage() {
  const { user } = useUser();
  const { audioFiles, editAudioFiles } = audioFilesStore((state) => state);
  const { editLoading } = loadingStore((state) => state);
  const { searchAudio } = searchAudioStore((state) => state);
  const getAudios = async () => {
    try {
      editLoading(true);
      const res = await axios.get(
        `${APP_API_URL}/api/media?userId=${user?.id}`
      );
      editAudioFiles(res.data);
    } catch (error) {
      handleError(error);
    } finally {
      editLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      getAudios();
    }
  }, [user]);
  let arrOfFiles = audioFiles.filter((e) =>
    e.mediaName.toLowerCase().includes(searchAudio.toLowerCase())
  );
  return (
    <main className="flexCenter flex-col gap-y-[1rem] text-white px-[2rem]">
      <HeadPanel />
      <ul className="max-h-audioContainer scrollable-component overflow-y-auto  bg-neutral-800 pt-[1rem] rounded-lg text-[0.7rem]  w-full flex flex-col ">
        {!arrOfFiles.length ? (
          <li className="text-center h-[3rem]">Empty</li>
        ) : (
          arrOfFiles.map((e, i) => <HomePageRenderItem {...e} key={i} i={i} />)
        )}
      </ul>
    </main>
  );
}

const HeadPanel = () => {
  const { audioFiles, editAudioFiles } = audioFilesStore((state) => state);
  const { searchAudio, editSearchAudio } = searchAudioStore((state) => state);
  return (
    <section className="flexBetween w-full">
      <article className="flexCenter  bg-neutral-800 p-2 rounded-lg h-[2.5rem]">
        <FontAwesomeIcon icon={faSearch} className="text-neutral-400" />
        <input
          value={searchAudio}
          onChange={(e) => editSearchAudio(e.target.value)}
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

const HomePageRenderItem = ({ i, mediaSrc, mediaName, _id }) => {
  const { play, editPlay } = playStore((state) => state);
  const { audioFiles } = audioFilesStore((state) => state);

  const { selectedAudio, editSelectedAudio } = selectedAudioStore(
    (state) => state
  );
  const options: OptionProps[] = [
    {
      icon: faHeart,
      label: "Add to favorite",
      color: "text-black",
    },
    {
      icon: faDownload,
      label: "Install",
      color: "text-cyan-300",
    },
  ];
  return (
    <li
      className={`${selectedAudio?.index === i && "text-cyan-300"} ${
        i != audioFiles.length - 1 && "border-b"
      } min-h-[3rem] gap-x-5 hover:text-cyan-500 border-white pl-[1.5rem] pr-[0.8rem] flexBetween cursor-pointer`}
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
        <MyPopover
          containerStyles="min-w-[9rem] translate-x-[-5rem] max-w-[13rem] flex-col flex gap-y-3"
          trigger={<FontAwesomeIcon icon={faEllipsis} />}
        >
          <RenameAudio />
          {options.map((e, i) => (
            <OptionBtn key={i} {...e} />
          ))}
          <DeleteBtn itemName={mediaName} itemId={_id} itemSrc={mediaSrc} />
        </MyPopover>
        <FontAwesomeIcon icon={faBars} />
      </div>
    </li>
  );
};

const DeleteBtn = ({ itemName, itemId, itemSrc }) => {
  const { audioFiles, editAudioFiles } = audioFilesStore((state) => state);
  const { selectedAudio, editSelectedAudio } = selectedAudioStore(
    (state) => state
  );
  const { user } = useUser();
  const { toast } = useToast();
  const { editLoading } = loadingStore((state) => state);
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
  const handleDelete = async () => {
    try {
      editLoading(true);
      // console.log(itemId);
      // /api/media?id
      await deleteAudio(itemName);
      let res = await axios.delete(`${APP_API_URL}/api/media?id=${itemId}`);
      await getAudios();
      // find a solution delete an audio if it was playing
      toast({ description: "The Audio was deleted successfully" });
    } catch (error) {
      handleError(error);
      toast({ variant: "destructive", description: "Something went wrong" });
    } finally {
      editLoading(false);
    }
  };
  return (
    <MyDialog
      trigger={
        <div className="flexBetween">
          <span>Delete</span>
          <FontAwesomeIcon icon={faTrash} className="text-red-500" />
        </div>
      }
    >
      <DialogHeader>
        <DialogTitle>Upload Audio file</DialogTitle>
        <DialogContent>
          Are you sure you want to delete
          <span className="text-red-500"> {itemName.slice(6)}</span>
          <DialogFooter>
            <div className="flexBetween w-full">
              <DialogClose>
                <MyButton label="Cancel" color="bg-cyan-500 text-white" />
              </DialogClose>
              <DialogClose onClick={handleDelete}>
                <MyButton
                  label="Delete"
                  icon={faTrash}
                  color="bg-red-500 text-white"
                />
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </DialogHeader>
    </MyDialog>
  );
};
