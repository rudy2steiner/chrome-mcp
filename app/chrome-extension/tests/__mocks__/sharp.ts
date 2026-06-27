export default function sharp() {
  return {
    resize: () => sharp(),
    png: () => sharp(),
    jpeg: () => sharp(),
    webp: () => sharp(),
    toBuffer: async () => Buffer.from([]),
    metadata: async () => ({ width: 1, height: 1 }),
  };
}
