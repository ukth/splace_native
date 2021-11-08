import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { GestureResponderEvent, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { pixelScaler } from "../utils";
import { Icon } from "./Icon";

export const HeaderBackButton = ({
  onPress,
  color,
}: {
  onPress: (event: GestureResponderEvent) => void;
  color?: string;
}) => {
  return (
    <TouchableOpacity
      hitSlop={{
        top: pixelScaler(10),
        bottom: pixelScaler(10),
        right: pixelScaler(10),
        left: pixelScaler(10),
      }}
      onPress={onPress}
      style={{ marginLeft: pixelScaler(27) }}
    >
      <Icon
        name="header_back"
        style={{
          width: pixelScaler(9),
          height: pixelScaler(17),
        }}
      />
    </TouchableOpacity>
  );
};
