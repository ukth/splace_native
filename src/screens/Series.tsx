import React, { useContext, useEffect } from "react";
import {
  BLOCK,
  GET_SERIES,
  GET_SERIES_INFO,
  HIDE_SERIES,
  LOG_GETLOGSBYSERIES,
  LOG_GETSERIES,
  REMOVE_SERIES,
  SCRAP_SERIES,
  UNBLOCK,
  UNSCRAP_SERIES,
} from "../queries";
import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import {
  PhotologType,
  SeriesElementType,
  SplaceType,
  StackGeneratorParamList,
  ThemeType,
} from "../types";
import styled, { ThemeContext } from "styled-components/native";
import { pixelScaler, showFlashMessage } from "../utils";
import { useNavigation } from "@react-navigation/native";
import { BldText13, BldText16, RegText20 } from "../components/Text";
import { Alert, FlatList, TouchableOpacity, View } from "react-native";
import ScreenContainer from "../components/ScreenContainer";
import PhotoLog from "../components/Contents/Photolog";
import ModalMapView from "../components/ModalMapView";
import { FloatingMapButton } from "../components/FloatingMapButton";

import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useRoute } from "@react-navigation/core";

import BottomSheetModal from "../components/BottomSheetModal";
import ModalButtonBox from "../components/ModalButtonBox";
import { Icon } from "../components/Icon";
import { HeaderRightIcon } from "../components/HeaderRightIcon";

const Header = styled.View`
  align-items: center;
  justify-content: center;
`;

