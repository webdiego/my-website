'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { blur } from '../animations';
export default function Description() {
  return (
    <motion.div initial="hidden" animate="visible" transition={{ duration: 1, delay: 1.5 }} variants={blur}>
      <p>
        Hello, my name is <span className="font-bold">Diego</span> and I&apos;m an Italian web and mobile developer.
      </p>
      <p className="mt-2 ">
        I&apos;m currently based in <span className="font-bold">Milan </span>
        and I&apos;ve also lived in <span className="font-bold">Australia, Spain </span> and
        <span className="font-bold"> New Zealand </span> in the past years and I 🧡
        working remotely.
      </p>
      <p className="mt-2">
        I&apos;ve been working professionally for the last three years mostly in the
        <span className="font-bold"> Javascript </span> ecosystem; the craziest and most exciting one.
      </p>
      <p className="mt-2">
        I&apos;m mainly focused on the front-end side but I&apos;ve been so curious also about the back-end side thanks
        to <span className="font-bold"> Next.js</span>, my favorite framework, that gave me the possibility to watch
        outside the &quot;fence&quot;.
      </p>
      <p className="mt-2">
        So, my goal is to have an overall knowledge of the web development world, both front-end and back-end aspects
        and start to contribute to open source projects and enjoy the journey.
      </p>
    </motion.div>
  );
}
