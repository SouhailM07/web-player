import "@/../styles/globals.css";
import { Audiowide } from "next/font/google";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/SINGLE-USE/Navbar/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import DontRenderWhen from "@/components/REUSABLE/DontRenderWhen/DontRenderWhen";
import PlayPanel from "@/components/SINGLE-USE/PlayPanel/PlayPanel";
import Loading from "@/components/REUSABLE/Loading/Loading";

const audiowide = Audiowide({ subsets: ["latin"], weight: ["400"] });
export const metadata = {
  title: "web-player",
  description: "Generated by Shadow",
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
    // publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en">
        <body className={audiowide.className}>
          <Loading />
          <DontRenderWhen route={["/login", "/upload", "/profile"]}>
            <Navbar />
          </DontRenderWhen>
          {children}
          <DontRenderWhen route={["/login", "/upload", "/profile"]}>
            <PlayPanel />
          </DontRenderWhen>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
