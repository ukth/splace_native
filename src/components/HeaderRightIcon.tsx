import { Ionicons } from "@expo/vector-icons";
import React, { useContext } from "react";
import {
  GestureResponderEvent,
  Image,
  ImageStyle,
  StyleProp,
  TouchableOpacity,
} from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { Icons } from "../icons";
import { IconName } from "../types";
import { pixelScaler } from "../utils";
import { Icon } from "./Icon";
import { BldText16 } from "./Text";

export const HeaderRightIcon = ({
  onPress,
  iconName,
  iconStyle,
}: {
  onPress: (event: GestureResponderEvent) => void;
  iconName: IconName;
  iconStyle: StyleProp<ImageStyle>;
}) => {
  const theme = useContext(ThemeContext);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ marginRight: pixelScaler(27) }}
      hitSlop={{
        top: pixelScaler(10),
        bottom: pixelScaler(10),
        left: pixelScaler(10),
        right: pixelScaler(10),
      }}
    >
      <Icon name={iconName} style={iconStyle} />
    </TouchableOpacity>
  );
};
