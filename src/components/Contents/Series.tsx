import React from "react";
import { FlatList, View } from "react-native";
import styled from "styled-components/native";
import { SeriesType } from "../../types";
import { pixelScaler } from "../../utils";
import Image from "../Image";
import { BldText20 } from "../Text";
import Header from "./Header";

const Container = styled.View`
  margin-bottom: ${pixelScaler(30)}px;
`;

const TitleContianer = styled.View`
  padding: 0 ${pixelScaler(30)}px;
  margin-bottom: ${pixelScaler(20)}px;
`;

const Series = ({ item }: { item: SeriesType }) => {
  // console.log(item);
  return (
    <Container>
      <Header
        user={item.author}
        pressThreeDots={() => {
          console.log("press!");
        }}
      />
      <TitleContianer>
        <BldText20>{item.title}</BldText20>
      </TitleContianer>
      <FlatList
        data={item.photologs}
        horizontal={true}
        ListHeaderComponent={() => <View style={{ width: pixelScaler(30) }} />}
        ListFooterComponent={() => <View style={{ width: pixelScaler(20) }} />}
        keyExtractor={(item) => "" + item.id}
        renderItem={({ item, index }) => {
          return (
            <Image
              source={{ uri: item.imageUrls[0] }}
              style={{
                width: pixelScaler(100),
                height: pixelScaler(100),
                marginRight: pixelScaler(10),
                borderRadius: pixelScaler(10),
              }}
            />
          );
        }}
        showsHorizontalScrollIndicator={false}
        bounces={false}
      />
    </Container>
  );
};

export default Series;
