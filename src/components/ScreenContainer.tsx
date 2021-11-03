import React, { useContext } from "react";
import { View, ViewStyle } from "react-native";
import { ThemeContext } from "styled-components/native";

const ScreenContainer = ({
  children,
  style,
}: {
  children?: any;
  style?: ViewStyle;
}) => {
  const theme = useContext(ThemeContext);

  return (
    <View
      style={{
        backgroundColor: theme.background,
        flex: 1,
        ...style,
      }}
    >
      {children}
    </View>
  );
};
export default ScreenContainer;
