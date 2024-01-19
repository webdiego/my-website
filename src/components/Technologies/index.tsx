"use client";
import React from "react";
import { motion } from "framer-motion";
import { blur } from "@animations/index";
import { Carousel, ScrollingCarousel } from "@trendyol-js/react-carousel";
import { dataTech } from "../../data/technologies";

export default function Technologies() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ duration: 1, delay: 2 }}
      variants={blur}
      className="my-10"
    >
      <h2 className="font-semibold text-2xl tracking-tighter">Tech stack</h2>
      <p className="text-slate-500">These are some technologies I use</p>
      <div className="w-full mt-5">
        <ScrollingCarousel>
          {dataTech.map((item, index) => (
            <div
              key={index}
              className={`w-24 h-24 ${item.background} rounded-md flex items-center justify-center mr-10`}
            >
              {item.icon}
            </div>
          ))}
        </ScrollingCarousel>
      </div>
    </motion.div>
  );
}
