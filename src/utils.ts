import axios from "axios";
import { Dimensions } from "react-native";
import { API_URL } from "./apollo";

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

export const keyword2Address = async (
  keyword: string,
  coordinate?: { lat: number; lon: number }
) => {
  if (keyword === "") {
    return [];
  }
  const res: any = await axios.get(
    "http://" +
      API_URL +
      "/geocode?keyword=" +
      keyword +
      (coordinate ? "&coordinate=" + coordinate.lon + "," + coordinate.lat : "")
  );

  if (res.status === 200) {
    if (res.data?.addresses) {
      return res.data?.addresses;
    }
  }
  return [];
};

export const coords2address = async ({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}) => {
  const res: any = await axios.get(
    "http://" + API_URL + "/reversegeocode?lat=" + lat + "&lon=" + lon
  );

  if (res.data?.status?.code === 0) {
    const result = res.data.results[0];
    if (result) {
      let addStr = "";
      addStr += res.data.results[0]?.region?.area1?.name + " ";
      addStr += res.data.results[0]?.region?.area2?.name + " ";
      addStr += res.data.results[0]?.land?.name + " ";
      addStr += res.data.results[0]?.land?.number1 + " ";
      // addStr += res.data.results[0]?.land?.addition0?.value + " ";
      return addStr;
    }
    return "주소 정보 없음";
  } else if (res.data?.status?.code === 3) {
    return "주소 정보 없음";
  }

  return "주소 정보 불러오기 실패";
};

export const priceToText = (n: number) => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatPhoneString = (phoneString: string) => {
  if (phoneString.length === 8) {
    return phoneString.substr(0, 4) + "-" + phoneString.substr(4, 4);
  }
  if (
    phoneString.substr(0, 2) === "01" &&
    (phoneString.length === 10 || phoneString.length === 11)
  ) {
    return (
      phoneString.substr(0, 3) +
      "-" +
      phoneString.substring(3, phoneString.length - 4) +
      "-" +
      phoneString.substr(phoneString.length - 4, 4)
    );
  }
  if (
    phoneString.substr(0, 2) === "02" &&
    (phoneString.length === 9 || phoneString.length === 10)
  ) {
    return (
      phoneString.substr(0, 2) +
      "-" +
      phoneString.substring(2, phoneString.length - 4) +
      "-" +
      phoneString.substr(phoneString.length - 4, 4)
    );
  }
  if (phoneString.length === 10 || phoneString.length === 11) {
    return (
      phoneString.substr(0, 3) +
      "-" +
      phoneString.substring(2, phoneString.length - 4) +
      "-" +
      phoneString.substr(phoneString.length - 4, 4)
    );
  }
  return phoneString;
};

export const formatOperatingTime = (n: number) => {
  const h = Math.floor(n / 3600000);
  const m = Math.floor((n % 3600000) / 60000);
  return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
};

export const dayNameKor = ["일", "월", "화", "수", "목", "금", "토"];

export const BLANK_IMAGE =
  "http://t3.gstatic.com/licensed-image?q=tbn:ANd9GcTT0cESt5DADuWcGOffPxaqNw8BZHK1-GIqXiC5cCVCCD80BCiRvohsgU4BJZMhxLXw3pzppeprEgqAimhbl7c";

export const calcDistanceByCoords = (
  coord1: { lat: number; lon: number },
  coord2: { lat: number; lon: number }
) => {
  if (coord1.lat == coord2.lat && coord1.lon == coord2.lon) {
    return 0;
  }

  var radLat1 = (Math.PI * coord1.lat) / 180;
  var radLat2 = (Math.PI * coord2.lat) / 180;
  var theta = coord1.lon - coord2.lon;
  var radTheta = (Math.PI * theta) / 180;

  var dist =
    Math.sin(radLat1) * Math.sin(radLat2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);

  if (dist > 1) {
    dist = 1;
  }

  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515 * 1.609344 * 1000;

  return Math.round(dist);
};

export const formatDistance = (d: number) => {
  if (d < 1000) {
    return d + "m";
  }
  return (d / 1000).toFixed(1) + "km";
};

export const format2DecimalNumber = (n: number) => {
  if (n < 10) {
    return "0" + n;
  }
  return "" + n;
};
