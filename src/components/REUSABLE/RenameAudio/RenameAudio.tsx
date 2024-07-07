import "./renameaudio.css";
import MyDialog from "../MyDialog/MyDialog";
import OptionBtn from "../OptionBtn/OptionBtn";
import { faPenToSquare, faSave } from "@fortawesome/free-solid-svg-icons";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MyButton from "../MyButton/MyButton";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
// shadcn-ui
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { APP_API_URL } from "@/lib/APP_API_URL";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import handleError from "@/lib/handleError";
import loadingStore from "@/zustand/loading.store";
import { Button } from "@/components/ui/button";
import audioFilesStore from "@/zustand/audioFiles.store";
import { useUser } from "@clerk/nextjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";

const formSchema = z.object({
  audioName: z.string().min(3, {
    message: "audio name must be at least 3 characters.",
  }),
});

export default function RenameAudio({
  _id,
  name,
}: {
  _id: string;
  name: string;
}) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      audioName: name,
    },
  });
  const { toast } = useToast();
  const { editLoading } = loadingStore((state) => state);
  const { user } = useUser();
  const { editAudioFiles } = audioFilesStore((state) => state);
  const closeDialogRef = useRef<HTMLButtonElement | null>(null);
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
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // console.log(values);
      if (values.audioName !== name) {
        editLoading(true);
        await axios.put(`${APP_API_URL}/api/media?id=${_id}`, {
          customName: values.audioName,
        });
        toast({ description: "audio name was updated" });
        await getAudios();
      }
    } catch (error) {
      handleError(error);
      toast({ variant: "destructive", description: "something went wrong" });
    } finally {
      editLoading(false);
      closeDialogRef.current?.click();
    }
  };
  return (
    <MyDialog
      trigger={
        <OptionBtn
          icon={faPenToSquare}
          label="Rename"
          color="text-neutral-300"
        />
      }
    >
      <DialogHeader>
        <DialogTitle>Audio Name</DialogTitle>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="audioName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Audio name</FormLabel>
                    <FormControl>
                      <Input placeholder="audio name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <MyButton
                  icon={faSave}
                  label="Rename"
                  borderBottomColor="#06b5d4"
                  btnType="button"
                  type="submit"
                  color="bg-cyan-400 text-white"
                />
                <DialogClose ref={closeDialogRef} />
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </DialogHeader>
    </MyDialog>
  );
}
