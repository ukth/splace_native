import { useLazyQuery, useQuery } from "@apollo/client";
// import { RouteProp } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { Alert, FlatList, Share, Text, View } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { CardBox } from "../../components/CardRowBox";
import Image from "../../components/Image";
import ScreenContainer from "../../components/ScreenContainer";
import {
  BldText13,
  RegText16,
  BldText20,
  RegText13,
  RegText20,
} from "../../components/Text";
import {
  BLOCK,
  FOLLOW,
  GET_MOMENTS,
  GET_PROFILE,
  GET_USER_LOGS,
  GET_USER_SERIES,
  UNFOLLOW,
} from "../../queries";
import {
  MomentType,
  PhotologType,
  SeriesType,
  StackGeneratorParamList,
  ThemeType,
  UserType,
} from "../../types";
import { BLANK_IMAGE, convertNumber, pixelScaler } from "../../utils";
import * as Linking from "expo-linking";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { gql, useMutation } from "@apollo/client";
import { LinearGradient } from "expo-linear-gradient";
import BottomSheetModal from "../../components/BottomSheetModal";
import ModalButtonBox from "../../components/ModalButtonBox";
import { Ionicons } from "@expo/vector-icons";
import { HeaderRightMenu } from "../../components/HeaderRightMenu";

const UpperContainer = styled.View`
  margin-bottom: ${pixelScaler(3)}px;
`;

const ProfileBanner = styled.View`
  position: absolute;
  width: 100%;
  height: 125px;
  z-index: 0;
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

const ButtonsContainer = styled.View`
  flex-direction: row;
  height: ${pixelScaler(35)}px;
  justify-content: center;
  padding: 0 ${pixelScaler(25)}px;
  margin-bottom: ${pixelScaler(7)}px;
`;

const Button = styled.TouchableOpacity`
  flex: 1;
  margin-right: ${pixelScaler(5)}px;
  margin-left: ${pixelScaler(5)}px;
  height: ${pixelScaler(35)}px;
  border-radius: ${pixelScaler(10)}px;
  border-width: ${pixelScaler(1)}px;
  align-items: center;
  justify-content: center;
`;

const TabViewContainer = styled.View`
  flex-direction: row;
  height: ${pixelScaler(60)}px;
  justify-content: center;
  border-bottom-width: ${pixelScaler(0.6)}px;
  border-bottom-color: ${({ theme }: { theme: ThemeType }) =>
    theme.profileTabBarBorderBottom};
`;

const Tab = styled.TouchableOpacity`
  flex: 1;
  margin-left: ${pixelScaler(30)}px;
  margin-right: ${pixelScaler(30)}px;
  align-items: center;
  justify-content: center;
  border-bottom-width: ${pixelScaler(1.7)}px;
  border-bottom-color: ${({
    isFocused,
    theme,
  }: {
    isFocused: boolean;
    theme: ThemeType;
  }) => (isFocused ? theme.profileFocusedTabBorderBottom : theme.background)};
`;

const ProfileMessageContainer = styled.View`
  align-items: center;
  margin-bottom: ${pixelScaler(30)}px;
