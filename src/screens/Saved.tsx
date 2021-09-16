import React, { useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Text, View } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { RegText16, RegText33 } from "../components/Text";
import { useWindowDimensions, Animated } from "react-native";
import { useRef } from "react";
import { useContext } from "react";
import { pixelScaler } from "../utils";
import { useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import Image from "../components/Image";

const TabView = styled.ScrollView`
  flex: 1;
  z-index: 3;
`;

function Saved() {
  const { width } = useWindowDimensions();
  const tabViewWidth = width - pixelScaler(60);
  const topTabWidth = pixelScaler(65);
  const theme = useContext(ThemeContext);

  const Container = styled.View`
    flex: 1;
    background-color: ${theme.background};
    padding: 0 ${pixelScaler(30)}px;
  `;

  const Screen = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    width: ${tabViewWidth}px;
  `;

  const TabBar = styled.View`
    width: 100%;
    height: ${pixelScaler(60)}px;
    flex-direction: row;
    justify-content: space-between;
  `;

  const TopTab = styled.TouchableOpacity`
    width: ${topTabWidth}px;
    align-items: center;
    justify-content: center;
    background-color: ${theme.background};
  `;
  const BottomBarContainer = styled.View`
    width: 100%;
    height: ${pixelScaler(1)}px;
    background-color: #c4c4c4;
  `;

  const scrollIndicator = useRef(new Animated.Value(0)).current;

  const [tabViewIndex, setTabViewIndex] = useState(0);
  scrollIndicator.addListener(({ value }) => {
    // console.log(value);
    const btwWidth = tabViewWidth - topTabWidth * 2;
    if (value < (topTabWidth + btwWidth) / 2) {
      (async () => setTabViewIndex(0))();
    } else if (value < ((topTabWidth + btwWidth) * 3) / 2) {
      setTabViewIndex(1);
    } else {
      setTabViewIndex(2);
    }
  });

  const scrollIndicatorPosition = Animated.multiply(
    scrollIndicator,
    1 / 2
  ).interpolate({
    inputRange: [0, tabViewWidth],
    outputRange: [0, tabViewWidth - topTabWidth],
    extrapolate: "clamp",
  });

  // useEffect(() => {
  //   console.log(scrollIndicator);
  // }, [scrollIndicator]);

  const scrollRef = useRef<any>();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
        paddingHorizontal: pixelScaler(30),
      }}
    >
      <TabBar>
        <TopTab
          onPress={() => {
            scrollRef.current?.scrollTo({ x: 0 });
          }}
        >
          <RegText16
            style={{
              color: tabViewIndex === 0 ? theme.text : theme.tabBarGrey,
            }}
          >
            게시물
          </RegText16>
        </TopTab>
        <TopTab
          onPress={() => {
            scrollRef.current?.scrollTo({ x: tabViewWidth });
          }}
        >
          <RegText16
            style={{
              color: tabViewIndex === 1 ? theme.text : theme.tabBarGrey,
            }}
          >
            지도
          </RegText16>
        </TopTab>
        <TopTab
          onPress={() => {
            scrollRef.current?.scrollTo({ x: tabViewWidth * 2 });
          }}
        >
          <RegText16
            style={{
              color: tabViewIndex === 2 ? theme.text : theme.tabBarGrey,
            }}
          >
            계정
          </RegText16>
        </TopTab>
      </TabBar>
      <BottomBarContainer>
        <Animated.View
          style={{
            width: pixelScaler(65),
            backgroundColor: theme.text,
            height: pixelScaler(1),
            transform: [{ translateX: scrollIndicatorPosition }],
          }}
        />
      </BottomBarContainer>
      <TabView
        ref={scrollRef}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollIndicator } } }],
          {
            useNativeDriver: false,
            // listener: (event) => {
            //   console.log(event.nativeEvent.contentOffset.x);
            //   if (event.nativeEvent.contentOffset.x < 150) {
            //     setTabViewIndex(0);
            //   } else if (event.nativeEvent.contentOffset.x < 450) {
            //     setTabViewIndex(1);
            //   }
            // },
          }
        )}
        scrollEventThrottle={5}
      >
        <Screen>
          <Image
            source={{
              uri: "https://www.surfcanarias.com/wp-content/uploads/2020/04/beneficios-del-surf-1-610x407.jpg",
            }}
            style={{
              width: 100,
              height: 100,
            }}
          />
        </Screen>
        <Screen>
          <RegText33>222</RegText33>
        </Screen>
        <Screen>
          <RegText33>333333</RegText33>
        </Screen>
      </TabView>
    </View>
  );
}

export default Saved;
