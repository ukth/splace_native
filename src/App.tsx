import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";
import { Alert, Text, TextInput, View } from "react-native";
import { ThemeProvider } from "styled-components";
import { theme } from "../theme";
import client from "./apollo";
import { ApolloProvider } from "@apollo/client";
import { ProgressProvider } from "./contexts/Progress";
import { ImagePickerProvider } from "./contexts/ImagePicker";
import FlashMessage from "react-native-flash-message";
import { UploadContentProvider } from "./contexts/UploadContent";
import { FilterProvider } from "./contexts/Filter";
import { pixelScaler } from "./utils";
import { RegText16 } from "./components/Text";

import * as Notifications from "expo-notifications";
import useMe from "./hooks/useMe";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const isLoadingComplete = useCachedResources();

  // @ts-ignore
  Text.defaultProps = { ...(Text.defaultProps || {}), allowFontScaling: false };
  // @ts-ignore
  TextInput.defaultProps = {
    // @ts-ignore
    ...(TextInput.defaultProps || {}),
    allowFontScaling: false,
  };

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ProgressProvider>
        <ImagePickerProvider>
          <UploadContentProvider>
            <FilterProvider>
              <ApolloProvider client={client}>
                <ThemeProvider theme={theme.light}>
                  <StatusBar style="dark" />
                  <SafeAreaProvider>
                    <Navigation />
                  </SafeAreaProvider>
                  <FlashMessage
                    position="top"
                    MessageComponent={({ message: { message } }) => (
                      <View
                        style={{
                          marginTop: pixelScaler(50),
                          width: pixelScaler(315),
                          height: pixelScaler(60),
                          shadowOffset: { width: 0, height: pixelScaler(2) },
                          shadowOpacity: 0.2,
                          shadowRadius: pixelScaler(2),
                          borderRadius: pixelScaler(10),
                          marginLeft: pixelScaler(30),
                          backgroundColor: "#f2f2f7",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <RegText16>{message}</RegText16>
                      </View>
                    )}
                  />
                </ThemeProvider>
              </ApolloProvider>
            </FilterProvider>
          </UploadContentProvider>
        </ImagePickerProvider>
      </ProgressProvider>
    );
  }
}
