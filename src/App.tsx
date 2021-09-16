import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, { useContext } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { Text, TextInput } from "react-native";
import { ThemeProvider } from "styled-components";
import { theme } from "../theme";
import client, { tokenVar } from "./apollo";
import { ApolloProvider } from "@apollo/client";
// import { BarStyleContext, BarStyleProvider } from "./contexts/BarStyle";

// const ThemeStatusBar = () => {
//   const { barStyle } = useContext(BarStyleContext);
//   return (<StatusBar barStyle={barStyle} backgroundColor={barStyle === "dark-content" ? "#ffffff" : "#000000"} />);
// }

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

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme.light}>
          <StatusBar style="dark" />
          <SafeAreaProvider>
            <Navigation />
          </SafeAreaProvider>
        </ThemeProvider>
      </ApolloProvider>
    );
  }
}
