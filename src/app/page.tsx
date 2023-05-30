import Head from 'next/head';
import Me from '@components/Me';
import Description from '@components/Description';
import Contacts from '@components/Contacts/index';

export default function Home() {
  return (
    <div className="flex h-full min-h-screen w-full max-w-8xl mx-auto flex-col items-start px-6 lg:flex-row justify-between lg:px-16 ">
      <Me />
      <div className="pb-10 lg:min-h-screen lg:py-16 flex flex-col w-full lg:w-4/6 lg:px-5">
        <Description />
        <Contacts />
      </div>
    </div>
  );
}
