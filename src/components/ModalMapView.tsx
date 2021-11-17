import React, { useContext, useState, useEffect, useRef } from "react";
import styled, { ThemeContext } from "styled-components/native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import BottomSheetModal from "./BottomSheetModal";
import { coords2address, pixelScaler } from "../utils";
import { BldText16, RegText13, RegText16 } from "./Text";
import { Ionicons } from "@expo/vector-icons";
import { SplaceType, StackGeneratorParamList, ThemeType } from "../types";
import clustering from "density-clustering";
import Image from "./Image";
import * as Linking from "expo-linking";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/core";
import { Icon } from "./Icon";
import * as Location from "expo-location";
import { BLANK_IMAGE } from "../constants";

const MarkerContainer = styled.TouchableOpacity`
  padding: ${pixelScaler(20)}px ${pixelScaler(20)}px;
  align-items: center;
  justify-content: center;
`;

const SingleMarker = styled.View`
  background-color: #00bcd1;
  width: ${pixelScaler(16)}px;
  height: ${pixelScaler(16)}px;
  border-radius: ${pixelScaler(16)}px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
`;

const ClusteredMarker = styled.View`
  background-color: #00bcd1;
  width: ${pixelScaler(35)}px;
  height: ${pixelScaler(35)}px;
  border-radius: ${pixelScaler(35)}px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
  align-items: center;
  justify-content: center;
`;

const ModalDragBar = styled.View`
  position: absolute;
  width: ${pixelScaler(100)}px;
  height: ${pixelScaler(4)}px;
  border-radius: ${pixelScaler(2)}px;
  background-color: ${({ theme }: { theme: ThemeType }) => theme.modalDragBar};
  top: ${pixelScaler(12)}px;
  z-index: 1;
  /* margin-bottom: ${pixelScaler(30)}px; */
`;

const SplaceInfo = styled.View`
  position: absolute;
  left: ${pixelScaler(15)}px;
  bottom: ${pixelScaler(45)}px;
  width: ${pixelScaler(345)}px;
  height: ${pixelScaler(205)}px;
  padding: ${pixelScaler(20)}px ${pixelScaler(20)}px;
  border-radius: ${pixelScaler(15)}px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
  background-color: ${({ theme }: { theme: ThemeType }) => theme.background};
`;

const UpperContainer = styled.TouchableOpacity`
  flex-direction: row;
  margin-bottom: ${pixelScaler(13)}px;
`;

const InfoContainer = styled.View``;

const FoundRouteButton = styled.TouchableOpacity`
  height: ${pixelScaler(35)}px;
  border-width: ${pixelScaler(1)}px;
  border-radius: ${pixelScaler(10)}px;
  border-color: ${({ theme }: { theme: ThemeType }) => theme.borderHighlight};
  align-items: center;
  justify-content: center;
`;
const TagsContainer = styled.View`
  flex-direction: row;
  width: ${pixelScaler(200)}px;
  flex-wrap: wrap;
  overflow: hidden;
  position: absolute;
  bottom: ${pixelScaler(0)}px;
`;

const Tag = styled.View`
  height: ${pixelScaler(20)}px;
  padding: 0 ${pixelScaler(10)}px;
  border-radius: ${pixelScaler(12.5)}px;
  border-width: ${pixelScaler(0.7)}px;
  align-items: center;
  justify-content: center;
  margin-right: ${pixelScaler(7)}px;
  margin-bottom: ${pixelScaler(5)}px;
`;

const BackToMeButton = styled.TouchableOpacity`
  position: absolute;
  right: ${pixelScaler(15)}px;
  top: ${pixelScaler(30)}px;
  width: ${pixelScaler(35)}px;
  height: ${pixelScaler(35)}px;
  background-color: ${({ theme }: { theme: ThemeType }) => theme.white};
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
  border-radius: ${pixelScaler(10)}px;
  align-items: center;
  justify-content: center;
`;

