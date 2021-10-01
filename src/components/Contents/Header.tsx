import { useNavigation } from "@react-navigation/core";
import React from "react";
import { GestureResponderEvent } from "react-native";
import styled from "styled-components/native";
import { PhotologType, UserType } from "../../types";
import { pixelScaler } from "../../utils";
import Image from "../Image";
import { BldText13 } from "../Text";
import ThreeDots from "../ThreeDots";

const Container = styled.View`
  width: auto;
  height: ${pixelScaler(60)}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${pixelScaler(30)}px;
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
  const navigation = useNavigation<any>();
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
          source={{ uri: user.profileImageUrl }}
          style={{
            width: pixelScaler(26),
            height: pixelScaler(26),
            borderRadius: pixelScaler(13),
            marginRight: pixelScaler(10),
          }}
        />

        <BldText13>{user.username}</BldText13>
      </Profile>
      <ThreeDots onPress={pressThreeDots} />
    </Container>
  );
};

export default Header;
