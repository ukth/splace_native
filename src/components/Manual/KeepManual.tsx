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
import { BldText16, RegText16 } from "../Text";

const TextBox = styled.View`
  align-items: center;
  justify-content: center;
  padding: ${pixelScaler(30)}px 0;
  border-width: ${pixelScaler(2)}px;
  border-radius: ${pixelScaler(20)}px;
  width: ${pixelScaler(315)}px;
`;

const ContentContainer = styled.View`
  flex: 9;
`;

const SuperTextBox = ({
  textLines,
  viewStyle,
}: {
  textLines: ReactElement[];
  viewStyle?: ViewStyle;
}) => {
  return (
    <View
      style={
        viewStyle
          ? {
              ...viewStyle,
            }
          : null
      }
    >
      <Icon
        name="super"
        style={{
          width: pixelScaler(59),
          height: pixelScaler(35),
          marginLeft: pixelScaler(5),
        }}
      />

      <TextBox>{textLines}</TextBox>
    </View>
  );
};

const PageContainer = styled.View`
  width: ${pixelScaler(375)}px;
`;

const UpperContainer = styled.View`
  flex: 9;
  align-items: center;
  justify-content: center;
`;

const FooterContainer = styled.View`
  flex: 5;
  align-items: center;
  justify-content: flex-start;
`;

const ImageContainer = styled.View`
  width: ${pixelScaler(315)}px;
  align-items: center;
  justify-content: center;
  padding: ${pixelScaler(5)}px ${pixelScaler(5)}px;
`;

const ShadowedImage = ({
  viewStyle,
  isFloating = false,
  ...props
}: {
  viewStyle?: ViewStyle;
  isFloating?: boolean;
  source: { uri: string };
  style: ImageStyle;
}) => {
  return (
    <View
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        ...viewStyle,
      }}
    >
      <Image {...props} />
    </View>
  );
};

const KeepManual = ({
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
      <PageContainer>
        <ContentContainer>
          <UpperContainer>
            <ImageContainer>
              <ShadowedImage
                style={{
                  width: pixelScaler(272),
                  height: pixelScaler(410),
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: pixelScaler(2),
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: pixelScaler(2),
                }}
                source={require("../../../assets/images/menual/keep_screen.jpg")}
              />
            </ImageContainer>
          </UpperContainer>
          <FooterContainer>
            <SuperTextBox
              textLines={[
                <RegText16 key={"1"} style={{ lineHeight: pixelScaler(23) }}>
                  저장소에는 여러 공간들을
                </RegText16>,
                <RegText16 key={"2"} style={{ lineHeight: pixelScaler(23) }}>
                  <BldText16 style={{ color: theme.textHighlight }}>
                    폴더별로 분류
                  </BldText16>
                  하여 저장할 수 있습니다.
                </RegText16>,
              ]}
            />
          </FooterContainer>
        </ContentContainer>
      </PageContainer>
      <PageContainer>
        <ContentContainer>
          <UpperContainer>
            <ImageContainer>
              <ShadowedImage
                style={{
                  width: pixelScaler(225),
                  height: pixelScaler(420),
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: pixelScaler(2),
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: pixelScaler(2),
                }}
                source={require("../../../assets/images/menual/keep_modal.jpg")}
              />
              <ShadowedImage
                isFloating={true}
                viewStyle={{
                  position: "absolute",
                  right: pixelScaler(50),
                  top: pixelScaler(81),
                }}
                style={{
                  width: pixelScaler(31),
                  height: pixelScaler(38),
                }}
                source={require("../../../assets/images/menual/keep_bookmark.jpg")}
              />
            </ImageContainer>
          </UpperContainer>
          <FooterContainer>
            <SuperTextBox
              textLines={[
                <RegText16 key={"1"} style={{ lineHeight: pixelScaler(23) }}>
                  공간 페이지의
                  <BldText16 style={{ color: theme.textHighlight }}>
                    {" 북마크 버튼"}
                  </BldText16>
                  을 눌러
                </RegText16>,
                <RegText16 key={"2"} style={{ lineHeight: pixelScaler(23) }}>
                  원하는 폴더에 공간을 저장해 보세요.
                </RegText16>,
              ]}
            />
          </FooterContainer>
        </ContentContainer>
      </PageContainer>
      <PageContainer>
        <ContentContainer>
          <UpperContainer>
            <ImageContainer>
              <ShadowedImage
                style={{
                  width: pixelScaler(269),
                  height: pixelScaler(400),
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: pixelScaler(2),
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: pixelScaler(2),
                }}
                source={require("../../../assets/images/menual/keep_members.jpg")}
              />
            </ImageContainer>
          </UpperContainer>
          <FooterContainer>
            <SuperTextBox
              textLines={[
                <RegText16 key={"1"} style={{ lineHeight: pixelScaler(23) }}>
                  생성된 폴더에 다른 친구들을
                </RegText16>,
                <RegText16 key={"2"} style={{ lineHeight: pixelScaler(23) }}>
                  추가하여
                  <BldText16 style={{ color: theme.textHighlight }}>
                    {" 여러 명이 함께 실시간으로"}
                  </BldText16>
                </RegText16>,
                <RegText16 key={"3"} style={{ lineHeight: pixelScaler(23) }}>
                  해당 폴더를 수정할 수 있습니다.
                </RegText16>,
              ]}
            />
          </FooterContainer>
        </ContentContainer>
      </PageContainer>
    </ScrollView>
  );
};

export default KeepManual;
