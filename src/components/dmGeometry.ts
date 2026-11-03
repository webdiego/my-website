import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { TessellateModifier } from "three/examples/jsm/modifiers/TessellateModifier.js";

// units are the svg's (dm.svg is ~1832 wide)
const DEPTH = 200;
const PUFF = 170; // how far the caps balloon out
const PUFF_REACH = 70; // distance from the outline where the balloon reaches full height

export const MORPH = { puff: 0 } as const;

/**
 * Extrudes the DM shapes and bakes a puff morph target: the caps inflate like a balloon,
 * staying flat near the outline.
 */
export function buildDM(shapes: THREE.Shape[]) {
  const extruded = new THREE.ExtrudeGeometry(shapes, {
    depth: DEPTH,
    bevelEnabled: true,
    bevelThickness: 30,
    bevelSize: 14,
    bevelSegments: 6,
    curveSegments: 16,
  });
  // caps are a few huge triangles: split them so they can bend
  const dense = new TessellateModifier(24, 12).modify(extruded);
  dense.deleteAttribute("normal");
  dense.deleteAttribute("uv");
  const g = mergeVertices(dense);
  g.computeVertexNormals();
  g.computeBoundingBox();
  const box = g.boundingBox!;

  // closed loops as segments: straight runs only keep their endpoints, so point distance isn't enough
  const segments = shapes.flatMap((s) => {
    const { shape, holes } = s.extractPoints(16);
    return [shape, ...holes].flatMap((loop) => loop.map((a, i) => [a, loop[(i + 1) % loop.length]]));
  });
  const distToOutline = (x: number, y: number) => {
    let best = Infinity;
    for (const [a, b] of segments) {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = dx * dx + dy * dy || 1;
      const t = Math.max(0, Math.min(1, ((x - a.x) * dx + (y - a.y) * dy) / len));
      best = Math.min(best, (a.x + t * dx - x) ** 2 + (a.y + t * dy - y) ** 2);
    }
    return Math.sqrt(best);
  };

  const pos = g.attributes.position as THREE.BufferAttribute;
  const n = pos.count;
  const puff = new Float32Array(n * 3);
  const midZ = (box.min.z + box.max.z) / 2;

  for (let i = 0; i < n; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    const t = Math.min(distToOutline(x, y) / PUFF_REACH, 1);
    // circular profile: steep at the edge, round on top
    const bulge = Math.sqrt(1 - (1 - t) ** 2) * PUFF;
    puff.set([x, y, z + Math.sign(z - midZ) * bulge], i * 3);
  }

  const puffed = new THREE.BufferGeometry();
  puffed.setAttribute("position", new THREE.BufferAttribute(puff, 3));
  puffed.setIndex(g.index);
  puffed.computeVertexNormals();

  g.morphAttributes.position = [new THREE.BufferAttribute(puff, 3)];
  g.morphAttributes.normal = [puffed.attributes.normal];

  // center on the extruded box so rotations pivot in the middle
  const center = box.getCenter(new THREE.Vector3());
  return { geometry: g, center, width: box.max.x - box.min.x };
}

export type DM = ReturnType<typeof buildDM>;
type TypedArray = Float32Array | Uint16Array | Uint32Array;

// plain typed arrays so the worker can transfer (not copy) the result
export function packDM({ geometry: g, center, width }: DM) {
  const arrays = {
    index: g.index!.array as TypedArray,
    position: g.attributes.position.array as TypedArray,
    normal: g.attributes.normal.array as TypedArray,
    morphPosition: g.morphAttributes.position!.map((a) => a.array as TypedArray),
    morphNormal: g.morphAttributes.normal!.map((a) => a.array as TypedArray),
  };
  const transfer = [arrays.index, arrays.position, arrays.normal, ...arrays.morphPosition, ...arrays.morphNormal].map(
    (a) => a.buffer as ArrayBuffer,
  );
  return { data: { ...arrays, center: center.toArray(), width }, transfer };
}

export function unpackDM(data: ReturnType<typeof packDM>["data"]): DM {
  const g = new THREE.BufferGeometry();
  g.setIndex(new THREE.BufferAttribute(data.index, 1));
  g.setAttribute("position", new THREE.BufferAttribute(data.position, 3));
  g.setAttribute("normal", new THREE.BufferAttribute(data.normal, 3));
  g.morphAttributes.position = data.morphPosition.map((a) => new THREE.BufferAttribute(a, 3));
  g.morphAttributes.normal = data.morphNormal.map((a) => new THREE.BufferAttribute(a, 3));
  return { geometry: g, center: new THREE.Vector3().fromArray(data.center), width: data.width };
}
