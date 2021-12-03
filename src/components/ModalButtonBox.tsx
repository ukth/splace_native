import React from "react";
import {
  GestureResponderEvent,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import styled from "styled-components/native";
import { pixelScaler } from "../utils";

const Container = styled.View`
  border-radius: ${pixelScaler(10)}px;
  background-color: #f2f2f7;
  margin-bottom: ${pixelScaler(3)}px;
  height: ${pixelScaler(60)}px;
  width: ${pixelScaler(315)}px;
  justify-content: center;
  align-items: center;
`;

const ModalButtonBox = ({
  onPress,
  children,
  style,
}: {
  onPress: (event: GestureResponderEvent) => void;
  children: React.ReactNode;
  style?: ViewStyle;
}) => {
  return (
    <View style={style}>
      <TouchableWithoutFeedback onPress={onPress}>
        <Container>{children}</Container>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default ModalButtonBox;
