import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { GestureResponderEvent, TouchableOpacity } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { pixelScaler } from "../utils";
import { CardBoxPropType } from "../types";
import { BldText13 } from "./Text";
import { LinearGradient } from "expo-linear-gradient";
import Image from "./Image";

const CardImage = styled.Image`
  width: ${pixelScaler(186)}px;
  height: ${pixelScaler(186)}px;
`;

export const CardBox = ({
  text,
  url,
  onPress,
}: {
  text?: string;
  url: string;
  onPress: (event: GestureResponderEvent) => void;
}) => {
  const theme = useContext(ThemeContext);

  // console.log(photolog);

  return (
    <TouchableOpacity onPress={onPress}>
      {text ? (
        <BldText13
          style={{
            position: "absolute",
            zIndex: 1,
            left: pixelScaler(15),
            top: pixelScaler(15),
            color: theme.white,
          }}
        >
          {text}
        </BldText13>
      ) : null}
      {text ? (
        <LinearGradient
          // Background Linear Gradient
          colors={["rgba(0,0,0,0.2)", "transparent"]}
          style={{
            top: 0,
            position: "absolute",
            height: pixelScaler(40),
            width: pixelScaler(186),
            zIndex: 3,
          }}
        />
      ) : null}
      <Image
        source={{ uri: url ?? "https://i.stack.imgur.com/mwFzF.png" }}
        style={{
          width: pixelScaler(186),
          height: pixelScaler(186),
          marginRight: pixelScaler(3),
          marginBottom: pixelScaler(3),
        }}
      />
      {/* need to fix!!! */}
    </TouchableOpacity>
  );
};

export const RowCardBoxContainer = ({ children }: { children: any }) => {
  const Container = styled.View`
    margin-bottom: ${pixelScaler(3)}px;
    flex-direction: row;
    justify-content: space-between;
  `;
  return <Container>{children}</Container>;
};
