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
      <p className="text-slate-500">
        Building with AI, and working alongside it
      </p>
      <div className="mt-4 grid grid-cols-1 gap-4">
        {aiData.map(({ title, description, icon: Icon, tags }) => (
          <div
            key={title}
            className="flex gap-4 rounded-lg border border-slate-200 bg-gradient-to-l from-slate-100 to-slate-200 p-5"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-white">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h3 className="font-semibold text-lg tracking-tight">{title}</h3>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                {description}
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-md bg-slate-800/80 px-2 py-0.5 text-xs text-white"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
