import { Ionicons } from "@expo/vector-icons";
import React, { useContext } from "react";
import { GestureResponderEvent, Image, TouchableOpacity } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { Icons } from "../icons";
import { pixelScaler } from "../utils";
import { BldText16 } from "./Text";

export const HeaderRightMenu = ({
  onPress,
}: {
  onPress: (event: GestureResponderEvent) => void;
}) => {
  const theme = useContext(ThemeContext);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ marginRight: pixelScaler(27) }}
      hitSlop={{
        top: pixelScaler(10),
        bottom: pixelScaler(10),
        right: pixelScaler(10),
      }}
    >
      <Image source={Icons.menu} style={{ width: 18, height: 15 }} />
    </TouchableOpacity>
  );
};
