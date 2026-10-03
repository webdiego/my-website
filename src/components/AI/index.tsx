"use client";
import React from "react";
import { motion } from "framer-motion";
import { blur } from "@animations/index";
import { aiData } from "@/data/ai";

export default function AI() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ duration: 1, delay: 2 }}
      variants={blur}
      className="my-4"
    >
      <h2 className="font-semibold text-2xl tracking-tighter">AI</h2>
      <p className="text-slate-500">How I build with and work alongside AI</p>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {aiData.map(({ title, description, icon: Icon }) => (
          <div
            key={title}
            className="rounded-lg border border-slate-200 bg-gradient-to-l from-slate-100 to-slate-200 p-4"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-800 text-white">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <h3 className="mt-3 text-sm font-semibold">{title}</h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              {description}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
