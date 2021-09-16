import { useMutation, useQuery, useSubscription, gql } from "@apollo/client";
import { RouteProp, useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";

import React, { useContext, useEffect, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import client from "../../apollo";
import Image from "../../components/Image";
import ScreenContainer from "../../components/ScreenContainer";
import { BldText13, RegText13 } from "../../components/Text";
import useMe from "../../hooks/useMe";
import { FOLLOW } from "../../queries";
import {
  RoomType,
  StackGeneratorParamList,
  themeType,
  UserType,
} from "../../types";
import { pixelScaler } from "../../utils";

const MemberContainer = styled.TouchableOpacity`
  height: ${pixelScaler(60)}px;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const InfoContainer = styled.View`
  height: ${pixelScaler(35)}px;
  width: ${pixelScaler(315)}px;
  flex-direction: row;
  align-items: center;
  /* justify-content: space-between; */
`;

const MemberThumbnail = styled.View`
  height: ${pixelScaler(32)}px;
  width: ${pixelScaler(32)}px;
`;

const TitleContainer = styled.View`
  margin-left: ${pixelScaler(15)}px;
`;

const FollowButton = styled.TouchableOpacity`
  height: 100%;
  width: ${pixelScaler(100)}px;
  border-radius: ${pixelScaler(10)}px;
  background-color: ${({ theme }: { theme: themeType }) => theme.followButton};
  position: absolute;
  right: 0;
  align-items: center;
  justify-content: center;
`;

const ChatMemberComponent = ({ user }: { user: UserType }) => {
  const theme = useContext<themeType>(ThemeContext);
  const navigation = useNavigation<any>();

  const [isFollowing, setIsfollowing] = useState<boolean>();

  const setIsFollowingFromCache = () => {
    const { isFollowing: following } = client.readFragment({
      id: "User:" + user.id, // The value of the to-do item's cache ID
      fragment: gql`
        fragment myUser on User {
          isFollowing
        }
      `,
    });
    setIsfollowing(following);
  };

  useEffect(() => {
    setIsFollowingFromCache();
  }, []);

  const onCompleted = ({
    followUser: { ok, error },
  }: {
    followUser: {
      ok: boolean;
      error: string;
    };
  }) => {
    // { ok, error }: { ok: boolean; error: string }
    console.log(user.id);
    if (ok) {
      client.cache.modify({
        id: `User:${user.id}`,
        fields: {
          isFollowing(prev) {
            // console.log(prev);
            return true;
          },
        },
      });
      setIsFollowingFromCache();
    } else {
      Alert.alert("팔로우에 실패하였습니다.");
    }
    // console.log(client.cache)
  };

  const [mutation, { loading, data }] = useMutation(FOLLOW, {
    onCompleted,
  });

  const me = useMe();

  return (
    <MemberContainer
      onPress={() => {
        navigation.push("Profile", { user });
      }}
    >
      <InfoContainer>
        <MemberThumbnail>
          <Image
            source={{
              uri: user.profileImageUrl,
            }}
            style={{
              width: pixelScaler(32),
              height: pixelScaler(32),
              borderRadius: pixelScaler(32),
            }}
          />
        </MemberThumbnail>
        <TitleContainer>
          <BldText13
            style={{
              color: theme.chatMemberUsername,
              width: pixelScaler(200),
            }}
            numberOfLines={1}
          >
            {user.username}
          </BldText13>
          <RegText13
            style={{
              color: theme.chatMemberName,
            }}
            numberOfLines={1}
          >
            {user.name ?? ""}
          </RegText13>
        </TitleContainer>
        {user.id !== me.id && !isFollowing ? (
          <FollowButton
            onPress={() =>
              mutation({
                variables: {
                  targetId: user.id,
                },
              })
            }
          >
            <BldText13 style={{ color: theme.followButtonText }}>
              팔로우
            </BldText13>
          </FollowButton>
        ) : null}
      </InfoContainer>
    </MemberContainer>
  );
};

const Chatmembers = ({
  navigation,
  route,
}: {
  navigation: StackNavigationProp<StackGeneratorParamList>;
  route: RouteProp<StackGeneratorParamList, "ChatMembers">;
}) => {
  const room = route.params.room;
  const theme = useContext<themeType>(ThemeContext);

  return (
    <ScreenContainer>
      <FlatList
        data={room.members}
        keyExtractor={(item) => "" + item.id}
        renderItem={({ item }) => <ChatMemberComponent user={item} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => <></>}
        ItemSeparatorComponent={() => (
          <View
            style={{
              marginHorizontal: pixelScaler(30),
              backgroundColor: theme.chatMemberSeperator,
              height: pixelScaler(0.6),
            }}
          />
        )}
        ListFooterComponent={() => <></>}
      />
    </ScreenContainer>
  );
};

export default Chatmembers;
