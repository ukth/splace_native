import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Dimensions, useWindowDimensions, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { menualCheckedVar, tokenVar } from "./apollo";
import { API_URL, MANUAL, NOTIFICATION } from "./constants";
import { Splace } from "./screens";

export const convertNumber = (n: number) => {
  if (!n) {
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

export const pixelScaler = (n: number) => {
  const width = Dimensions.get("window").width;
  return (n * width) / 375;
};

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

export const keyword2Place = async (
  keyword: string,
  coordinate?: { lat: number; lon: number }
) => {
  if (keyword === "") {
    return [];
  }
  const res: any = await axios.get(
    "http://" +
      API_URL +
      "/keyword?keyword=" +
      keyword +
      (coordinate ? "&x=" + coordinate.lon + "&y=" + coordinate.lat : "")
  );
  if (res.status === 200) {
    return res.data?.documents?.map(
      (place: {
        distance: string;
        id: string;
        place_name: string;
        road_address_name: string;
        address_name: string;
        x: string;
        y: string;
      }) => {
        return {
          id: place.id,
          distance: place.distance !== "" ? Number(place.distance) : 0,
          name: place.place_name,
          road_address: place.road_address_name,
          address: place.address_name,
          lon: Number(place.x),
          lat: Number(place.y),
        };
      }
    );
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
  if (!lat || !lon) {
    return "";
  }
  const res: any = await axios.get(
    "http://" + API_URL + "/reversegeocode?lat=" + lat + "&lon=" + lon
  );

  if (res.data?.status?.code === 0) {
    const result = res.data.results[0];
    if (result?.name === "roadaddr") {
      // let addStr = "";
      return (
        (result.region?.area1?.alias ?? result.region?.area1?.name) +
        " " +
        result.region?.area2?.name +
        " " +
        result.land?.name +
        " " +
        result.land?.number1
      );
      // addStr += res.data.results[0]?.land?.addition0?.value + " ";
    } else if (result?.name === "addr") {
      return (
        (result.region?.area1?.alias ?? result.region?.area1?.name) +
        " " +
        result.region?.area2?.name +
        " " +
        result.region?.area3?.name +
        " " +
        result.land?.number1 +
        "-" +
        result.land?.number2
      );
    } else if (result?.name === "legalcode") {
      (result.region?.area1?.alias ?? result.region?.area1?.name) +
        " " +
        result.region?.area2?.name +
        " " +
        result.region?.area3?.name;
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
    return d.toFixed(0) + "m";
  }
  return (d / 1000).toFixed(1) + "km";
};

export const formatFilterDistance = (d: number) => {
  if (d < 0.2) {
    return "100m";
  }
  if (d < 0.4) {
    return "500m";
  }
  if (d < 0.6) {
    return "1km";
  }
  if (d < 0.8) {
    return "3km";
  }
  if (d < 1.0) {
    return "5km";
  }
  if (d < 1.2) {
    return "10km";
  }
  return "제한 없음";
};

export const format2DecimalNumber = (n: number) => {
  if (n < 10) {
    return "0" + n;
  }
  return "" + n;
};

export const AlbumTitleKor = {
  Panoramas: "파노라마",
  Videos: "비디오",
  Favorites: "즐겨찾는 항목",
  "Time-lapse": "타임랩스",
  Hidden: "",
  "Recently Deleted": "",
  Recents: "최근 항목",
  Bursts: "고속 연사 촬영",
  "Slo-mo": "슬로 모션",
  "Recently Added": "",
  Selfies: "셀피",
  Screenshots: "스크린샷",
  Portrait: "인물 사진",
  "Live Photos": "라이브 포토",
  Animated: "움직이는 항목",
  "Long Exposure": "장노출",
  "Unable to Upload": "",
  RAW: "RAW",
};

export const uploadPhotos = async (urls: string[]) => {
  const formData = new FormData();
  if (urls.length >= 1) {
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      formData.append("photos", {
        // @ts-ignore
        uri: url,
        name: url.substr(url.length > 20 ? url.length - 20 : 0),
        type: "image/jpeg",
      });
    }

    const res: { data: { originalname: string; location: string }[] } =
      await axios.post("http://" + API_URL + "/uploadphoto", formData, {
        headers: {
          "content-type": "multipart/form-data",
          // token: tokenVar(),
          token: tokenVar() ?? "",
        },
      });

    if (res.data.length === urls.length) {
      const awsUrls = [];
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        for (let j = 0; j < Object.keys(res.data).length; j++) {
          if (
            res.data[j]?.originalname ===
            url.substr(url.length > 20 ? url.length - 20 : 0)
          ) {
            awsUrls.push(res.data[j].location);
            break;
          }
        }
      }
      if (awsUrls.length === urls.length) {
        return awsUrls;
      }
    } else {
      console.log(res);
    }
  }
  return [];
};

export const uploadVideo = async (url: string) => {
  const formData = new FormData();

  formData.append("video", {
    // @ts-ignore
    uri: url,
    name: url.substr(url.length > 20 ? url.length - 20 : 0),
    type: "video/mov",
  });
  // console.log({
  //   // @ts-ignore
  //   uri: url,
  //   name: url.substr(url.length > 20 ? url.length - 20 : 0),
  //   type: "video/mp4",
  // });

  // console.log("in upload");
  const res: any = await axios.post(
    "http://" + API_URL + "/uploadvideo",
    formData,
    {
      headers: {
        "content-type": "multipart/form-data",
        // token: tokenVar(),
        token: tokenVar() ?? "",
      },
    }
  );
  return res?.data?.location ?? "";
};

export const showFlashMessage = ({ message }: { message: string }) => {
  showMessage({
    message,
    backgroundColor: "#ffffff",
    type: "success",
    floating: true,
  });
};

export const shortenAddress = (address: string) => {
  const words = address.split(" ");
  return words[0].substr(0, 2) + ", " + words[1].substr(0, 2);
};

export const convertTimeDifference2String = (diff: number) => {
  if (diff < 60 * 60 * 1000) {
    const min = Math.floor(diff / 60000);
    return min !== 0 ? min + "분 전" : "방금 전";
  }
  if (Math.floor(diff / (60 * 60000)) < 24) {
    return Math.floor(diff / (60 * 60000)) + "시간 전";
  }
  if (Math.floor(diff / (60 * 60000 * 24)) < 7) {
    return Math.floor(diff / (60 * 60000 * 24)) + "일 전";
  }
  if (diff / (60 * 60000 * 24) < 30) {
    return Math.floor(diff / (60 * 60000 * 24 * 7)) + "주 전";
  }
  if (diff / (60 * 60000 * 24) < 365) {
    return Math.floor(diff / (60 * 60000 * 24 * 30)) + "달 전";
  }
  return Math.floor(diff / (60 * 60000 * 24 * 365)) + "년 전";
};

export const checkNotifications = async () => {
  const d = new Date();
  AsyncStorage.setItem(NOTIFICATION, d.valueOf() + "");
};

export const getNotificationsChecked = async () => {
  return Number((await AsyncStorage.getItem(NOTIFICATION)) ?? 0);
};

export const checkMenual = async (n: 0 | 1 | 2) => {
  var v = menualCheckedVar();
  if (v % 2 ** (n + 1) < 2 ** n) {
    v += 2 ** n;
    menualCheckedVar(v);
    AsyncStorage.setItem(MANUAL, String(v));
  }
};

export const getWeekNumber = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth();
  const date = today.getDate();

  const firstDate = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0);
  const firstDay = firstDate.getDay() === 0 ? 7 : firstDate.getDay();
  return Math.ceil((date + firstDay - 1) / 7);
};
