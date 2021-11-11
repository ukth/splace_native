import React, { useContext } from "react";
import { GestureResponderEvent, View } from "react-native";
import { ThemeContext } from "styled-components/native";
import { ThemeType } from "../../types";
import { pixelScaler } from "../../utils";
import { BldText16 } from "../Text";
import { GreyButton, InfoContainer, MemberContainer } from "./StyledComponents";

export const GreyButtonComponent = ({
  type,
  onPress,
}: {
  type: "+" | "-";
  onPress: (event: GestureResponderEvent) => void;
}) => {
  const theme = useContext<ThemeType>(ThemeContext);
  return (
    <MemberContainer onPress={onPress}>
      <InfoContainer>
        <GreyButton>
          <View
            style={{
              position: "absolute",
              width: pixelScaler(16),
              height: pixelScaler(2),
              borderRadius: pixelScaler(2),
              backgroundColor: theme.greyButtonContext,
            }}
          />
          {type === "+" ? (
            <View
              style={{
                position: "absolute",
                width: pixelScaler(2),
                height: pixelScaler(16),
                borderRadius: pixelScaler(2),
                backgroundColor: theme.greyButtonContext,
              }}
            />
          ) : null}
        </GreyButton>
        <BldText16 style={{ marginLeft: pixelScaler(15) }}>
          {type === "+" ? "초대하기" : "나가기"}
        </BldText16>
      </InfoContainer>
    </MemberContainer>
  );
};

export default GreyButtonComponent;
