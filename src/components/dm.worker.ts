// building the DM takes seconds on a phone CPU: do it here so the page never freezes
import * as THREE from "three";
import { buildDM, packDM } from "./dmGeometry";

self.onmessage = (e: MessageEvent<ReturnType<THREE.Shape["toJSON"]>[]>) => {
  const shapes = e.data.map((json) => new THREE.Shape().fromJSON(json));
  const { data, transfer } = packDM(buildDM(shapes));
  self.postMessage(data, { transfer });
};
