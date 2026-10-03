"use client";
import React from "react";
import { motion } from "framer-motion";
import { blur } from "@animations/index";

export default function Description() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ duration: 1, delay: 1 }}
      variants={blur}
      className="space-y-2 leading-relaxed text-sm"
    >
      <p>
        Hi, I&apos;m <span className="font-bold">Diego</span>, an Italian web
        and mobile developer who loves building fast, polished products.
      </p>
      <p>
        I&apos;m based in <span className="font-bold">Italy</span>, and
        I&apos;ve also lived in <span className="font-bold">Spain</span>,{" "}
        <span className="font-bold">New Zealand</span> and{" "}
        <span className="font-bold">Australia</span>. I 🧡 working remotely.
      </p>
      <p>
        I work in the <span className="font-bold">JavaScript</span> ecosystem,
        mostly on the front end. <span className="font-bold">Next.js</span>, my
        favorite framework, pulled me towards the back end too, and I enjoy
        owning a feature from the UI to the database.
      </p>
      <p>
        Lately I&apos;ve been exploring <span className="font-bold">AI</span>:
        building LLM-powered features and using it to work better every day.
      </p>
      <p>
        My goal is to keep growing as a well-rounded web developer and to
        contribute to open source along the way.
      </p>
    </motion.div>
  );
}
