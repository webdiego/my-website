// shared between the DOM (hovered word) and the 3D scene (read every frame, no re-render)
export const moods = {
  idle: { color: "#d9d6cf", tilt: 0.5, wobble: 0.15, zoom: 1, puff: 0, scatter: 0, wire: 0 },
  curiosity: { color: "#ff8a5b", tilt: 0.8, wobble: 0.3, zoom: 1.05, puff: 1, scatter: 0, wire: 0 },
  creativity: { color: "#b69cff", tilt: 0.4, wobble: 0.2, zoom: 1, puff: 0, scatter: 1, wire: 0 },
  details: { color: "#c8f560", tilt: 0.25, wobble: 0.05, zoom: 1.35, puff: 0, scatter: 0, wire: 1 },
};

export type Mood = keyof typeof moods;

export const mood: { current: Mood } = { current: "idle" };
