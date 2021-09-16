import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { GestureResponderEvent } from "react-native";
import styled from "styled-components/native";
import { pixelScaler } from "../utils";

const Container = styled.TouchableOpacity`
  position: absolute;
  top: ${pixelScaler(54)}px;
  left: ${pixelScaler(15)}px;
`;

export const ScreenBackButton = ({
  color = "black",
  onPress,
}: {
  color?: string;
  onPress: (event: GestureResponderEvent) => void;
}) => {
  return (
    <Container onPress={onPress}>
      <Ionicons name={"chevron-back"} color={color} size={26} />
    </Container>
  );
};
