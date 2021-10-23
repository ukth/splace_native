import React, { useContext } from "react";
import { GestureResponderEvent } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { ThemeType } from "../types";
import { pixelScaler } from "../utils";

const DotsContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const Dot = styled.View`
  width: ${pixelScaler(4)}px;
  height: ${pixelScaler(4)}px;
  margin-right: ${pixelScaler(4)}px;
  background-color: ${({ color }: { color: string }) => color};
  border-radius: ${pixelScaler(2)}px;
`;

const ThreeDots = ({
  onPress,
  color,
}: {
  onPress: (event: GestureResponderEvent) => void;
  color?: string;
}) => {
  const theme = useContext<ThemeType>(ThemeContext);
  if (!color) {
    color = theme.dots;
  }
  return (
    <DotsContainer
      onPress={onPress}
      hitSlop={{ top: 15, bottom: 15, right: 5, left: 5 }}
    >
      <Dot color={color} />
      <Dot color={color} />
      <Dot color={color} />
    </DotsContainer>
  );
};

export default ThreeDots;
