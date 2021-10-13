import styled from "styled-components/native";
import { themeType } from "../types";
import { pixelScaler } from "../utils";

export const FloatingMapButton = styled.TouchableOpacity`
  position: absolute;
  right: ${pixelScaler(15)}px;
  bottom: ${pixelScaler(15)}px;
  width: ${pixelScaler(60)}px;
  height: ${pixelScaler(60)}px;
  border-radius: ${pixelScaler(60)}px;
  background-color: ${({ theme }: { theme: themeType }) => theme.background};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  align-items: center;
  justify-content: center;
  z-index: 0;
`;