const Series = () => {
  const route = useRoute<RouteProp<StackGeneratorParamList, "Series">>();
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const seriesId = route.params.id;

  const [showMap, setShowMap] = useState(false);
  const [splaces, setSplaces] = useState<SplaceType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const theme = useContext<ThemeType>(ThemeContext);

  const [log_getSeries, _1] = useMutation(LOG_GETSERIES);
  const [log_getLogs, _2] = useMutation(LOG_GETLOGSBYSERIES);

  useEffect(() => {
    try {
      log_getSeries({ variables: { seriesId } });
      log_getLogs({ variables: { seriesId } });
    } catch {}
  }, []);

  const { data: seriesInfo } = useQuery(GET_SERIES_INFO, {
    variables: { seriesId },
  });

  useEffect(() => {
    // console.log(seriesInfo);
    navigation.setOptions({
      headerTitle: () => (
        <Header>
          <BldText16 style={{ marginBottom: pixelScaler(5) }}>
            {seriesInfo?.seeSeries?.series?.title}
          </BldText16>
          <TouchableOpacity>
            <BldText13
              style={{
                color: theme.seriesHeaderGreyText,
              }}
            >
              {seriesInfo?.seeSeries?.series?.author?.username}
            </BldText13>
          </TouchableOpacity>
        </Header>
      ),
      headerRight: () => (
        <HeaderRightIcon
          iconName="threedot"
          iconStyle={{ width: pixelScaler(20), height: pixelScaler(4) }}
          onPress={() => setModalVisible(true)}
        />
      ),
    });
  }, [seriesInfo]);

  const onGetLogsCompleted = async (data: {
    getLogsBySeries: {
      seriesElements: {
        id: number;
        photolog: PhotologType;
      }[];
      ok: boolean;
    };
  }) => {
    if (data?.getLogsBySeries?.ok) {
      const splaceIds: number[] = [];
      const tmp: SplaceType[] = [];
      for (let i = 0; i < data.getLogsBySeries.seriesElements.length; i++) {
        const splace = data.getLogsBySeries.seriesElements[i].photolog.splace;
        if (splace && !splaceIds.includes(splace.id)) {
          tmp.push(splace);
          splaceIds.push(splace.id);
        }
      }
      setSplaces(tmp);
    }
  };

  const {
    data: logsData,
    refetch,
    fetchMore,
  } = useQuery(GET_SERIES, {
    variables: { seriesId },
    onCompleted: onGetLogsCompleted,
  });

  navigation.addListener("focus", () => refetch());

  const onDeleteCompleted = (data: any) => {
    if (data?.deleteSeries?.ok) {
      showFlashMessage({ message: "시리즈가 삭제되었습니다." });
      navigation.pop();
      refetch();
    } else {
      Alert.alert("시리즈를 삭제할 수 없습니다.");
    }
  };

  const [deleteMutation, { loading: deleteMutationLoading }] = useMutation(
    REMOVE_SERIES,
    { onCompleted: onDeleteCompleted }
  );

  const onHideCompleted = (data: any) => {
    if (data?.hideSeries?.ok) {
      showFlashMessage({ message: "시리즈가 되었습니다." });
      refetch();
    } else {
      Alert.alert("게시물을 삭제할 수 없습니다.");
    }
  };

  const [hideMutation, { loading: hideMutationLoading }] = useMutation(
    HIDE_SERIES,
    { onCompleted: onHideCompleted }
  );

  const onScrapCompleted = (data: any) => {
    if (data?.scrapSeries?.ok) {
      showFlashMessage({ message: "게시물이 스크랩되었습니다." });
      refetch();
    } else {
      Alert.alert("게시물을 스크랩 할 수 없습니다.");
    }
  };

  const [scrapMutation, { loading: scrapMutationLoading }] = useMutation(
    SCRAP_SERIES,
    { onCompleted: onScrapCompleted }
  );

  const onUnscrapCompleted = (data: any) => {
    if (data?.unscrapSeries?.ok) {
      showFlashMessage({ message: "게시물이 스크랩 목록에서 삭제되었습니다." });
      refetch();
    } else {
      Alert.alert(
        "게시물을 스크랩 목록에서 삭제할 수 없습니다.",
        data?.unscrapSeries.error
      );
    }
  };

  const [unscrapMutation, { loading: unscrapMutationLoading }] = useMutation(
    UNSCRAP_SERIES,
    { onCompleted: onUnscrapCompleted }
  );

  const onBlockCompleted = (data: any) => {
    if (data?.blockUser?.ok) {
      showFlashMessage({ message: "사용자가 차단되었습니다." });
      refetch();
    } else {
      Alert.alert("사용자를 차단할 수 없습니다.");
    }
  };

  const [blockMutation, { loading: blockMutationLoading }] = useMutation(
    BLOCK,
    { onCompleted: onBlockCompleted }
  );

  const onUnblockCompleted = (data: any) => {
    if (data?.unblockUser?.ok) {
      showFlashMessage({ message: "차단이 해제되었습니다." });
      refetch();
    } else {
      Alert.alert("차단 해제에 실패했습니다.");
    }
  };

  const [unblockMutation, { loading: unblockMutationLoading }] = useMutation(
    UNBLOCK,
    { onCompleted: onUnblockCompleted }
  );

  const onEndReached = async () => {
    await fetchMore({
      variables: {
        lastLogId:
          logsData?.getLogsBySeries?.seriesElements[
            logsData?.getLogsBySeries?.seriesElements?.length - 1
          ].id,
      },
    });
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: SeriesElementType;
    index: number;
  }) => <PhotoLog item={item.photolog} key={index} type="Series" />;

  const [refreshing, setRefreshing] = useState<boolean>(false);

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
        ListHeaderComponent={<View style={{ height: pixelScaler(30) }}></View>}
        keyExtractor={(item) => "" + item.id}
        data={logsData?.getLogsBySeries?.seriesElements}
        renderItem={renderItem}
        onEndReached={onEndReached}
        onRefresh={refresh}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
      />
      {splaces.length > 0 ? (
        <ModalMapView
          showMap={showMap}
          setShowMap={setShowMap}
          splaces={splaces}
        />
      ) : null}
      {splaces.length > 0 ? (
        <FloatingMapButton onPress={() => setShowMap(true)}>
          <Icon
            name="map"
            style={{
              width: pixelScaler(20.7),
              height: pixelScaler(22.1),
            }}
          />
        </FloatingMapButton>
      ) : null}
      {seriesInfo?.seeSeries?.series ? (
        <BottomSheetModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          style={{
            borderTopLeftRadius: pixelScaler(20),
            borderTopRightRadius: pixelScaler(20),
            paddingBottom: pixelScaler(44),
          }}
        >
          {/* <ModalButtonBox>
            <RegText20>링크 복사</RegText20>
          </ModalButtonBox> */}
          {seriesInfo.seeSeries.series.author?.isMe ? (
            <>
              {/* <ModalButtonBox>
                <RegText20>공유</RegText20>
              </ModalButtonBox> */}
              <ModalButtonBox
                onPress={() => {
                  if (
                    seriesInfo.seeSeries.series &&
                    logsData?.getLogsBySeries?.seriesElements
                  ) {
                    setModalVisible(false);
                    navigation.push("EditSeries", {
                      series: {
                        ...seriesInfo.seeSeries.series,
                        seriesElements:
                          logsData?.getLogsBySeries?.seriesElements,
                      },
                    });
                  }
                }}
              >
                <RegText20>{"시리즈 수정"}</RegText20>
              </ModalButtonBox>
              <ModalButtonBox
                onPress={() => {
                  if (!deleteMutationLoading) {
                    Alert.alert("시리즈 삭제", "시리즈를 삭제하시겠습니까?", [
                      {
                        text: "예",
                        onPress: () => {
                          setModalVisible(false);
                          deleteMutation({
                            variables: {
                              seriesId,
                            },
                          });
                        },
                      },
                      {
                        text: "취소",
                        style: "cancel",
                      },
                    ]);
                  }
                }}
              >
                <RegText20 style={{ color: "#FF0000" }}>
                  {"시리즈 삭제"}
                </RegText20>
              </ModalButtonBox>
            </>
          ) : (
            <>
              {/* <ModalButtonBox>
                <RegText20>공유</RegText20>
              </ModalButtonBox> */}
              {seriesInfo.seeSeries.series.isScraped ? (
                <ModalButtonBox
                  onPress={() => {
                    if (!unscrapMutationLoading) {
                      setModalVisible(false);
                      unscrapMutation({
                        variables: {
                          scrapedSeriesId: seriesId,
                        },
                      });
                    }
                  }}
                >
                  <RegText20 style={{ color: "#00A4B7" }}>
                    스크랩 목록에서 삭제
                  </RegText20>
                </ModalButtonBox>
              ) : (
                <ModalButtonBox
                  onPress={() => {
                    if (!scrapMutationLoading) {
                      setModalVisible(false);
                      scrapMutation({
                        variables: {
                          seriesId,
                        },
                      });
                    }
                  }}
                >
                  <RegText20 style={{ color: "#00A4B7" }}>스크랩하기</RegText20>
                </ModalButtonBox>
              )}
              <ModalButtonBox
                onPress={() => {
                  if (!hideMutationLoading) {
                    setModalVisible(false);
                    hideMutation({ variables: { targetId: seriesId } });
                  }
                }}
              >
                <RegText20>{"숨기기"}</RegText20>
              </ModalButtonBox>
              {seriesInfo.seeSeries.series.author?.isBlocked ? (
                <ModalButtonBox
                  onPress={() => {
                    if (!unblockMutationLoading) {
                      setModalVisible(false);
                      unblockMutation({
                        variables: {
                          targetId: seriesInfo.seeSeries.series.author?.id,
                        },
                      });
                    }
                  }}
                >
                  <RegText20 style={{ color: "#FF0000" }}>차단 해제</RegText20>
                </ModalButtonBox>
              ) : (
                <ModalButtonBox
                  onPress={() => {
                    if (!blockMutationLoading) {
                      Alert.alert(
                        "사용자 차단",
                        "이 사용자를 차단하시겠습니까?",
                        [
                          {
                            text: "확인",
                            onPress: () => {
                              setModalVisible(false);
                              blockMutation({
                                variables: {
                                  targetId:
                                    seriesInfo.seeSeries.series.author?.id,
                                },
                              });
                            },
                          },
                          {
                            text: "취소",
                            style: "cancel",
                          },
                        ]
                      );
                    }
                  }}
                >
                  <RegText20 style={{ color: "#FF0000" }}>{"차단"}</RegText20>
                </ModalButtonBox>
              )}
            </>
          )}
        </BottomSheetModal>
      ) : null}
    </ScreenContainer>
  );
};

export default Series;
