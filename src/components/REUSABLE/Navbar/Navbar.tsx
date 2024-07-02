"use client";
import "./navbar.css";
import { motion } from "framer-motion";
import {
  faCompactDisc,
  faUpload,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { links_t } from "@/types";
import { useEffect } from "react";
import { useAuth, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  const { user } = useUser();
  const { isSignedIn, isLoaded } = useAuth();
  let arr: links_t[] = [
    { icon: faUpload, ariaLabel: "Upload", handler: "" },
    { icon: faCompactDisc, ariaLabel: "Compact Disc", handler: "" },
  ];
  useEffect(() => {
    console.log(user ? "signed in" : "not signed in");
  }, [user]);
  return (
    <header className="text-white px-[2rem] py-[1.2rem] bg-black">
      <nav className="flexBetween">
        <h1 className="flexCenter gap-x-[1rem]">Web Player</h1>
        <ul role="list" className="flex gap-x-[2rem] text-[#41faf4]">
          {arr.map((e, i) => (
            <LinksRenderItem key={i} {...e} />
          ))}
          <SignInBtn checker={isSignedIn && isLoaded} />
        </ul>
      </nav>
    </header>
  );
}

const LinksRenderItem = ({ icon, ariaLabel }: links_t) => (
  <motion.li whileHover={{ scale: 1.1 }} role="listitem">
    <FontAwesomeIcon
      aria-label={ariaLabel}
      role="button"
      icon={icon}
      className="h-[1.5rem] aspect-square"
    />
  </motion.li>
);

const SignInBtn = ({ checker }) => (
  <motion.li whileHover={{ scale: 1.1 }} role="listitem">
    {checker ? (
      <UserButton />
    ) : (
      <Link href="/login">
        <FontAwesomeIcon
          aria-label="sign in btn"
          icon={faUserCircle}
          className="h-[1.5rem] aspect-square"
        />
      </Link>
    )}
  </motion.li>
);
