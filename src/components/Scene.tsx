"use client";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import * as THREE from "three";
import { mood, moods } from "./mood";
import { MORPH, unpackDM, type DM } from "./dmGeometry";

// shortcut: r3f 9.x still builds a THREE.Clock internally (deprecated since r183); drop that one
// warning and forward everything else. Remove once r3f v10 is stable and installed.
THREE.setConsoleFunction((type: "log" | "warn" | "error", message: string, ...params: unknown[]) => {
  if (message.startsWith("THREE.Clock:")) return;
  console[type](message, ...params);
});

// blocky plasma on a curved CRT: barrel warp, scanlines, phosphor mask, power-on intro
const crtFragment = /* glsl */ `
  uniform float uTime;
  uniform float uBoot;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform vec3 uColor;
  varying vec2 vUv;

  vec2 curve(vec2 uv) {
    uv = uv * 2.0 - 1.0;
    uv *= 1.0 + pow(abs(uv.yx) / vec2(5.5, 4.5), vec2(2.0));
    return uv * 0.5 + 0.5;
  }

  float plasma(vec2 p, float t) {
    p += (uMouse - 0.5) * 0.6;
    float v = sin(p.x * 3.0 + t) + sin(p.y * 2.3 - t * 0.7)
            + sin((p.x + p.y) * 2.0 + t * 0.5) + sin(length(p - 0.5) * 6.0 - t * 1.3);
    return v * 0.25 + 0.5;
  }

  float sampleBlocks(vec2 uv) {
    float block = 90.0;
    vec2 cell = floor(uv * vec2(block * uRes.x / uRes.y, block)) / vec2(block * uRes.x / uRes.y, block);
    float v = plasma(cell * vec2(uRes.x / uRes.y, 1.0) * 1.4, uTime * 0.35);
    return smoothstep(0.45, 0.75, v);
  }

  void main() {
    vec2 uv = curve(vUv);
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }

    // chromatic split, stronger at the edges like a real tube
    float ca = 0.002 + 0.004 * length(vUv - 0.5);
    vec3 col = vec3(sampleBlocks(uv + vec2(ca, 0.0)), sampleBlocks(uv), sampleBlocks(uv - vec2(ca, 0.0)));
    col *= uColor;

    float scan = 0.75 + 0.25 * sin(uv.y * uRes.y * 1.5);
    float px = mod(gl_FragCoord.x, 3.0);
    vec3 mask = vec3(px < 1.0 ? 1.0 : 0.7, px >= 1.0 && px < 2.0 ? 1.0 : 0.7, px >= 2.0 ? 1.0 : 0.7);
    float flicker = 0.97 + 0.03 * sin(uTime * 60.0);
    float vignette = pow(16.0 * uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y), 0.35);

    // power-on: a bright line opens vertically once the 3D is ready (uBoot < 0 = still off)
    float on = uBoot < 0.0 ? 0.0 : smoothstep(0.0, 1.2, uBoot);
    float open = step(abs(uv.y - 0.5), on * 0.5 + 0.002);
    float line = uBoot < 0.0 ? 0.0 : (1.0 - on) * smoothstep(0.01, 0.0, abs(uv.y - 0.5)) * 2.0;

    col = col * scan * mask * flicker * vignette * 0.32 * open + line;
    gl_FragColor = vec4(col + vec3(0.07, 0.066, 0.06) * vignette, 1.0);
  }
`;

