"use client";
import React from "react";
import Image from "next/image";
import Github from "@public/github.jpeg";
import { useRef } from "react";
import { motion } from "framer-motion";
import { fade_up } from "../animations";

export default function Me() {
  const constraintsRef = useRef(null);

  return (
    <div className="sticky flex max-w-full flex-col lg:sticky lg:top-0 lg:mb-0 lg:min-h-screen  lg:overflow-visible py-16  w-full lg:w-2/6">
      <div className="flex flex-1 flex-col">
        <motion.div
          className="absolute"
          animate={{ rotate: 360 }}
          transition={{ ease: "linear", duration: 5, repeat: Infinity }}
        >
          <Image
            src={Github}
            className="rounded-full  h-[180px] w-[180px] bg-blue-200 animate-all rotate-360 duration-1000"
            alt="Github profile"
          />
        </motion.div>
        <motion.div
          className="h-[180px] w-[180px] rounded-full  z-[100]"
          ref={constraintsRef}
        >
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
          <h1 className="text-[40px] mt-4 font-bold animate-text bg-gradient-to-r from-orange-500 via-purple-400  to-blue-400 bg-clip-text py-1 text-transparent  font-lostar">
            Diego Massarini
          </h1>
          <h2 className="text-lg font-medium text-slate-900 -mt-2">
            Web | Mobile developer
          </h2>
          <motion.div
            initial="hidden"
            animate="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            <motion.div variants={fade_up} className="flex items-center mt-4">
              <Image
                src="/shapes/01.svg"
                width={20}
                height={20}
                alt="Abstract logo"
              />
              <p className="ml-2">Exploratory</p>
            </motion.div>
            <motion.div variants={fade_up} className="flex items-center ">
              <Image
                src="/shapes/02.svg"
                width={20}
                height={20}
                alt="Abstract logo"
              />
              <p className="ml-2">Traveler</p>
            </motion.div>
            <motion.div variants={fade_up} className="flex items-center ">
              <Image
                src="/shapes/03.svg"
                width={20}
                height={20}
                alt="Abstract logo"
              />
              <p className="ml-2">Nature&apos;s lover</p>
            </motion.div>
            <motion.div variants={fade_up} className="flex items-center ">
              <Image
                src="/shapes/06.svg"
                width={20}
                height={20}
                alt="Abstract logo"
              />
              <p className="ml-2">Music devotee</p>
            </motion.div>

            <motion.div variants={fade_up} className="flex items-center ">
              <Image
                src="/shapes/04.svg"
                width={20}
                height={20}
                alt="Abstract logo"
              />
              <p className="ml-2">Restless</p>
            </motion.div>
            <motion.div variants={fade_up} className="flex items-center ">
              <Image
                src="/shapes/05.svg"
                width={20}
                height={20}
                alt="Abstract logo"
              />
              <p className="ml-2">Pizza addicted</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
