import React, { useRef, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { isLoggedInVar, logUserOut, tokenVar } from "../apollo";

export default function Market({ navigation }: { navigation: any }) {
  return (
    <ScrollView
      maximumZoomScale={2.5}
      minimumZoomScale={1.0}
      style={{ backgroundColor: "#a0e0d0" }}
    >
      <Image
        source={{
          uri: "https://www.surfcanarias.com/wp-content/uploads/2020/05/Surfing-Equipment-scaled.jpg",
        }}
        style={{ width: 200, height: 200 }}
      />
      <Text>hello</Text>
      <Text>hello</Text>
      <Text>hello</Text>
      <Text>hello</Text>
      <Text>hello</Text>
      <Text>hello</Text>
    </ScrollView>
  );
}
