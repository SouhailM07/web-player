import "./optionbtn.css";
import { OptionProps } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function OptionBtn({ icon, label, color }: OptionProps) {
  return <div className="flexBetween">
    <span>{label}</span>
    <FontAwesomeIcon icon={icon} className={color} />
  </div>
}