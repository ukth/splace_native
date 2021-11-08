import React, { useState, useEffect, useRef } from "react";
import { Alert, FlatList, useWindowDimensions } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../../components/ScreenContainer";
import { useMutation, useQuery } from "@apollo/client";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackGeneratorParamList, UserType } from "../../types";
import { RegTextInput13 } from "../../components/TextInput";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import styled from "styled-components/native";
import { pixelScaler } from "../../utils";
import { BldText16, RegText13, RegText16 } from "../../components/Text";
import { Ionicons } from "@expo/vector-icons";
import { View } from "../../components/Themed";
import { logUserOut } from "../../apollo";
import { GET_BLOCKED_USER, UNBLOCK } from "../../queries";
import {
  InfoContainer,
  MemberContainer,
  MemberThumbnail,
  TitleContainer,
} from "../../components/Members/StyledComponents";
import Image from "../../components/Image";

const BlockedUsers = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

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
                      uri: user.profileImageUrl ?? "",
                    }}
                    style={{
                      width: pixelScaler(32),
                      height: pixelScaler(32),
                      borderRadius: pixelScaler(32),
                    }}
                  />
                </MemberThumbnail>
                <TitleContainer>
                  <BldText16>{user.username}</BldText16>
                  <RegText13>{user.name}</RegText13>
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
