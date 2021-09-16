import { Dimensions } from "react-native";

export const convertLike = (n: number) => {
  if (n === 0) {
    return "0";
  }
  if (n < 10) {
    return "1+";
  }
  if (n < 100) {
    return "10+";
  }
  if (n < 1000) {
    return "100+";
  }
  if (n < 10000) {
    return "1k+";
  }
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
