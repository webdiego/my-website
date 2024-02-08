import Head from "next/head";
import Me from "@components/Me";
import Description from "@components/Description";
import Contacts from "@components/Contacts/index";
import Technologies from "@components/Technologies";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diego Massarini - Frontend Developer",
  description:
    "I'm a Frontend Developer based in Australia, I'm passionate about web development and I love to create beautiful and functional websites. I'm always open to new opportunities, feel free to contact me!",
};

export default function Home() {
  return (
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#fff" />
        <meta name="msapplication-TileColor" content="#fff" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <div className="flex min-h-screen h-full w-full max-w-7xl mx-auto flex-col items-start px-6 lg:flex-row justify-between lg:px-16 text-slate-800">
        <Me />
        <div className="lg:mt-10 min-h-screen h-full lg:py-16 flex flex-col w-full lg:w-4/6 lg:px-5 max-w-5xl mr-auto">
          <Description />
          <Technologies />
          <Contacts />
        </div>
      </div>
    </>
  );
}
