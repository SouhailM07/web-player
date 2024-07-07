import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export interface links_t {
  icon: IconDefinition;
  ariaLabel: string;
  handler?: any;
  customStyle?: string;
}

export interface OptionProps {
  icon: IconDefinition;
  label: string;
  color: string;
}
