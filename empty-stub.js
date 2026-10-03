export default function sharp() {
  return {
    resize: () => sharp(),
    webp: () => sharp(),
    avif: () => sharp(),
    toFile: async () => {},
    metadata: async () => ({ format: 'webp', width: 800, height: 800 }),
  };
}
