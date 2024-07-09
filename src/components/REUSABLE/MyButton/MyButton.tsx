"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export default function MyButton({
  label,
  icon = null,
  color,
  handler,
  role = undefined,
  btnType = "button",
  type = "button",
  borderBottomColor = "black",
}: {
  label: string;
  icon?: IconDefinition | null;
  color: string;
  handler?: any;
  role?: string | undefined;
  btnType: "divButton" | "button";
  type?: "button" | "submit";
  borderBottomColor?: string;
}) {
  if (btnType == "divButton") {
    return (
      <motion.div
        role={role}
        onClick={handler}
        animate={{ borderBottom: "5px solid transparent" }}
        whileHover={{ borderBottom: `5px solid ${borderBottomColor}`, y: -5 }}
        whileTap={{ y: 5, borderBottom: "5px solid transparent" }}
        className={`${color} rounded-lg p-3 space-x-[1rem] `}
      >
        {icon ? (
          <>
            <span>{label}</span>
            <FontAwesomeIcon icon={icon} />
          </>
        ) : (
          <span>{label}</span>
        )}
      </motion.div>
    );
  }
  return (
    <motion.button
      type={type}
      onClick={handler}
      animate={{ borderBottom: "5px solid transparent" }}
      whileHover={{ borderBottom: `5px solid ${borderBottomColor}`, y: -5 }}
      whileTap={{ y: 5, borderBottom: "5px solid transparent" }}
      className={`${color} rounded-lg p-3 space-x-[1rem] `}
    >
      {icon ? (
        <>
          <span>{label}</span>
          <FontAwesomeIcon icon={icon} />
        </>
      ) : (
        <span>{label}</span>
      )}
    </motion.button>
  );
}
