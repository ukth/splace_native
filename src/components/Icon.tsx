import React from "react";
import { Image, ImageStyle, StyleProp } from "react-native";
import { Icons } from "../icons";

export const Icon = ({
  name,
  style,
}: {
  name:
    | "add_log"
    | "add_wishlist"
    | "bookmark_selected"
    | "camera"
    | "close_white"
    | "close"
    | "credit1"
    | "credit2"
    | "credit3"
    | "credit4"
    | "edit"
    | "filter"
    | "heart_outline"
    | "image"
    | "location_pin"
    | "locked"
    | "map"
    | "market2"
    | "menu"
    | "mylocation"
    | "notification_new"
    | "notification"
    | "super_box"
    | "super_good"
    | "super_neckless"
    | "super_soso"
    | "super_verygood"
    | "supertasty";
  style: StyleProp<ImageStyle>;
}) => {
  return <Image source={Icons[name]} style={style} />;
};
