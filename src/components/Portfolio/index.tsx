"use client";

import React from "react";
import ProjectCard from "@/components/Portfolio/ProjectCard";
import { blur } from "@animations/index";
import { motion } from "framer-motion";
import { ProjectsData } from "@/data/projects";

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
      </div>
    </motion.div>
  );
}
