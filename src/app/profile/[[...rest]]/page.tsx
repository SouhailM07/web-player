"use client";
import { UserProfile } from "@clerk/nextjs";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

export default function ProfileRoute() {
  const router = useRouter();
  // ! handler
  const handleBack = () => router.back();
  return (
    <main className="w-full h-full gap-y-[1rem] items-center flex flex-col-reverse ">
      <UserProfile />
      <button
        onClick={handleBack}
        className="m-3 h-[3rem] aspect-square rounded-full bg-white flexCenter self-end border-2 border-black sticky top-0"
      >
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </main>
  );
}
