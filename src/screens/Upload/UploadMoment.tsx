import React, { useState, useEffect, useRef, useContext } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../../components/ScreenContainer";
import { useQuery } from "@apollo/client";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackGeneratorParamList, ThemeType } from "../../types";
import styled, { ThemeContext } from "styled-components/native";
import { HeaderBackButton } from "../../components/HeaderBackButton";

import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  Animated,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
// import Slider from "@react-native-community/slider";
import * as MediaLibrary from "expo-media-library";
import { useIsFocused } from "@react-navigation/core";
import { AVPlaybackStatus, Video } from "expo-av";
import { pixelScaler } from "../../utils";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { RNCamera } from "react-native-camera";

const Container = styled.View`
  flex: 1;
  background-color: black;
`;

const Actions = styled.View`
  position: absolute;
  bottom: 0;
  height: ${pixelScaler(155)}px;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const ButtonsContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const TakePhotoBtn = styled.TouchableOpacity`
  width: 100px;
  height: 100px;
  background-color: rgba(0, 255, 255, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 50px;
`;

const SliderContainer = styled.View``;

const CloseButton = styled.TouchableOpacity`
  top: 50px;
  position: absolute;
  left: 30px;
`;

const CameraButtonContainer = styled.View`
  width: ${pixelScaler(60)}px;
  height: ${pixelScaler(60)}px;
  border-width: ${pixelScaler(3)}px;
  border-color: ${({ theme }: { theme: ThemeType }) =>
    theme.cameraButtonOutline};
  border-radius: ${pixelScaler(60)}px;
  align-items: center;
  justify-content: center;
`;

const UploadMoment = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const theme = useContext<ThemeType>(ThemeContext);
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => navigation.pop()}
          color={theme.white}
        />
      ),
    });
  }, []);

  const camera = useRef();
  const video = useRef();
  const [takenPhoto, setTakenPhoto] = useState("");
  const [cameraReady, setCameraReady] = useState(false);
  const [ok, setOk] = useState(false);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [zoom, setZoom] = useState(0);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [recordedUri, setRecordedUri] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const getPermissions = async () => {
    const { granted } = await Camera.requestPermissionsAsync();
    setOk(granted);
  };
  useEffect(() => {
    getPermissions();
  }, []);

  const { width } = useWindowDimensions();

  const record = Animated.timing(progress, {
    toValue: width,
    duration: 30000,
    useNativeDriver: true,
  });
  // const onCameraSwitch = () => {
  //   if (cameraType === Camera.Constants.Type.front) {
  //     setCameraType(Camera.Constants.Type.back);
  //   } else {
  //     setCameraType(Camera.Constants.Type.front);
  //   }
  // };
  // const onZoomValueChange = (e) => {
  //   setZoom(e);
  // };
  // const onFlashChange = () => {
  //   if (flashMode === Camera.Constants.FlashMode.off) {
  //     setFlashMode(Camera.Constants.FlashMode.on);
  //   } else if (flashMode === Camera.Constants.FlashMode.on) {
  //     setFlashMode(Camera.Constants.FlashMode.auto);
  //   } else if (flashMode === Camera.Constants.FlashMode.auto) {
  //     setFlashMode(Camera.Constants.FlashMode.off);
  //   }
  // };
  // const goToUpload = async (save) => {
  //   if (save) {
  //     await MediaLibrary.saveToLibraryAsync(takenPhoto);
  //   }
  // };
  // const onUpload = () => {
  //   Alert.alert("Save photo?", "Save photo & upload or just upload", [
  //     {
  //       text: "Save & Upload",
  //       onPress: () => goToUpload(true),
  //     },
  //     {
  //       text: "Just Upload",
  //       onPress: () => goToUpload(false),
  //     },
  //   ]);
  // };
  // const onCameraReady = () => setCameraReady(true);
  // const takePhoto = async () => {
  //   if (camera.current && cameraReady) {
  //     const { uri } = await camera.current.recordAsync({
  //       quality: 1,
  //       maxDuration: 15,
  //     });
  //     // setTakenPhoto(uri);
  //   }
  // };
  // const onDismiss = () => setTakenPhoto("");
  // const isFocused = useIsFocused();

  useEffect(() => {
    if (recordedUri !== "") {
      if (video.current) {
        video.current.playAsync();
      }
    }
  }, [recordedUri]);
  progress.addListener(({ value }) => console.log(value));

  return (
    <ScreenContainer
      style={{ backgroundColor: "#900000", justifyContent: "center" }}
    >
      {recordedUri === "" ? (
        <>
          <Animated.View
            style={[
              {
                height: pixelScaler(67),
                backgroundColor: "#ffffff",
                transform: [{ scaleX: progress }],
              },
              {
                width: progress,
              },
            ]}
          />
          <View
            style={{
              width: 100,
              height: 100,
              backgroundColor: "#90e060",
            }}
          />
          <Camera
            ref={camera}
            type={cameraType}
            style={{
              width,
              height: (width * 4) / 3,
            }}
            zoom={zoom}
            // onCameraReady={onCameraReady}
          />
        </>
      ) : (
        // <RNCamera
        //   ref={camera}
        //   type={RNCamera.Constants.Type.back}
        //   style={{
        //     width,
        //     height: (width * 4) / 3,
        //   }}
        // />
        <Video
          ref={video}
          isLooping
          style={{
            width,
            height: (width * 4) / 3,
          }}
          source={{
            uri: recordedUri ?? "",
          }}
          resizeMode="cover"
          progressUpdateIntervalMillis={30}
        />
      )}
      <CloseButton
        onPress={() => {
          setRecordedUri("");
        }}
      >
        <Ionicons name="close" color="white" size={30} />
      </CloseButton>
      <Actions>
        {/* <SliderContainer>
          <Slider
              style={{ width: 200, height: 20 }}
              value={zoom}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="rgba(255, 255, 255, 0.5)"
              onValueChange={onZoomValueChange}
            />
        </SliderContainer> */}
        <ButtonsContainer>
          <TouchableWithoutFeedback
            onPressIn={async () => {
              setIsRecording(true);
              const { uri } = await camera.current?.recordAsync();
              record.start();
              setRecordedUri(uri);
            }}
            onPressOut={() => {
              setIsRecording(false);
              camera.current?.stopRecording();
              record.stop();
            }}
          >
            <CameraButtonContainer>
              <View
                style={{
                  borderRadius: pixelScaler(60),
                  width: pixelScaler(isRecording ? 40 : 50),
                  height: pixelScaler(isRecording ? 40 : 50),
                  backgroundColor: isRecording
                    ? theme.themeBackground
                    : theme.background,
                }}
              />
            </CameraButtonContainer>
          </TouchableWithoutFeedback>
        </ButtonsContainer>
      </Actions>
    </ScreenContainer>
  );
};

export default UploadMoment;
