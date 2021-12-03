import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components/native";
import { ThemeType } from "../../types";
import { pixelScaler } from "../../utils";
import { RegText16 } from "../Text";

const TagContainer = styled.TouchableOpacity`
  height: ${pixelScaler(25)}px;
  padding: 0 10px;
  border-radius: ${pixelScaler(12.5)}px;
  border-width: ${pixelScaler(1)}px;
  border-color: ${({ color, theme }: { color?: string; theme: ThemeType }) =>
    color ?? theme.tagBorder};
  align-items: center;
  justify-content: center;
  margin-right: ${({ color }: { color?: string }) =>
    color ? pixelScaler(5) : pixelScaler(10)}px;
  margin-bottom: ${pixelScaler(10)}px;
  padding-top: ${pixelScaler(1.3)}px;
`;

const Tag = ({
  text,
  onPress,
  color,
}: {
  text: string;
  onPress: () => void;
  color?: string;
}) => {
  const theme = useContext<ThemeType>(ThemeContext);
  return (
    <TagContainer onPress={onPress} color={color}>
      <RegText16 style={{ color: color ?? theme.text }}>{text}</RegText16>
    </TagContainer>
  );
};

export default Tag;
