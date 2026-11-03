"use client";
import { Component, memo, useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowUpRight, CornerDownRight } from "lucide-react";
import dynamic from "next/dynamic";
import { contacts } from "@/data/contacts";
import { mood, type Mood } from "./mood";

// WebGL is client-only; rendering it on the server causes hydration mismatches
// memo: the hovered word lives in Hero state, and that must not re-render the 3D tree
const Scene = memo(dynamic(() => import("./Scene"), { ssr: false }));

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
    <span className="ml-2 inline-block align-top font-mono text-[11px] leading-tight text-mute">
      {pad(size.w)} × {pad(size.h)}
      <br />
      <CornerDownRight className="inline h-[1em] w-[1em] align-[-0.1em]" aria-hidden /> {pad(fps, 3)} FPS
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

// behaves like a toggle button: mouse hover previews it, a tap or Enter switches it on/off
function Word({
  id,
  current,
  onChange,
  children,
}: {
  id: Mood;
  current: Mood;
  onChange: (m: Mood) => void;
  children: string;
}) {
  const active = current === id;
  const [text, scramble] = useScramble(children);
  const pointer = useRef("");
  useEffect(() => {
    if (active) scramble();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- replay only when switching on
  }, [active]);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={children}
      onPointerDown={(e) => (pointer.current = e.pointerType)}
      onPointerEnter={(e) => e.pointerType === "mouse" && onChange(id)}
      onPointerLeave={(e) => e.pointerType === "mouse" && active && onChange("idle")}
      onClick={() => {
        // a mouse click lands on a word that hover already switched on: leave it
        if (pointer.current !== "mouse") onChange(active ? "idle" : id);
        pointer.current = "";
      }}
      className="cursor-crosshair select-none touch-manipulation font-serif text-[1.12em] italic border-b border-dotted border-current leading-none transition-[color,scale] duration-300 active:scale-95"
      style={{ color: active ? `var(--color-${id})` : undefined }}
    >
      <Stable text={children} shown={text} />
      <sup className="ml-0.5 text-[0.5em] text-mute">°</sup>
    </button>
  );
}

const CLIENTS = ["Untamed", "Independent clients"];
const EMAIL = "webdiegomassarini@gmail.com";
// URLSearchParams encodes spaces as "+", which mail apps show literally: build the query by hand
const MAIL_PARAMS = `subject=${encodeURIComponent("Hello Diego")}&body=${encodeURIComponent(
  "Hi Diego,\n\nI came across your website and I'd like to talk about...\n\n",
)}`;

function ScrambleIn({ text }: { text: string }) {
  const [shown, scramble] = useScramble(text);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- play once per mount, the key swaps the text
  useEffect(scramble, []);
  return <Stable text={text} shown={shown} />;
}

// cycles through CLIENTS with the same scramble as the hover; reduced motion keeps the first one
function Clients() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % CLIENTS.length), 2800);
    return () => clearInterval(t);
  }, []);
  return (
    <>
      <span className="sr-only">{CLIENTS.join(", ")}</span>
      <span className="text-bone">
        <ScrambleIn key={i} text={CLIENTS[i]} />
      </span>
    </>
  );
}

// mailto does nothing without a configured mail app, so the address is also copied
function GetInTouch() {
  const [copied, setCopied] = useState(false);
  return (
    <a
      href={`mailto:${EMAIL}?${MAIL_PARAMS}`}
      onClick={() => {
        navigator.clipboard?.writeText(EMAIL).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }, () => {});
      }}
      className="text-bone underline decoration-dotted underline-offset-4 hover:no-underline"
    >
      <span aria-live="polite">{copied ? "Email copied" : "Get in touch"}</span>
    </a>
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
      className="group flex select-none items-center justify-between gap-3 rounded-full border border-dashed border-bone/30 bg-ink/40 px-4 py-2.5 font-mono text-[11px] backdrop-blur-sm transition-all duration-300 active:bg-bone active:text-ink md:py-1.5 md:hover:-translate-x-1 md:hover:border-solid md:hover:border-bone md:hover:bg-bone md:hover:text-ink"
    >
      <Stable text={name} shown={text} />
      <ArrowUpRight
        className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        aria-hidden
      />
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
  const [current, setCurrent] = useState<Mood>("idle");
  const changeMood = useCallback((m: Mood) => {
    mood.current = m;
    setCurrent(m);
  }, []);
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
              <Word id="curiosity" current={current} onChange={changeMood}>
              curiosity
            </Word>,
            </span>{" "}
            <Word id="creativity" current={current} onChange={changeMood}>
              creativity
            </Word> and a picky eye for{" "}
            <Word id="details" current={current} onChange={changeMood}>
              details
            </Word>
            <Readout />
          </p>
          <p className="reveal mt-6 font-mono text-[11px] uppercase leading-relaxed tracking-wider text-mute" style={order(1)}>
            Currently working with <Clients />
            <br />
            Based in Italy · Open to freelance ·{" "}
            <GetInTouch />
          </p>

        </div>

        <nav aria-label="Links" className="reveal grid grid-cols-2 gap-2 md:flex md:flex-col md:items-end" style={order(2)}>
          {contacts.map((c) => (
            <LinkPill key={c.name} {...c} />
          ))}
        </nav>
      </div>
    </main>
  );
}
