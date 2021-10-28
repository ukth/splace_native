import React, { useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import styled from "styled-components/native";
import { SeriesType, StackGeneratorParamList } from "../../types";
import { pixelScaler } from "../../utils";
import BottomSheetModal from "../BottomSheetModal";
import Image from "../Image";
import { BldText20, RegText20 } from "../Text";
import Header from "./Header";
import ModalButtonBox from "../ModalButtonBox";
import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";

const Container = styled.View`
  margin-bottom: ${pixelScaler(30)}px;
`;

const TitleContianer = styled.TouchableOpacity`
  padding: 0 ${pixelScaler(30)}px;
  margin-bottom: ${pixelScaler(20)}px;
`;

const Series = ({ item }: { item: SeriesType }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  return (
    <Container>
      <Header
        user={item.author}
        pressThreeDots={() => {
          setModalVisible(true);
        }}
      />

      <TitleContianer
        onPress={() => {
          console.log("hello");
          navigation.push("Series", {
            id: item.id,
          });
        }}
      >
        <BldText20>{item.title}</BldText20>
      </TitleContianer>

      <FlatList
        data={item.seriesElements}
        horizontal={true}
        ListHeaderComponent={() => <View style={{ width: pixelScaler(30) }} />}
        ListFooterComponent={() => <View style={{ width: pixelScaler(20) }} />}
        keyExtractor={(item) => "" + item.id}
        renderItem={({ item, index }) => {
          return (
            <Image
              source={{ uri: item.photolog.imageUrls[0] }}
              style={{
                width: pixelScaler(100),
                height: pixelScaler(100),
                marginRight: pixelScaler(10),
                borderRadius: pixelScaler(10),
              }}
            />
          );
        }}
        showsHorizontalScrollIndicator={false}
        bounces={false}
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

        <ModalButtonBox>
          <RegText20>
            {item.author.username === "dreamost_heo" ? "게시물 수정" : "숨기기"}
          </RegText20>
        </ModalButtonBox>
        <ModalButtonBox>
          <RegText20 style={{ color: "#FF0000" }}>
            {item.author.username === "dreamost_heo" ? "게시물 삭제" : "차단"}
          </RegText20>
        </ModalButtonBox>
      </BottomSheetModal>
    </Container>
  );
};

export default Series;
