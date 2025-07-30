"use client";

import React from "react";
import ProjectCard from "@/components/Portfolio/ProjectCard";
import { blur } from "@animations/index";
import { motion } from "framer-motion";
const ProjectsData = [
  {
    title: "Thoughtz",
    description:
      "In this project, I created a full-stack application that allows users to share their thoughts and ideas. It features user authentication, a form for creating posts, and a responsive design.",
    link: "https://thoughtz.vercel.app/",
    githubLink: "https://github.com/webdiego/thoughts",
    tags: [
      "React",
      "Next.js",
      "NextAuth / Google OAuth",
      "Tailwind CSS",
      "TypeScript",
      "Prisma",
      "Turso",
    ],
  },
  {
    title: "next.js-drizzle-turso",
    description:
      "This project is a boilerplate for building Next.js applications with Drizzle ORM and Turso as the database. It provides a solid foundation for developers to start building their applications quickly.",
    link: "https://drizzle-turso.vercel.app/",
    githubLink: "https://github.com/webdiego/next.js-drizzle-turso",
    template: true,
    tags: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "TypeScript",
      "Drizzle ORM",
      "Turso",
    ],
  },
  {
    title: "Alberobello Restaurant website",
    description:
      "This is a website for a restaurant called Alberobello, built with Next.js, Tailwind CSS, and TypeScript. It showcases a modern design and responsive layout and It uses the Notion API to fetch content dynamically for the menu.",
    link: "https://alberobello-restaurant.vercel.app/",
    githubLink: "https://github.com/webdiego/alberobello-restaurant",
    tags: ["React", "Next.js", "Tailwind CSS", "TypeScript", "Notion API"],
  },
];

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
          const { title, description, link, tags, githubLink, template } =
            project;
          return (
            <ProjectCard
              key={project.title}
              {...{ title, description, link, githubLink, tags, template }}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
