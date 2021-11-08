import React from "react";
import { Image, ImageStyle, StyleProp } from "react-native";
import { Icons } from "../icons";
import { IconName } from "../types";

export const Icon = ({
  name,
  style,
}: {
  name: IconName;
  style: StyleProp<ImageStyle>;
}) => {
  return <Image source={Icons[name]} style={style} />;
};
