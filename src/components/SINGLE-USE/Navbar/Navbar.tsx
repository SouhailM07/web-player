"use client";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
//
import UploadPage from "../UploadPage/UploadPage";
import MyUserProfile from "../MyUserProfile/MyUserProfile";
import dynamic from "next/dynamic";
const DynamicUploadPage = dynamic(() => import("../UploadPage/UploadPage"));

export default function Navbar() {
  const { user } = useUser();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    console.log(user ? "signed in" : "not signed in");
  }, [user]);
  return (
    <header className="text-white max-md:px-[1rem] px-[2rem] py-[1.2rem] bg-black">
      <nav className="flexBetween">
        <h1 className="flexCenter gap-x-[1rem]">Web Player</h1>
        <ul
          role="list"
          className="flex gap-x-[2rem] text-cyan-300 items-center "
        >
          {isSignedIn && <DynamicUploadPage />}
          {/* <LinksRenderItem key={i} {...e} /> */}
          <SignInBtn checker={isSignedIn && isLoaded} />
        </ul>
      </nav>
    </header>
  );
}

const SignInBtn = ({ checker }) => (
  <li role="listitem">
    {checker ? (
      <MyUserProfile />
    ) : (
      <Link aria-label="sign in link" href="/login">
        <FontAwesomeIcon
          aria-label="sign in btn"
          icon={faUserCircle}
          className="h-[1.3rem] aspect-square select-none "
        />
      </Link>
    )}
  </li>
);
