"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import axios from "axios";
// shadcn-ui
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import { DialogClose, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MyDialog from "@/components/REUSABLE/MyDialog/MyDialog";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { links_t } from "@/types";
import { uploadAudio } from "@/lib/fb_hanlders";
import { APP_API_URL } from "@/lib/APP_API_URL";
import handleError from "@/lib/handleError";
import { useUser } from "@clerk/nextjs";
import loadingStore from "@/zustand/loading.store";
import selectedAudioStore from "@/zustand/selectedAudio.store";
import audioFilesStore from "@/zustand/audioFiles.store";
import { useToast } from "@/components/ui/use-toast";

export const UploadContext: any = createContext("");

const formSchema = z.object({
  audio: z.any().refine((file) => file instanceof FileList, {
    message: "Audio must be a File",
  }),
});

export default function UploadPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const { editLoading } = loadingStore((state) => state);
  const { user } = useUser();
  const { selectedAudio, editSelectedAudio } = selectedAudioStore(
    (state) => state
  );
  const { audioFiles, editAudioFiles } = audioFilesStore((state) => state);
  // ! handlers
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
  const { toast } = useToast();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // console.log(values.audio[0]);
    let doesAudioExist = audioFiles.filter((e) => {
      const thisAudioIndex = values.audio[0].name.lastIndexOf(".");
      const thisAudio = values.audio[0].name.slice(0, thisAudioIndex);
      const anAudio = e.mediaName.slice(6, e.mediaName.lastIndexOf("."));
      return thisAudio == anAudio;
    });
    if (doesAudioExist.length > 0) {
      toast({
        variant: "destructive",
        description: "The audio is already exist",
      });
    } else {
      editLoading(true);
      const { mediaName, downloadURL }: any = await uploadAudio(
        values.audio[0]
      );
      await axios
        .post(`${APP_API_URL}/api/media`, {
          mediaName,
          mediaSrc: downloadURL,
          user: user?.id,
        })
        .then((res) => {
          getAudios();
        })
        .catch(handleError)
        .finally(() => {
          toast({ description: "The audio has been uploaded successfully" });
          // ! must reset the value properly
          editLoading(false);
        });
      closeRef?.current.click();
    }
    form.reset();
  };
  useEffect(() => {
    console.log("check render");
  }, [user]);
  const closeRef = useRef<any>();
  return (
    <MyDialog trigger={<LinksRenderItem icon={faUpload} ariaLabel="upload" />}>
      <DialogHeader>
        <DialogTitle>Upload Audio file</DialogTitle>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 flex-col flex"
          >
            <FormField
              control={form.control}
              name="audio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Audio</FormLabel>
                  <FormControl>
                    <Input
                      accept="audio/*"
                      type="file"
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  </FormControl>
                  <FormDescription>
                    Please upload an audio file.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="self-end">
              Submit
            </Button>
            <DialogClose ref={closeRef} className="absolute z-[-1]" />
          </form>
        </Form>
      </DialogHeader>
    </MyDialog>
  );
}
const LinksRenderItem = ({ icon, ariaLabel }: links_t) => (
  <motion.li whileHover={{ scale: 1.1 }}>
    <FontAwesomeIcon
      aria-label={ariaLabel}
      icon={icon}
      className="h-[1.3rem] aspect-square select-none"
    />
  </motion.li>
);

const LOCAL_CONTEXT = ({ children }: { children: ReactNode }) => {
  const { editLoading } = loadingStore((state) => state);
  const { user } = useUser();
  // ! handlers

  return <UploadContext.Provider>{children}</UploadContext.Provider>;
};
