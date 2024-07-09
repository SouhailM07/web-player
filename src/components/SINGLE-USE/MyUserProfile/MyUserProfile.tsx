"use client";
import MyPopover from "@/components/REUSABLE/MyPopover/MyPopover";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPowerOff,
  faUser,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useClerk, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MyUserProfile() {
  const { signOut } = useClerk();

  const router = useRouter();
  // ! handlers
  const handleLogout = () => signOut();
  const handleRedirectToProfile = () => {
    router.push("/profile");
  };
  return (
    <MyPopover trigger={<MyUserButton />} containerStyles="space-y-4 w-[15rem]">
      <Link href="/profile">
        <button
          onClick={handleRedirectToProfile}
          className="h-[3rem] w-full text-start  hover:bg-slate-300 rounded-md px-[1rem] flexBetween"
        >
          <span>Profile</span>
          <FontAwesomeIcon icon={faUser} className="p-2 rounded-full" />
        </button>
      </Link>
      <button
        onClick={handleLogout}
        className="h-[3rem] w-full text-start  hover:bg-slate-300 rounded-md px-[1rem] flexBetween"
      >
        <span>logout</span>
        <FontAwesomeIcon
          icon={faPowerOff}
          className="text-white p-2 rounded-full bg-red-500 "
        />
      </button>
    </MyPopover>
  );
}

const MyUserButton = () => {
  const { user } = useUser();
  // useEffect(() => {}, [user]);
  return (
    <>
      {user?.hasImage ? (
        <Image
          className="rounded-full"
          // @ts-ignore
          src={user?.imageUrl}
          alt="img"
          width={40}
          height={40}
        />
      ) : (
        <FontAwesomeIcon
          icon={faUserCircle}
          className="text-[1.8rem]"
          role="button"
        />
      )}
    </>
  );
};
