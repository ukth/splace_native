import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isLoggedInVar, tokenVar, menualCheckedVar } from "../apollo";
import { Asset } from "expo-asset";
import { Image } from "react-native";
import { MANUAL, TOKEN } from "../constants";

function cacheImages(images: (string | number)[]) {
  return images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        const token = await AsyncStorage.getItem(TOKEN);
        if (token) {
          isLoggedInVar(true);
          tokenVar(token);
        }
        const menualChecked = await AsyncStorage.getItem(MANUAL);
        if (menualChecked) {
          menualCheckedVar(Number(menualChecked));
        } else {
          menualCheckedVar(0);
        }
        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          "space-mono": require("../../assets/fonts/SpaceMono-Regular.ttf"),
          "NanumSquareRound-R": require("../../assets/fonts/NanumSquareRoundOTFR.otf"),
          "NanumSquareRound-B": require("../../assets/fonts/NanumSquareRoundOTFB.otf"),
          "NanumSquareRound-EB": require("../../assets/fonts/NanumSquareRoundOTFEB.otf"),
          "NanumSquareRound-L": require("../../assets/fonts/NanumSquareRoundOTFL.otf"),
          "NotoSansKR-Bold": require("../../assets/fonts/NotoSansKR-Bold.otf"),
          "NotoSansKR-Medium": require("../../assets/fonts/NotoSansKR-Medium.otf"),
          "NotoSansKR-Regular": require("../../assets/fonts/NotoSansKR-Regular.otf"),

          "NotoSans-Bold": require("../../assets/fonts/NotoSans-Bold.ttf"),
          "NotoSans-Regular": require("../../assets/fonts/NotoSans-Regular.ttf"),
        });

        cacheImages([
          require("../../assets/images/menual/log.jpg"),
          require("../../assets/images/icons/positionpin_small.png"),
        ]);
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
