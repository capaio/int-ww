// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require("crypto");

export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

export function encrypt(word: string) {
  return crypto.createHash("md5").update(word).digest("hex");
}