`;

const BlankContainer = styled.View`
  height: ${pixelScaler(150)}px;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const ProfileInfo = ({
  user,
  tabViewIndex,
  setTabViewIndex,
  refetchProfile,
}: {
  user: UserType;
  tabViewIndex: number;
  setTabViewIndex: (_: 0 | 1 | 2) => void;
  refetchProfile: () => void;
}) => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const theme = useContext<ThemeType>(ThemeContext);

  const onFollowCompleted = ({
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
      refetchProfile();
    } else {
      Alert.alert("팔로우에 실패하였습니다.");
    }
  };

  const onUnfollowCompleted = ({
    unfollowUser: { ok, error },
  }: {
    unfollowUser: {
      ok: boolean;
      error: string;
    };
  }) => {
    if (ok) {
      refetchProfile();
      console.log("refetch!");
    } else {
      Alert.alert("팔로우에 실패하였습니다.");
    }
  };

  const [followMutation, { loading: followLoading }] = useMutation(FOLLOW, {
    onCompleted: onFollowCompleted,
  });

  const [unfollowMutation, { loading: unfollowLoading }] = useMutation(
    UNFOLLOW,
    {
      onCompleted: onUnfollowCompleted,
    }
  );

  return (
    <UpperContainer>
      <ProfileBanner />
      <NameContainer>
        <BldText13>{user.name}</BldText13>
      </NameContainer>
      <ProfileImageContainer>
        <Image
          source={{
            uri: user.profileImageUrl ?? "https://i.stack.imgur.com/mwFzF.png",
          }}
          style={{
            width: pixelScaler(105),
            height: pixelScaler(105),
            borderRadius: pixelScaler(100),
          }}
        />
      </ProfileImageContainer>
      <CountsContainer>
        <TouchableOpacity
          onPress={() => {
            navigation.push("ProfileUsers", { type: "followers", user });
          }}
        >
          <CountButton count={user.totalFollowers ?? 0} text="팔로워" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.push("ProfileUsers", { type: "followings", user });
          }}
        >
          <CountButton count={user.totalFollowing ?? 0} text="팔로잉" />
        </TouchableOpacity>
        <CountButton count={user.totalLogsNumber ?? 0} text="로그" />
      </CountsContainer>
      {user.profileMessage || user.url ? (
        <ProfileMessageContainer>
          {user.profileMessage ? (
            <RegText13 style={{ width: pixelScaler(315), textAlign: "center" }}>
              {user.profileMessage}
            </RegText13>
          ) : null}
          {user.url ? (
            <RegText13
              onPress={() =>
                Linking.openURL(
                  user.url?.startsWith("http")
                    ? user.url
                    : "https://" + user.url
                )
              }
              style={{ color: theme.profileLink }}
            >
              {user.url}
            </RegText13>
          ) : null}
        </ProfileMessageContainer>
      ) : null}
      <ButtonsContainer>
        <Button
          onPress={() => {
            if (user.isMe) {
              navigation.push("Chatrooms");
            } else {
            }
          }}
        >
          <RegText13>메세지</RegText13>
        </Button>

        {!user.isMe &&
          user.isFollowing !== undefined &&
          (user.isFollowing ? (
            <Button
              onPress={() => {
                Alert.alert(
                  "Unfollow",
                  "팔로우를 취소하시겠습니까?",
                  [
                    {
                      text: "취소",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "확인",
                      onPress: () =>
                        unfollowMutation({
                          variables: {
                            targetId: user.id,
                          },
                        }),
                    },
                  ],
                  { cancelable: false }
                );
              }}
            >
              <RegText13>팔로잉</RegText13>
            </Button>
          ) : (
            <Button
              style={{ borderWidth: 0, backgroundColor: theme.followButton }}
              onPress={() =>
                followMutation({
                  variables: {
                    targetId: user.id,
                  },
                })
              }
            >
              <RegText13
                style={{
                  color: theme.followButtonText,
                }}
              >
                팔로우
              </RegText13>
            </Button>
          ))}
      </ButtonsContainer>
      <TabViewContainer>
        <Tab onPress={() => setTabViewIndex(0)} isFocused={tabViewIndex === 0}>
          <RegText16>게시물</RegText16>
        </Tab>
        <Tab onPress={() => setTabViewIndex(1)} isFocused={tabViewIndex === 1}>
          <RegText16>시리즈</RegText16>
        </Tab>
        {user.isMe ? (
          <Tab
            onPress={() => setTabViewIndex(2)}
            isFocused={tabViewIndex === 2}
          >
            <RegText16>모먼트</RegText16>
          </Tab>
        ) : null}
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

