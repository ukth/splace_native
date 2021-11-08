import React, { useState, useEffect, useRef, useContext } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../components/ScreenContainer";
import { useMutation, useQuery } from "@apollo/client";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  PhotologType,
  SplaceType,
  StackGeneratorParamList,
  ThemeType,
} from "../types";
import styled, { ThemeContext } from "styled-components/native";
import { pixelScaler, shortenAddress } from "../utils";
import { FlatList } from "react-native";
import {
  GET_LOGS_BY_CATEGORY,
  GET_SPLACES_BY_RATINGTAG,
  LOG_GETLOGSBYCATEGORIES,
} from "../queries";
import { TouchableOpacity } from "react-native-gesture-handler";
import Image from "../components/Image";
import { BldText13, RegText13, RegText16 } from "../components/Text";
import { ModalKeep } from "../components/ModalKeep";
import { Icon } from "../components/Icon";
import { BLANK_IMAGE } from "../constants";

const Tag = styled.View`
  height: ${pixelScaler(25)}px;
  padding: 0 ${pixelScaler(10)}px;
  border-width: ${pixelScaler(0.67)}px;
  margin-right: ${pixelScaler(9)}px;
  padding-top: ${pixelScaler(1.3)}px;
  align-items: center;
  justify-content: center;
`;

const SplaceItemContainer = styled.View`
  width: ${pixelScaler(170)}px;
  height: ${pixelScaler(225)}px;
`;

const LabelContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${pixelScaler(13)}px;
  align-items: center;
  width: ${pixelScaler(145)}px;
`;
const TagsContainer = styled.View`
  flex-direction: row;
`;

const SplacesByRatingtag = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const [splaceId, setSplaceId] = useState<number>();
  const [modalVisible, setModalVisible] = useState(false);

  const { ratingtag } =
    useRoute<RouteProp<StackGeneratorParamList, "SplacesByRatingtag">>().params;

  const { data, loading, fetchMore, refetch } = useQuery(
    GET_SPLACES_BY_RATINGTAG,
    {
      variables: { tagId: ratingtag.id },
    }
  );

  navigation.addListener("focus", () => refetch());

  const theme = useContext<ThemeType>(ThemeContext);

  const [log_getSplaces, _1] = useMutation(LOG_GETLOGSBYCATEGORIES);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Tag
          style={{
            borderColor: theme.borderHighlight,
            borderRadius: pixelScaler(25),
          }}
        >
          <RegText16 style={{ color: theme.borderHighlight }}>
            {ratingtag.name}
          </RegText16>
        </Tag>
      ),
    });
    try {
      log_getSplaces({ variables: { tagId: ratingtag.id } });
    } catch {}
  }, []);

  return (
    <ScreenContainer style={{ padding: pixelScaler(30) }}>
      <FlatList
        data={data?.getSplacesByRatingtag?.splaces}
        numColumns={2}
        onEndReached={() =>
          fetchMore({
            variables: {
              tagId: ratingtag.id,
              lastId:
                data?.getSplacesByRatingtag?.splaces[
                  data?.getSplacesByRatingtag?.splaces.length - 1
                ].id,
            },
          })
        }
        keyExtractor={(item) => item.id + ""}
        renderItem={({ item: splace }: { item: SplaceType }) => (
          <SplaceItemContainer>
            <TouchableOpacity
              onPress={() => navigation.push("Splace", { splace })}
            >
              <Image
                source={{ uri: splace.thumbnail ?? BLANK_IMAGE }}
                style={{
                  width: pixelScaler(145),
                  height: pixelScaler(145),
                  borderRadius: pixelScaler(10),
                  marginBottom: pixelScaler(12),
                }}
              />
            </TouchableOpacity>
            <LabelContainer>
              <TouchableOpacity
                onPress={() => navigation.push("Splace", { splace })}
              >
                <BldText13
                  style={{ width: pixelScaler(130) }}
                  numberOfLines={1}
                >
                  {splace.name}
                </BldText13>
              </TouchableOpacity>
              <TouchableOpacity>
                <Icon
                  name={splace.isSaved ? "bookmark_fill" : "bookmark_black"}
                  style={{
                    width: pixelScaler(12),
                    height: pixelScaler(18),
                  }}
                />
              </TouchableOpacity>
            </LabelContainer>

            <TagsContainer>
              <Tag
                style={{
                  height: pixelScaler(20),
                }}
              >
                <RegText13>{shortenAddress(splace.address)}</RegText13>
              </Tag>
              {splace.bigCategories?.length ? (
                <Tag
                  style={{
                    borderRadius: pixelScaler(20),
                    height: pixelScaler(20),
                  }}
                >
                  <RegText13>{splace.bigCategories[0].name}</RegText13>
                </Tag>
              ) : null}
            </TagsContainer>
          </SplaceItemContainer>
        )}
      />
      {splaceId ? (
        <ModalKeep
          splaceId={splaceId}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      ) : null}
    </ScreenContainer>
  );
};

export default SplacesByRatingtag;
