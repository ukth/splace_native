import { useLazyQuery, useQuery } from "@apollo/client";
// import { RouteProp } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { CardBox } from "../components/CardRowBox";
import Image from "../components/Image";
import ScreenContainer from "../components/ScreenContainer";
import {
  BldText13,
  BldText20,
  RegText13,
  RegText16,
  RegText20,
} from "../components/Text";
import { GET_PROFILE, GET_USER_LOGS } from "../queries";
import {
  PhotologType,
  StackGeneratorParamList,
  themeType,
  UserType,
} from "../types";
import { pixelScaler } from "../utils";
import * as Linking from "expo-linking";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";

const UpperContainer = styled.View`
  margin-bottom: ${pixelScaler(3)}px;
`;

const ProfileBanner = styled.View`
  position: absolute;
  width: 100%;
  height: 125px;
  z-index: 0;
  background-color: #a0d0f0;
`;

const NameContainer = styled.View`
  height: ${pixelScaler(45)}px;
  align-items: center;
  justify-content: center;
`;

const ProfileImageContainer = styled.View`
  height: ${pixelScaler(105)}px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${pixelScaler(20)}px;
`;

const CountsContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: ${pixelScaler(30)}px;
`;

const CountButtonContainer = styled.View`
  margin-right: ${pixelScaler(36)}px;
  margin-left: ${pixelScaler(36)}px;
  align-items: center;
`;

const ButtonsContainer = styled.TouchableOpacity`
  flex-direction: row;
  height: ${pixelScaler(35)}px;
  justify-content: center;
  background-color: #90a0d0;
`;

const TabViewContainer = styled.View`
  flex-direction: row;
  height: ${pixelScaler(60)}px;
  justify-content: center;
`;

const Tab = styled.TouchableOpacity`
  flex: 1;
  margin-left: ${pixelScaler(30)}px;
  margin-right: ${pixelScaler(30)}px;
  align-items: center;
  background-color: #f0e0d0;
  border-bottom-width: ${({ isFocused }: { isFocused: boolean }) =>
    isFocused ? 2 : 0}px;
`;

const ProfileMessageContainer = styled.View`
  align-items: center;
  margin-bottom: ${pixelScaler(30)}px;
`;

const ProfileInfo = ({
  user,
  tabViewIndex,
  setTabViewIndex,
}: {
  user: UserType;
  tabViewIndex: number;
  setTabViewIndex: (_: number) => void;
}) => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  useEffect(() => {
    navigation.setOptions({
      title: user.username,
    });
  }, []);

  const theme = useContext<themeType>(ThemeContext);

  return (
    <UpperContainer>
      <ProfileBanner />
      <NameContainer>
        <BldText13>{user.name}</BldText13>
      </NameContainer>
      <ProfileImageContainer>
        <Image
          source={{ uri: user.profileImageUrl }}
          style={{
            width: pixelScaler(105),
            height: pixelScaler(105),
            borderRadius: pixelScaler(100),
          }}
        />
      </ProfileImageContainer>
      <CountsContainer>
        <TouchableOpacity onPress={() => {}}>
          <CountButton count={user.totalFollowers} text="팔로워" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <CountButton count={user.totalFollowing} text="팔로잉" />
        </TouchableOpacity>
        <CountButton count={user.totalLogsNumber} text="로그" />
      </CountsContainer>
      <ProfileMessageContainer>
        {user.profileMessage ? (
          <RegText13>{user.profileMessage}</RegText13>
        ) : null}
        {user.url ? (
          <RegText13
            onPress={() => Linking.openURL(user.url)}
            style={{ color: theme.profileLink }}
          >
            {user.url}
          </RegText13>
        ) : null}
      </ProfileMessageContainer>
      <ButtonsContainer></ButtonsContainer>
      <TabViewContainer>
        <Tab
          onPress={() => setTabViewIndex(0)}
          isFocused={tabViewIndex === 0}
        ></Tab>
        <Tab
          onPress={() => setTabViewIndex(1)}
          isFocused={tabViewIndex === 1}
        ></Tab>
        <Tab
          onPress={() => setTabViewIndex(2)}
          isFocused={tabViewIndex === 2}
        ></Tab>
      </TabViewContainer>
    </UpperContainer>
  );
};

const CountButton = ({ count, text }: { count: number; text: string }) => {
  return (
    <CountButtonContainer>
      <BldText20 style={{ marginBottom: pixelScaler(3) }}>{count}</BldText20>
      <RegText13>{text}</RegText13>
    </CountButtonContainer>
  );
};

const Profile = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "Profile">;
}) => {
  const [user, setUser] = useState<UserType>(route.params.user);
  const [tabViewIndex, setTabViewIndex] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const myProfile = false;

  const onCompleted = (data: any) => {
    if (data?.seeProfile?.ok && data.seeProfile?.profile) {
      setUser(data.seeProfile?.profile);
    }
  };

  const {
    loading,
    error,
    data,
    refetch: refetchProfile,
  } = useQuery(GET_PROFILE, {
    variables: {
      userId: route.params.user.id,
    },
    onCompleted,
  });

  const {
    data: logsData,
    refetch: refetchLogs,
    fetchMore,
  } = useQuery(GET_USER_LOGS, {
    variables: {
      userId: route.params.user.id,
    },
  });

  const updateData = async () => {
    const { data } = await refetchProfile();
    if (data?.seeProfile?.ok && data.seeProfile?.profile) {
      setUser(data.seeProfile?.profile);
    }
    await refetchLogs();
  };

  const refresh = async () => {
    setRefreshing(true);
    const timer = setTimeout(() => {
      Alert.alert("요청시간 초과");
      setRefreshing(false);
    }, 10000);

    await updateData();
    clearTimeout(timer);
    setRefreshing(false);
  };

  return (
    <ScreenContainer>
      <FlatList
        ListHeaderComponent={
          <ProfileInfo
            user={user}
            tabViewIndex={tabViewIndex}
            setTabViewIndex={setTabViewIndex}
          />
        }
        numColumns={2}
        data={logsData?.getUserLogs?.logs}
        keyExtractor={(item, index) => "" + index}
        renderItem={({ item }: { item: PhotologType }) => (
          <CardBox url={item.imageUrls[0]} onPress={() => {}} />
        )}
        refreshing={refreshing}
        onRefresh={refresh}
        onEndReached={async () => {
          console.log("hello");
          await fetchMore({
            variables: {
              lastId:
                logsData?.getUserLogs?.logs[
                  logsData?.getUserLogs?.logs.length - 1
                ].id,
              userId: user.id,
            },
          });
        }}
      />
    </ScreenContainer>
  );
};

export default Profile;
