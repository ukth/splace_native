import React, { useContext, useState, useEffect, useRef } from "react";
import styled, { ThemeContext } from "styled-components/native";
import MapView, { Marker } from "react-native-maps";
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
import { BLANK_IMAGE, coords2address, pixelScaler } from "../utils";
import { BldText16, RegText13, RegText16 } from "./Text";
import { Ionicons } from "@expo/vector-icons";
import { SplaceType, StackGeneratorParamList, ThemeType } from "../types";
import clustering from "density-clustering";
import { Image } from "react-native";
import * as Linking from "expo-linking";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/core";
import { Icons } from "../icons";
import { Icon } from "./Icon";

const MarkerContainer = styled.TouchableOpacity`
  /* background-color: #d0a0f0; */
  padding: ${pixelScaler(20)}px ${pixelScaler(20)}px;
  align-items: center;
  justify-content: center;
`;

const ModalDragBar = styled.View`
  position: absolute;
  width: ${pixelScaler(100)}px;
  height: ${pixelScaler(4)}px;
  border-radius: ${pixelScaler(2)}px;
  background-color: #d1d1d6;
  top: ${pixelScaler(12)}px;
  z-index: 1;
  /* margin-bottom: ${pixelScaler(30)}px; */
`;

const AddressContainer = styled.View`
  position: absolute;
  left: ${pixelScaler(15)}px;
  bottom: ${pixelScaler(45)}px;
  width: ${pixelScaler(345)}px;
  height: ${pixelScaler(150)}px;
  padding: ${pixelScaler(30)}px ${pixelScaler(30)}px;
  border-radius: ${pixelScaler(15)}px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  background-color: ${({ theme }: { theme: ThemeType }) => theme.background};
`;

const ConfirmButton = styled.TouchableOpacity`
  position: absolute;
  height: ${pixelScaler(35)}px;
  border-width: ${pixelScaler(1)}px;
  border-radius: ${pixelScaler(10)}px;
  border-color: ${({ theme }: { theme: ThemeType }) => theme.borderHighlight};
  align-items: center;
  justify-content: center;
  width: ${pixelScaler(305)}px;
  bottom: ${pixelScaler(20)}px;
  left: ${pixelScaler(20)}px;
`;

const ModalSingleMapView = ({
  showMap,
  setShowMap,
  coordinate,
  address,
  onConfirm,
}: {
  showMap: boolean;
  setShowMap: (_: boolean) => void;
  coordinate: { lat: number; lon: number };
  address: string;
  onConfirm: any;
}) => {
  const { width } = useWindowDimensions();
  const height = pixelScaler(760);
  const theme = useContext<ThemeType>(ThemeContext);

  const screenHeight = Dimensions.get("screen").height;
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
            provider="google"
            style={{
              width,
              height,
              borderRadius: pixelScaler(15),
            }}
            initialRegion={{
              latitude: coordinate.lat,
              longitude: coordinate.lon,
              latitudeDelta: 0.03,
              longitudeDelta: 0.008,
            }}
          >
            <Marker
              coordinate={{
                latitude: coordinate.lat,
                longitude: coordinate.lon,
              }}
              anchor={{
                x: 0.5,
                y: 1,
              }}
            >
              <Icon
                name="positionpin"
                style={{
                  width: pixelScaler(23),
                  height: pixelScaler(33),
                }}
              />
            </Marker>
          </MapView>
          <AddressContainer>
            <BldText16>{address}</BldText16>
            <ConfirmButton
              onPress={() => {
                setShowMap(false);
                onConfirm();
              }}
            >
              <RegText16 style={{ color: theme.textHighlight }}>완료</RegText16>
            </ConfirmButton>
          </AddressContainer>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ModalSingleMapView;
