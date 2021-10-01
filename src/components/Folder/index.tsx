import styled from "styled-components/native";
import React from "react";
import { pixelScaler } from "../../utils";
import { themeType } from "../../types";

export const DeleteButton = styled.TouchableOpacity`
  position: absolute;
  right: 0;
  top: 0;
  width: ${pixelScaler(30)}px;
  height: ${pixelScaler(30)}px;
  border-radius: ${pixelScaler(30)}px;
  background-color: ${({ theme }: { theme: themeType }) =>
    theme.folderDeleteButtonBackground};
  z-index: 1;
  align-items: center;
  justify-content: center;
`;

export const Minus = styled.View`
  background-color: ${({ theme }: { theme: themeType }) =>
    theme.folderDeleteMinus};
  width: ${pixelScaler(12)}px;
  height: ${pixelScaler(2)}px;
  border-radius: ${pixelScaler(2)}px;
`;

export const EditButtonsContainer = styled.View`
  flex: 1;
  height: ${pixelScaler(40)}px;
  width: ${pixelScaler(375 - 17.5)}px;
  flex-direction: row;
  padding: 0 ${pixelScaler(30)}px;
  margin-bottom: ${pixelScaler(5)}px;
`;

export const SortButton = styled.TouchableOpacity`
  position: absolute;
  right: ${pixelScaler(30)}px;
  bottom: ${pixelScaler(4)}px;
  flex-direction: row;
`;

export const NewFolderButton = styled.TouchableOpacity`
  position: absolute;
  left: ${pixelScaler(12.5)}px;
  bottom: 0;
  justify-content: center;
  padding: 0 ${pixelScaler(10)}px;
  height: ${pixelScaler(20)}px;
  border-radius: ${pixelScaler(30)}px;
  border-width: ${pixelScaler(0.7)}px;
`;

export const Item = styled.TouchableOpacity`
  width: ${pixelScaler(145)}px;
  height: ${pixelScaler(145)}px;
  border-radius: ${pixelScaler(10)}px;
  margin-top: ${pixelScaler(15)}px;
  align-items: center;
  justify-content: center;
`;
