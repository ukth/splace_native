import React from "react";
import { Image, ImageStyle, StyleProp } from "react-native";
import { Icons } from "../icons";

export const Icon = ({
  name,
  style,
}: {
  name:
    | "arrowdown"
    | "bigcoins"
    | "bookmark_black"
    | "bookmark_color"
    | "bookmark_fill"
    | "box_plus"
    | "box"
    | "super"
    | "super_necklace"
    | "super_sad"
    | "super_ok"
    | "super_smallheart"
    | "super_bigheart"
    | "super_hot"
    | "super_superhot"
    | "super_tasty"
    | "super_supertasty"
    | "super_inbox"
    | "edit"
    | "empty_heart"
    | "filter"
    | "gallery_black"
    | "gallery_white"
    | "heart_colorfill"
    | "heartplus"
    | "home_black"
    | "home_color"
    | "lock_black"
    | "lock_white"
    | "map"
    | "messagebox"
    | "myposition"
    | "notification_1"
    | "notification_dot"
    | "positionpin"
    | "profile_black"
    | "profile_color"
    | "purchaselist"
    | "search_black"
    | "search_color"
    | "search_grey"
    | "shop_black"
    | "shop_color"
    | "smallcoins_pisa"
    | "smallcoins_straight"
    | "threedot"
    | "menu"
    | "uplog"
    | "wishlist"
    | "close_white"
    | "close";
  style: StyleProp<ImageStyle>;
}) => {
  return <Image source={Icons[name]} style={style} />;
};