const ModalMapView = ({
  showMap,
  setShowMap,
  latitude,
  longitude,
  splaces,
}: {
  showMap: boolean;
  setShowMap: (_: boolean) => void;
  latitude?: number;
  longitude?: number;
  splaces: SplaceType[];
}) => {
  const { width } = useWindowDimensions();
  const theme = useContext<ThemeType>(ThemeContext);

  const [userLocation, setUserLocation] =
    useState<{ latitude: number; longitude: number }>();

  let latitudeDelta = 0.03;
  let longitudeDelta = 0.008;

  if (splaces.length > 1) {
    let max_lat = -90,
      max_lon = -180,
      min_lat = 90,
      min_lon = 180;

    for (let i = 0; i < splaces.length; i++) {
      const splace = splaces[i];
      if (!splace) {
        continue;
      }
      if (splace.lat > max_lat) {
        max_lat = splace.lat;
      }
      if (splace.lat < min_lat) {
        min_lat = splace.lat;
      }
      if (splace.lon > max_lon) {
        max_lon = splace.lon;
      }
      if (splace.lon < min_lon) {
        min_lon = splace.lon;
      }
    }

    if (max_lat !== min_lat && max_lon !== min_lon) {
      latitudeDelta = (max_lat - min_lat) * 2;
      longitudeDelta = (max_lon - min_lon) * 1.5;
    } else if (max_lat !== min_lat) {
      latitudeDelta = (max_lat - min_lat) * 2;
    } else if (max_lon !== min_lon) {
      longitudeDelta = (max_lon - min_lon) * 1.5;
    }
    latitude = (max_lat + min_lat) / 2 - latitudeDelta * 0.15;
    longitude = (max_lon + min_lon) / 2;
  } else if (splaces.length === 1) {
    latitude = splaces[0].lat;
    longitude = splaces[0].lon;
  }

  const [delta, setDelta] = useState(latitudeDelta);
  const [clustered, setClustered] = useState<number[][]>();
  const [selectedSplaceIndex, setSelectedSplaceIndex] = useState(0);
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    (async () => {
      const add = await coords2address({
        lat: splaces[selectedSplaceIndex].lat,
        lon: splaces[selectedSplaceIndex].lon,
      });
      setAddress(add);
    })();
  }, [selectedSplaceIndex]);

  const getCenter = (indices: number[]) => {
    let max_lat = -90,
      max_lon = -180,
      min_lat = 90,
      min_lon = 180;
    for (let i = 0; i < indices.length; i++) {
      const splace = splaces[indices[i]];
      if (!splace) {
        continue;
      }
      if (splace.lat > max_lat) {
        max_lat = splace.lat;
      }
      if (splace.lat < min_lat) {
        min_lat = splace.lat;
      }
      if (splace.lon > max_lon) {
        max_lon = splace.lon;
      }
      if (splace.lon < min_lon) {
        min_lon = splace.lon;
      }
    }
    return {
      latitude: (min_lat + max_lat) / 2,
      longitude: (min_lon + max_lon) / 2,
    };
  };

  useEffect(() => {
    var dataset = splaces.map((splace) => [splace?.lat ?? 0, splace?.lon ?? 0]);
    var optics = new clustering.OPTICS();
    // parameters: 6 - neighborhood radius, 2 - number of points in neighborhood to form a cluster
    var clusters = optics.run(dataset, delta / 20, 1);
    // var plot = optics.getReachabilityPlot();

    setClustered(clusters);
  }, [delta]);

  const screenHeight = useWindowDimensions().height;
  const height = screenHeight - pixelScaler(88);
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

  const panResponders = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: (event, gestureState) => {
        panY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dy > 0 && gestureState.vy > 1.5) {
          closeModal();
        } else {
          resetBottomSheet.start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (showMap) {
      resetBottomSheet.start();
    }
  }, [showMap]);

  const closeModal = () => {
    closeBottomSheet.start(() => {
      setShowMap(false);
    });
  };

  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const mapViewRef = useRef<any>();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "splace는 위치정보가 필요합니다. 설정에서 권한을 부여해주세요."
        );
        return;
      }

      let location = await Location.getLastKnownPositionAsync();

      if (location) {
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    })();
  }, []);

  return (
    <Modal
      visible={showMap}
      animationType={"fade"}
      transparent
      statusBarTranslucent
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={{
            width,
            height,
            borderRadius: 100,
            alignItems: "center",
            borderTopLeftRadius: pixelScaler(100),
            borderTopRightRadius: pixelScaler(100),
            transform: [{ translateY: translateY }],
          }}
        >
          <View
            style={{
              position: "absolute",
              top: 0,
              height: 40,
              width: "100%",
              zIndex: 2,
            }}
            {...panResponders.panHandlers}
          ></View>
          <ModalDragBar />
          <MapView
            ref={mapViewRef}
            showsUserLocation={true}
            showsMyLocationButton={false}
            onUserLocationChange={(e) => {
              // setUserLocation(coordinate);
              setUserLocation({
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
              });
            }}
            provider={PROVIDER_GOOGLE}
            style={{
              width,
              height,
              borderRadius: pixelScaler(15),
            }}
            {...(latitude &&
              longitude && {
                initialRegion: {
                  latitude,
                  longitude,
                  latitudeDelta,
                  longitudeDelta,
                },
              })}
            onRegionChange={(e) => {
              setDelta(e.latitudeDelta);
            }}
          >
            {clustered &&
              clustered.map((cluster, index) => {
                const { latitude, longitude } = getCenter(cluster);
                // const latitude = splaces[Math.max(...cluster)].lat;
                // const longitude = splaces[Math.max(...cluster)].lon;
                return (
                  <Marker
                    key={Math.max(...cluster)}
                    coordinate={{
                      latitude,
                      longitude,
                    }}
                    onPress={(e) => {
                      if (cluster.length === 1) {
                        setSelectedSplaceIndex(cluster[0]);
                      }
                    }}
                    anchor={{
                      x: 0.5,
                      y:
                        cluster.length === 1 &&
                        cluster.includes(selectedSplaceIndex)
                          ? 0.7
                          : 0.5,
                    }}
                  >
                    {cluster.length === 1 ? (
                      cluster[0] === selectedSplaceIndex ? (
                        <MarkerContainer>
                          <Icon
                            name="positionpin"
                            style={{
                              width: pixelScaler(23),
                              height: pixelScaler(33),
                              // box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
                              shadowColor: "#000",
                              shadowOffset: {
                                width: 0,
                                height: pixelScaler(2),
                              },
                              shadowRadius: pixelScaler(2),
                              shadowOpacity: 0.1,
                            }}
                          />
                        </MarkerContainer>
                      ) : (
                        <MarkerContainer
                          onPress={() => {
                            setSelectedSplaceIndex(cluster[0]);
                          }}
                        >
                          <SingleMarker />
                        </MarkerContainer>
                      )
                    ) : (
                      <MarkerContainer>
                        <ClusteredMarker>
                          <RegText16 style={{ color: "#ffffff" }}>
                            +{cluster.length < 100 ? cluster.length : 99}
                          </RegText16>
                        </ClusteredMarker>
                      </MarkerContainer>
                    )}
                  </Marker>
                );
              })}
          </MapView>
          <BackToMeButton
            onPress={() => {
              mapViewRef.current?.setCamera({
                center: userLocation,
              });
            }}
          >
            <Icon
              name="myposition"
              style={{
                width: pixelScaler(19),
                height: pixelScaler(19),
              }}
            />
          </BackToMeButton>
          <SplaceInfo>
            <UpperContainer
              onPress={() => {
                closeModal();
                navigation.push("Splace", {
                  splace: splaces[selectedSplaceIndex],
                });
              }}
            >
              <Image
                style={{
                  width: pixelScaler(110),
                  height: pixelScaler(110),
                  borderRadius: pixelScaler(10),
                  marginRight: pixelScaler(12),
                }}
                source={{
                  uri: splaces[selectedSplaceIndex].thumbnail ?? BLANK_IMAGE,
                }}
              />
              <InfoContainer>
                <BldText16
                  style={{
                    marginBottom: pixelScaler(10),
                    height: pixelScaler(16),
                  }}
                >
                  {splaces[selectedSplaceIndex].name}
                </BldText16>

                <RegText13
                  style={{
                    lineHeight: pixelScaler(17),
                    marginBottom: pixelScaler(5),
                    width: pixelScaler(181),
                    height: pixelScaler(34),
                  }}
                  numberOfLines={2}
                >
                  {address}
                </RegText13>

                <TagsContainer>
                  {splaces[selectedSplaceIndex].ratingtags?.map((ratingtag) => (
                    <Tag
                      key={ratingtag.id + "rat"}
                      style={{ borderColor: theme.borderHighlight }}
                    >
                      <RegText13 style={{ color: theme.borderHighlight }}>
                        {ratingtag.name}
                      </RegText13>
                    </Tag>
                  ))}
                  {splaces[selectedSplaceIndex].bigCategories?.map(
                    (bigCategory) => (
                      <Tag key={bigCategory.id + "big"}>
                        <RegText13>{bigCategory.name}</RegText13>
                      </Tag>
                    )
                  )}
                </TagsContainer>
              </InfoContainer>
            </UpperContainer>
            <FoundRouteButton
              onPress={() => {
                Alert.alert("지도 앱 선택", "", [
                  {
                    text: "Google Maps",
                    onPress: () =>
                      Linking.openURL(
                        "https://maps.google.com/?q=@" +
                          splaces[selectedSplaceIndex].lat +
                          "," +
                          splaces[selectedSplaceIndex].lon
                      ),
                  },
                  {
                    text: "Apple Maps",
                    onPress: () =>
                      Linking.openURL(
                        "https://maps.apple.com/?q=" +
                          splaces[selectedSplaceIndex].name +
                          "&ll=" +
                          splaces[selectedSplaceIndex].lat +
                          "," +
                          splaces[selectedSplaceIndex].lon
                      ),
                  },
                  {
                    text: "카카오맵",
                    onPress: () => async () => {
                      try {
                        await Linking.openURL(
                          "kakaomap://look?&p=" +
                            splaces[selectedSplaceIndex].lat +
                            "," +
                            splaces[selectedSplaceIndex].lon
                        );
                      } catch {
                        Alert.alert("카카오맵을 열 수 없습니다.");
                      }
                    },
                  },
                  {
                    text: "네이버 지도",
                    onPress: async () => {
                      try {
                        await Linking.openURL(
                          "nmap://place?name=" +
                            splaces[selectedSplaceIndex].name +
                            "&lat=" +
                            splaces[selectedSplaceIndex].lat +
                            "&lng=" +
                            splaces[selectedSplaceIndex].lon
                        );
                      } catch {
                        Alert.alert("네이버 지도를 열 수 없습니다.");
                      }
                    },
                  },
                  {
                    text: "취소",
                    style: "cancel",
                  },
                ]);
              }}
            >
              <RegText16 style={{ color: theme.textHighlight }}>
                길찾기
              </RegText16>
            </FoundRouteButton>
          </SplaceInfo>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ModalMapView;
