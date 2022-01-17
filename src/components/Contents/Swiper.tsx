import React, { useState } from "react";
import { Animated, TouchableWithoutFeedback, View } from "react-native";
import { PhotologType, StackGeneratorParamList } from "../../types";
import { pixelScaler } from "../../utils";
import Image from "../Image";
import Carousel, {
  CarouselProps,
  getInputRangeFromIndexes,
} from "react-native-snap-carousel";
import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { RegText13 } from "../Text";

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
              -width + pixelScaler(22.3),
              -width * 2 + pixelScaler(22.3),
              -width * 3 + pixelScaler(30),
              -width * 3 + pixelScaler(30),
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

  const [scrollIndex, setScrollIndex] = useState(0);

  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  return (
    <Carousel
      data={item.imageUrls}
      onSnapToItem={(index: number) => setScrollIndex(index)}
      renderItem={({ item: url, index }) => (
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.push("ImagesViewer", { urls: item.imageUrls })
          }
        >
          {scrollIndex + 3 > index ? (
            <Image
              source={{ uri: url }}
              style={{
                backgroundColor: "#dadada",
                width: pixelScaler(345),
                marginLeft: pixelScaler(15),
                height:
                  item.photoSize === 2
                    ? pixelScaler(460)
                    : item.photoSize === 1
                    ? pixelScaler(345)
                    : pixelScaler(258.75),
                borderRadius: pixelScaler(10),
              }}
            />
          ) : (
            <View
              style={{
                backgroundColor: "#dadada",
                width: pixelScaler(345),
                marginLeft: pixelScaler(15),
                height:
                  item.photoSize === 2
                    ? pixelScaler(460)
                    : item.photoSize === 1
                    ? pixelScaler(345)
                    : pixelScaler(258.75),
                borderRadius: pixelScaler(10),
              }}
            />
          )}
        </TouchableWithoutFeedback>
      )}
      sliderWidth={pixelScaler(375)}
      itemWidth={pixelScaler(375)}
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
