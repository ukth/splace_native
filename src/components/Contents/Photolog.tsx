import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext, useState, PureComponent } from "react";
import { Alert, Share, TouchableOpacity } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { PhotologType } from "../../types";
import { pixelScaler, showFlashMessage } from "../../utils";
import BottomSheetModal from "../BottomSheetModal";
import { BldText20, RegText20 } from "../Text";
import Content from "./Content";
import Header from "./Header";
import Liked from "./Liked";
import ModalButtonBox from "../ModalButtonBox";
import SeriesTag from "./SeriesTag";
import Swiper from "./Swiper";
import { useMutation, useQuery } from "@apollo/client";
import {
  BLOCK,
  GET_FEED,
  HIDE_LOG,
  REMOVE_LOG,
  SCRAP_LOG,
  UNBLOCK,
  UNSCRAP_LOG,
} from "../../queries";

const Container = styled.View`
  margin-bottom: ${pixelScaler(30)}px;
`;

const SwiperContainer = styled.View`
  /* background-color: #edee9f; */
`;

const BottomHeader = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 0 ${pixelScaler(30)}px;
  height: ${pixelScaler(38)}px;
  margin-bottom: ${pixelScaler(4)}px;
  width: auto;
  justify-content: space-between;
  /* background-color: #458693; */
