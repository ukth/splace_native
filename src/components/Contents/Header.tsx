import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext } from "react";
import { GestureResponderEvent } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { BLANK_PROFILE_IMAGE } from "../../constants";
import {
  PhotologType,
  StackGeneratorParamList,
  ThemeType,
  UserType,
} from "../../types";
import { pixelScaler } from "../../utils";
import Image from "../Image";
import { BldText13 } from "../Text";
import ThreeDots from "../ThreeDots";

const Container = styled.View`
  width: auto;
  height: ${pixelScaler(55)}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${pixelScaler(30)}px;
  padding-top: ${pixelScaler(3)}px;
`;
const Profile = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const Header = ({
  user,
  pressThreeDots,
}: {
  user: UserType;
  pressThreeDots: (event: GestureResponderEvent) => void;
}) => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const theme = useContext<ThemeType>(ThemeContext);
  return (
    <Container>
      <Profile
        onPress={() =>
          navigation.push("Profile", {
            user,
          })
        }
      >
        {/* <ProfileImage source={{ uri: item.author.profileImageUrl }} /> */}
        <Image
          source={{ uri: user.profileImageUrl ?? BLANK_PROFILE_IMAGE }}
          style={{
            width: pixelScaler(26),
            height: pixelScaler(26),
            borderRadius: pixelScaler(13),
            marginRight: pixelScaler(10),
            borderWidth: pixelScaler(0.4),
            borderColor: theme.imageBorder,
          }}
        />

        <BldText13>{user.username}</BldText13>
      </Profile>
      <ThreeDots onPress={pressThreeDots} />
    </Container>
  );
};

export default Header;
