"use client";
import { Component, useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { contacts } from "@/data/contacts";
import { mood, type Mood } from "./mood";

// WebGL is client-only; rendering it on the server causes hydration mismatches
const Scene = dynamic(() => import("./Scene"), { ssr: false });

// no WebGL (old browser, blocked GPU) makes the canvas throw: keep the page, lose only the 3D
class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

// own component so the twice-a-second fps update re-renders only this, never the 3D scene
function Readout() {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [fps, setFps] = useState(0);

  useEffect(() => {
    const resize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    resize();
    window.addEventListener("resize", resize);

    let frames = 0;
    let last = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      frames++;
      if (now - last >= 500) {
        setFps(Math.round((frames * 1000) / (now - last)));
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <span className="ml-2 inline-block align-top font-mono text-[10px] leading-tight text-mute">
      {pad(size.w)} × {pad(size.h)}
      <br />↳ {pad(fps, 3)} FPS
    </span>
  );
}

const pad = (n: number, len = 4) => String(n).padStart(len, "0");

const GLYPHS = "!<>-_\\/[]{}=+*^?#░▒▓";

// letters resolve left to right out of random glyphs
function useScramble(text: string) {
  const [out, setOut] = useState(text);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);
  const run = () => {
    clearInterval(timer.current);
    let frame = 0;
    timer.current = setInterval(() => {
      frame++;
      const done = Math.floor(frame / 2);
      setOut(
        text
          .split("")
          .map((c, i) => (i < done || c === " " ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join(""),
      );
      if (done >= text.length) clearInterval(timer.current);
    }, 30);
  };
  useEffect(() => () => clearInterval(timer.current), []);
  return [out, run] as const;
}

// the real text reserves the width; glyphs are absolutely positioned on top, so they can never
// widen the word and push the line to wrap under the cursor
function Stable({ text, shown }: { text: string; shown: string }) {
  return (
    <span className="relative inline-block whitespace-nowrap" aria-hidden>
      <span className="invisible">{text}</span>
      <span className="absolute inset-0 overflow-hidden">{shown}</span>
    </span>
  );
}

function Word({ id, children }: { id: Mood; children: string }) {
  const [active, setActive] = useState(false);
  const [text, scramble] = useScramble(children);
  const on = () => {
    mood.current = id;
    setActive(true);
    scramble();
  };
  const off = () => {
    if (mood.current === id) mood.current = "idle";
    setActive(false);
  };
  return (
    <button
      type="button"
      onPointerEnter={on}
      onPointerLeave={off}
      onFocus={on}
      onBlur={off}
      className="cursor-crosshair border-b border-dotted border-current leading-none transition-colors duration-300"
      style={{ color: active ? `var(--color-${id})` : undefined }}
      aria-label={children}
    >
      <Stable text={children} shown={text} />
      <sup className="ml-0.5 text-[0.5em] text-mute">°</sup>
    </button>
  );
}

function LinkPill({ name, url }: { name: string; url: string }) {
  const [text, scramble] = useScramble(name);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      onPointerEnter={scramble}
      onFocus={scramble}
      className="group flex items-center gap-2 rounded-full border border-dashed border-bone/30 bg-ink/40 px-4 py-1.5 font-mono text-xs backdrop-blur-sm transition-all duration-300 hover:-translate-x-1 hover:border-solid hover:border-bone hover:bg-bone hover:text-ink"
    >
      <Stable text={name} shown={text} />
      <span className="inline-block transition-transform duration-300 group-hover:rotate-45" aria-hidden>
        ↗
      </span>
    </a>
  );
}

// position in the staggered entrance, read by .reveal in globals.css
const order = (i: number) => ({ "--i": i }) as CSSProperties;

// the boot line gets at least this long, even when the 3D is ready sooner
const MIN_INTRO_MS = 1200;
const MAX_INTRO_MS = 6000;

export default function Hero() {
  const [ready, setReady] = useState(false);
  const [no3d, setNo3d] = useState(false);
  const onSceneError = useCallback(() => {
    setNo3d(true);
    setReady(true);
  }, []);
  const onLoaded = useCallback(() => {
    setTimeout(() => setReady(true), Math.max(0, MIN_INTRO_MS - performance.now()));
  }, []);
  // never trap the content behind the intro: no WebGL, a failed worker or a very slow phone
  // still get the page; the 3D mark grows in whenever it does arrive
  useEffect(() => {
    const fallback = setTimeout(() => setReady(true), MAX_INTRO_MS);
    return () => clearTimeout(fallback);
  }, []);

  return (
    <main className="relative flex min-h-svh flex-col justify-between p-6 md:p-14" data-ready={ready}>
      <div className="fixed inset-0 z-0 bg-ink">
        <SceneBoundary onError={onSceneError}>
          <Scene ready={ready} onLoaded={onLoaded} />
        </SceneBoundary>
      </div>
      {/* loading: a single CRT line; without WebGL the flat initials stand in for the 3D mark */}
      <div className="boot-line" aria-hidden />
      {no3d && <div className="dm-flat" role="img" aria-label="DM" />}

      <header className="reveal relative z-10 flex items-start justify-between" style={order(0)}>
        {/* eslint-disable-next-line @next/next/no-img-element -- tiny static mark, inverted via CSS */}
        <img src="/dm.svg" alt="DM, Diego Massarini" className="h-6 w-auto invert md:h-8" />
        <p className="text-right font-mono text-[11px] uppercase leading-relaxed tracking-wider text-mute">
          Diego Massarini
          <br />
          Developer, mostly frontend
        </p>
      </header>

      <div className="relative z-10 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <p className="reveal text-3xl leading-tight md:text-4xl" style={order(1)}>
            I&apos;m a developer driven by{" "}
            <span className="whitespace-nowrap">
              <Word id="curiosity">curiosity</Word>,
            </span>{" "}
            <Word id="creativity">creativity</Word> and a slightly unhealthy eye for{" "}
            <Word id="details">details</Word>
            <Readout />
          </p>

          <p className="reveal mt-6 font-mono text-[11px] uppercase leading-relaxed tracking-wider text-mute" style={order(2)}>
            Italy → Spain → New Zealand → Australia → ?
            <br />
            Hover or tap the words above
          </p>
        </div>

        <nav aria-label="Links" className="reveal flex flex-wrap gap-2 md:flex-col md:items-end" style={order(3)}>
          {contacts.map((c) => (
            <LinkPill key={c.name} {...c} />
          ))}
        </nav>
      </div>
    </main>
  );
}