const Profile = () => {
  const route = useRoute<RouteProp<StackGeneratorParamList, "Profile">>();
  const [user, setUser] = useState<UserType>(route.params.user);
  const [tabViewIndex, setTabViewIndex] = useState<0 | 1 | 2>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const theme = useContext<ThemeType>(ThemeContext);

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          {user.isMe ? (
            <TouchableOpacity>
              <Ionicons name="notifications" size={20} />
            </TouchableOpacity>
          ) : null}
          <HeaderRightMenu onPress={() => setModalVisible(true)} />
        </View>
      ),
      title: user.username ?? "",
    });
    console.log("RENDERED!!");
  }, []);

  const onShare = async (id: number) => {
    try {
      const result = await Share.share({
        url: "https://splace.co.kr/share.php?type=Profile&id=" + id,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          setModalVisible(false);
        } else {
          Alert.alert("공유에 실패했습니다.");
        }
      } else if (result.action === Share.dismissedAction) {
        setModalVisible(false);
      }
    } catch (error) {
      alert(error);
    }
  };

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

  useEffect(() => {
    if (data?.seeProfile?.ok && data.seeProfile?.profile) {
      setUser(data.seeProfile?.profile);
    }
  }, [data]);

  const {
    data: logsData,
    refetch: refetchLogs,
    fetchMore: fetchMoreLogs,
  } = useQuery(GET_USER_LOGS, {
    variables: {
      userId: route.params.user.id,
    },
  });

  const {
    data: seriesData,
    refetch: refetchSereis,
    fetchMore: fetchMoreSereis,
  } = useQuery(GET_USER_SERIES, {
    variables: {
      userId: route.params.user.id,
    },
  });

  // console.log(seriesData, route.params.user.id);

  const {
    data: momentData,
    refetch: refetchMoment,
    fetchMore: fetchMoreMoment,
  } = useQuery(GET_MOMENTS);

  const onBlockCompleted = (data: any) => {
    console.log(data);
    if (data?.blockUser?.ok) {
      Alert.alert(
        "사용자를 차단하였습니다.\n메인피드에서 해당 사용자의 게시물이 더 이상 보이지 않습니다."
      );
    } else {
      Alert.alert("사용자를 차단할 수 없습니다.");
    }
    setModalVisible(false);
  };

  const [mutation, _] = useMutation(BLOCK, { onCompleted: onBlockCompleted });

  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const updateData = async () => {
    await refetchProfile();
    await refetchLogs();
    await refetchSereis();
    await refetchMoment();
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

  const renderLogs = ({
    item,
    index,
  }: {
    item: PhotologType;
    index: number;
  }) => (
    <CardBox
      url={item.imageUrls[0]}
      onPress={() => {
        navigation.push("UserLogs", {
          user,
          initialScrollIndex: index,
          data: logsData,
          refetch: refetchLogs,
          fetchMore: fetchMoreLogs,
        });
      }}
    />
  );

  const renderSeries = ({
    item,
    index,
  }: {
    item: SeriesType;
    index: number;
  }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.push("Series", {
            id: item.id,
          });
        }}
      >
        <BldText13
          style={{
            position: "absolute",
            zIndex: 1,
            left: pixelScaler(15),
            top: pixelScaler(15),
            color: theme.white,
          }}
        >
          {item.title} ({item.seriesElements.length})
        </BldText13>
        <LinearGradient
          // Background Linear Gradient
          colors={["rgba(0,0,0,0.2)", "transparent"]}
          style={{
            top: 0,
            position: "absolute",
            height: pixelScaler(40),
            width: pixelScaler(186),
            zIndex: 3,
          }}
        />
        <Image
          source={{
            uri: item.seriesElements[0]?.photolog.imageUrls[0] ?? BLANK_IMAGE,
          }}
          style={{
            width: pixelScaler(186),
            height: pixelScaler(186),
            marginRight: pixelScaler(3),
            marginBottom: pixelScaler(3),
          }}
        />
      </TouchableOpacity>
    );
  };

  const renderMoments = ({
    moments,
    index,
  }: {
    moments: MomentType[];
    index: number;
  }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.push("MomentView", {
            moments,
            index,
          });
        }}
      >
        <Image
          source={{
            uri: moments[index].videoUrl ?? BLANK_IMAGE,
          }}
          style={{
            width: pixelScaler(186),
            height: pixelScaler(186),
            marginRight: pixelScaler(3),
            marginBottom: pixelScaler(3),
          }}
        />
      </TouchableOpacity>
    );
  };

  const [listData, setListData] = useState<any>([[], [], []]);
  useEffect(() => {
    setListData([
      logsData?.getUserLogs?.logs,
      seriesData?.getUserSeries?.series,
      momentData?.getMyMoments?.moments,
    ]);
  }, [logsData, seriesData, momentData]);

  return (
    <ScreenContainer>
      <FlatList
        key={tabViewIndex === 2 ? "moment" : "else"}
        ListHeaderComponent={
          <ProfileInfo
            user={user}
            tabViewIndex={tabViewIndex}
            setTabViewIndex={setTabViewIndex}
            refetchProfile={refetchProfile}
          />
        }
        numColumns={tabViewIndex === 2 ? 3 : 2}
        data={listData[tabViewIndex]}
        keyExtractor={(item, index) => "" + index}
        renderItem={({ item, index }) => {
          if (tabViewIndex === 0) {
            return renderLogs({ item, index });
          } else if (tabViewIndex === 1) {
            return renderSeries({ item, index });
          }
          return renderMoments({
            moments: momentData?.getMyMoments?.moments,
            index,
          });
        }}
        refreshing={refreshing}
        onRefresh={refresh}
        onEndReached={async () => {
          if (tabViewIndex === 0) {
            await fetchMoreLogs({
              variables: {
                lastId:
                  listData[tabViewIndex][listData[tabViewIndex].length - 1].id,
                userId: user.id,
              },
            });
          } else if (tabViewIndex === 1) {
            await fetchMoreSereis({
              variables: {
                lastId:
                  listData[tabViewIndex][listData[tabViewIndex].length - 1].id,
                userId: user.id,
              },
            });
          } else if (tabViewIndex === 2) {
            await fetchMoreMoment({
              variables: {
                lastId:
                  listData[tabViewIndex][listData[tabViewIndex].length - 1].id,
                userId: user.id,
              },
            });
          }
        }}
        ListFooterComponent={() => {
          return listData[tabViewIndex]?.length == 0 ? (
            <BlankContainer>
              <RegText16>
                등록된{" "}
                {tabViewIndex === 0
                  ? "게시물이 "
                  : tabViewIndex === 1
                  ? "시리즈가 "
                  : "모먼트가 "}
                없습니다.
              </RegText16>
            </BlankContainer>
          ) : null;
        }}
      />
      {user.isMe ? (
        <BottomSheetModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          style={{
            borderTopLeftRadius: pixelScaler(20),
            borderTopRightRadius: pixelScaler(20),
            paddingBottom: pixelScaler(44),
          }}
        >
          <ModalButtonBox
            onPress={() => {
              setModalVisible(false);
              navigation.push("EditProfile", { me: user });
            }}
          >
            <RegText20>프로필 편집</RegText20>
          </ModalButtonBox>
          <ModalButtonBox>
            <RegText20>스크랩한 게시물</RegText20>
          </ModalButtonBox>
          <ModalButtonBox
            style={{ marginBottom: pixelScaler(30) }}
            onPress={() => {
              setModalVisible(false);
              navigation.push("MySplaces");
            }}
          >
            <RegText20>등록된 공간 관리</RegText20>
          </ModalButtonBox>
          <ModalButtonBox>
            <RegText20>프로필 공유</RegText20>
          </ModalButtonBox>
          <ModalButtonBox
            onPress={() => {
              setModalVisible(false);
              navigation.push("Setting");
            }}
          >
            <RegText20>설정</RegText20>
          </ModalButtonBox>
        </BottomSheetModal>
      ) : (
        <BottomSheetModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          style={{
            borderTopLeftRadius: pixelScaler(20),
            borderTopRightRadius: pixelScaler(20),
            paddingBottom: pixelScaler(44),
          }}
        >
          <ModalButtonBox
            style={{ marginBottom: pixelScaler(30) }}
            onPress={() => onShare(user.id)}
          >
            <RegText20>프로필 공유</RegText20>
          </ModalButtonBox>
          <ModalButtonBox
            onPress={() => mutation({ variables: { targetId: user.id } })}
          >
            <RegText20 style={{ color: theme.modalButtonRedText }}>
              차단
            </RegText20>
          </ModalButtonBox>
          <ModalButtonBox
            onPress={() => {
              navigation.push("Report", { type: "user", id: user.id });
            }}
          >
            <RegText20 style={{ color: theme.modalButtonRedText }}>
              신고
            </RegText20>
          </ModalButtonBox>
        </BottomSheetModal>
      )}
    </ScreenContainer>
  );
};

export default Profile;
