import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isLoggedInVar, tokenVar, cache } from "../apollo";

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        const token = await AsyncStorage.getItem("token");
        if (token) {
          isLoggedInVar(true);
          tokenVar(token);
        }
        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('../../assets/fonts/SpaceMono-Regular.ttf'),
          "NanumSquareRound-R": require("../../assets/fonts/NanumSquareRoundOTFR.otf"),
          "NanumSquareRound-B": require("../../assets/fonts/NanumSquareRoundOTFB.otf"),
          "NanumSquareRound-EB": require("../../assets/fonts/NanumSquareRoundOTFEB.otf"),
          "NanumSquareRound-L": require("../../assets/fonts/NanumSquareRoundOTFL.otf"),
        });
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
