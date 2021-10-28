import { useMutation, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import {
  Alert,
  FlatList,
  Image as DefaultImage,
  ScrollView,
  Share,
  TouchableOpacity,
  View,
} from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import BottomSheetModal from "../../components/BottomSheetModal";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import { HeaderRightMenu } from "../../components/HeaderRightMenu";
import Image from "../../components/Image";
import ModalButtonBox from "../../components/ModalButtonBox";
import ScreenContainer from "../../components/ScreenContainer";
import {
  BldText16,
  BldText20,
  BldText33,
  RegText13,
  RegText20,
} from "../../components/Text";
import { GET_LOGS_BY_SPLACE, GET_SPLACE_INFO, REPORT } from "../../queries";
import {
  PhotologType,
  StackGeneratorParamList,
  ThemeType,
  TimeSetType,
  UserType,
} from "../../types";
import {
  convertNumber,
  coords2address,
  dayNameKor,
  formatOperatingTime,
  formatPhoneString,
  pixelScaler,
  priceToText,
} from "../../utils";
import ModalMapView from "../../components/ModalMapView";
import * as Linking from "expo-linking";
import useMe from "../../hooks/useMe";
import { Icons } from "../../icons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { theme } from "../../../theme";
import { ProgressContext } from "../../contexts/Progress";

const ListHeaderContainer = styled.View``;
const UpperContainer = styled.View`
  padding-top: ${pixelScaler(30)}px;
  padding-left: ${pixelScaler(30)}px;
  padding-right: ${pixelScaler(30)}px;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${pixelScaler(30)}px;
`;

const ButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${pixelScaler(30)}px;
`;

const UnfoldButtonContainer = styled.TouchableOpacity`
  position: absolute;
  /* bottom: 0px; */
  bottom: ${pixelScaler(15)}px;
  right: 0px;
`;

const Button = styled.TouchableOpacity`
  width: ${({ width }: { width: number }) => width}px;
  border-width: ${pixelScaler(1.1)}px;
  border-radius: ${pixelScaler(10)}px;
  height: ${pixelScaler(35)}px;
  justify-content: center;
  align-items: center;
`;

const TextContainer = styled.View``;

const TagsContainer = styled.View`
  flex-direction: row;
  margin-top: ${pixelScaler(10)}px;
  margin-bottom: ${pixelScaler(30)}px;
  flex-wrap: wrap;
`;

const Tag = styled.View`
  height: ${pixelScaler(20)}px;
  align-items: center;
  justify-content: center;
  padding: 0 ${pixelScaler(10)}px;
  border-radius: ${pixelScaler(15)}px;
  border-width: ${pixelScaler(0.67)}px;
  border-color: ${({ theme, color }: { theme: ThemeType; color?: string }) =>
    color ?? theme.text};
  margin-right: ${pixelScaler(10)}px;
  margin-bottom: ${pixelScaler(10)}px;
`;

const ContentHeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${pixelScaler(30)}px;
`;

const SortButtonContainer = styled.TouchableOpacity`
  flex-direction: row;
`;

const operatingTimeToString = (timeSet: TimeSetType) => {
  let s = dayNameKor[timeSet.day];
  if (!timeSet.open || !timeSet.close) {
    return s + " 휴무일";
  }

  s +=
    " " +
    formatOperatingTime(timeSet.open) +
    " - " +
    formatOperatingTime(timeSet.close);
  if (timeSet.breakOpen && timeSet.breakClose) {
    s +=
      " ( Break " +
      formatOperatingTime(timeSet.breakOpen) +
      " - " +
      formatOperatingTime(timeSet.breakClose) +
      " )";
  }
  return s;
};

const breakDayToString = (breakDay: number[]) => {
  if (breakDay.length === 0) {
    return "정기 휴무일 없음";
  }

  let s = "매월 ";
  const weekNumKor = ["첫", "둘", "셋", "넷", "다섯", "여섯"];
  let days = [];
  let weeks = [Math.floor(breakDay[0] / 7)];

  breakDay.sort((a: number, b: number) => a - b);

  for (let i = 0; i < 7; i++) {
    if (breakDay.includes(weeks[0] * 7 + i)) {
      days.push(i);
    }
  }

  for (let i = weeks[0] + 1; i < 6; i++) {
    if (breakDay.includes(i * 7 + days[0])) {
      weeks.push(i);
    }
  }

  for (let i = 0; i < weeks.length; i++) {
    s += weekNumKor[weeks[i]] + "째, ";
  }
  s = s.substr(0, s.length - 2) + " 주 ";

  if (days[0] == 0) {
    for (let i = 1; i < days.length; i++) {
      s += dayNameKor[days[i]] + "요일, ";
    }
    s += "일요일 휴무";
  } else {
    for (let i = 0; i < days.length; i++) {
      s += dayNameKor[days[i]] + "요일, ";
    }
    s = s.substr(0, s.length - 2) + " 휴무";
  }

  return s;
};

const Splace = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "Splace">;
}) => {
  const splaceId = route.params.splace.id;
  const [splace, setSplace] = useState(route.params.splace);
  const theme = useContext<ThemeType>(ThemeContext);
  const [fold, setFold] = useState<boolean>(true);
  const [saved, setSaved] = useState<boolean>(false); // isSaved
  // const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [showMap, setShowMap] = useState(false);
  const [operatingTime, setOperatingTime] = useState<TimeSetType[]>();
  const [sortMode, setSortMode] = useState<"generated" | "popular">(
    "generated"
  );
  const [showOperatingTime, setShowOperatingTime] = useState(false);
  const me: UserType = useMe();
  const { spinner } = useContext(ProgressContext);

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [modalContent, setModalContent] = useState<
    "contact" | "menu" | "operatingTime"
  >("contact");

  const day = new Date().getDay();

  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const onShare = async (id: number) => {
    try {
      const result = await Share.share({
        url: "https://splace.co.kr/share.php?type=Splace&id=" + id,
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

  navigation.addListener("focus", () => refetch());

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
      headerTitle: () => <Ionicons name="bicycle" size={40} />,
      headerRight: () =>
        me.id === splace.owner?.id ? (
          <TouchableOpacity
            onPress={() => navigation.push("EditSplace", { splace })}
          >
            <DefaultImage
              source={Icons.edit}
              style={{
                width: pixelScaler(19),
                height: pixelScaler(19),
                marginRight: pixelScaler(26),
              }}
            />
          </TouchableOpacity>
        ) : (
          <HeaderRightMenu
            onPress={() => {
              setModalContent("menu");
              setModalVisible(true);
            }}
          />
        ),
    });
  }, [modalContent, modalVisible, splace]);

  const { data, loading, refetch } = useQuery(GET_SPLACE_INFO, {
    variables: { splaceId },
  });

  useEffect(() => {
    if (!loading && data?.seeSplace?.ok && data.seeSplace.splace.categories) {
      setSplace(data?.seeSplace?.splace);
      if (data?.seeSplace?.splace?.timeSets?.length === 7) {
        var timeSets = data?.seeSplace?.splace?.timeSets
          .slice()
          .sort((a: TimeSetType, b: TimeSetType) => a.day - b.day);

        setShowOperatingTime(
          timeSets.filter((timeSet: TimeSetType) => timeSet.open).length > 0
        );
        setOperatingTime(timeSets);
      }
    }
  }, [data]);

  useEffect(() => {
    refetchLogs({
      splaceId: splace.id,
      orderBy: sortMode === "generated" ? "time" : "like",
    });
  }, [sortMode]);

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

  const {
    data: logsData,
    fetchMore,
    refetch: refetchLogs,
  } = useQuery(GET_LOGS_BY_SPLACE, {
    variables: {
      splaceId: splace.id,
      orderBy: "time",
    },
  });

  // useEffect(() => {
  //   console.log(splace.categories);
  // }, [splace]);
  const onCompleted = (data: any) => {
    spinner.stop();
    if (data.reportResources?.ok) {
      Alert.alert("폐업, 휴점 정보 제안이 완료되었습니다.");
    } else {
      Alert.alert("폐업, 휴점 정보 제안에 실패했습니다.");
    }
  };
  const [mutation, { loading: mutationLoading }] = useMutation(REPORT, {
    onCompleted,
  });

  return (
    <ScreenContainer>
      <FlatList
        refreshing={refreshing}
        onRefresh={refresh}
        showsVerticalScrollIndicator={false}
        data={logsData?.getLogsBySplace?.logs}
        numColumns={2}
        onEndReachedThreshold={0.2}
        onEndReached={() => {
          fetchMore({
            variables: {
              splaceId: splace.id,
              orderBy: sortMode === "generated" ? "time" : "like",
              lastId:
                logsData?.getLogsBySplace?.logs[
                  logsData?.getLogsBySplace?.logs.length - 1
                ].id,
            },
          });
        }}
        ListHeaderComponent={
          <ListHeaderContainer>
            {splace.thumbnail && splace.thumbnail !== "" && (
              <TouchableWithoutFeedback
                onPress={() =>
                  navigation.push("ImagesViewer", {
                    urls: [splace.thumbnail ?? ""],
                  })
                }
              >
                <Image
                  source={{ uri: splace.thumbnail }}
                  style={{ width: "100%", height: pixelScaler(125) }}
                />
              </TouchableWithoutFeedback>
            )}
            <UpperContainer>
              <TitleContainer>
                <BldText33>{splace?.name}</BldText33>
                <TouchableOpacity
                  onPress={() => {
                    // setSaved(!saved);
                    // navigation.push("EditSplace", { splace });
                  }}
                >
                  <Ionicons
                    name={saved ? "bookmark" : "bookmark-outline"}
                    size={pixelScaler(26)}
                  />
                </TouchableOpacity>
              </TitleContainer>
              <ButtonsContainer>
                <Button
                  onPress={() => {
                    // console.log(splace);
                    if (splace.phone || splace.url || splace.owner) {
                      setModalContent("contact");
                      setModalVisible(true);
                    } else {
                      Alert.alert("연락정보가 없습니다.");
                    }
                  }}
                  width={pixelScaler(150)}
                >
                  <RegText13>연락정보</RegText13>
                </Button>
                <Button
                  onPress={() => {
                    onShare(splace.id);
                  }}
                  width={pixelScaler(150)}
                >
                  <RegText13>공유</RegText13>
                </Button>
              </ButtonsContainer>
              <TextContainer>
                <RegText13 style={{ lineHeight: pixelScaler(17) }}>
                  위치{" "}
                  <RegText13
                    onPress={() => setShowMap(true)}
                    style={{ color: theme.textHighlight }}
                  >
                    {splace.address !== ""
                      ? splace.address + (" " + (splace.detailAddress ?? ""))
                      : "주소 정보 없음"}
                    {"\n"}
                  </RegText13>
                </RegText13>
                {showOperatingTime && operatingTime ? (
                  <RegText13 style={{ lineHeight: pixelScaler(17) }}>
                    운영시간{" "}
                    <RegText13
                      onPress={() => {
                        setModalContent("operatingTime");
                        setModalVisible(true);
                      }}
                      style={{ color: theme.textHighlight }}
                    >
                      {operatingTime[day].open
                        ? formatOperatingTime(operatingTime[day].open ?? 0) +
                          " - " +
                          formatOperatingTime(operatingTime[day].close ?? 0) +
                          (operatingTime[day].breakOpen &&
                          operatingTime[day].breakClose
                            ? " ( Break " +
                              formatOperatingTime(
                                operatingTime[day].breakOpen ?? 0
                              ) +
                              " - " +
                              formatOperatingTime(
                                operatingTime[day].breakClose ?? 0
                              ) +
                              " )"
                            : "") +
                          "\n"
                        : "휴무일\n"}
                    </RegText13>
                  </RegText13>
                ) : null}
                {splace.itemName &&
                splace.itemPrice &&
                splace.itemName !== "" ? (
                  <TouchableOpacity
                    hitSlop={{ top: pixelScaler(10) }}
                    onPress={() => {
                      if (splace.menuUrls) {
                        navigation.push("ImagesViewer", {
                          urls: splace.menuUrls,
                        });
                      }
                    }}
                  >
                    <RegText13 style={{ lineHeight: pixelScaler(17) }}>
                      메뉴{" "}
                      <RegText13 style={{ color: theme.textHighlight }}>
                        {splace.itemName +
                          " ₩ " +
                          priceToText(splace.itemPrice) +
                          "\n"}
                      </RegText13>
                    </RegText13>
                  </TouchableOpacity>
                ) : null}
                {splace?.fixedContents && splace.fixedContents.length > 0 ? (
                  <RegText13 style={{ lineHeight: pixelScaler(17) }}>
                    안내 게시물{" "}
                    <RegText13
                      onPress={() =>
                        navigation.push("FixedContents", { splace })
                      }
                      style={{
                        color: theme.textHighlight,
                        width: pixelScaler(270),
                      }}
                      numberOfLines={1}
                    >
                      {splace.fixedContents[0].title}
                      {"\n"}
                    </RegText13>
                  </RegText13>
                ) : null}
                {splace.pets || splace.noKids || splace.parking ? (
                  <RegText13 style={{ lineHeight: pixelScaler(17) }}>
                    {(splace.pets ? "반려동물 출입 가능🐶 " : "") +
                      (splace.noKids ? "No kids zone👶 " : "") +
                      (splace.parking ? "주차가능🚘 " : "") +
                      "\n"}
                  </RegText13>
                ) : null}
                <UnfoldButtonContainer
                  hitSlop={{
                    top: pixelScaler(30),
                    left: pixelScaler(30),
                    right: pixelScaler(30),
                    bottom: pixelScaler(30),
                  }}
                  onPress={() => setFold(!fold)}
                >
                  <Ionicons
                    name={fold ? "chevron-down" : "chevron-up"}
                    size={pixelScaler(20)}
                  />
                </UnfoldButtonContainer>
              </TextContainer>
              {!fold ? (
                <RegText13 style={{ lineHeight: pixelScaler(17) }}>
                  {splace.intro + "\n"}
                </RegText13>
              ) : null}
              <TagsContainer>
                {[
                  ...(splace.ratingtags ?? []),
                  ...(splace.bigCategories ?? []),
                  ...(splace.categories ?? []),
                ].map((category) => (
                  <Tag key={category.id + ""}>
                    <RegText13>{category.name}</RegText13>
                  </Tag>
                ))}
              </TagsContainer>
              <ContentHeaderContainer>
                <BldText20>
                  관련 게시물 {convertNumber(splace.totalPhotologs)}
                </BldText20>
                <SortButtonContainer
                  hitSlop={{
                    top: pixelScaler(15),
                    left: pixelScaler(15),
                    right: pixelScaler(15),
                    bottom: pixelScaler(15),
                  }}
                  onPress={() => {
                    if (sortMode === "generated") {
                      setSortMode("popular");
                    } else {
                      setSortMode("generated");
                    }
                  }}
                >
                  <RegText13>
                    {sortMode === "generated" ? "최신 순" : "인기 순"}
                  </RegText13>
                  <Ionicons
                    name={fold ? "chevron-down" : "chevron-up"}
                    size={pixelScaler(15)}
                  />
                </SortButtonContainer>
              </ContentHeaderContainer>
            </UpperContainer>
          </ListHeaderContainer>
        }
        renderItem={({
          item,
          index,
        }: {
          item: PhotologType;
          index: number;
        }) => (
          <TouchableOpacity
            key={"" + index}
            style={{
              marginRight: pixelScaler(3),
              marginBottom: pixelScaler(3),
            }}
            onPress={() => {
              navigation.push("SplaceLogs", {
                splace,
                initialScrollIndex: index,
                data: logsData,
                refetch: refetchLogs,
                fetchMore: fetchMore,
              });
            }}
          >
            <Image
              source={{ uri: item.imageUrls[0] }}
              style={{ width: pixelScaler(186), height: pixelScaler(186) }}
            />
          </TouchableOpacity>
        )}
      />
      <ModalMapView
        showMap={showMap}
        setShowMap={setShowMap}
        splaces={[splace]}
      />
      <BottomSheetModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        style={{
          borderTopLeftRadius: pixelScaler(20),
          borderTopRightRadius: pixelScaler(20),
          paddingBottom: pixelScaler(44),
        }}
      >
        {modalContent === "contact" ? (
          <>
            {splace.phone && (
              <ModalButtonBox
                onPress={() => {
                  Linking.openURL("tel:" + splace.phone);
                  setModalVisible(false);
                }}
              >
                <RegText20>{formatPhoneString(splace.phone)}</RegText20>
              </ModalButtonBox>
            )}
            {splace.url && (
              <ModalButtonBox
                onPress={() => {
                  Linking.openURL(
                    splace.url?.startsWith("http")
                      ? splace.url
                      : "https://" + splace.url
                  );
                  setModalVisible(false);
                }}
              >
                <RegText20 style={{ color: theme.textHighlight }}>
                  {splace.url}
                </RegText20>
              </ModalButtonBox>
            )}
            {splace.owner && (
              <ModalButtonBox
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <RegText20>DM 보내기</RegText20>
              </ModalButtonBox>
            )}
          </>
        ) : modalContent === "operatingTime" ? (
          operatingTime && (
            <View
              style={{
                width: "100%",
                paddingHorizontal: pixelScaler(30),
              }}
            >
              <BldText16 style={{ marginBottom: pixelScaler(30) }}>
                운영 시간
              </BldText16>
              <RegText13
                style={{
                  color: theme.textHighlight,
                  lineHeight: pixelScaler(17),
                }}
              >
                {operatingTimeToString(operatingTime[day]) + "\n"}
              </RegText13>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <RegText13 key={i} style={{ lineHeight: pixelScaler(17) }}>
                  {operatingTimeToString(operatingTime[(day + i) % 7]) + "\n"}
                </RegText13>
              ))}
              {/* {splace.breakDays.length !== 0 ? ( */}
              <RegText13
                style={{
                  color: theme.errorText,
                  lineHeight: pixelScaler(17),
                }}
              >
                {breakDayToString([1, 4, 15, 17]) + "\n"}
              </RegText13>
              {/* ) : null} */}
            </View>
          )
        ) : (
          <>
            {me.authority === "editor" ? (
              <ModalButtonBox
                onPress={() => {
                  setModalVisible(false);
                  navigation.push("SuggestInfo", { splace });
                }}
              >
                <RegText20>정보 수정</RegText20>
              </ModalButtonBox>
            ) : null}
            <ModalButtonBox
              onPress={() => {
                // setModalVisible(false);
                Alert.alert(
                  "폐업, 휴점 정보 제안",
                  "이 가게의 영업상태가 변경되었나요?",
                  [
                    {
                      text: "폐업",
                      onPress: () => {
                        if (!mutationLoading) {
                          spinner.start();
                          mutation({
                            variables: {
                              sourceType: "Splace",
                              sourceId: splace.id,
                              reason: "closure",
                            },
                          });
                        }
                      },
                    },
                    {
                      text: "휴점",
                      onPress: () => {
                        if (!mutationLoading) {
                          spinner.start();
                          mutation({
                            variables: {
                              sourceType: "Splace",
                              sourceId: splace.id,
                              reason: "break",
                            },
                          });
                        }
                      },
                    },
                    {
                      text: "휴점 종료",
                      onPress: () => {
                        if (!mutationLoading) {
                          spinner.start();
                          mutation({
                            variables: {
                              sourceType: "Splace",
                              sourceId: splace.id,
                              reason: "end break",
                            },
                          });
                        }
                      },
                    },
                    {
                      text: "취소",
                      onPress: () => {},
                      style: "cancel",
                    },
                  ]
                );
              }}
            >
              <RegText20>폐업/휴점 신고</RegText20>
            </ModalButtonBox>
            <ModalButtonBox
              onPress={() => {
                setModalVisible(false);
                navigation.push("RegisterOwner", {
                  splaceId: splace.id,
                  confirmScreen: "Splace",
                });
              }}
              style={{ marginBottom: pixelScaler(27) }}
            >
              <RegText20>소유주 등록</RegText20>
            </ModalButtonBox>
            <ModalButtonBox
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <RegText20 style={{ color: theme.errorText }}>신고</RegText20>
            </ModalButtonBox>
          </>
        )}
      </BottomSheetModal>
    </ScreenContainer>
  );
};

export default Splace;
