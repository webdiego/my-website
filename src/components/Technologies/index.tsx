"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { blur } from "@animations/index";
import { Carousel } from "@trendyol-js/react-carousel";
export default function index() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ duration: 1, delay: 2 }}
      variants={blur}
      className="my-10"
    >
      <h2 className="font-semibold text-2xl tracking-tighter">Tech stack</h2>
      <p className="text-slate-500">
        These are some Technologies I&apos;ve used
      </p>
      <div className="w-full mt-5">
        <Carousel show={3.5} slide={4} swiping={true} transition={0.5}>
          <div className="w-44 h-44 bg-red-200 ">h</div>
          <div className="w-44 h-44 bg-red-600">h</div>
          <div className="w-44 h-44 bg-red-700 ">h</div>
          <div className="w-44 h-44 bg-red-800 ">h</div>
        </Carousel>
      </div>
    </motion.div>
  );
}
