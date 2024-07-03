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
import { createContext, ReactNode, useRef } from "react";
import { DialogClose, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MyDialog from "@/components/REUSABLE/MyDialog/MyDialog";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { links_t } from "@/types";
import loadingStore from "@/zustand/loading.store";
import { uploadAudio } from "@/lib/fb_hanlders";
import { APP_API_URL } from "@/lib/APP_API_URL";
import handleResponse from "@/lib/handleResponse";
import handleError from "@/lib/handleError";

export const UploadContext: any = createContext("");

const formSchema = z.object({
  audio: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, "You must upload exactly one file.")
    .refine(
      (files) => files[0]?.type.startsWith("audio/"),
      "File must be an audio type."
    ),
});

export default function UploadPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    const audioFile = values.audio[0];
    closeRef?.current.click();
  };
  const closeRef = useRef<any>();
  return (
    <LOCAL_CONTEXT>
      <MyDialog
        trigger={<LinksRenderItem icon={faUpload} ariaLabel="upload" />}
      >
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
    </LOCAL_CONTEXT>
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
  // ! handlers
  const handleUpload = async (values) => {
    try {
      editLoading(true);
      const { mediaName, downloadURL }: any = await uploadAudio(
        values.audio[0]
      );
      const res = await axios.post(`${APP_API_URL}/api/media`, {
        mediaName,
        mediaSrc: downloadURL,
        user: "",
      });
      console.log(res);
    } catch (error) {
      handleError(error);
    } finally {
      editLoading(false);
    }
  };
  return (
    <UploadContext.Provider value={{ handleUpload }}>
      {children}
    </UploadContext.Provider>
  );
};
