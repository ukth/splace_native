import React from "react";
import {
  Animated,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  CardBoxPropType,
  PhotologType,
  StackGeneratorParamList,
} from "../../types";
import { pixelScaler } from "../../utils";
import Image from "../Image";
import Carousel, {
  CarouselProps,
  getInputRangeFromIndexes,
} from "react-native-snap-carousel";
import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";

const Swiper = ({ item }: { item: PhotologType }) => {
  const scrollInterpolator = (
    index: number,
    carouselProps: CarouselProps<any>
  ) => {
    const range = [3, 2, 1, 0, -1];
    const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
    const outputRange = range;

    return { inputRange, outputRange };
  };
  const animatedStyles = (
    index: number,
    animatedValue: Animated.Value | any,
    carouselProps: CarouselProps<any>
  ) => {
    const sizeRef = carouselProps.vertical
      ? carouselProps.itemHeight
      : carouselProps.itemWidth;
    const translateProp = carouselProps.vertical ? "translateY" : "translateX";

    const width = carouselProps.itemWidth ?? 0;

    // console.log(typeof(animatedValue));
    // console.log(animatedValue);
    // console.log(Object.keys(animatedValue));
    return {
      zIndex: carouselProps.data.length - index,
      opacity: animatedValue.interpolate({
        inputRange: [0, 1, 1.9, 2],
        outputRange: [1, 1, 1, 0],
      }),
      transform: [
        {
          translateX: animatedValue.interpolate({
            inputRange: [-1, 0, 1, 2, 3, 4],
            outputRange: [
              0,
              0,
              -width + 22.5,
              -width * 2 + 25,
              -width * 3 + 24,
              -width * 3 + 24,
            ],
            extrapolate: "clamp",
          }),
          scale: animatedValue.interpolate({
            inputRange: [0, 1, 2, 3, 4],
            outputRange: [1, 0.9, 0.9, 0.9, 0.9],
            extrapolate: "clamp",
          }),
        },
      ],
    };
  };

  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  return (
    <Carousel
      data={item.imageUrls}
      renderItem={({ item: url, index }) => (
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.push("ImagesViewer", { urls: item.imageUrls })
          }
        >
          <Image
            source={{ uri: url }}
            style={{
              backgroundColor: "#dadada",
              marginLeft: pixelScaler(5),
              width: pixelScaler(345),
              height:
                item.photoSize === 2
                  ? pixelScaler(460)
                  : item.photoSize === 1
                  ? pixelScaler(345)
                  : pixelScaler(258.75),
              borderRadius: pixelScaler(15),
            }}
          />
        </TouchableWithoutFeedback>
      )}
      sliderWidth={400}
      itemWidth={380}
      layout={"stack"}
      layoutCardOffset={12}
      inactiveSlideOpacity={1}
      activeAnimationType={"decay"}
      scrollInterpolator={scrollInterpolator}
      slideInterpolatedStyle={animatedStyles}
      useScrollView={true}
      swipeThreshold={5}
    />
  );
};

export default Swiper;
