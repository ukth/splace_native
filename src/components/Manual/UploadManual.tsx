import React, { ReactElement, useContext } from "react";
import {
  Image,
  ImageProps,
  ImageStyle,
  ScrollView,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { ThemeType } from "../../types";
import { pixelScaler } from "../../utils";
import { Icon } from "../Icon";
import { BldText16, RegText16, RegText28 } from "../Text";

const Container = styled.View`
  flex: 1;
  padding-left: ${pixelScaler(58)}px;
  padding-top: ${pixelScaler(10)}px;
`;

const LabelContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${pixelScaler(16)}px;
`;

const UploadManual = ({
  scrollIndex,
  setScrollIndex,
}: {
  scrollIndex: number;
  setScrollIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { width, height } = useWindowDimensions();

  const theme = useContext<ThemeType>(ThemeContext);

  return (
    <ScrollView
      pagingEnabled={true}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={{
        width,
        height: height - pixelScaler(90),
      }}
      onScroll={({ nativeEvent }) => {
        const ind = Math.floor(
          (nativeEvent.contentOffset.x + width / 2) / width
        );
        if (ind != scrollIndex) {
          setScrollIndex(ind);
        }
      }}
      scrollEventThrottle={16}
    >
      <Container style={{ backgroundColor: theme.background }}>
        <Icon
          name="super"
          style={{
            width: pixelScaler(59),
            height: pixelScaler(35),
            marginBottom: pixelScaler(15),
          }}
        />
        <RegText16 style={{ lineHeight: pixelScaler(23) }}>
          splace의 게시물은
        </RegText16>
        <RegText16 style={{ lineHeight: pixelScaler(23) }}>
          {"세 종류로 구성되어 있습니다.\n\n"}
        </RegText16>
        <LabelContainer>
          <Icon
            name="manual_log"
            style={{
              width: pixelScaler(18.5),
              height: pixelScaler(18.5),
              marginRight: pixelScaler(20),
            }}
          />
          <RegText28>로그</RegText28>
        </LabelContainer>

        <RegText16 style={{ lineHeight: pixelScaler(23) }}>
          <BldText16 style={{ color: theme.textHighlight }}>
            사진과 텍스트
          </BldText16>
          로 여러분의 경험을
        </RegText16>
        <RegText16 style={{ lineHeight: pixelScaler(23) }}>
          {"공유할 수 있어요.\n\n"}
        </RegText16>
        <LabelContainer>
          <Icon
            name="manual_series"
            style={{
              width: pixelScaler(18.5),
              height: pixelScaler(18.5),
              marginRight: pixelScaler(20),
            }}
          />
          <RegText28>시리즈</RegText28>
        </LabelContainer>

        <BldText16 style={{ color: theme.textHighlight }}>
          여러 로그를 묶어 하나의 시리즈로
        </BldText16>
        <RegText16 style={{ lineHeight: pixelScaler(23) }}>
          {"만들어 보세요.\n\n"}
        </RegText16>
        <LabelContainer>
          <Icon
            name="manual_camera"
            style={{
              width: pixelScaler(21),
              height: pixelScaler(18),
              marginRight: pixelScaler(20),
            }}
          />
          <RegText28>모먼트</RegText28>
        </LabelContainer>

        <RegText16 style={{ lineHeight: pixelScaler(23) }}>
          모먼트는 다른 사람에게 노출되지
        </RegText16>
        <RegText16 style={{ lineHeight: pixelScaler(23) }}>
          않습니다.
          <BldText16 style={{ color: theme.textHighlight }}>
            {" 지금 이 순간을 영상으로 "}
          </BldText16>
          찍어,
        </RegText16>
        <RegText16 style={{ lineHeight: pixelScaler(23) }}>
          나만을 위한 공간 기록으로 남겨보세요.
        </RegText16>
      </Container>
    </ScrollView>
  );
};

export default UploadManual;
