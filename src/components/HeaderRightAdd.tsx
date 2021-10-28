import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { GestureResponderEvent, Image, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Icons } from "../icons";
import { pixelScaler } from "../utils";

export const HeaderRightAdd = ({
  onPress,
}: {
  onPress: (event: GestureResponderEvent) => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ marginRight: pixelScaler(30) }}
    >
      <Image source={Icons.add_log} />
    </TouchableOpacity>
  );
};