`;

const PhotoLog = ({
  item,
  type,
}: {
  item: PhotologType;
  type?: "Series" | undefined;
}) => {
  const theme = useContext(ThemeContext);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("dots");
  // const [liked, setLiked] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const onShare = async (id: number) => {
    try {
      const result = await Share.share({
        url: "https://splace.co.kr/share.php?type=Log&id=" + id,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          setModalVisible(false);
        } else {
          Alert.alert("공유에 실패했습니다.");
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error);
    }
  };

  const pressThreeDots = () => {
    showModal("dots");
  };

  const pressMoreSeries = () => {
    showModal("series");
  };

  const showModal = (content: string) => {
    setModalContent(content);
    setModalVisible(true);
  };

  const onDeleteCompleted = (data: any) => {
    if (data?.deletePhotolog?.ok) {
      showFlashMessage({ message: "게시물이 삭제되었습니다." });
      setModalVisible(false);
      setIsDeleted(true);
      refetch();
    } else {
      setModalVisible(false);
      Alert.alert("게시물을 삭제할 수 없습니다.", data?.deletePhotolog?.error);
    }
  };

  const { refetch } = useQuery(GET_FEED);

  const [deleteMutation, { loading: deleteMutationLoading }] = useMutation(
    REMOVE_LOG,
    { onCompleted: onDeleteCompleted }
  );

  const onHideCompleted = (data: any) => {
    if (data?.hidePhotologs?.ok) {
      showFlashMessage({ message: "숨김처리 되었습니다." });
      setModalVisible(false);
      setIsDeleted(true);
    } else {
      Alert.alert("숨김처리 할 수 없습니다.");
    }
  };

  const [hideMutation, { loading: hideMutationLoading }] = useMutation(
    HIDE_LOG,
    { onCompleted: onHideCompleted }
  );

  const onScrapCompleted = (data: any) => {
    if (data?.scrapLog?.ok) {
      showFlashMessage({ message: "게시물이 스크랩되었습니다." });
      refetch();
    } else {
      Alert.alert("게시물을 스크랩 할 수 없습니다.");
    }
  };

  const [scrapMutation, { loading: scrapMutationLoading }] = useMutation(
    SCRAP_LOG,
    { onCompleted: onScrapCompleted }
  );

  const onUnscrapCompleted = (data: any) => {
    if (data?.unscrapLog?.ok) {
      showFlashMessage({ message: "게시물이 스크랩 목록에서 삭제되었습니다." });
      refetch();
    } else {
      Alert.alert(
        "게시물을 스크랩 목록에서 삭제할 수 없습니다.",
        data?.unscrapLog.error
      );
    }
  };

  const [unscrapMutation, { loading: unscrapMutationLoading }] = useMutation(
    UNSCRAP_LOG,
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

  return isDeleted ? null : (
    <Container>
      {type !== "Series" ? (
        <Header user={item.author} pressThreeDots={pressThreeDots} />
      ) : null}
      <SwiperContainer
        style={{
          height:
            item.photoSize === 2
              ? pixelScaler(420 + 10)
              : item.photoSize === 1
              ? pixelScaler(315 + 10)
              : pixelScaler(236.25 + 10),
        }}
      >
        <Swiper item={item} />
      </SwiperContainer>
      <BottomHeader>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => {
            if (item.splace?.activate) {
              navigation.push("Splace", { splace: item.splace });
            }
          }}
        >
          <BldText20 numberOfLines={1}>
            {item.splace?.name ?? "Splace"}
          </BldText20>
        </TouchableOpacity>
        <Liked item={item} />
      </BottomHeader>
      {item?.seriesElements?.length !== 0 ? (
        <SeriesTag
          series={item?.seriesElements.map((element) => element.series)}
          pressMoreSeries={pressMoreSeries}
        />
      ) : null}
      <Content item={item} />
      <BottomSheetModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        style={{
          borderTopLeftRadius: pixelScaler(20),
          borderTopRightRadius: pixelScaler(20),
          paddingBottom: pixelScaler(44),
        }}
      >
        {modalContent === "dots" ? (
          item.author.isMe ? (
            <>
              {/* <ModalButtonBox>
                <RegText20>링크 복사</RegText20>
              </ModalButtonBox> */}
              {/* <ModalButtonBox onPress={() => onShare(item.id)}>
                <RegText20>공유</RegText20>
              </ModalButtonBox> */}
              <ModalButtonBox
                onPress={() => {
                  setModalVisible(false);
                  navigation.push("EditPhotolog", { photolog: item });
                }}
              >
                <RegText20>게시물 수정</RegText20>
              </ModalButtonBox>
              <ModalButtonBox
                onPress={() => {
                  Alert.alert("게시물 삭제", "게시물을 삭제하시겠습니까?", [
                    {
                      text: "확인",
                      onPress: () => {
                        if (!deleteMutationLoading) {
                          setModalVisible(false);
                          deleteMutation({
                            variables: {
                              photologId: item.id,
                            },
                          });
                        }
                      },
                    },
                    {
                      text: "취소",
                      style: "cancel",
                    },
                  ]);
                }}
              >
                <RegText20 style={{ color: "#FF0000" }}>게시물 삭제</RegText20>
              </ModalButtonBox>
            </>
          ) : (
            <>
              {/* <ModalButtonBox>
                <RegText20>링크 복사</RegText20>
              </ModalButtonBox> */}
              {/* <ModalButtonBox onPress={() => onShare(item.id)}>
                <RegText20>공유</RegText20>
              </ModalButtonBox> */}
              {item.isScraped ? (
                <ModalButtonBox
                  onPress={() => {
                    if (!scrapMutationLoading) {
                      setModalVisible(false);
                      unscrapMutation({ variables: { scrapedLogId: item.id } });
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
                      scrapMutation({ variables: { photologId: item.id } });
                    }
                  }}
                >
                  <RegText20 style={{ color: "#00A4B7" }}>스크랩하기</RegText20>
                </ModalButtonBox>
              )}

              <ModalButtonBox
                style={{ marginBottom: pixelScaler(30) }}
                onPress={() => {
                  if (!hideMutationLoading) {
                    setModalVisible(false);
                    hideMutation({
                      variables: {
                        targetId: item.id,
                      },
                    });
                  }
                }}
              >
                <RegText20>게시물 숨기기</RegText20>
              </ModalButtonBox>
              <ModalButtonBox
                onPress={() => {
                  setModalVisible(false);
                  navigation.push("Report", {
                    type: "log",
                    id: item.id,
                  });
                }}
              >
                <RegText20>신고</RegText20>
              </ModalButtonBox>
              {item.author.isBlocked ? (
                <ModalButtonBox
                  onPress={() => {
                    if (!unblockMutationLoading) {
                      unblockMutation({
                        variables: { targetId: item.author.id },
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
                                variables: { targetId: item.author.id },
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
                  <RegText20 style={{ color: "#FF0000" }}>차단</RegText20>
                </ModalButtonBox>
              )}
            </>
          )
        ) : (
          <>
            {item.seriesElements.map((element) => (
              <ModalButtonBox
                key={element.series.id}
                onPress={() => {
                  setModalVisible(false);
                  navigation.push("Series", {
                    id: element.series.id,
                  });
                }}
              >
                <RegText20>{element.series.title}</RegText20>
              </ModalButtonBox>
            ))}
          </>
        )}
      </BottomSheetModal>
    </Container>
  );
};

export default PhotoLog;
