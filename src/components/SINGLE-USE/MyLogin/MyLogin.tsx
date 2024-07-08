"use client";
import { motion } from "framer-motion";
import { useSignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
// assets
import Image, { StaticImageData } from "next/image";
import img1 from "@/../public/google logo.png";
import img2 from "@/../public/facebook logo.png";
import img3 from "@/../public/github logo.png";

export default function MyLogin() {
  const { signIn } = useSignIn();
  const { user } = useUser();
  const router = useRouter();
  const URL_TO_REDIRECT = "/";
  // handlers
  useEffect(() => {
    if (user?.id) {
      router.replace("/");
    }
  }, [user]);
  const signInWithStrategy = (
    strategy: "oauth_google" | "oauth_facebook" | "oauth_github"
  ) => {
    signIn?.authenticateWithRedirect({
      strategy,
      redirectUrl: "/sso-callback",
      redirectUrlComplete: URL_TO_REDIRECT,
    });
  };
  let links: { label: string; handler; img: StaticImageData }[] = [
    {
      label: "Google",
      img: img1,
      handler: () => signInWithStrategy("oauth_google"),
    },
    {
      label: "Facebook",
      img: img2,
      handler: () => signInWithStrategy("oauth_facebook"),
    },
    {
      label: "Github",
      img: img3,
      handler: () => signInWithStrategy("oauth_github"),
    },
  ];
  if (user?.id) {
    return null;
  }
  return (
    <main className="min-h-screen flexCenter flex-col gap-y-[2rem]">
      <h1 className="text-[2rem] font-bold text-white">Sign In</h1>
      <ul
        role="list"
        className="flex-col flex items-center gap-y-[1.5rem] w-full "
      >
        {links.map((e, i) => (
          <motion.button
            whileHover={{ scale: 1.1 }}
            key={i}
            role="listitem"
            onClick={e.handler}
            className="border-2 grid grid-cols-[40%_60%] justify-items-center items-center  bg-white font-medium border-black w-[17rem] h-[3rem] rounded-full"
          >
            <Image
              fetchPriority="high"
              loading="eager"
              src={e.img}
              alt="logo"
              width={50}
              height={50}
            />
            <span className="justify-self-start">{e.label}</span>
          </motion.button>
        ))}
      </ul>
    </main>
  );
}
