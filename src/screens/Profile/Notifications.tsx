import { useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import client from "../../apollo";
import Image from "../../components/Image";
import ScreenContainer from "../../components/ScreenContainer";
import { BldText13, BldText16, RegText13 } from "../../components/Text";
import { FOLLOW, GET_NOTIFICATIONS } from "../../queries";
import { StackGeneratorParamList, ThemeType, UserType } from "../../types";
import { BLANK_IMAGE, pixelScaler } from "../../utils";
import { gql, useMutation } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ItemContainer = styled.View`
  height: ${pixelScaler(75)}px;
  width: auto;
  border-bottom-width: ${pixelScaler(0.67)}px;
  border-bottom-color: ${({ theme }: { theme: ThemeType }) =>
    theme.notificationSeperator};
  flex-direction: row;
  align-items: center;
`;

const ContentContainer = styled.View`
  /* overflow: hidden; */
  flex: 1;
  align-items: center;
  flex-direction: row;
`;

export const Button = styled.TouchableOpacity`
  height: ${pixelScaler(35)}px;
  width: ${pixelScaler(100)}px;
  border-radius: ${pixelScaler(10)}px;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0;
`;

const FollowButton = ({ user }: { user: UserType }) => {
  console.log(user);
  const [isFollowing, setIsfollowing] = useState(user.isFollowing ?? false);

  const onCompleted = ({
    followUser: { ok, error },
  }: {
    followUser: {
      ok: boolean;
      error: string;
    };
  }) => {
    if (ok) {
      setIsfollowing(true);
    } else {
      Alert.alert("사용자를 팔로우할 수 없습니다.");
    }
  };
  const [mutation, { loading }] = useMutation(FOLLOW, {
    onCompleted,
  });

  const theme = useContext<ThemeType>(ThemeContext);

  return (
    <Button
      style={
        isFollowing
          ? { borderWidth: pixelScaler(1) }
          : { backgroundColor: theme.themeBackground }
      }
      onPress={() =>
        mutation({
          variables: {
            targetId: user.id,
          },
        })
      }
    >
      <BldText13 style={isFollowing ? {} : { color: theme.white }}>
        {isFollowing ? "팔로잉" : "팔로우"}
      </BldText13>
    </Button>
  );
};

const Notification = () => {
  const { data, refetch } = useQuery(GET_NOTIFICATIONS);
  const [notifications, setNotifications] = useState<any[]>();

  const [refreshing, setRefreshing] = useState(false);

  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const d = new Date();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldText16>알림</BldText16>,
    });
    AsyncStorage.setItem("check_notification", d.valueOf() + "");
  }, []);

  navigation.addListener("focus", refetch);

  useEffect(() => {
    if (data?.getMyActivityLogs?.ok) {
      var tmp = [
        ...(data?.getMyActivityLogs?.followLogs ?? []),
        ...(data?.getMyActivityLogs?.editFolderLogs ?? []),
        ...(data?.getMyActivityLogs?.likeLogs ?? []),
      ];
      // console.log(a.map((b) => b.createdAt));
      // tmp = tmp.map((s) => s.createdAt);
      // console.log();
      setNotifications(
        tmp.sort((a, b) => -Number(a.createdAt) + Number(b.createdAt))
      );
      // console.log(data?.getMyActivityLogs);
    }
  }, [data]);

  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <ScreenContainer
      style={{
        paddingHorizontal: pixelScaler(30),
      }}
    >
      <FlatList
        refreshing={refreshing}
        onRefresh={refresh}
        data={notifications}
        keyExtractor={(item) => item.__typename + item.id}
        renderItem={({ item }) => (
          <ItemContainer>
            <TouchableOpacity
              onPress={() =>
                navigation.push("Profile", { user: item.requestUser })
              }
            >
              <Image
                source={{
                  uri: item?.requestUser?.profileImageUrl ?? BLANK_IMAGE,
                }}
                style={{
                  width: pixelScaler(32),
                  height: pixelScaler(32),
                  borderRadius: pixelScaler(32),
                  marginRight: pixelScaler(15),
                }}
              />
            </TouchableOpacity>
            {item?.__typename === "FollowLog" ? (
              <ContentContainer>
                <RegText13
                  style={{
                    width: pixelScaler(155),
                    lineHeight: pixelScaler(17),
                  }}
                >
                  <BldText13>{item?.requestUser?.username}</BldText13>님이{" "}
                  {item?.target?.title} 회원님을 팔로우하였습니다.
                </RegText13>
                <FollowButton user={item.requestUser} />
              </ContentContainer>
            ) : item?.__typename === "EditFolderLog" ? (
              <ContentContainer>
                <RegText13
                  style={{
                    lineHeight: pixelScaler(17),
                  }}
                >
                  <BldText13>{item?.requestUser?.username}</BldText13>님이{" "}
                  {item?.target?.title} 폴더를 수정하였습니다.
                </RegText13>
              </ContentContainer>
            ) : item?.__typename === "LikeLog" ? (
              <ContentContainer>
                <RegText13
                  style={{
                    width: pixelScaler(212),
                    lineHeight: pixelScaler(17),
                  }}
                >
                  <BldText13>{item?.requestUser?.username}</BldText13>님이{" "}
                  회원님의 게시물을 좋아합니다.
                </RegText13>
                <Image
                  source={{ uri: item?.target?.imageUrls[0] }}
                  style={{
                    position: "absolute",
                    right: 0,
                    width: pixelScaler(45),
                    height: pixelScaler(45),
                    borderRadius: pixelScaler(10),
                  }}
                />
              </ContentContainer>
            ) : null}
          </ItemContainer>
        )}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
};

export default Notification;