function Crt({ ready }: { ready: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const target = useMemo(() => new THREE.Color(), []);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBoot: { value: -1 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uColor: { value: new THREE.Color(moods.idle.color) },
    }),
    [],
  );

  const readyAt = useRef(-1);

  useFrame(({ clock, pointer, size }) => {
    const u = material.current?.uniforms;
    if (!u) return;
    u.uTime.value = clock.elapsedTime;
    if (ready && readyAt.current < 0) readyAt.current = clock.elapsedTime;
    u.uBoot.value = readyAt.current < 0 ? -1 : clock.elapsedTime - readyAt.current;
    u.uRes.value.set(size.width, size.height);
    u.uMouse.value.lerp(new THREE.Vector2(pointer.x * 0.5 + 0.5, pointer.y * 0.5 + 0.5), 0.03);
    u.uColor.value.lerp(target.set(moods[mood.current].color), 0.05);
  });

  return (
    <mesh renderOrder={-1} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader="varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.999, 1.0); }"
        fragmentShader={crtFragment}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

// every vertex of the DM becomes a particle: each one leaves at its own moment, swirls around
// the mark's vertical axis and drifts out, so the logo crumbles and later reassembles
const dustVertex = /* glsl */ `
  uniform float uScatter;
  uniform float uTime;
  uniform float uDpr;
  uniform vec3 uCenter;
  varying float vAlpha;

  float hash(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }

  void main() {
    float r = hash(position);
    vec3 dir = normalize(vec3(hash(position + 1.7), hash(position + 4.1), hash(position + 7.3)) - 0.5 + 1e-4);
    float s = smoothstep(r * 0.5, r * 0.5 + 0.5, uScatter);

    // most grains stay on the mark so the DM still reads as a dust sculpture; only a few (r^5) fly off
    vec3 p = position - uCenter;
    float a = s * r * 0.35 + sin(uTime * 0.6 + r * 6.28) * 0.03 * s;
    p.xz = mat2(cos(a), -sin(a), sin(a), cos(a)) * p.xz;
    float far = r * r * r * r * r;
    p += dir * s * (8.0 + far * 1100.0);
    p += dir * s * sin(uTime * 1.3 + r * 40.0) * 6.0; // keep shimmering while scattered
    p.y -= s * far * 420.0; // svg y points down, so this floats the stray dust upward
    p += uCenter;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    // every vertex as a grain is too dense: keep about half
    float keep = step(hash(position + 9.1), 0.5);
    gl_PointSize = keep * (1.2 + r * 2.2) * uDpr * (6.0 / -mv.z);
    vAlpha = smoothstep(0.0, 0.15, uScatter) * (0.45 + 0.55 * r);
  }
`;

const dustFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(uColor, vAlpha * smoothstep(0.5, 0.1, d));
  }
`;

// hover turns the chrome into terminal ASCII: the screen is cut into character cells, each picks
// a glyph by how bright the lit chrome is there, and the gaps between strokes let the CRT through
const GLYPHS = " .:-=+*#%@";

function glyphAtlas() {
  const canvas = document.createElement("canvas");
  canvas.width = GLYPHS.length * 32;
  canvas.height = 48;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.font = "bold 40px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  [...GLYPHS].forEach((c, i) => ctx.fillText(c, i * 32 + 16, 26));
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

// module-level: Scene only ever loads in the browser, there is one logo, and these change every frame
const ascii = {
  uGlyphs: { value: glyphAtlas() },
  uAscii: { value: 0 },
  uTime: { value: 0 },
  uDpr: { value: 1 },
};

const asciiChunk = /* glsl */ `
  if (uAscii > 0.001) {
    vec2 cellSize = vec2(7.0, 11.0) * uDpr;
    vec2 id = floor(gl_FragCoord.xy / cellSize);
    // cells flip over one by one in random order rather than all at once
    if (asciiHash(id) < uAscii) {
      vec2 local = fract(gl_FragCoord.xy / cellSize);
      float lum = dot(gl_FragColor.rgb, vec3(0.299, 0.587, 0.114));
      // chrome sits in a narrow mid-grey band: stretch it so the reflections use the whole ramp
      float idx = floor(clamp((lum - 0.08) * 2.6, 0.0, 0.999) * ${GLYPHS.length}.0);
      // a few cells keep scrambling, like a terminal that never settles
      float tick = floor(uTime * 14.0);
      if (asciiHash(id + tick) < 0.07) idx = floor(asciiHash(id - tick) * ${GLYPHS.length}.0);
      float ink = texture2D(uGlyphs, vec2((idx + local.x) / ${GLYPHS.length}.0, local.y)).r;
      if (ink < 0.4) discard;
      gl_FragColor = linearToOutputTexel(vec4(diffuseColor.rgb * (0.6 + lum), diffuseColor.a));
    }
  }
