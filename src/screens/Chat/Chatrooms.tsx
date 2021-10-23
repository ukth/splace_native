import { useQuery, useSubscription, gql, useMutation } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import {
  getFocusedRouteNameFromRoute,
  useNavigation,
  useRoute,
} from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext, useEffect, useState } from "react";

import {
  Alert,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import client, { tokenVar, userIdVar } from "../../apollo";
import Image from "../../components/Image";
import ScreenContainer from "../../components/ScreenContainer";
import { BldText13, RegText13, RegText9 } from "../../components/Text";
import useMe from "../../hooks/useMe";
import { CREATE_ROOM, GET_ROOMS, ROOM_UPDATE } from "../../queries";
import {
  RoomType,
  StackGeneratorParamList,
  ThemeType,
  UserType,
} from "../../types";
import { pixelScaler } from "../../utils";

const RoomContainer = styled.TouchableOpacity`
  height: ${pixelScaler(75)}px;
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

const UnreadMark = styled.View`
  width: ${pixelScaler(12)}px;
  height: ${pixelScaler(12)}px;
  border-radius: ${pixelScaler(10)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.chatPreviewUnreadMark};
  position: absolute;
  right: 0px;
  top: 0px;
`;

const RoomItem = ({ room }: { room: RoomType }) => {
  const me = useMe();
  useEffect(() => {
    // console.log("chatrooms! idvar:", userIdVar());
  }, []);
  const navigation = useNavigation<any>();
  const theme = useContext<ThemeType>(ThemeContext);

  // console.log(room);

  let timeText = "";

  if (room.updatedAt) {
    const diff = new Date().getTime() - Number(room.updatedAt);

    if (diff < 60 * 60 * 1000) {
      const min = Math.floor(diff / 60000);
      timeText = min !== 0 ? min + "분 전" : "방금 전";
    } else {
      timeText = Math.floor(diff / (60 * 60000)) + "시간 전";
    }
  }

  const updated =
    room?.chatroomReaded?.filter((readed) => readed?.user?.id === me?.id)[0]
      ?.updatedAt < room?.updatedAt;
  // console.log(
  //   room?.chatroomReaded?.filter((readed) => readed?.user?.id === me?.id)[0]
  //     ?.updatedAt
  // );
  if (room?.id === 61) {
    // console.log(room);
  }

  let readed = false;
  if (room?.lastMessage) {
    // console.log("EWRHUQIU!");
    readed =
      room?.chatroomReaded?.filter((readed) => readed?.user?.id === me?.id)[0]
        ?.updatedAt > room?.lastMessage?.createdAt;
  } else {
    readed =
      room?.chatroomReaded?.filter((readed) => readed?.user?.id === me?.id)[0]
        ?.updatedAt > room?.updatedAt;
    // console.log(readed);
  }

  return (
    <RoomContainer
      onPress={() =>
        navigation.push("Chatroom", {
          room,
        })
      }
    >
      <InfoContainer>
        {room.members.length === 1 ? (
          <MemberThumbnail>
            <Image
              source={{
                uri: me.profileImageUrl,
              }}
              style={{
                width: pixelScaler(32),
                height: pixelScaler(32),
                borderRadius: pixelScaler(32),
              }}
            />
          </MemberThumbnail>
        ) : room.members.length === 2 ? (
          <MemberThumbnail>
            <Image
              source={{
                uri:
                  room.members.filter(
                    (member: UserType) => member.id !== me?.id
                  )[0].profileImageUrl ?? "",
              }}
              style={{
                width: pixelScaler(32),
                height: pixelScaler(32),
                borderRadius: pixelScaler(32),
              }}
            />
          </MemberThumbnail>
        ) : (
          <MemberThumbnail>
            <Image
              source={{
                uri:
                  room.members.filter(
                    (member: UserType) => member.id !== me?.id
                  )[0].profileImageUrl ?? "",
              }}
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                width: pixelScaler(26),
                height: pixelScaler(26),
                borderRadius: pixelScaler(26),
              }}
            />
            <Image
              source={{
                uri:
                  room.members.filter(
                    (member: UserType) => member.id !== me?.id
                  )[1].profileImageUrl ?? "",
              }}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: pixelScaler(26),
                height: pixelScaler(26),
                borderRadius: pixelScaler(26),
              }}
            />
          </MemberThumbnail>
        )}
        <TitleContainer>
          <BldText13 style={{ width: pixelScaler(200) }} numberOfLines={1}>
            {room.title !== ""
              ? room.title
              : room.members.map((member) => member.username).join(", ")}
          </BldText13>
          <RegText13
            style={{
              color: readed ? theme.chatPreviewTextRead : "#000000",
            }}
            numberOfLines={1}
          >
            {room?.lastMessage?.text ?? "채팅방이 생성되었습니다."}
          </RegText13>
        </TitleContainer>
        {updated ? <UnreadMark /> : null}
        <RegText9
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            color: theme.chatPreviewTimeText,
          }}
        >
          {timeText}
        </RegText9>
      </InfoContainer>
    </RoomContainer>
  );
};

const Chatrooms = () => {
  const { data, loading, fetchMore, refetch } = useQuery(GET_ROOMS);

  const { data: updatedRoomData, loading: roomUpdateLoading } =
    useSubscription(ROOM_UPDATE);

  const me = useMe();

  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  navigation.addListener("focus", () => {
    refetch();
    // console.log(data2, data4, "$$$$$$$$");
  });

  useEffect(() => {
    refetch();
  }, [updatedRoomData]);

  const onCreateComplete = (data: {
    createChatroom: {
      ok: boolean;
      error: string;
    };
  }) => {
    const {
      createChatroom: { ok, error },
    } = data;
    console.log(data);
    if (ok) {
      // navigation.push();
    } else {
      Alert.alert("채팅방을 생성할 수 없습니다.");
    }
  };

  const [createMutation, { loading: createMutationLoading }] = useMutation(
    CREATE_ROOM,
    {
      onCompleted: onCreateComplete,
    }
  );

  console.log(me);
  useEffect(() => console.log(me), [me]);
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            createMutation({
              variables: {
                title: "",
                memberIds: [me.id],
                isPersonal: false,
              },
            })
          }
        >
          <Ionicons name="md-person-add-outline" size={30} />
        </TouchableOpacity>
      ),
    });
  }, []);

  const [refreshing, setRefreshing] = useState(false);

  const theme = useContext<ThemeType>(ThemeContext);

  const renderItem = ({ item: room }: { item: RoomType }) => (
    <RoomItem room={room} />
  );

  // const route = useRoute();

  const refresh = async () => {
    setRefreshing(true);
    const timer = setTimeout(() => {
      Alert.alert("요청시간 초과");
      setRefreshing(false);
    }, 10000);
    await refetch();
    clearTimeout(timer);
    setRefreshing(false);
  };

  return (
    <ScreenContainer>
      <FlatList
        data={data?.getMyRooms?.myRooms}
        refreshing={refreshing}
        keyExtractor={(item) => "" + item.id}
        onEndReached={async () => {
          await fetchMore({
            variables: {
              lastId:
                data?.getMyRooms?.myRooms[
                  (data.getMyRooms?.myRooms?.length ?? 1) - 1
                ].id,
            },
          });
        }}
        onRefresh={refresh}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View
            style={{
              marginHorizontal: pixelScaler(30),
              backgroundColor: theme.chatRoomItemBorder,
              height: pixelScaler(0.6),
            }}
          />
        )}
      />
    </ScreenContainer>
  );
};

export default Chatrooms;
