import React, { useState, useEffect, useRef, useContext } from "react";
import { Alert, FlatList, useWindowDimensions } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../../components/ScreenContainer";
import { useMutation, useQuery } from "@apollo/client";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackGeneratorParamList, ThemeType, UserType } from "../../types";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import { pixelScaler } from "../../utils";
import { BldText16, RegText13, RegText16 } from "../../components/Text";
import { GET_BLOCKED_USER, UNBLOCK } from "../../queries";
import {
  InfoContainer,
  MemberContainer,
  MemberThumbnail,
  TitleContainer,
} from "../../components/Members/StyledComponents";
import Image from "../../components/Image";
import { BLANK_PROFILE_IMAGE } from "../../constants";
import { ThemeContext } from "styled-components/native";

const BlockedUsers = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const theme = useContext<ThemeType>(ThemeContext);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldText16>차단된 계정</BldText16>,
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
    });
  }, []);
  const { data, refetch } = useQuery(GET_BLOCKED_USER);

  const onUnblockCompleted = (data: any) => {
    if (data?.unblockUser?.ok) {
      Alert.alert("차단이 해제되었습니다.");
    } else {
      Alert.alert("차단을 풀 수 없습니다.");
    }
    refetch();
  };

  const [mutation, _] = useMutation(UNBLOCK, {
    onCompleted: onUnblockCompleted,
  });

  navigation.addListener("focus", refetch);

  return (
    <ScreenContainer style={{ alignItems: "center", justifyContent: "center" }}>
      {data?.getMyBlockedUser?.users?.length > 0 ? (
        <FlatList
          data={data?.getMyBlockedUser?.users}
          keyExtractor={(user) => "" + user.id}
          renderItem={({ item: user }: { item: any }) => (
            <MemberContainer
              onPress={() =>
                Alert.alert(
                  "",
                  user.username + "님을\n차단 해제하시겠습니까?",
                  [
                    {
                      text: "취소",
                      style: "cancel",
                    },
                    {
                      text: "확인",
                      onPress: async () =>
                        await mutation({ variables: { targetId: user.id } }),
                    },
                  ]
                )
              }
            >
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
                  <BldText16>{user.username}</BldText16>
                  {user.name && user.name !== "" ? (
                    <RegText13>{user.name}</RegText13>
                  ) : null}
                </TitleContainer>
              </InfoContainer>
            </MemberContainer>
          )}
        />
      ) : (
        <BldText16>차단한 계정이 없습니다.</BldText16>
      )}
    </ScreenContainer>
  );
};

export default BlockedUsers;
