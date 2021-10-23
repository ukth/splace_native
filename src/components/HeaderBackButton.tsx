import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { GestureResponderEvent, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { pixelScaler } from "../utils";

export const HeaderBackButton = ({
  onPress,
}: {
  onPress: (event: GestureResponderEvent) => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ marginLeft: pixelScaler(18) }}>
      <Ionicons size={pixelScaler(27)} name="chevron-back" />
    </TouchableOpacity>
  );
};
