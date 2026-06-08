export const COOLDOWN_DURATION = 500;

export const MAX_TRUNKS = 10;

export const CLOUD_SPAWN_INTERVAL = 8;
export const CLOUD_DENSE_START = 10;
export const CLOUD_DENSE_END = 35;
export const CLOUD_MAX_LEVEL = 50;

export const CLOUD_TYPES = ['cloud1', 'cloud2', 'cloud3'];

export const SPACE_THRESHOLD = 90;
export const TRANSITION_DURATION = 40;
export const SPACE_OBJECTS_START = 130;

export const QUOTES = [
  "Thank you for watering! 🌱",
  "The tree feels your love! 🌳",
  "Growing stronger! 💪",
  "You're amazing! ✨",
  "The roots go deeper... 🌿",
  "Nature thanks you! 🍃",
  "Every drop counts! 💧",
  "The tree whispers thank you... 🌲",
  "Good things take time! ⏳",
  "You're a true gardener! 🌻",
  "The forest remembers! 🦋",
  "Magic in every drop! ✨",
  "Keep growing! 🚀",
  "The tree is watching over you! 👁️",
  "One drop at a time! 💦",
];

export const CLOUDS_BEHIND = [
  { src: 'cloud1', bottomVw: 0.49, left: '5%', widthVw: 13, anim: 'cloudFloat1', delay: '0s', dur: '22s' },
  { src: 'cloud2', bottomVw: 0.64, left: '55%', widthVw: 15, anim: 'cloudFloat2', delay: '-10s', dur: '28s' },
  { src: 'cloud1', bottomVw: 0.88, left: '30%', widthVw: 11, anim: 'cloudFloat1', delay: '-7s', dur: '25s' },
];

export const CLOUDS_FRONT = [
  { src: 'cloud3', bottomVw: 0.69, left: '20%', widthVw: 17, anim: 'cloudFloat3', delay: '-15s', dur: '35s' },
];

export interface Leaf {
  id: number;
  x: number;
  startX: number;
  delay: number;
  duration: number;
}

export interface Cloud {
  id: number;
  type: string;
  x: number;
  worldY: number;
  widthVw: number;
  zIndex: number;
  animDelay: string;
  animDur: string;
}

export interface Star {
  id: number;
  x: number;
  worldY: number;
  size: number;
  twinkleDelay: string;
  twinkleDur: string;
}

export interface SpaceObject {
  id: number;
  type: 'planet' | 'ship' | 'meteor' | 'rocket' | 'satellite' | 'asteroid';
  x: number;
  worldY: number;
  zIndex: number;
  fromLeft?: boolean;
}

