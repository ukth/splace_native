import React from "react";
import styled from "styled-components/native";
import { HashTagType, themeType } from "../../types";
import { pixelScaler } from "../../utils";
import { RegText13 } from "../Text";

const Container = styled.View`
  flex-direction: row;
`;
const Tag = styled.View`
  height: ${pixelScaler(20)}px;
  border-width: ${pixelScaler(0.6)}px;
  border-color: ${({ theme }: { theme: themeType }) => theme.tagBorder};
  border-radius: ${({
    borderRadius,
  }: {
    theme: themeType;
    borderRadius: number;
  }) => borderRadius}px;
  padding: 0 ${pixelScaler(10)}px;
  align-items: center;
  justify-content: center;
  margin-right: ${pixelScaler(10)}px;
`;

const Tags = ({ tags, address }: { tags: HashTagType[]; address: string }) => {
  // console.log(tags);

  return (
    <Container>
      <Tag borderRadius={0}>
        <RegText13>{address}</RegText13>
      </Tag>
      {tags.map(({ name }: { name: string }, index: number) => (
        <Tag borderRadius={10} key={index}>
          <RegText13>{name}</RegText13>
        </Tag>
      ))}
    </Container>
  );
};

export default Tags;