`;

function injectAscii(shader: THREE.WebGLProgramParametersWithUniforms) {
  Object.assign(shader.uniforms, ascii);
  shader.fragmentShader = shader.fragmentShader
    .replace(
      "#include <common>",
      `#include <common>
      uniform sampler2D uGlyphs;
      uniform float uAscii;
      uniform float uTime;
      uniform float uDpr;
      float asciiHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }`,
    )
    .replace("#include <dithering_fragment>", `#include <dithering_fragment>\n${asciiChunk}`);
}

function Logo({ ready, onLoaded }: { ready: boolean; onLoaded: () => void }) {
  const svg = useLoader(SVGLoader, "/dm.svg");
  const group = useRef<THREE.Group>(null);
  const solid = useRef<THREE.Mesh>(null);
  const wire = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshPhysicalMaterial>(null);
  const wireMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const dust = useRef<THREE.Points>(null);
  const dustMaterial = useRef<THREE.ShaderMaterial>(null);
  const hovered = useRef(false);
  const live = useRef({ tilt: 0.5, wobble: 0.15, zoom: 1, puff: 0, scatter: 0, wire: 0, ascii: 0, t: 0 });
  const target = useMemo(() => new THREE.Color(), []);

  const [dm, setDm] = useState<DM | null>(null);

  useEffect(() => {
    const worker = new Worker(new URL("./dm.worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (e) => {
      setDm(unpackDM(e.data));
      worker.terminate();
    };
    worker.postMessage(svg.paths.flatMap((p) => p.toShapes()).map((s) => s.toJSON()));
    return () => worker.terminate();
  }, [svg]);

  useEffect(() => {
    if (dm) onLoaded();
  }, [dm, onLoaded]);

  // the particles reuse the mesh's own vertex buffer: no extra memory
  const particles = useMemo(() => {
    if (!dm) return null;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", dm.geometry.attributes.position);
    const uniforms = {
      uScatter: { value: 0 },
      uTime: { value: 0 },
      uDpr: { value: 1 },
      uCenter: { value: dm.center },
      uColor: { value: new THREE.Color(moods.creativity.color) },
    };
    return { geometry, uniforms };
  }, [dm]);

  useFrame(({ pointer, viewport, clock }, dt) => {
    const m = moods[mood.current];
    const l = live.current;
    const ease = (from: number, to: number, speed = 3) => THREE.MathUtils.damp(from, to, speed, dt);
    l.tilt = ease(l.tilt, m.tilt, 4);
    l.wobble = ease(l.wobble, m.wobble);
    l.zoom = ease(l.zoom, m.zoom);
    l.puff = ease(l.puff, m.puff, 5);
    l.ascii = ease(l.ascii, hovered.current ? 1 : 0, 5);
    // breaking apart is slow and dreamy, coming back together a little quicker
    l.scatter = ease(l.scatter, m.scatter, m.scatter > l.scatter ? 1.2 : 2);
    l.wire = ease(l.wire, m.wire, 4);
    l.t += dt;

    for (const mesh of [solid.current, wire.current]) {
      if (!mesh?.morphTargetInfluences?.length) continue;
      mesh.morphTargetInfluences[MORPH.puff] = l.puff;
    }
    // the solid dissolves as the first particles leave
    const solidness = 1 - THREE.MathUtils.smoothstep(l.scatter, 0, 0.35);
    if (material.current && solid.current) {
      material.current.color.lerp(target.set(m.color), 0.06);
      material.current.opacity = (1 - l.wire * 0.75) * solidness;
      solid.current.visible = solidness > 0.01;
      ascii.uAscii.value = l.ascii;
      ascii.uTime.value = clock.elapsedTime;
      ascii.uDpr.value = viewport.dpr;
    }
    if (dustMaterial.current && dust.current) {
      const u = dustMaterial.current.uniforms;
      u.uScatter.value = l.scatter;
      u.uTime.value = clock.elapsedTime;
      u.uDpr.value = viewport.dpr;
      dust.current.visible = l.scatter > 0.005;
    }
    if (wireMaterial.current) {
      wireMaterial.current.opacity = l.wire * 0.6;
      wire.current!.visible = l.wire > 0.01;
    }

    const g = group.current;
    if (!g) return;
    const fit = Math.min(1, viewport.width / 4.2);
    // stays hidden until the page says go, then grows in
    // zooming in (details) must still fit the screen width: the mark is 3.2 units wide at scale 1
    const zoomed = Math.min(fit * l.zoom, (viewport.width * 0.92) / 3.2);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, ready ? zoomed : 0.001, 4, dt));
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, pointer.x * l.tilt + Math.sin(l.t * 1.3) * l.wobble, 4, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -pointer.y * l.tilt * 0.6 + Math.cos(l.t * 1.1) * l.wobble * 0.5, 4, dt);
    g.rotation.z = Math.sin(l.t * 0.9) * l.wobble * 0.15;
    // the bio sits bottom-left: lift the mark clear of it (much more on portrait screens)
    const lift = viewport.height * (viewport.aspect < 1 ? 0.2 : 0.07);
    g.position.y = lift + Math.sin(l.t * 0.8) * 0.06;
  });

  if (!dm || !particles) return null;
  const unit = 3.2 / dm.width;
  // svg y points down: flip it, and pivot around the center of the extruded box
  const meshProps = {
    geometry: dm.geometry,
    // r3f sets geometry after construction, so three never sizes morphTargetInfluences on its own
    onUpdate: (self: THREE.Mesh) => self.updateMorphTargets(),
    scale: [unit, -unit, unit] as const,
    position: [-dm.center.x * unit, dm.center.y * unit, -dm.center.z * unit] as const,
  };

  return (
    <group ref={group} scale={0.001}>
      <mesh
        ref={solid}
        {...meshProps}
        onPointerOver={() => (hovered.current = true)}
        onPointerOut={() => (hovered.current = false)}
      >
        <meshPhysicalMaterial
          ref={material}
          onBeforeCompile={injectAscii}
          color={moods.idle.color}
          metalness={0.85}
          roughness={0.12}
          clearcoat={1}
          clearcoatRoughness={0.05}
          iridescence={0.4}
          iridescenceIOR={1.5}
          transparent
        />
      </mesh>
      <mesh ref={wire} {...meshProps} visible={false}>
        <meshBasicMaterial ref={wireMaterial} color="#c8f560" wireframe transparent opacity={0} />
      </mesh>
      <points ref={dust} geometry={particles.geometry} scale={meshProps.scale} position={meshProps.position} visible={false}>
        <shaderMaterial
          ref={dustMaterial}
          uniforms={particles.uniforms}
          vertexShader={dustVertex}
          fragmentShader={dustFragment}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// the page decides when to go (`ready`); the scene only reports when the geometry has landed
export default function Scene({ ready, onLoaded }: { ready: boolean; onLoaded: () => void }) {
  // phones have 3x screens and weak GPUs: 1.5x max, and drop to 1x if frames start slipping
  const [dpr, setDpr] = useState(1.5);

  return (
    <Canvas
      className="pointer-events-none"
      camera={{ position: [0, 0, 6], fov: 35 }}
      dpr={[1, dpr]}
      // reading shader logs forces a blocking wait on every compile; only worth it while developing
      onCreated={({ gl }) => {
        gl.debug.checkShaderErrors = process.env.NODE_ENV !== "production";
      }}
      gl={{ antialias: true }}
      eventSource={document.body}
      eventPrefix="client"
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <Crt ready={ready} />
      <Suspense fallback={null}>
        <Logo ready={ready} onLoaded={onLoaded} />
      </Suspense>
      {/* chrome needs something to reflect: a studio built from light panels, no HDR download */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={5} position={[0, 4, 3]} scale={[10, 1.5, 1]} />
        <Lightformer form="rect" intensity={3} position={[0, -4, 2]} scale={[10, 0.6, 1]} />
        <Lightformer form="rect" intensity={2.5} color="#ff8a5b" position={[-5, 0, 1]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={2.5} color="#7dd3c8" position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer form="ring" intensity={3} position={[0, 0, -5]} scale={4} />
      </Environment>
    </Canvas>
  );
}
