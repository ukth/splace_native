import React, { useContext } from "react";
import { View } from "react-native";
import { ThemeContext } from "styled-components/native";

const ScreenContainer = ({ children }: { children?: any }) => {
  const theme = useContext(ThemeContext);
  return (
    <View
      style={{
        backgroundColor: theme.background,
        flex: 1,
      }}
    >
      {children}
    </View>
  );
};
export default ScreenContainer;
