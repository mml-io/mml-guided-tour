export const randomArrayElement = (array: Array<any>) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

export const randomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
