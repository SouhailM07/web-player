"use client";
import MyButton from "@/components/REUSABLE/MyButton/MyButton";
import { UserProfile } from "@clerk/nextjs";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export default function ProfileRoute() {
  const router = useRouter();
  // ! handler
  const handleBack = () => router.back();
  return (
    <main className="w-full h-full flex items-start justify-center">
      <UserProfile />
      <MyButton
        label="Back"
        color="bg-white absolute right-0 z-[100] "
        icon={faArrowRight}
        btnType="button"
        handler={handleBack}
      />
    </main>
  );
}
