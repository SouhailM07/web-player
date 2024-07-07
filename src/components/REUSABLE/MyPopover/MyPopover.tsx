import "./mypopover.css";
import { ReactElement, ReactNode } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function MyPopover({
  children,
  trigger,
  containerStyles,
}: {
  children: ReactNode;
  trigger: ReactElement;
  containerStyles?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent className={containerStyles}>{children}</PopoverContent>
    </Popover>
  );
}
