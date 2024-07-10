"use client";
import { OptionProps } from "@/types";
import audioFilesStore from "@/zustand/audioFiles.store";
import playStore from "@/zustand/play.store";
import selectedAudioStore from "@/zustand/selectedAudio.store";
import {
  faBars,
  faDownload,
  faEllipsis,
  faHeart,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dynamic from "next/dynamic";
import OptionBtn from "../OptionBtn/OptionBtn";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MyButton from "../MyButton/MyButton";
import { APP_API_URL } from "@/lib/APP_API_URL";
import axios from "axios";
import loadingStore from "@/zustand/loading.store";
import { useToast } from "@/components/ui/use-toast";
import handleError from "@/lib/handleError";
import audioInstanceStore from "@/zustand/audioInstance.store";
import { deleteAudio } from "@/lib/fb_hanlders";
import { useGlobalContext } from "@/context/GlobalContext";

// ! dynamic components
const DynamicRenameAudio = dynamic(
  () => import("@/components/REUSABLE/RenameAudio/RenameAudio")
);
const DynamicMyPopover = dynamic(
  () => import("@/components/REUSABLE/MyPopover/MyPopover")
);
const DynamicMyDialog = dynamic(
  () => import("@/components/REUSABLE/MyDialog/MyDialog")
);

export default function HomePageRenderItem({ customName, i, mediaSrc, _id }) {
  const { play, editPlay } = playStore((state) => state);
  const { audioFiles } = audioFilesStore((state) => state);

  const { selectedAudio, editSelectedAudio } = selectedAudioStore(
    (state) => state
  );
  // const options: OptionProps[] = [
  //   {
  //     icon: faHeart,
  //     label: "Add to favorite",
  //     color: "text-black",
  //   },
  //   {
  //     icon: faDownload,
  //     label: "Install",
  //     color: "text-cyan-300",
  //   },
  // ];
  return (
    <li
      role="listitem"
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
          trigger={
            <FontAwesomeIcon aria-label="more details btn" icon={faEllipsis} />
          }
        >
          <DynamicRenameAudio _id={_id} name={customName} />
          {/* {options.map((e, i) => (
            <OptionBtn key={i} {...e} />
          ))} */}
          <DeleteBtn itemName={customName} itemId={_id} itemSrc={mediaSrc} />
        </DynamicMyPopover>
        <FontAwesomeIcon aria-label="drag btn" icon={faBars} />
      </div>
    </li>
  );
}

const DeleteBtn = ({ itemName, itemId, itemSrc }) => {
  const { selectedAudio, editSelectedAudio } = selectedAudioStore(
    (state) => state
  );
  const { audioInstance, editAudioInstance } = audioInstanceStore(
    (state) => state
  );
  const { editPlay } = playStore((state) => state);

  const { toast } = useToast();
  const { editLoading } = loadingStore((state) => state);
  const { getAudios }: any = useGlobalContext();

  // ! handlers [1]
  const handleDelete = async () => {
    try {
      editLoading(true);
      editPlay(false);
      // check if the current audio playing is the one to delete
      if (audioInstance && itemSrc == selectedAudio.src) {
        audioInstance.currentTime = 0.0;
        audioInstance.pause();
      }
      editAudioInstance(null);
      await deleteAudio(itemName);
      let res = await axios.delete(`${APP_API_URL}/api/media?id=${itemId}`);
      await getAudios();
      toast({
        description: "The Audio was deleted successfully",
        duration: 3000,
      });
    } catch (error) {
      handleError(error);
      toast({
        variant: "destructive",
        description: "Something went wrong",
        duration: 3000,
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
