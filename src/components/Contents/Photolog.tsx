import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext, useState } from "react";
import { TouchableOpacity } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { PhotologType, themeType } from "../../types";
import { pixelScaler } from "../../utils";
import BottomSheetModal from "../BottomSheetModal";
import Image from "../Image";
import { BldText13, BldText20, RegText20 } from "../Text";
import Content from "./Content";
import Header from "./Header";
import Liked from "./Liked";
import SeriesTag from "./SeriesTag";
import Swiper from "./Swiper";

const Container = styled.View`
  margin-bottom: ${pixelScaler(30)}px;
`;

const ProfileImage = styled.Image`
  width: ${pixelScaler(26)}px;
  height: ${pixelScaler(26)}px;
  border-radius: ${pixelScaler(13)}px;
  margin-right: ${pixelScaler(10)}px;
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
const BottomHeaderRight = styled.View`
  right: 0;
  flex-direction: row;
  align-items: center;
  /* background-color: #36ffff; */
`;

const ModalButtonBox = styled.TouchableOpacity`
  border-radius: ${pixelScaler(10)}px;
  background-color: #f2f2f7;
  margin-bottom: ${pixelScaler(3)}px;
  height: ${pixelScaler(60)}px;
  width: ${pixelScaler(315)}px;
  justify-content: center;
  align-items: center;
`;

const ModalUpBox = styled.View``;
const ModalDownBox = styled.View`
  margin-top: ${pixelScaler(30)}px;
`;

const PhotoLog = ({ item }: { item: PhotologType }) => {
  const theme = useContext(ThemeContext);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [modalVisible, setModalVisible] = useState(false);
  // const [liked, setLiked] = useState<boolean>(false);

  const pressThreeDots = () => {
    setModalVisible(true);
  };

  return (
    <Container>
      <Header user={item.author} pressThreeDots={pressThreeDots} />
      <SwiperContainer
        style={{
          height:
            item.photoSize === 1
              ? pixelScaler(394 + 10)
              : item.photoSize === 2
              ? pixelScaler(315 + 10)
              : pixelScaler(252 + 10),
        }}
      >
        <Swiper item={item} />
      </SwiperContainer>
      <BottomHeader>
        <TouchableOpacity
          onPress={() => navigation.push("Splace", { splace: item.splace })}
        >
          <BldText20>{item.splace.name}</BldText20>
        </TouchableOpacity>
        <Liked item={item} />
      </BottomHeader>
      {item?.series?.length !== 0 ? (
        <SeriesTag series={item?.series[0]} />
      ) : null}
      <Content item={item} />
      <BottomSheetModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      >
        <ModalUpBox>
          <ModalButtonBox>
            <RegText20>링크 복사</RegText20>
          </ModalButtonBox>
          <ModalButtonBox>
            <RegText20>공유</RegText20>
          </ModalButtonBox>
          <ModalButtonBox>
            <RegText20 style={{ color: "#00A4B7" }}>
              저장된 게시물에 추가
            </RegText20>
          </ModalButtonBox>
        </ModalUpBox>
        <ModalDownBox>
          <ModalButtonBox>
            <RegText20>
              {item.author.username === "dreamost_heo"
                ? "게시물 수정"
                : "숨기기"}
            </RegText20>
          </ModalButtonBox>
          <ModalButtonBox>
            <RegText20 style={{ color: "#FF0000" }}>
              {item.author.username === "dreamost_heo" ? "게시물 삭제" : "차단"}
            </RegText20>
          </ModalButtonBox>
        </ModalDownBox>
      </BottomSheetModal>
    </Container>
  );
};

export default PhotoLog;
