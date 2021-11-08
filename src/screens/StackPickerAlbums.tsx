import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
  FlatList,
  Alert,
} from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { AlbumType, StackGeneratorParamList, ThemeType } from "../types";
import { AlbumTitleKor, pixelScaler } from "../utils";
import { HeaderBackButton } from "../components/HeaderBackButton";
import { HeaderRightConfirm } from "../components/HeaderRightConfirm";
import { BldText16, RegText13 } from "../components/Text";
import ScreenContainer from "../components/ScreenContainer";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { Icons } from "../icons";
import * as MediaLibrary from "expo-media-library";
import { ImagePickerContext } from "../contexts/ImagePicker";
import { Icon } from "../components/Icon";
import { BLANK_IMAGE } from "../constants";

const AlbumContainer = styled.TouchableOpacity`
  height: ${pixelScaler(75)}px;
  padding: 0 ${pixelScaler(30)}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const AlbumThumbnail = styled.Image`
  width: ${pixelScaler(60)}px;
  height: ${pixelScaler(60)}px;
  border-radius: ${pixelScaler(10)}px;
  margin-right: ${pixelScaler(15)}px;
`;

const AlbumInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Seperator = styled.View`
  width: ${pixelScaler(315)}px;
  height: ${pixelScaler(0.67)}px;
  margin-left: ${pixelScaler(30)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.lightSeperator};
`;

const StackPickerAlbums = () => {
  const theme = useContext<ThemeType>(ThemeContext);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const [albums, setAlbums] = useState<AlbumType[]>();
  const { rootScreen, params } =
    useRoute<RouteProp<StackGeneratorParamList, "StackPickerAlbums">>().params;

  const { images, setImages } = useContext(ImagePickerContext);

  useEffect(() => {
    (async () => {
      const { accessPrivileges } = await MediaLibrary.requestPermissionsAsync();
      if (accessPrivileges === "none") {
        Alert.alert("앨범 권한이 필요합니다.");
        navigation.pop();
      }
      const albumsList = await MediaLibrary.getAlbumsAsync({
        includeSmartAlbums: true,
      });
      if (albumsList) {
        var tmp = [];
        for (let i = 0; i < albumsList.length; i++) {
          const album: MediaLibrary.Album = albumsList[i];
          var recents;
          var favorites;
          // console.log(album);
          const assets = await MediaLibrary.getAssetsAsync({
            album: album.id,
            first: 1,
          });
          var title = album.title;
          if (album.type === "smartAlbum") {
            if (title in AlbumTitleKor) {
              //@ts-ignore
              title = AlbumTitleKor[title];
            }
          }
          if (assets.totalCount > 0 && title) {
            if (album.title === "Recents") {
              recents = {
                title: title,
                id: album.id,
                count: assets.totalCount,
                thumbnail: assets.assets[0]?.uri ?? BLANK_IMAGE,
              };
            } else if (album.title === "Favorites") {
              favorites = {
                title: title,
                id: album.id,
                count: assets.totalCount,
                thumbnail: assets.assets[0]?.uri ?? BLANK_IMAGE,
              };
            } else {
              tmp.push({
                title: title,
                id: album.id,
                count: assets.totalCount,
                thumbnail: assets.assets[0]?.uri ?? BLANK_IMAGE,
              });
            }
          }
        }

        if (favorites) {
          tmp = [favorites, ...tmp];
        }
        if (recents) {
          tmp = [recents, ...tmp];
        }
        setAlbums(tmp);
      }
    })();
    navigation.setOptions({
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => {
            setImages([]);
            navigation.pop();
          }}
        />
      ),
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: 70,
            height: 70,
          }}
          onPress={() => {
            navigation.pop();
          }}
        >
          <Icon
            name="close"
            style={{ width: pixelScaler(11), height: pixelScaler(11) }}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <HeaderRightConfirm
          onPress={async () => {
            navigation.pop();
          }}
        />
      ),
      headerTitle: () => <BldText16>앨범 선택</BldText16>,
    });
  }, []);

  return (
    <ScreenContainer>
      <FlatList
        data={albums}
        renderItem={({ item, index }: { item: AlbumType; index: number }) => (
          <AlbumContainer
            key={index}
            onPress={() => {
              navigation.push("StackPickerAssets", {
                rootScreen,
                params,
                album: item,
              });
            }}
          >
            <AlbumInfo>
              <AlbumThumbnail source={{ uri: item.thumbnail }} />
              <BldText16>{item.title}</BldText16>
            </AlbumInfo>
            <RegText13 style={{ color: theme.greyTextLight }}>
              {item.count}
            </RegText13>
          </AlbumContainer>
        )}
        ItemSeparatorComponent={Seperator}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
};

export default StackPickerAlbums;
