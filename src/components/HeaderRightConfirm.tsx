import { Ionicons } from "@expo/vector-icons";
import React, { useContext } from "react";
import { GestureResponderEvent, TouchableOpacity } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { pixelScaler } from "../utils";
import { BldText16 } from "./Text";

export const HeaderRightConfirm = ({
  onPress,
  text = "완료",
}: {
  onPress: (event: GestureResponderEvent) => void;
  text?: string;
}) => {
  const theme = useContext(ThemeContext);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ marginRight: pixelScaler(27) }}
    >
      <BldText16 style={{ color: theme.headerConfirmText }}>{text}</BldText16>
    </TouchableOpacity>
  );
};
