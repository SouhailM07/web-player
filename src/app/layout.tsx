import "@/../styles/globals.css";
import { Audiowide } from "next/font/google";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/SINGLE-USE/Navbar/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import DontRenderWhen from "@/components/REUSABLE/DontRenderWhen/DontRenderWhen";
import PlayPanel from "@/components/SINGLE-USE/PlayPanel/PlayPanel";
import Loading from "@/components/REUSABLE/Loading/Loading";
import GlobalContextProvider from "@/context/GlobalContext";
import { AudioProvider } from "@/context/AudioContext";
import { Metadata, Viewport } from "next";

const audiowide = Audiowide({ subsets: ["latin"], weight: ["400"] });

const APP_NAME = "PWA App";
const APP_DEFAULT_TITLE = "Web Player";
const APP_TITLE_TEMPLATE = "%s - Web Player";
const APP_DESCRIPTION = "Generated by Shadow";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
    // publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en">
        <body className={audiowide.className}>
          <GlobalContextProvider>
            <AudioProvider>
              <Loading />
              <DontRenderWhen route={["/login", "/upload", "/profile"]}>
                <Navbar />
              </DontRenderWhen>
              {children}
              <DontRenderWhen route={["/login", "/upload", "/profile"]}>
                <PlayPanel />
              </DontRenderWhen>
              <Toaster />
            </AudioProvider>
          </GlobalContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
