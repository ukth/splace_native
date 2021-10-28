import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext, useState, PureComponent } from "react";
import { Alert, Image, Share, TouchableOpacity } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { FixedContentType, PhotologType, SplaceType } from "../../types";
import { pixelScaler } from "../../utils";
import BottomSheetModal from "../BottomSheetModal";
import { BldText20, RegText20 } from "../Text";
import Content from "./Content";
import ModalButtonBox from "../ModalButtonBox";
import Swiper from "./Swiper";
import { Icons } from "../../icons";

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

const FixedContent = ({
  item,
  splace,
}: {
  item: FixedContentType;
  splace: SplaceType;
}) => {
  const theme = useContext(ThemeContext);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <Container>
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
        <BldText20>{item.title}</BldText20>
        {splace.owner?.isMe ? (
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={Icons.edit}
              style={{
                width: pixelScaler(18),
                height: pixelScaler(18),
              }}
            />
          </TouchableOpacity>
        ) : null}
      </BottomHeader>
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
        {splace.owner?.isMe ? (
          <>
            <ModalButtonBox
              onPress={() => {
                setModalVisible(false);
                navigation.push("EditFixedContents", {
                  fixedContent: item,
                  splaceId: splace.id,
                });
              }}
            >
              <RegText20>게시물 수정</RegText20>
            </ModalButtonBox>
            <ModalButtonBox>
              <RegText20 style={{ color: "#FF0000" }}>게시물 삭제</RegText20>
            </ModalButtonBox>
          </>
        ) : null}
      </BottomSheetModal>
    </Container>
  );
};

export default FixedContent;
