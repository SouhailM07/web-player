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

const formSchema = z.object({
  audioName: z.string().min(3, {
    message: "audio name must be at least 3 characters.",
  }),
});

export default function RenameAudio({}: {}) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      audioName: "",
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
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
                <DialogClose>
                  <MyButton
                    label="Save"
                    icon={faSave}
                    color="bg-cyan-500 text-white"
                  />
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </DialogHeader>
    </MyDialog>
  );
}
