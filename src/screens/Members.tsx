import { useMutation, useQuery, useSubscription, gql } from "@apollo/client";
import { RouteProp, useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";

import React, { useContext, useEffect, useState } from "react";
import { Alert, FlatList, GestureResponderEvent, View } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { theme } from "../../theme";
import client from "../apollo";
import Image from "../components/Image";
import ScreenContainer from "../components/ScreenContainer";
import { BldText13, BldText16, BldText20, RegText13 } from "../components/Text";
import useMe from "../hooks/useMe";
import { FOLLOW, GET_ROOM_INFO, LEAVE_CHATROOM } from "../queries";
import {
  RoomType,
  StackGeneratorParamList,
  themeType,
  UserType,
} from "../types";
import { pixelScaler } from "../utils";

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

const GreyButton = styled.View`
  width: ${pixelScaler(32)}px;
  height: ${pixelScaler(32)}px;
  border-radius: ${pixelScaler(32)}px;
  background-color: ${({ theme }: { theme: themeType }) => theme.greyButton};
  align-items: center;
  justify-content: center;
`;

const Seperator = () => {
  const theme = useContext<themeType>(ThemeContext);
  return (
    <View
      style={{
        marginHorizontal: pixelScaler(30),
        backgroundColor: theme.chatMemberSeperator,
        height: pixelScaler(0.6),
        width: pixelScaler(315),
      }}
    />
  );
};

const GreyButtonComponent = ({
  type,
  onPress,
}: {
  type: "+" | "-";
  onPress: (event: GestureResponderEvent) => void;
}) => {
  const theme = useContext<themeType>(ThemeContext);
  return (
    <MemberContainer onPress={onPress}>
      <InfoContainer>
        <GreyButton>
          <View
            style={{
              position: "absolute",
              width: pixelScaler(16),
              height: pixelScaler(2),
              borderRadius: pixelScaler(2),
              backgroundColor: theme.greyButtonContext,
            }}
          />
          {type === "+" ? (
            <View
              style={{
                position: "absolute",
                width: pixelScaler(2),
                height: pixelScaler(16),
                borderRadius: pixelScaler(2),
                backgroundColor: theme.greyButtonContext,
              }}
            />
          ) : null}
        </GreyButton>
        <BldText16 style={{ marginLeft: pixelScaler(15) }}>
          {type === "+" ? "초대하기" : "나가기"}
        </BldText16>
      </InfoContainer>
    </MemberContainer>
  );
};

const MemberComponent = ({ user }: { user: UserType }) => {
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
    // console.log(user.id);
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
  // console.log(user);

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
          <BldText16
            style={{
              color: theme.chatMemberUsername,
              width: pixelScaler(200),
            }}
            numberOfLines={1}
          >
            {user.username}
          </BldText16>
          {user.name ? (
            <RegText13
              style={{
                color: theme.chatMemberName,
              }}
              numberOfLines={1}
            >
              {user.name}
            </RegText13>
          ) : null}
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

const Members = ({
  navigation,
  route,
}: {
  navigation: StackNavigationProp<StackGeneratorParamList>;
  route: RouteProp<StackGeneratorParamList, "Members">;
}) => {
  const theme = useContext<themeType>(ThemeContext);

  const { vars, membersData, refetchMembers, inviteMutation, leaveMutation } =
    route.params;

  const [members, setMembers] = useState<UserType[]>(membersData);

  const [refreshing, setRefreshing] = useState(false);

  const updateMembers = async () => {
    const { data } = await refetchMembers();
    if (data?.getRoomInfo?.ok) {
      setMembers(data.getRoomInfo.room.members);
    } else if (true) {
      console.log("hello");
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    await updateMembers();
    setRefreshing(false);
  };

  navigation.addListener("focus", async () => {
    await updateMembers();
  });

  return (
    <ScreenContainer>
      <FlatList
        data={members}
        keyExtractor={(item) => "" + item.id}
        renderItem={({ item }) => <MemberComponent user={item} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View>
            <GreyButtonComponent
              type={"+"}
              onPress={() =>
                navigation.push("AddMembers", {
                  vars,
                  members,
                  inviteMutation,
                })
              }
            />
            <Seperator />
          </View>
        )}
        onRefresh={refresh}
        refreshing={refreshing}
        ItemSeparatorComponent={() => <Seperator />}
        ListFooterComponent={() => (
          <View>
            <Seperator />
            <GreyButtonComponent
              type={"-"}
              onPress={() => leaveMutation({ variables: { ...vars } })}
            />
          </View>
        )}
      />
    </ScreenContainer>
  );
};

export default Members;
