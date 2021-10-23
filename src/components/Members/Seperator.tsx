import React, { useContext } from "react";
import { ThemeContext } from "styled-components/native";
import { ThemeType } from "../../types";
import { pixelScaler } from "../../utils";
import { View } from "../Themed";

const Seperator = () => {
  const theme = useContext<ThemeType>(ThemeContext);
  return (
    <View
      style={{
        marginHorizontal: pixelScaler(30),
        backgroundColor: theme.chatMemberSeperator,
        height: pixelScaler(0.6),
        width: pixelScaler(315),
      }}
    />
  );
};

export default Seperator;
