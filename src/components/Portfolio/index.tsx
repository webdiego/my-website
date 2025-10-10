"use client";

import React from "react";
import ProjectCard from "@/components/Portfolio/ProjectCard";
import { blur } from "@animations/index";
import { motion } from "framer-motion";
import { ProjectsData } from "@/data/projects";
import Link from "next/link";
import { FolderHeart } from "lucide-react";

export default function Portfolio() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ duration: 1, delay: 2 }}
      variants={blur}
      className="my-10"
    >
      <h2 className="font-semibold text-2xl tracking-tighter">Portfolio</h2>
      <p className="text-slate-500">
        Here are some projects I&apos;ve worked on
      </p>
      <div className="mt-4 grid grid-cols-1 gap-4">
        {ProjectsData.map((project) => {
          return <ProjectCard key={project.title} {...project} />;
        })}
        <div className="flex items-center justify-center">
          <Link
            target="_blank"
            href={"https://github.com/webdiego?tab=repositories"}
            className="text-xs bg-slate-800 text-white rounded-full px-3 py-1  mr-2 flex hover:opacity-90 transition-all transform duration-300 hover:-translate-y-1 w-auto border-2 border-slate-500"
          >
            <span className="text-xs inline">And much more!</span>
            <FolderHeart className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
