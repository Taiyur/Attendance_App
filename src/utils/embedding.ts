export const generateFakeEmbedding = (): number[] => {
  // 128-d vector (like FaceNet)
  return Array.from({ length: 128 }, () =>
    Number((Math.random() * 2 - 1).toFixed(6))
  );
};
