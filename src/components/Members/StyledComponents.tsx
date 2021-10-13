import styled from "styled-components/native";
import { themeType } from "../../types";
import { pixelScaler } from "../../utils";

export const MemberContainer = styled.TouchableOpacity`
  height: ${pixelScaler(60)}px;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const InfoContainer = styled.View`
  height: ${pixelScaler(35)}px;
  width: ${pixelScaler(315)}px;
  flex-direction: row;
  align-items: center;
`;

export const MemberThumbnail = styled.View`
  height: ${pixelScaler(32)}px;
  width: ${pixelScaler(32)}px;
`;

export const TitleContainer = styled.View`
  margin-left: ${pixelScaler(15)}px;
`;

export const FollowButton = styled.TouchableOpacity`
  height: 100%;
  width: ${pixelScaler(100)}px;
  border-radius: ${pixelScaler(10)}px;
  background-color: ${({ theme }: { theme: themeType }) => theme.followButton};
  position: absolute;
  right: 0;
  align-items: center;
  justify-content: center;
`;

export const GreyButton = styled.View`
  width: ${pixelScaler(32)}px;
  height: ${pixelScaler(32)}px;
  border-radius: ${pixelScaler(32)}px;
  background-color: ${({ theme }: { theme: themeType }) => theme.greyButton};
  align-items: center;
  justify-content: center;
`;
