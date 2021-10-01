import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { useContext } from "react";
import {
  GestureResponderEvent,
  ScrollView,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import { Route } from "react-native-tab-view";
import styled, { ThemeContext } from "styled-components/native";
import { CardBox, RowCardBoxContainer } from "../components/CardRowBox";
import { BldText13, BldText20, BldText33, RegText13 } from "../components/Text";
import { StackGeneratorParamList, themeType } from "../types";
import { pixelScaler } from "../utils";

const Container = styled.ScrollView`
  background-color: ${({ theme }: { theme: themeType }) => theme.background};
`;

const UpperContainer = styled.View`
  padding-top: ${pixelScaler(30)}px;
  padding-left: ${pixelScaler(30)}px;
  padding-right: ${pixelScaler(30)}px;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${pixelScaler(30)}px;
`;

const BookMark = ({ isSaved }: { isSaved: boolean }) => {
  const [saved, setSaved] = useState<boolean>(isSaved);
  return (
    <Ionicons
      name={saved ? "bookmark" : "bookmark-outline"}
      size={pixelScaler(26)}
    />
  );
};

const ButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${pixelScaler(30)}px;
`;

const UnfoldButtomContainer = styled.TouchableOpacity`
  position: absolute;
  /* bottom: 0px; */
  top: 80px;
  right: 0px;
`;

const Button = styled.TouchableOpacity`
  width: ${({ width }: { width: number }) => width}px;
  border-width: ${pixelScaler(1.1)}px;
  border-radius: ${pixelScaler(10)}px;
  height: ${pixelScaler(35)}px;
  justify-content: center;
  align-items: center;
`;

const TextContainer = styled.View`
  /* background-color: #9078f0; */
  margin-bottom: ${pixelScaler(30)}px;
`;

const RatingTagsContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${pixelScaler(30)}px;
`;

const RatingTags = styled.View`
  height: ${pixelScaler(20)}px;
  align-items: center;
  justify-content: center;
  padding: 0 ${pixelScaler(10)}px;
  border-radius: ${pixelScaler(15)}px;
  border-width: ${pixelScaler(0.8)}px;
  margin-right: ${pixelScaler(10)}px;
`;

const FixedContent = styled.View`
  width: ${pixelScaler(100)}px;
  height: ${pixelScaler(100)}px;
  margin-right: ${pixelScaler(10)}px;
  border-radius: ${pixelScaler(10)}px;
  background-color: #9080f0;
`;

const ContentHeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${pixelScaler(30)}px;
`;

const SortButtonContainer = styled.TouchableOpacity`
  flex-direction: row;
`;

const Splace = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "Splace">;
}) => {
  const splace = route.params.splace;
  const theme = useContext<themeType>(ThemeContext);
  const [fold, setFold] = useState<boolean>(true);
  const [saved, setSaved] = useState<boolean>(false); // isSaved
  // const [modalVisible, setModalVisible] = useState<boolean>(false);

  return (
    <Container>
      <UpperContainer>
        <TitleContainer>
          <BldText33>{splace?.name}</BldText33>
          <TouchableOpacity
            onPress={() => {
              // if (!saved) {
              //   setModalVisible(true);
              // }
            }}
          >
            <Ionicons
              name={saved ? "bookmark" : "bookmark-outline"}
              size={pixelScaler(26)}
            />
          </TouchableOpacity>
        </TitleContainer>
        <ButtonsContainer>
          {!splace?.market ? (
            <Button onPress={() => {}} width={pixelScaler(98.3)}>
              <RegText13>Market</RegText13>
            </Button>
          ) : null}
          <Button
            onPress={() => {}}
            width={!splace?.market ? pixelScaler(98.3) : pixelScaler(150)}
          >
            <RegText13>연락정보</RegText13>
          </Button>
          <Button
            onPress={() => {}}
            width={!splace?.market ? pixelScaler(98.3) : pixelScaler(150)}
          >
            <RegText13>팔로우</RegText13>
          </Button>
        </ButtonsContainer>
        <TextContainer>
          <RegText13>
            위치{" "}
            <RegText13
              onPress={() => {}}
              style={{ color: theme.textHighlight }}
            >
              {"서울특별시 블라블라\n"}
            </RegText13>
          </RegText13>
          <RegText13>
            운영시간{" "}
            <RegText13
              onPress={() => {}}
              style={{ color: theme.textHighlight }}
            >
              {"10:00~\n"}
            </RegText13>
          </RegText13>
          <RegText13>
            메뉴{" "}
            <RegText13
              onPress={() => {}}
              style={{ color: theme.textHighlight }}
            >
              {"쉑버거\n"}
            </RegText13>
          </RegText13>
          <RegText13>{"반려동물 출입 가능"}</RegText13>
          {!fold ? (
            <RegText13>{`
The operation couldn’t is not connected

at node_modules/react-native/Libraries/WebSocket/WebSocket.js:260:8

in _eventEmitter.addListener$argument_1

at node_modules/react-native/Libraries/

vendor/emitter/EventEmitter.js:189:10 i`}</RegText13>
          ) : null}
          <UnfoldButtomContainer onPress={() => setFold(!fold)}>
            <Ionicons
              name={fold ? "chevron-down" : "chevron-up"}
              size={pixelScaler(30)}
            />
          </UnfoldButtomContainer>
        </TextContainer>
        <RatingTagsContainer>
          <RatingTags style={{ borderColor: theme.textHighlight }}>
            <RegText13 style={{ color: theme.textHighlight }}>
              Super Tasty!
            </RegText13>
          </RatingTags>
          <RatingTags>
            <RegText13>음식점</RegText13>
          </RatingTags>
          <RatingTags>
            <RegText13>햄버거</RegText13>
          </RatingTags>
        </RatingTagsContainer>
        <ScrollView
          style={{ marginBottom: pixelScaler(30) }}
          bounces={false}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {[0, 0, 0, 0, 0].map((item, index) => (
            <FixedContent key={index} />
          ))}
        </ScrollView>
        <ContentHeaderContainer>
          <BldText20>관련 게시물 {100}+</BldText20>
          <SortButtonContainer>
            <RegText13>최신 순</RegText13>
            <Ionicons
              name={fold ? "chevron-down" : "chevron-up"}
              size={pixelScaler(15)}
            />
          </SortButtonContainer>
        </ContentHeaderContainer>
      </UpperContainer>
      {[0, 0, 0, 0].map((item, index) => (
        <RowCardBoxContainer key={index}>
          <CardBox
            onPress={() => {}}
            url="https://media.wired.com/photos/59346dfa86599a3834f7d925/master/pass/hogwarts.jpg"
          />
          <CardBox
            onPress={() => {}}
            url="https://i.pinimg.com/originals/ee/7f/86/ee7f8649af3509ea64da7d2e5417866e.jpg"
          />
        </RowCardBoxContainer>
      ))}
    </Container>
  );
};

export default Splace;
