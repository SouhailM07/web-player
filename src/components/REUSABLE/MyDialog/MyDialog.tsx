"use client";
import { ReactElement, ReactNode } from "react";
import "./mydialog.css";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function MyDialog({
  children,
  trigger,
}: {
  children: ReactNode;
  trigger: ReactElement;
}) {
  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
