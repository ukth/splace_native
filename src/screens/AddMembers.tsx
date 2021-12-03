import { useMutation, useQuery, useSubscription, gql } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";

import React, { useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled, { ThemeContext } from "styled-components/native";
import { Icon } from "../components/Icon";
import Image from "../components/Image";
import ScreenContainer from "../components/ScreenContainer";
import { BldText16, RegText13 } from "../components/Text";
import { BldTextInput16 } from "../components/TextInput";
import { BLANK_PROFILE_IMAGE } from "../constants";
import useMe from "../hooks/useMe";
import { GET_FOLLOWERS } from "../queries";
import {
  RoomType,
  StackGeneratorParamList,
  ThemeType,
  UserType,
} from "../types";
import { pixelScaler } from "../utils";

const MemberContainer = styled.View`
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

const SelectButton = styled.View`
  position: absolute;
  right: 0;
  width: ${pixelScaler(30)}px;
  height: ${pixelScaler(30)}px;
  border-radius: ${pixelScaler(30)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.chatInviteSelect};
  align-items: center;
  justify-content: center;
`;

const Selected = styled.View`
  width: ${pixelScaler(18)}px;
  height: ${pixelScaler(18)}px;
  border-radius: ${pixelScaler(18)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.chatInviteSelected};
`;

const Seperator = () => {
  const theme = useContext<ThemeType>(ThemeContext);
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

const ChatMemberComponent = ({
  user,
  userList,
  setUserList,
  roomMemberIds,
}: {
  user: UserType;
  userList: number[];
  setUserList: (users: number[]) => void;
  roomMemberIds: number[];
}) => {
  const theme = useContext<ThemeType>(ThemeContext);
  const navigation = useNavigation<any>();

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (!roomMemberIds.includes(user.id)) {
          if (userList.includes(user.id)) {
            setUserList(userList.filter((id) => id !== user.id));
          } else {
            setUserList([...userList, user.id]);
          }
        }
      }}
    >
      <MemberContainer>
        <InfoContainer>
          <MemberThumbnail>
            <Image
              source={{
                uri: user.profileImageUrl ?? BLANK_PROFILE_IMAGE,
              }}
              style={{
                width: pixelScaler(32),
                height: pixelScaler(32),
                borderRadius: pixelScaler(32),
                borderWidth: pixelScaler(0.4),
                borderColor: theme.imageBorder,
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
          {!roomMemberIds.includes(user.id) ? (
            <SelectButton>
              {userList.includes(user.id) ? <Selected /> : null}
            </SelectButton>
          ) : null}
        </InfoContainer>
      </MemberContainer>
    </TouchableWithoutFeedback>
  );
};

const FollowerSearchEntry = styled.View`
  height: ${pixelScaler(40)}px;
  margin-left: ${pixelScaler(30)}px;
  margin-right: ${pixelScaler(30)}px;
  margin-top: ${pixelScaler(15)}px;
  margin-bottom: ${pixelScaler(15)}px;
  background-color: ${({ theme }: { theme: ThemeType }) => theme.entry};
  border-radius: ${pixelScaler(10)}px;
  flex-direction: row;
  align-items: center;
`;

const AddMembers = ({
  navigation,
  route,
}: {
  navigation: StackNavigationProp<StackGeneratorParamList>;
  route: RouteProp<StackGeneratorParamList, "AddMembers">;
}) => {
  const theme = useContext<ThemeType>(ThemeContext);
  const me = useMe();
  const [keyword, setKeyword] = useState<string>("");
  const listRef = useRef<any>();
  const [userList, setUserList] = useState<number[]>([]);
  // console.log(me);

  const { vars, members, inviteMutation } = route.params;

  const { data, loading, refetch, fetchMore } = useQuery(GET_FOLLOWERS, {
    variables: { userId: me.id, keyword },
  });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldText16>초대하기</BldText16>,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            if (!loading && userList.length !== 0) {
              inviteMutation({
                variables: {
                  ...vars,
                  memberIds: userList,
                },
              });
            }
          }}
        >
          <BldText16
            style={{
              marginRight: pixelScaler(25),
              color: theme.chatInviteConfirmText,
            }}
          >
            초대({userList.length})
          </BldText16>
        </TouchableOpacity>
      ),
    });
  }, [userList]);

  useEffect(() => {
    refetch({
      userId: me.id,
      keyword,
    });

    if (listRef.current) {
      listRef.current.scrollToOffset({ animated: false, offset: 0 });
    }
  }, [keyword]);

  return (
    <ScreenContainer>
      <FollowerSearchEntry>
        <Icon
          name="search_grey"
          style={{
            width: pixelScaler(20),
            height: pixelScaler(20),
            marginLeft: pixelScaler(15),
            marginRight: pixelScaler(5),
          }}
        />
        <BldTextInput16
          onChangeText={(text) => {
            setKeyword(text);
          }}
          autoCapitalize={"none"}
        />
      </FollowerSearchEntry>
      {loading ? null : (
        <FlatList
          ref={listRef}
          data={data?.seeFollowers?.followers}
          keyExtractor={(item) => "" + item?.id}
          renderItem={({ item }) => (
            <ChatMemberComponent
              user={item}
              userList={userList}
              setUserList={setUserList}
              roomMemberIds={members.map((user) => user.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => <View></View>}
          ItemSeparatorComponent={() => <Seperator />}
          ListFooterComponent={() => <View></View>}
          onEndReached={async () => {
            await fetchMore({
              variables: {
                userId: me.id,
                lastId:
                  data?.seeFollowers?.followers[
                    data?.seeFollowers?.followers?.length - 1
                  ].id,
                ...(keyword !== "" ? { keyword } : {}),
              },
            });
          }}
          onEndReachedThreshold={0.3}
        />
      )}
    </ScreenContainer>
  );
};

export default AddMembers;
