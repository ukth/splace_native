import React, { useState, useRef, useContext } from "react";
import { Image, Modal, View } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/core";
import styled from "styled-components/native";
import { pixelScaler } from "../../utils";
import { SplaceType, ThemeType } from "../../types";
import { RegText13 } from "../Text";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon } from "../Icon";
import { useMutation } from "@apollo/client";
import { RATE_SPLACE } from "../../queries";
import spinner from "../Spinner";
import { ProgressContext } from "../../contexts/Progress";

const RatingContainer = styled.View`
  width: ${pixelScaler(285)}px;
  height: ${pixelScaler(132)}px;
  border-radius: ${pixelScaler(15)}px;
  border-width: ${pixelScaler(1)}px;
  border-color: ${({ theme }: { theme: ThemeType }) => theme.borderHighlight};
  align-items: center;
  padding: ${pixelScaler(20)}px ${pixelScaler(20)}px;
  background-color: ${({ theme }: { theme: ThemeType }) => theme.background};
`;

const RatingButtonsContainer = styled.View`
  position: absolute;
  bottom: ${pixelScaler(25)}px;
  width: ${pixelScaler(180)}px;
  flex-direction: row;
  justify-content: space-between;
`;

const RatingModal = ({
  modalVisible,
  setModalVisible,
  splace,
  onConfirm,
}: {
  modalVisible: boolean;
  setModalVisible: any;
  splace: SplaceType;
  onConfirm: () => void;
}) => {
  const mapViewRef = useRef<any>();

  const onCompleted = (data: any) => {
    spinner.stop();
    setModalVisible(false);
    onConfirm();
  };

  const [mutation, { loading }] = useMutation(RATE_SPLACE, { onCompleted });
  const { spinner } = useContext(ProgressContext);

  return (
    <Modal
      visible={modalVisible}
      animationType={"fade"}
      transparent
      statusBarTranslucent
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          alignItems: "center",
        }}
      >
        <RatingContainer>
          <View style={{ flexDirection: "row" }}>
            <RegText13
              numberOfLines={1}
              style={{
                lineHeight: pixelScaler(20),
                maxWidth: pixelScaler(240),
              }}
            >
              {"'" + splace.name}
            </RegText13>
            <RegText13>{"'"}</RegText13>
          </View>
          <RegText13>{"어떠셨나요?"}</RegText13>
          <RatingButtonsContainer>
            <TouchableOpacity
              onPress={() => {
                if (!loading) {
                  spinner.start(false);
                  setTimeout(() => {
                    setModalVisible(false);
                    spinner.stop();
                  }, 2000);
                  mutation({
                    variables: {
                      splaceId: splace.id,
                      rating: 0,
                    },
                  });
                }
              }}
            >
              <Icon
                name="super_ok"
                style={{ width: pixelScaler(41), height: pixelScaler(38) }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (!loading) {
                  spinner.start(false);
                  setTimeout(() => {
                    setModalVisible(false);
                    spinner.stop();
                  }, 2000);
                  mutation({
                    variables: {
                      splaceId: splace.id,
                      rating: 1,
                    },
                  });
                }
              }}
            >
              <Icon
                name="super_smallheart"
                style={{ width: pixelScaler(41), height: pixelScaler(38) }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (!loading) {
                  spinner.start(false);
                  setTimeout(() => {
                    setModalVisible(false);
                    spinner.stop();
                  }, 2000);
                  mutation({
                    variables: {
                      splaceId: splace.id,
                      rating: 2,
                    },
                  });
                }
              }}
            >
              <Icon
                name="super_bigheart"
                style={{ width: pixelScaler(41), height: pixelScaler(38) }}
              />
            </TouchableOpacity>
          </RatingButtonsContainer>
        </RatingContainer>
      </View>
    </Modal>
  );
};

export default RatingModal;
