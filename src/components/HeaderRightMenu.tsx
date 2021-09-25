import { Ionicons } from "@expo/vector-icons";
import React, { useContext } from "react";
import { GestureResponderEvent, TouchableOpacity } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { pixelScaler } from "../utils";
import { BldText16 } from "./Text";

export const HeaderRightMenu = ({
  onPress,
}: {
  onPress: (event: GestureResponderEvent) => void;
}) => {
  const theme = useContext(ThemeContext);
  return (
    <TouchableOpacity onPress={onPress} style={{ marginLeft: pixelScaler(18) }}>
      <Ionicons name="menu" size={26} />
    </TouchableOpacity>
  );
};
