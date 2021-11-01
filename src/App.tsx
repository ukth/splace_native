import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { Text, TextInput } from "react-native";
import { ThemeProvider } from "styled-components";
import { theme } from "../theme";
import client, { tokenVar } from "./apollo";
import { ApolloProvider } from "@apollo/client";
import * as Linking from "expo-linking";
import { ProgressProvider } from "./contexts/Progress";
import { ImagePickerProvider } from "./contexts/ImagePicker";
import FlashMessage from "react-native-flash-message";
import { UploadContentProvider } from "./contexts/UploadContent";

export default function App() {
  const isLoadingComplete = useCachedResources();
  // const colorScheme = useColorScheme();

  // @ts-ignore
  Text.defaultProps = { ...(Text.defaultProps || {}), allowFontScaling: false };
  // @ts-ignore
  TextInput.defaultProps = {
    // @ts-ignore
    ...(TextInput.defaultProps || {}),
    allowFontScaling: false,
  };

  // const url = Linking.useURL();
  // console.log("url:", url);

  // const handleDeepLink = (event: any) => {
  //   console.log("!!", event);
  // };

  // useEffect(() => {
  //   console.log("rendered");
  //   Linking.addEventListener("url", handleDeepLink);
  //   // return () => {
  //   //   Linking.removeEventListener("url", handleDeepLink);
  //   // };
  // }, []);

  // useEffect(() => {
  //   console.log("UE, url changed", url);
  // }, [url]);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ProgressProvider>
        <ImagePickerProvider>
          <UploadContentProvider>
            <ApolloProvider client={client}>
              <ThemeProvider theme={theme.light}>
                <StatusBar style="dark" />
                <SafeAreaProvider>
                  <Navigation />
                </SafeAreaProvider>
                <FlashMessage position="top" />
              </ThemeProvider>
            </ApolloProvider>
          </UploadContentProvider>
        </ImagePickerProvider>
      </ProgressProvider>
    );
  }
}
