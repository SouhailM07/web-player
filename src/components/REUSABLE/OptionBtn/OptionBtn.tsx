import { OptionProps } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function OptionBtn({ icon, label, color }: OptionProps) {
  return (
    <div className="flexBetween hover:bg-neutral-300 rounded-md p-1">
      <span>{label}</span>
      <FontAwesomeIcon icon={icon} className={color} />
    </div>
  );
}
