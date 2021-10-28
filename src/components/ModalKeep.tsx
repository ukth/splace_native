import React, { useContext } from "react";
import { GestureResponderEvent, Image, TouchableOpacity } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { Icons } from "../icons";
import { pixelScaler } from "../utils";
import BottomSheetModal from "./BottomSheetModal";

const Container = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

export const ModalKeep = ({
  splaceId,
  modalVisible,
  setModalVisible,
}: {
  splaceId: number;
  modalVisible: boolean;
  setModalVisible: any;
}) => {
  const theme = useContext(ThemeContext);
  return (
    <BottomSheetModal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      style={{
        borderTopLeftRadius: pixelScaler(20),
        borderTopRightRadius: pixelScaler(20),
        paddingBottom: pixelScaler(44),
      }}
    >
      <Container></Container>
    </BottomSheetModal>
  );
};
