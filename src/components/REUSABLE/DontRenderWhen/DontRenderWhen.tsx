"use client";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
export default function DontRenderWhen({
  children,
  route,
}: {
  children: ReactNode;
  route: string[];
}) {
  const pathname = usePathname();
  if (!route.includes(pathname)) {
    return children;
  } else {
    return null;
  }
}
