import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext, useState, PureComponent } from "react";
import { Alert, Share, TouchableOpacity } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { PhotologType } from "../../types";
import { pixelScaler } from "../../utils";
import BottomSheetModal from "../BottomSheetModal";
import { BldText20, RegText20 } from "../Text";
import Content from "./Content";
import Header from "./Header";
import Liked from "./Liked";
import ModalButtonBox from "../ModalButtonBox";
import SeriesTag from "./SeriesTag";
import Swiper from "./Swiper";

const Container = styled.View`
  margin-bottom: ${pixelScaler(30)}px;
`;

const SwiperContainer = styled.View`
  /* background-color: #edee9f; */
`;

const BottomHeader = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 0 8%;
  height: ${pixelScaler(40)}px;
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

  return (
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
          onPress={() => {
            if (item.splace?.activate) {
              navigation.push("Splace", { splace: item.splace });
            }
          }}
        >
          <BldText20>{item.splace?.name ?? "Splace"}</BldText20>
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
              <ModalButtonBox>
                <RegText20>링크 복사</RegText20>
              </ModalButtonBox>
              <ModalButtonBox onPress={() => onShare(item.id)}>
                <RegText20>공유</RegText20>
              </ModalButtonBox>

              <ModalButtonBox>
                <RegText20>게시물 수정</RegText20>
              </ModalButtonBox>
              <ModalButtonBox>
                <RegText20 style={{ color: "#FF0000" }}>게시물 삭제</RegText20>
              </ModalButtonBox>
            </>
          ) : (
            <>
              <ModalButtonBox>
                <RegText20>링크 복사</RegText20>
              </ModalButtonBox>
              <ModalButtonBox onPress={() => onShare(item.id)}>
                <RegText20>공유</RegText20>
              </ModalButtonBox>
              <ModalButtonBox>
                <RegText20 style={{ color: "#00A4B7" }}>스크랩하기</RegText20>
              </ModalButtonBox>

              <ModalButtonBox>
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
              <ModalButtonBox>
                <RegText20 style={{ color: "#FF0000" }}>차단</RegText20>
              </ModalButtonBox>
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
