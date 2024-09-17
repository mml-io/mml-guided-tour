export const randomArrayElement = (array: Array<any>) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

export const randomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomFloatBetween = (a: number, b: number): number => {
  return Math.random() * (b - a) + a;
};

export const setToCSVString = (set: Set<number>) => {
  return Array.from(set).join(" ");
};
