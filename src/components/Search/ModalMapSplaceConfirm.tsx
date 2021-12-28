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
import { coords2address, pixelScaler } from "../../utils";
import { BldText16, RegText13, RegText16 } from "../Text";
import { SplaceType, StackGeneratorParamList, ThemeType } from "../../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/core";
import { Icon } from "../Icon";
import { FilterContext } from "../../contexts/Filter";

const ModalDragBar = styled.View`
  position: absolute;
  width: ${pixelScaler(120)}px;
  height: ${pixelScaler(4)}px;
  border-radius: ${pixelScaler(2)}px;
  background-color: ${({ theme }: { theme: ThemeType }) => theme.modalDragBar};
  top: ${pixelScaler(8)}px;
  z-index: 1;
  /* margin-bottom: ${pixelScaler(30)}px; */
`;

const SplaceContainer = styled.View`
  position: absolute;
  left: ${pixelScaler(15)}px;
  bottom: ${pixelScaler(45)}px;
  width: ${pixelScaler(345)}px;
  padding: ${pixelScaler(20)}px ${pixelScaler(20)}px;
  border-radius: ${pixelScaler(15)}px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
  background-color: ${({ theme }: { theme: ThemeType }) => theme.background};
`;

const SplaceInfoContainer = styled.View`
  flex-direction: row;
  /* background-color: #1040d0; */
`;

const InfosContainer = styled.View`
  flex: 1;
  /* background-color: #f01030; */
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

const TagsContainer = styled.View`
  position: absolute;
  bottom: 0;
  /* background-color: #9020d0; */
`;

const TagsRowContainer = styled.View`
  flex-direction: row;
  margin-top: ${pixelScaler(10)}px;
  /* background-color: #9030f0; */
`;

const Tag = styled.View`
  padding: 0 ${pixelScaler(10)}px;
  justify-content: center;
  border-width: ${pixelScaler(0.67)}px;
  border-radius: ${pixelScaler(20)}px;
  height: ${pixelScaler(20)}px;
  margin-right: ${pixelScaler(7)}px;
`;

const ModalMapSplaceConfirm = ({
  showMap,
  setShowMap,
  coordinate,
  address,
  name,
}: {
  showMap: boolean;
  setShowMap: (_: boolean) => void;
  coordinate: { lat: number; lon: number };
  address: string;
  name: string;
}) => {
  const { width } = useWindowDimensions();
  const theme = useContext<ThemeType>(ThemeContext);
  const [showModal, setShowModal] = useState(showMap);

  const { filter, setFilter } = useContext(FilterContext);

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
        if (gestureState.dy > 0 && gestureState.vy > 0) {
          closeModal();
        } else {
          resetBottomSheet.start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (showMap) {
      openModal();
    } else {
      closeModal();
    }
  }, [showMap]);

  const openModal = () => {
    setShowModal(true);
    resetBottomSheet.start();
  };

  const closeModal = () => {
    closeBottomSheet.start(() => {
      setShowModal(false);
    });
  };

  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const mapViewRef = useRef<any>();

  return (
    <Modal
      visible={showModal}
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
            provider={PROVIDER_GOOGLE}
            style={{
              width,
              height,
              borderRadius: pixelScaler(15),
            }}
            initialRegion={{
              latitude: coordinate.lat ?? 37.4996187,
              longitude: coordinate.lon ?? 127.0296435,
              latitudeDelta: 0.03,
              longitudeDelta: 0.008,
            }}
          >
            <Marker
              coordinate={{
                latitude: coordinate?.lat,
                longitude: coordinate?.lon,
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
          <SplaceContainer
            style={{
              height: pixelScaler(145),
            }}
          >
            <SplaceInfoContainer>
              <InfosContainer>
                <BldText16 style={{ marginBottom: pixelScaler(10) }}>
                  {name}
                </BldText16>
                <RegText13>{address}</RegText13>
              </InfosContainer>
            </SplaceInfoContainer>
            <ConfirmButton
              onPress={() => {
                setShowMap(false);
                setFilter({
                  ...filter,
                  lat: coordinate?.lat,
                  lon: coordinate?.lon,
                  locationText: address,
                });
                navigation.pop();
              }}
            >
              <RegText16 style={{ color: theme.textHighlight }}>완료</RegText16>
            </ConfirmButton>
          </SplaceContainer>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ModalMapSplaceConfirm;
