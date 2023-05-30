'use client';
import React from 'react';
import Image from 'next/image';
import Github from '@public/github.jpeg';
import { useRef } from 'react';
import { motion } from 'framer-motion';

export default function Me() {
  const constraintsRef = useRef(null);

  return (
    <div className="sticky flex max-w-full flex-col lg:sticky lg:top-0 lg:mb-0 lg:min-h-screen  lg:overflow-visible py-16  w-full lg:w-2/6">
      <div className="flex flex-1 flex-col">
        <motion.div
          className="absolute"
          animate={{ rotate: 360 }}
          transition={{ ease: 'linear', duration: 5, repeat: Infinity }}
        >
          <Image
            src={Github}
            className="rounded-full  h-[180px] w-[180px] bg-blue-200 animate-all rotate-360 duration-1000"
            alt="Github profile"
          />
        </motion.div>
        <motion.div className="h-[180px] w-[180px] rounded-full" ref={constraintsRef}>
          <motion.img
            drag
            dragConstraints={constraintsRef}
            src="./me.jpeg"
            className="rounded-full absolute cursor-grab"
            width={180}
            height={180}
            alt="Photo profile"
          />
        </motion.div>
        <p className="text-xs pt-2">You can throw me away ⤴</p>
        <div>
          <h1 className="text-4xl mt-4 font-bold animate-text bg-gradient-to-r from-orange-500 via-purple-400  to-blue-400 bg-clip-text py-1 text-transparent tracking-tighter">
            Diego Massarini
          </h1>
          <div>
            <h2 className="text-lg font-medium">Web | Mobile developer</h2>
            <p className="mt-4">
              <span className="text-teal-500">✸</span> Unconventional stuff
            </p>
            <p>
              <span className="text-purple-500">☈</span> Traveler
            </p>
            <p>
              <span className="text-orange-500">✼</span> Nature&apos;s lover
            </p>
            <p>
              <span className="text-blue-500">ꆜ</span> Freaky brain
            </p>
            <p>
              <span className="text-red-500">✤</span> Pizza addicted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
