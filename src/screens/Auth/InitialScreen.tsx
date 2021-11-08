import React, { useState, useEffect, useContext } from "react";
import { Animated, Image, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/core";
import styled, { ThemeContext } from "styled-components/native";
import { setStatusBarStyle } from "expo-status-bar";
import ScreenContainer from "../../components/ScreenContainer";
import { pixelScaler } from "../../utils";
import { RegText16 } from "../../components/Text";
import { AuthStackParamList, ThemeType } from "../../types";
import { StackNavigationProp } from "@react-navigation/stack";

const Button = styled.TouchableOpacity`
  width: ${pixelScaler(147)}px;
  align-items: center;
  justify-content: center;
  border-radius: ${pixelScaler(10)}px;
  border-color: ${({ theme }: { theme: ThemeType }) => theme.white};
`;

const InitialScreen = () => {
  var timerId: NodeJS.Timer;
  const [backgroundIndex, setBackgroundIndex] = useState(-1);
  const { width, height } = useWindowDimensions();

  const [firstAnimation, setFirstAnimation] = useState(new Animated.Value(0));
  const [buttonOpacity, setButtonOpacity] = useState(new Animated.Value(0));

  const theme = useContext<ThemeType>(ThemeContext);

  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();

  const imageSources = [
    require("../../../assets/images/registration_images/Find.jpg"),
    require("../../../assets/images/registration_images/discover.jpg"),
    require("../../../assets/images/registration_images/Feel.jpg"),
    require("../../../assets/images/registration_images/experience.jpg"),
    require("../../../assets/images/registration_images/enjoy.jpg"),
    require("../../../assets/images/registration_images/plan.jpg"),
    require("../../../assets/images/registration_images/save.jpg"),
    require("../../../assets/images/registration_images/share.jpg"),
    require("../../../assets/images/registration_images/showoff.jpg"),
    require("../../../assets/images/registration_images/Find.jpg"),
  ];

  useEffect(() => {
    // setStatusBarStyle("light");
    Animated.timing(firstAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      timerId = setInterval(() => {
        setBackgroundIndex((prev) => (prev < 9 ? prev + 1 : prev));
      }, 500);
    });
  }, []);
  navigation.addListener("focus", () => setStatusBarStyle("light"));

  useEffect(() => {
    if (backgroundIndex === 9) {
      clearInterval(timerId);
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }
  }, [backgroundIndex]);

  const boxInterpolation = firstAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgb(255,255,255)", "rgb(0,0,0)"],
  });

  const animatedStyle = {
    backgroundColor: boxInterpolation,
  };

  return (
    <ScreenContainer style={{ backgroundColor: "#f00" }}>
      {backgroundIndex < 0 ? (
        <Animated.View
          style={{
            position: "absolute",

            width: width,
            height,
            zIndex: 10,
            ...animatedStyle,
          }}
        />
      ) : null}
      {backgroundIndex <= 0 ? (
        <Image
          source={imageSources[0]}
          style={{
            position: "absolute",
            left: -1,
            width: width + 2,
            height,
            zIndex: 9,
          }}
        />
      ) : null}
      {backgroundIndex <= 1 ? (
        <Image
          source={imageSources[1]}
          style={{
            position: "absolute",
            left: -1,
            width: width + 2,
            height,
            zIndex: 8,
          }}
        />
      ) : null}
      {backgroundIndex <= 2 ? (
        <Image
          source={imageSources[2]}
          style={{
            position: "absolute",
            left: -1,
            width: width + 2,
            height,
            zIndex: 7,
          }}
        />
      ) : null}
      {backgroundIndex <= 3 ? (
        <Image
          source={imageSources[3]}
          style={{
            position: "absolute",
            left: -1,
            width: width + 2,
            height,
            zIndex: 6,
          }}
        />
      ) : null}
      {backgroundIndex <= 4 ? (
        <Image
          source={imageSources[4]}
          style={{
            position: "absolute",
            left: -1,
            width: width + 2,
            height,
            zIndex: 5,
          }}
        />
      ) : null}
      {backgroundIndex <= 5 ? (
        <Image
          source={imageSources[5]}
          style={{
            position: "absolute",
            left: -1,
            width: width + 2,
            height,
            zIndex: 4,
          }}
        />
      ) : null}
      {backgroundIndex <= 6 ? (
        <Image
          source={imageSources[6]}
          style={{
            position: "absolute",
            left: -1,
            width: width + 2,
            height,
            zIndex: 3,
          }}
        />
      ) : null}
      {backgroundIndex <= 7 ? (
        <Image
          source={imageSources[7]}
          style={{
            position: "absolute",
            left: -1,
            width: width + 2,
            height,
            zIndex: 2,
          }}
        />
      ) : null}
      {backgroundIndex <= 8 ? (
        <Image
          source={imageSources[8]}
          style={{
            position: "absolute",
            left: -1,
            width: width + 2,
            height,
            zIndex: 1,
          }}
        />
      ) : null}
      {backgroundIndex <= 9 ? (
        <Image
          source={imageSources[9]}
          style={{
            position: "absolute",
            left: -1,
            width: width + 2,
            height,
            zIndex: 0,
          }}
        />
      ) : null}
      <Animated.View
        style={{
          position: "absolute",
          bottom: pixelScaler(60),
          width,
          height: pixelScaler(60),
          zIndex: 1,
          opacity: buttonOpacity,
          flexDirection: "row",
          paddingHorizontal: pixelScaler(30),
          justifyContent: "space-between",
        }}
      >
        <Button onPress={() => navigation.push("LogIn")}>
          <RegText16 style={{ color: theme.white }}>로그인</RegText16>
        </Button>
        <Button onPress={() => navigation.push("RegistrationStack")}>
          <RegText16 style={{ color: theme.white }}>회원가입</RegText16>
        </Button>
      </Animated.View>
    </ScreenContainer>
  );
};

export default InitialScreen;
