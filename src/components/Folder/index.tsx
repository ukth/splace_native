import styled from "styled-components/native";
import React from "react";
import { pixelScaler } from "../../utils";
import { ThemeType } from "../../types";
import { GestureResponderEvent, TouchableWithoutFeedback } from "react-native";

export const DeleteButton = styled.TouchableOpacity`
  position: absolute;
  right: 0;
  top: 0;
  width: ${pixelScaler(30)}px;
  height: ${pixelScaler(30)}px;
  border-radius: ${pixelScaler(30)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.folderDeleteButtonBackground};
  z-index: 1;
  align-items: center;
  justify-content: center;
`;

export const Minus = styled.View`
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.folderDeleteMinus};
  width: ${pixelScaler(12)}px;
  height: ${pixelScaler(2)}px;
  border-radius: ${pixelScaler(2)}px;
`;

export const EditButtonsContainer = styled.View`
  height: ${pixelScaler(40)}px;
  width: ${pixelScaler(375 - 35)}px;
  flex-direction: row;
  padding: 0 ${pixelScaler(12.5)}px;
  margin-bottom: ${pixelScaler(5)}px;
  align-items: center;
`;

export const SortButton = styled.TouchableOpacity`
  position: absolute;
  right: ${pixelScaler(17.5)}px;
  height: ${pixelScaler(40)}px;
  flex-direction: row;
  align-items: center;
  padding-top: ${pixelScaler(20)}px;
  /* background-color: #9df; */
`;

export const NewFolderButton = styled.TouchableOpacity`
  position: absolute;
  left: ${pixelScaler(12.5)}px;
  bottom: 0;
  justify-content: center;
  padding: 0 ${pixelScaler(10)}px;
  padding-top: ${pixelScaler(1.3)}px;
  height: ${pixelScaler(20)}px;
  border-radius: ${pixelScaler(30)}px;
  border-width: ${pixelScaler(0.67)}px;
`;

export const ItemContainer = styled.View`
  width: ${pixelScaler(145)}px;
  height: ${pixelScaler(145)}px;
  border-radius: ${pixelScaler(10)}px;
  margin-top: ${pixelScaler(15)}px;
  align-items: center;
  justify-content: center;
`;

export const Item = ({
  onPress,
  children,
}: {
  onPress: (event: GestureResponderEvent) => void;
  children: React.ReactNode;
}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <ItemContainer>{children}</ItemContainer>
    </TouchableWithoutFeedback>
  );
};
