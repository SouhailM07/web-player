"use client";
import dynamic from "next/dynamic";
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
  faSearch,
  faTrash,
  faVolumeLow,
} from "@fortawesome/free-solid-svg-icons";
// ! zustand states
import selectedAudioStore from "@/zustand/selectedAudio.store";
import audioFilesStore from "@/zustand/audioFiles.store";
import playStore from "@/zustand/play.store";
import searchAudioStore from "@/zustand/searchAudio.store";
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
import { OptionProps } from "@/types";
import OptionBtn from "@/components/REUSABLE/OptionBtn/OptionBtn";
import audioInstanceStore from "@/zustand/audioInstance.store";
import MyButton from "@/components/REUSABLE/MyButton/MyButton";
import { Slider } from "@/components/ui/slider";
import audioVolumeStore from "@/zustand/audioVolume.store";
//
const DynamicRenameAudio = dynamic(
  () => import("@/components/REUSABLE/RenameAudio/RenameAudio")
);
const DynamicMyPopover = dynamic(
  () => import("@/components/REUSABLE/MyPopover/MyPopover")
);
const DynamicMyDialog = dynamic(
  () => import("@/components/REUSABLE/MyDialog/MyDialog")
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
      <ul className="max-h-audioContainer max-md:max-h-autoContainerSm scrollable-component overflow-y-auto  bg-neutral-800 pt-[1rem] rounded-lg text-[0.7rem]  w-full flex flex-col ">
        {!arrOfFiles.length || !isSignedIn ? (
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
    <section className="flexBetween w-full max-md:flex-col gap-y-3">
      <article className="md:hidden flexBetween w-full">
        <SoundControl />
        <div>
          Files : <span>{audioFiles.length}</span>
        </div>
      </article>
      <article className="flexCenter max-md:w-full  bg-neutral-800 p-2 rounded-lg h-[2.5rem]">
        <FontAwesomeIcon icon={faSearch} className="text-neutral-400" />
        <input
          value={searchAudio}
          onChange={(e) => editSearchAudio(e.target.value)}
          className=" rounded-md indent-[1rem] text-[0.7rem] h-full outline-none border-none w-full md:min-w-[20rem] text-white bg-transparent"
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

const HomePageRenderItem = ({ customName, i, mediaSrc, mediaName, _id }) => {
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
        className="w-full  overflow-hidden flex items-center self-stretch text-nowrap "
      >
        {customName.includes("audio/") ? customName.slice(6) : customName}
      </p>
      <div className="flex gap-x-[1.5rem] items-center text-[1rem]">
        <DynamicMyPopover
          containerStyles="min-w-[9rem] translate-x-[-5rem] max-w-[13rem] flex-col flex gap-y-2"
          trigger={<FontAwesomeIcon icon={faEllipsis} />}
        >
          <DynamicRenameAudio _id={_id} name={customName} />
          {options.map((e, i) => (
            <OptionBtn key={i} {...e} />
          ))}
          <DeleteBtn itemName={customName} itemId={_id} itemSrc={mediaSrc} />
        </DynamicMyPopover>
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
  const { audioInstance, editAudioInstance } = audioInstanceStore(
    (state) => state
  );
  const { play, editPlay } = playStore((state) => state);

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
      editPlay(false);
      if (audioInstance && itemSrc == selectedAudio.src) {
        audioInstance.currentTime = 0.0;
        audioInstance.pause();
      }
      editAudioInstance(null);
      await deleteAudio(itemName);
      let res = await axios.delete(`${APP_API_URL}/api/media?id=${itemId}`);
      await getAudios();
      // find a solution delete an audio if it was playing
      toast({
        description: "The Audio was deleted successfully",
      });
    } catch (error) {
      handleError(error);
      toast({
        variant: "destructive",
        description: "Something went wrong",
      });
    } finally {
      editLoading(false);
    }
  };
  return (
    <DynamicMyDialog
      trigger={<OptionBtn color="text-red-500" label="Delete" icon={faTrash} />}
    >
      <DialogHeader>
        <DialogTitle>Upload Audio file</DialogTitle>
        <DialogContent>
          Are you sure you want to delete
          <span className="text-red-500">
            {itemName.includes("audio/") ? itemName.slice(6) : itemName}
          </span>
          <DialogFooter>
            <div className="flexBetween w-full">
              <DialogClose>
                <MyButton
                  btnType="divButton"
                  label="Cancel"
                  borderBottomColor="rgb(8 145 178)"
                  color="bg-cyan-500 text-white"
                />
              </DialogClose>
              <DialogClose onClick={handleDelete}>
                <MyButton
                  btnType="divButton"
                  label="Delete"
                  icon={faTrash}
                  borderBottomColor="rgb(220 38 38)"
                  color="bg-red-500 text-white"
                />
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </DialogHeader>
    </DynamicMyDialog>
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
