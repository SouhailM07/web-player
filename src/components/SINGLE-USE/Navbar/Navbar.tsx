"use client";
import "./navbar.css";
import { motion } from "framer-motion";
import { faCompactDisc, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { links_t } from "@/types";
import { useEffect } from "react";
import { useAuth, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
//
import UploadPage from "../UploadPage/UploadPage";

export default function Navbar() {
  const { user } = useUser();
  const { isSignedIn, isLoaded } = useAuth();
  let arr: links_t[] = [
    { icon: faCompactDisc, ariaLabel: "Compact Disc", handler: "" },
  ];
  useEffect(() => {
    console.log(user ? "signed in" : "not signed in");
  }, [user]);
  return (
    <header className="text-white px-[2rem] py-[1.2rem] bg-black">
      <nav className="flexBetween">
        <h1 className="flexCenter gap-x-[1rem]">Web Player</h1>
        <ul
          role="list"
          className="flex gap-x-[2rem] text-cyan-300 items-center "
        >
          <UploadPage />
          {/* <LinksRenderItem key={i} {...e} /> */}
          <SignInBtn checker={isSignedIn && isLoaded} />
        </ul>
      </nav>
    </header>
  );
}

const SignInBtn = ({ checker }) => (
  <motion.li whileHover={{ scale: 1.1 }} role="listitem">
    {checker ? (
      <UserButton />
    ) : (
      <Link href="/login">
        <FontAwesomeIcon
          aria-label="sign in btn"
          icon={faUserCircle}
          className="h-[1.3rem] aspect-square select-none "
        />
      </Link>
    )}
  </motion.li>
);
