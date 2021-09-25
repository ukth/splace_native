import { Dimensions } from "react-native";

export const convertLike = (n: number) => {
  if (n === 0) {
    return "0";
  }
  if (n < 1000) {
    return 10 ** Math.floor(Math.log10(n)) + "+";
  }
  if (n < 1000000) {
    return 10 ** (Math.floor(Math.log10(n)) - 3) + "k+";
  }

  return 10 ** (Math.floor(Math.log10(n)) - 6) + "m+";
};

const { width, height } = Dimensions.get("window");
export const pixelScaler = (n: number) => (n * width) / 375;

const GMT = 9;

export const getHour = (timestamp: number) => {
  return Math.floor(((timestamp + 3600 * GMT) % 86400) / 3600) % 24;
};

export const getMinute = (timestamp: number) => {
  return Math.floor(((timestamp + 3600 * GMT) % 3600) / 60) % 60;
};

export const isSameDay = (timestamp1: number, timestamp2: number) => {
  return (
    Math.floor((timestamp1 + 3600 * GMT) / 86400) ===
    Math.floor((timestamp2 + 3600 * GMT) / 86400)
  );
};

export const strCmpFunc = (a: string, b: string) => {
  if (a < b) {
    return -1;
  }
  if (a === b) {
    return 0;
  }
  return 1;
};