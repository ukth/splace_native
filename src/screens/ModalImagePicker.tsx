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
import { ThemeType } from "../types";
import { AlbumTitleKor, pixelScaler } from "../utils";
import { HeaderRightConfirm } from "../components/HeaderRightConfirm";
import {
  BldText13,
  BldText16,
  RegText13,
  RegText16,
  RegText9,
} from "../components/Text";
import { ZoomableImage } from "../components/ImagePicker/ZoomableImageComponent";
import ScreenContainer from "../components/ScreenContainer";
import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { ImagePickerContext } from "../contexts/ImagePicker";
import * as MediaLibrary from "expo-media-library";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { ProgressContext } from "../contexts/Progress";
import { Icon } from "../components/Icon";
import { BLANK_IMAGE } from "../constants";

const PickerContainer = styled.View`
  height: ${pixelScaler(290)}px;
  align-items: center;
  justify-content: center;
`;

const ButtonsContainer = styled.View`
  flex-direction: row;
  /* justify-content: space-between; */
  justify-content: center;
  position: absolute;
  right: ${pixelScaler(0)}px;
`;

const ImageContainer = styled.View`
  width: ${pixelScaler(315)}px;
  height: ${pixelScaler(315)}px;
  align-items: center;
  justify-content: center;
  background-color: #910;
`;

const SizeButtonsContainer = styled.View`
  right: ${pixelScaler(15)}px;
  top: ${pixelScaler(60)}px;
  width: ${pixelScaler(33)}px;
  height: ${pixelScaler(100)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.greyBackground};
  border-radius: ${pixelScaler(33)}px;
  justify-content: space-around;
  padding: ${pixelScaler(5)}px 0;
  align-items: center;
`;

const Button = styled.TouchableOpacity`
  height: ${pixelScaler(25)}px;
  justify-content: center;
  padding-top: ${pixelScaler(1.3)}px;
`;

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

const ImageItemContainer = styled.TouchableOpacity`
  width: ${pixelScaler(123)}px;
  height: ${pixelScaler(123)}px;
  margin-right: ${pixelScaler(3)}px;
  margin-bottom: ${pixelScaler(3)}px;
`;

const ImageItem = styled.Image`
  width: ${pixelScaler(123)}px;
  height: ${pixelScaler(123)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.greyBackground};
`;

const ImageItemFocused = styled.View`
  position: absolute;
  width: ${pixelScaler(123)}px;
  height: ${pixelScaler(123)}px;
  background-color: rgba(255, 255, 255, 0.7);
`;

const NumberLabelContainer = styled.View`
  width: ${pixelScaler(20)}px;
  height: ${pixelScaler(20)}px;
  border-radius: ${pixelScaler(20)}px;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: ${pixelScaler(10)}px;
  right: ${pixelScaler(10)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.themeBackground};
`;

const HeaderTitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ImageMonthContainer = styled.View`
  height: ${pixelScaler(20)}px;
  padding: 0 ${pixelScaler(10)}px;
  border-radius: ${pixelScaler(20)}px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: absolute;
  top: ${pixelScaler(10)}px;
  left: ${pixelScaler(10)}px;
  padding-top: ${pixelScaler(1.3)}px;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const NumberLabel = ({ ids, id }: { ids: string[]; id: string }) => {
  const idx = ids.indexOf(id);
  const theme = useContext<ThemeType>(ThemeContext);
  return (
    <NumberLabelContainer>
      <BldText13 style={{ color: theme.background }}>{idx + 1}</BldText13>
    </NumberLabelContainer>
  );
};

type AlbumType = {
  title: string;
  id: string;
  count: number;
  thumbnail: string;
};

const ModalImagePicker = () => {
  const theme = useContext<ThemeType>(ThemeContext);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const { setShowPicker } = useContext(ImagePickerContext);
  const [album, setAlbum] = useState<AlbumType>();
  const [albums, setAlbums] = useState<AlbumType[]>();
  const [focusedImageIndex, setFocusedImageIndex] = useState(0);

  const [showAlbums, setShowAlbums] = useState(false);
  const screenHeight = useWindowDimensions().height;

  const { images, setImages, setImageSize, imageSize } =
    useContext(ImagePickerContext);

  const [focusedSize, setFocusedSize] = useState<0 | 1 | 2>(imageSize);
  const flatListRef = useRef<any>();

  const [loadedImage, setLoadedImage] = useState<MediaLibrary.Asset[]>([]);

  const [selectedImages, setSelectedImages] = useState<
    (MediaLibrary.Asset & {
      zoom: number;
      offset_x: number;
      offset_y: number;
    })[]
  >([]);

  const [albumScrollIndex, setAlbumScrollIndex] = useState(0);

  const scrollIndicator = useRef(new Animated.Value(0)).current;

  const [size, setSize] = useState<{ width: number; height: number }>();

  const ZoomableRef = useRef<any>();

  const panY = useRef(new Animated.Value(screenHeight)).current;
  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const resetBottomSheet = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  });

  const closeBottomSheet = Animated.timing(panY, {
    toValue: screenHeight,
    duration: 300,
    useNativeDriver: true,
  });

  const closeModal = () => {
    closeBottomSheet.start(() => {
      setShowAlbums(false);
    });
  };

  const openModal = () => {
    resetBottomSheet.start(() => {
      setShowAlbums(false);
    });
  };

  const { spinner } = useContext(ProgressContext);

  const updateSelectedImage = async () => {
    selectedImages[focusedImageIndex] = {
      ...selectedImages[focusedImageIndex],
      zoom: ZoomableRef?.current?.state.zoom ?? 1,
      offset_x: ZoomableRef?.current?.state.offset_x ?? 0,
      offset_y: ZoomableRef?.current?.state.offset_y ?? 0,
    };
    setImageSize(focusedSize);

    const frameWidth =
      focusedSize === 2 ? pixelScaler(187.5) : pixelScaler(250);
    const frameHeight =
      focusedSize === 0 ? pixelScaler(187.5) : pixelScaler(250);
    let tmp = [];
    spinner.start(false);

    for (let i = 0; i < selectedImages.length; i++) {
      const image = selectedImages[i];
      const r = focusedSize === 0 ? 3 / 4 : focusedSize === 1 ? 1 : 4 / 3;

      var pixR;
      if (frameHeight / frameWidth < image.height / image.width) {
        pixR = image.width / (frameWidth * image.zoom);
      } else {
        pixR = image.height / (frameHeight * image.zoom);
      }

      const manipResult = await manipulateAsync(
        image.uri,
        [
          {
            crop: {
              width: frameWidth * pixR - 2,
              height: frameHeight * pixR - 2,
              originX: -image.offset_x * pixR + 1,
              originY: -image.offset_y * pixR + 1,
            },
          },
          {
            resize: {
              width: 1080,
            },
          },
        ],
        { compress: 0, format: SaveFormat.PNG }
      );
      // console.log(manipResult);
      tmp.push({
        edited: true,
        url: manipResult.uri,
        orgUrl: image.uri,
      });
    }
    spinner.stop();
    setShowPicker(false);
    navigation.pop();

    setImages(tmp);
  };

  useEffect(() => {
    (async () => {
      const { accessPrivileges } = await MediaLibrary.requestPermissionsAsync();
      if (accessPrivileges === "none") {
        alert("편집을 위해선 앨범 권한이 필요합니다.");
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
            sortBy: "creationTime",
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
          // console.log(assets.totalCount, album.title);
        }

        if (favorites) {
          tmp = [favorites, ...tmp];
        }
        if (recents) {
          tmp = [recents, ...tmp];
        }
        setAlbums(tmp);
        if (recents) {
          setAlbum(recents);
        } else {
          setAlbum(tmp[0]);
        }
      } else {
        Alert.alert("앨범을 불러올 수 없습니다.");
      }

      // albumsList);
      // setAlbums()
    })();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderRightConfirm
          onPress={async () => {
            await updateSelectedImage();
          }}
        />
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: 70,
            height: 70,
          }}
          onPress={() => {
            setShowPicker(false);
            navigation.pop();
          }}
        >
          <Icon
            name="close"
            style={{ width: pixelScaler(11), height: pixelScaler(11) }}
          />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <HeaderTitleContainer>
          <BldText16 numberOfLines={1} onPress={() => openModal()}>
            {album?.title ?? "사진 선택"}
          </BldText16>
          <Icon
            name="arrow_right"
            style={{
              width: pixelScaler(6),
              height: pixelScaler(12),
              marginLeft: pixelScaler(10),
              transform: [{ rotate: "90deg" }],
            }}
          />
        </HeaderTitleContainer>
      ),
    });
  }, [selectedImages, album]);

  useEffect(() => {
    if (focusedSize === 2 && selectedImages[focusedImageIndex]?.uri) {
      Image.getSize(selectedImages[focusedImageIndex].uri, (img_w, img_h) => {
        if (img_w / 187.5 > img_h / 250) {
          setSize({
            width: (pixelScaler(250) / img_h) * img_w,
            height: pixelScaler(250),
          });
        } else {
          setSize({
            width: pixelScaler(187.5),
            height: (pixelScaler(187.5) / img_w) * img_h,
          });
        }
      });
    } else {
      const height_px = focusedSize === 0 ? 187.5 : 250;
      if (selectedImages[focusedImageIndex]?.uri) {
        Image.getSize(selectedImages[focusedImageIndex].uri, (img_w, img_h) => {
          if (img_w / 250 > img_h / height_px) {
            setSize({
              width: (pixelScaler(height_px) / img_h) * img_w,
              height: pixelScaler(height_px),
            });
          } else {
            setSize({
              width: pixelScaler(250),
              height: (pixelScaler(250) / img_w) * img_h,
            });
          }
        });
      }
    }
  }, [focusedImageIndex, selectedImages, focusedSize, focusedImageIndex]);

  useEffect(() => {
    if (album) {
      (async () => {
        const assets = await MediaLibrary.getAssetsAsync({
          album: album.id,
          first: 300,
          sortBy: "creationTime",
        });
        setLoadedImage(assets.assets);
        setFocusedImageIndex(0);
        if (images.length === 0) {
        } else {
          const orgUrls = images.map((image) => image.orgUrl);
          setSelectedImages(
            assets.assets
              .filter((asset) => orgUrls.includes(asset.uri))
              .map((asset) => {
                return {
                  ...asset,
                  offset_x: 0,
                  offset_y: 0,
                  zoom: 1,
                };
              })
          );
        }
      })();
    }
  }, [album]);

  const fetchLoadImage = () => {
    if (album) {
      (async () => {
        const assets = await MediaLibrary.getAssetsAsync({
          album: album.id,
          first: 300,
          after: loadedImage[loadedImage.length - 1].id,
          sortBy: "creationTime",
        });
        setLoadedImage([
          ...loadedImage,
          ...assets.assets.map((asset) => {
            return {
              ...asset,
              zoom: 1,
              offset_x: 0,
              offset_y: 0,
            };
          }),
        ]);
      })();
    }
  };

  const handleResize = (n: 0 | 1 | 2) => {
    var tmp = [...selectedImages];
    tmp = tmp.map((image, index) =>
      index === focusedImageIndex
        ? image
        : {
            ...image,
            offset_x: 0,
            offset_y: 0,
            zoom: 1,
          }
    );
    setSelectedImages(tmp);
    setFocusedSize(n);
  };

  const animatedValue = useRef(new Animated.Value(1)).current;
  const animatedContainerHeight = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [187.5, 250],
    extrapolate: "clamp",
  });
  const animatedFrameHeight = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [227.5, 290],
    extrapolate: "clamp",
  });
  const [shortened, setShortened] = useState(false);

  const widen = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 400,
      useNativeDriver: false,
    }).start(() => setShortened(false));
  };

  const shorten = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 400,
      useNativeDriver: false,
    }).start(() => setShortened(true));
  };

  useEffect(() => {
    if (focusedSize === 0) {
      if (!shortened) {
        setTimeout(() => shorten(), 200);
      }
    } else {
      if (shortened) {
        setTimeout(() => widen(), 200);
      }
    }
  }, [focusedSize]);

  return (
    <ScreenContainer>
      <Animated.View
        style={{
          height: animatedFrameHeight,
          alignItems: "center",
          paddingTop: pixelScaler(20),
        }}
      >
        {/* <ImageContainer> */}
        <View
          style={{
            height: pixelScaler(focusedSize === 0 ? 187.5 : 250),
          }}
        >
          <Animated.View
            style={{
              height: animatedContainerHeight,
            }}
          >
            <ScrollView
              style={{
                borderRadius: pixelScaler(15),
                width: pixelScaler(focusedSize === 2 ? 187.5 : 250),
                height: pixelScaler(focusedSize === 0 ? 187.5 : 250),
                // height: animatedContainerHeight,
                borderWidth: pixelScaler(0.4),
                borderColor: theme.greyTextAlone,
              }}
              scrollEnabled={false}
            >
              {size &&
                selectedImages.length > 0 &&
                selectedImages[focusedImageIndex] && (
                  <ZoomableImage
                    ref={ZoomableRef}
                    initialData={selectedImages[focusedImageIndex]}
                    imageHeight={size.height}
                    imageWidth={size.width}
                    frameWidth={pixelScaler(focusedSize === 2 ? 187.5 : 250)}
                    frameHeight={pixelScaler(focusedSize === 0 ? 187.5 : 250)}
                  />
                )}
            </ScrollView>
          </Animated.View>
        </View>
        {/* </ImageContainer> */}
        <ButtonsContainer>
          {/* <Button
            onPress={() => {
              openModal();
            }}
          >
            <RegText16>{album?.title ?? "최근 항목"}</RegText16>
          </Button> */}
          <SizeButtonsContainer>
            <Button
              onPress={() => handleResize(0)}
              hitSlop={{
                top: pixelScaler(5),
                bottom: pixelScaler(5),
                left: pixelScaler(5),
                right: pixelScaler(5),
              }}
            >
              <BldText13
                style={
                  focusedSize === 0 ? {} : { color: theme.greyBackgroundText }
                }
              >
                4:3
              </BldText13>
            </Button>
            <Button
              onPress={() => handleResize(1)}
              hitSlop={{
                top: pixelScaler(5),
                bottom: pixelScaler(5),
                left: pixelScaler(5),
                right: pixelScaler(5),
              }}
            >
              <BldText13
                style={
                  focusedSize === 1 ? {} : { color: theme.greyBackgroundText }
                }
              >
                1:1
              </BldText13>
            </Button>
            <Button
              onPress={() => handleResize(2)}
              hitSlop={{
                top: pixelScaler(5),
                bottom: pixelScaler(5),
                left: pixelScaler(5),
                right: pixelScaler(5),
              }}
            >
              <BldText13
                style={
                  focusedSize === 2 ? {} : { color: theme.greyBackgroundText }
                }
              >
                3:4
              </BldText13>
            </Button>
          </SizeButtonsContainer>
        </ButtonsContainer>
      </Animated.View>

      <View>
        <FlatList
          // maxToRenderPerBatch={10}
          // initialNumToRender={10}
          bounces={false}
          ref={flatListRef}
          data={loadedImage}
          renderItem={({
            item,
            index,
          }: {
            item: MediaLibrary.Asset;
            index: number;
          }) => {
            const creationTime = new Date(item.creationTime);
            const month = creationTime.getMonth() + 1;
            const year = creationTime.getFullYear();
            const prevTime = loadedImage[index - 1]?.creationTime
              ? new Date(loadedImage[index - 1]?.creationTime)
              : null;

            return (
              <ImageItemContainer
                key={index}
                onPress={() => {
                  const imageIds = selectedImages.map((image) => image.id);
                  const ind = imageIds.indexOf(item.id);

                  var tmp = [...selectedImages];
                  if (ZoomableRef?.current?.state) {
                    tmp[focusedImageIndex] = {
                      ...tmp[focusedImageIndex],
                      zoom: ZoomableRef?.current?.state.zoom,
                      offset_x: ZoomableRef?.current?.state.offset_x,
                      offset_y: ZoomableRef?.current?.state.offset_y,
                    };
                    setSelectedImages(tmp);
                    // console.log(tmp);
                  }

                  if (ind === -1 && selectedImages.length < 16) {
                    setSelectedImages([
                      ...tmp,
                      { ...item, zoom: 1, offset_x: 0, offset_y: 0 },
                    ]);
                    setFocusedImageIndex(tmp.length);
                  } else {
                    if (selectedImages[focusedImageIndex].id === item.id) {
                      setFocusedImageIndex(selectedImages.length - 2);
                      tmp.splice(ind, 1);
                      setSelectedImages(tmp);
                    } else if (ind !== -1) {
                      setFocusedImageIndex(imageIds.indexOf(item.id));
                    }
                  }
                }}
              >
                <ImageItem source={{ uri: item.uri }} />
                {selectedImages[focusedImageIndex]?.id === item.id ? (
                  <ImageItemFocused />
                ) : null}
                {selectedImages.map((image) => image.id).includes(item.id) ? (
                  <NumberLabel
                    ids={selectedImages.map((image) => image.id)}
                    id={item.id}
                  />
                ) : null}
                {index === 0 ||
                (prevTime &&
                  !(
                    year === prevTime.getFullYear() &&
                    month === prevTime.getMonth() + 1
                  )) ? (
                  <ImageMonthContainer>
                    <RegText13>
                      {year + (month < 10 ? "-0" : "-") + month}
                    </RegText13>
                  </ImageMonthContainer>
                ) : null}
              </ImageItemContainer>
            );
          }}
          numColumns={3}
          onEndReached={fetchLoadImage}
          onEndReachedThreshold={2}
          // onScroll={Animated.event(
          //   [{ nativeEvent: { contentOffset: { y: scrollIndicator } } }],
          //   { useNativeDriver: false }
          // )}
          // scrollEventThrottle={16}
        />
      </View>

      <Animated.View
        style={{
          height: screenHeight,
          backgroundColor: theme.background,
          width: "100%",
          position: "absolute",
          transform: [{ translateY: translateY }],
        }}
      >
        <FlatList
          data={albums}
          renderItem={({ item, index }: { item: AlbumType; index: number }) => (
            <AlbumContainer
              key={index}
              onPress={() => {
                flatListRef.current.scrollToIndex({
                  animated: false,
                  index: 0,
                });
                closeModal();
                setAlbum(item);
              }}
            >
              <AlbumInfo>
                <AlbumThumbnail source={{ uri: item.thumbnail }} />
                <BldText16
                  style={{ width: pixelScaler(200) }}
                  numberOfLines={1}
                >
                  {item.title}
                </BldText16>
              </AlbumInfo>
              <RegText13 style={{ color: theme.greyTextLight }}>
                {item.count}
              </RegText13>
            </AlbumContainer>
          )}
          ListFooterComponent={<View style={{ height: pixelScaler(100) }} />}
          ItemSeparatorComponent={Seperator}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    </ScreenContainer>
  );
};

export default ModalImagePicker;
