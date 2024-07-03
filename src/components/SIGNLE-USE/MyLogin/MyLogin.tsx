"use client";
import { motion } from "framer-motion";
import { useSignIn } from "@clerk/nextjs";
export default function MyLogin() {
  const { signIn } = useSignIn();
  const URL_TO_REDIRECT = "/";
  // handlers

  const signInWithStrategy = (
    strategy: "oauth_google" | "oauth_facebook" | "oauth_github"
  ) => {
    signIn?.authenticateWithRedirect({
      strategy,
      redirectUrl: "/sso-callback",
      redirectUrlComplete: URL_TO_REDIRECT,
    });
  };
  let links: { label: string; handler }[] = [
    { label: "Google", handler: () => signInWithStrategy("oauth_google") },
    { label: "Facebook", handler: () => signInWithStrategy("oauth_facebook") },
    { label: "Github", handler: () => signInWithStrategy("oauth_github") },
  ];
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
            className="border-2 bg-white font-medium border-black w-[17rem] h-[3rem] rounded-full"
          >
            {e.label}
          </motion.button>
        ))}
      </ul>
    </main>
  );
}
