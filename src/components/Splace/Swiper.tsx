import React from "react";
import { Animated, ScrollView, View } from "react-native";
import { FixedContentType } from "../../types";
import { pixelScaler } from "../../utils";
import Image from "../Image";
import Carousel, {
  CarouselProps,
  getInputRangeFromIndexes,
} from "react-native-snap-carousel";

const Swiper = ({ item }: { item: FixedContentType }) => {
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
        inputRange: [0, 1, 2],
        outputRange: [1, 0.5, 0],
      }),
      transform: [
        {
          translateX: animatedValue.interpolate({
            inputRange: [-1, 0, 1, 2, 3, 4],
            outputRange: [
              0,
              0,
              -width + 25,
              -width * 2 + 50,
              -width * 3 + 75,
              -width * 3 + 75,
            ],
            extrapolate: "clamp",
          }),
          scale: animatedValue.interpolate({
            inputRange: [0, 1, 2, 3, 4],
            outputRange: [1, 0.9, 0.8, 0.7, 0.7],
            extrapolate: "clamp",
          }),
        },
      ],
    };
  };

  return (
    <Carousel
      data={item.imageUrls}
      renderItem={({ item: url, index }) => (
        <View
          style={{
            // shadowColor: "#000000",
            // shadowOffset: { width: 4, height: 4 },
            // shadowOpacity: 0.3,
            // shadowRadius: 4,
            borderRadius: 15,
          }}
        >
          <Image
            source={{ uri: url }}
            style={{
              backgroundColor: "#dadada",
              marginLeft: pixelScaler(20),
              width: pixelScaler(315),
              height:
                item.photoSize === 2
                  ? pixelScaler(420)
                  : item.photoSize === 1
                  ? pixelScaler(315)
                  : pixelScaler(236.25),
              borderRadius: 15,
            }}
          />
        </View>
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
