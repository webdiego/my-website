"use client";
import React from "react";
import { motion } from "framer-motion";
import { blur } from "@animations/index";
import { Carousel, ScrollingCarousel } from "@trendyol-js/react-carousel";
import { dataTech } from "../../data/technologies";

export default function Technologies() {
  const [showTooltip, setShowTooltip] = React.useState(false);
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
              className="flex flex-col items-center group relative mb-5"
              onClick={() => setShowTooltip(true)}
            >
              <div
                key={index}
                className={`w-24 h-24 ${item.background} rounded-md flex items-center justify-center mr-10`}
              >
                {item.icon}
              </div>
              <span className="absolute -bottom-4 scale-0 rounded bg-gray-800 p-1.5 px-1.5 text-xs text-white group-hover:scale-100">
                {item.name}
              </span>
              {showTooltip && (
                <span className="absolute -bottom-4 scale-0 rounded bg-gray-800 p-1.5 px-1.5 text-xs text-white group-hover:scale-100">
                  {item.name}
                </span>
              )}
            </div>
          ))}
        </ScrollingCarousel>
      </div>
    </motion.div>
  );
}
