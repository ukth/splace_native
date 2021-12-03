import { GestureResponderEvent, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components/native";
import { ThemeType } from "../types";
import { pixelScaler } from "../utils";
import React from "react";

export const Container = styled.View`
  position: absolute;
  right: ${pixelScaler(15)}px;
  bottom: ${pixelScaler(15)}px;
  width: ${pixelScaler(60)}px;
  height: ${pixelScaler(60)}px;
  border-radius: ${pixelScaler(60)}px;
  background-color: ${({ theme }: { theme: ThemeType }) => theme.background};
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
  align-items: center;
  justify-content: center;
  z-index: 0;
`;

export const FloatingMapButton = ({
  onPress,
  children,
}: {
  onPress: (event: GestureResponderEvent) => void;
  children: React.ReactNode;
}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Container>{children}</Container>
    </TouchableWithoutFeedback>
  );
};
