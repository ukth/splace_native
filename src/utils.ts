import { Dimensions } from "react-native";

export const convertNumber = (n: number) => {
  if (n === 0) {
    return "0";
  }
  if (n < 10) {
    return "1+";
  }
  if (n < 50) {
    return "10+";
  }
  if (n < 100) {
    return "50+";
  }
  if (n < 1000) {
    return Math.floor(n / 100) + "00+";
  }
  if (n < 1000000) {
    return (n / 1000).toFixed(1) + "k+";
  }
  if (n < 1000000000) {
    return (n / 1000000).toFixed(1) + "m+";
  } else "" + n;
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

export const BLANK_IMAGE =
  "http://t3.gstatic.com/licensed-image?q=tbn:ANd9GcTT0cESt5DADuWcGOffPxaqNw8BZHK1-GIqXiC5cCVCCD80BCiRvohsgU4BJZMhxLXw3pzppeprEgqAimhbl7c";
