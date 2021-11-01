import React, { useState, useEffect, useRef, useContext } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../../components/ScreenContainer";
import { useMutation, useQuery } from "@apollo/client";
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
  Keyboard,
  KeyboardAvoidingView,
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
import {
  coords2address,
  pixelScaler,
  showFlashMessage,
  uploadVideo,
} from "../../utils";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { RNCamera } from "react-native-camera";
import { Icons } from "../../icons";
import { RegTextInput13, RegTextInput20 } from "../../components/TextInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ProgressContext } from "../../contexts/Progress";
import {
  BldText13,
  BldText16,
  RegText13,
  RegText20,
} from "../../components/Text";
import { UploadContentContext } from "../../contexts/UploadContent";
import { UPLOAD_MOMENT } from "../../queries";
import RatingModal from "./RatingModal";

const SelectSplaceButton = styled.TouchableOpacity`
  padding-top: ${pixelScaler(40)}px;
`;

const FooterContainer = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  left: ${pixelScaler(27)}px;
  z-index: 1;
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

const UpperContainer = styled.View`
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const BottomContainer = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const UploadButton = styled.TouchableOpacity`
  position: absolute;
  right: ${pixelScaler(30)}px;
  top: ${pixelScaler(60)}px;
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
    setContent({});
  }, []);

  const camera = useRef<any>();
  const video = useRef<any>();
  const [ok, setOk] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [recordedUri, setRecordedUri] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  // const progress = useRef(new Animated.Value(0)).current;
  const { content, setContent } = useContext(UploadContentContext);

  const [progress, setProgress] = useState(new Animated.Value(0));
  const [momentText, setMomentText] = useState("");

  const [showRating, setShowRating] = useState(false);

  const { spinner } = useContext(ProgressContext);

  const onCompleted = (data: any) => {
    spinner.stop();
    if (data?.uploadMoment?.ok) {
      showFlashMessage({ message: "모먼트가 업로드되었습니다." });
      setShowRating(true);
    } else {
      Alert.alert("업로드 실패");
    }
  };

  const [mutation, { loading }] = useMutation(UPLOAD_MOMENT, { onCompleted });

  const getPermissions = async () => {
    const { granted } = await Camera.requestPermissionsAsync();
    setOk(granted);
  };
  useEffect(() => {
    getPermissions();
    navigation.setOptions({
      headerShown: false,
    });
    setContent({});
  }, []);

  const { width, height } = useWindowDimensions();

  const record = Animated.timing(progress, {
    toValue: 1,
    duration: 30000,
    useNativeDriver: true,
  });

  const left = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, 0],
    extrapolate: "clamp",
  });

  // const barWidth = {
  //   width: progressAnim,
  // };

  useEffect(() => {
    if (recordedUri !== "") {
      if (video.current) {
        setIsLoaded(false);
        spinner.start();
        video.current.playAsync();
      }
    }
  }, [recordedUri]);

  // progress.addListener(({ value }) => console.log(value));

  // useEffect(() => {
  //   record.start();
  // }, []);

  return (
    <ScreenContainer
      style={{ backgroundColor: theme.black, justifyContent: "center" }}
    >
      <View
        style={{
          width: "100%",
          height: (height - (width * 4) / 3) / 2,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {(content.locationText?.length || content.splace) &&
          recordedUri !== "" && (
            <UploadButton
              onPress={async () => {
                spinner.start(true, 60);
                const awsUrl = await uploadVideo(recordedUri);
                // console.log(awsUrl);

                mutation({
                  variables: {
                    videoUrl: awsUrl,
                    text: momentText,
                    ...(content?.splace
                      ? {
                          splaceId: content.splace.id,
                          title: content.splace.name,
                        }
                      : {
                          title: content.locationText,
                        }),
                  },
                });
              }}
            >
              <BldText16 style={{ color: theme.white }}>업로드</BldText16>
            </UploadButton>
          )}
        {recordedUri === "" ? (
          <CloseButton
            style={{ height: pixelScaler((59 * height) / 844) }}
            hitSlop={{
              top: pixelScaler(10),
              bottom: pixelScaler(10),
              left: pixelScaler(10),
              right: pixelScaler(10),
            }}
            onPress={() => {
              navigation.pop();
            }}
          >
            <Ionicons name="chevron-back" color="white" size={30} />
          </CloseButton>
        ) : (
          <>
            <CloseButton
              style={{ height: pixelScaler((59 * height) / 844) }}
              hitSlop={{
                top: pixelScaler(10),
                bottom: pixelScaler(10),
                left: pixelScaler(10),
                right: pixelScaler(10),
              }}
              onPress={() => {
                setRecordedUri("");
              }}
            >
              <Image
                source={Icons.close_white}
                style={{
                  width: pixelScaler(12),
                  height: pixelScaler(12),
                }}
              />
            </CloseButton>
            <SelectSplaceButton
              onPress={() =>
                navigation.push("SearchSplaceForUpload", {
                  listHeaderRightText: "현 위치로 장소 선택",
                  onListHeaderRightPress: async ({
                    location,
                  }: {
                    location: {
                      lat: number;
                      lon: number;
                    };
                  }) => {
                    const locationText = await coords2address(location);
                    setContent({
                      ...content,
                      locationText,
                    });
                    navigation.pop();
                  },
                  rootScreen: "UploadMoment",
                })
              }
            >
              <RegText20
                style={{
                  color:
                    content.splace || content.locationText
                      ? theme.white
                      : theme.greyTextAlone,
                  width: pixelScaler(220),
                  textAlign: "center",
                }}
                numberOfLines={1}
              >
                {content.splace
                  ? content.splace.name
                  : content.locationText
                  ? content.locationText
                  : "장소 선택"}
              </RegText20>
            </SelectSplaceButton>
          </>
        )}
      </View>
      {recordedUri === "" ? (
        <View
          style={{
            flex: 1,
          }}
        >
          <Animated.View
            style={{
              backgroundColor: "#ffffff",
              height: pixelScaler(1.67),
              width,
              transform: [{ translateX: left }],
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
          />
          <FooterContainer>
            <TouchableWithoutFeedback
              onPress={async () => {
                console.log(record);
                if (!isRecording) {
                  console.log(record);
                  setIsRecording(true);
                  progress.setValue(0);
                  record.start(() => {
                    setIsRecording(false);
                    camera.current?.stopRecording();
                  });
                  const { uri } = await camera.current?.recordAsync();
                  setRecordedUri(uri);
                } else {
                  setIsRecording(false);
                  camera.current?.stopRecording();
                  record.stop();
                }
              }}
            >
              <CameraButtonContainer>
                <View
                  style={{
                    borderRadius: pixelScaler(isRecording ? 5 : 60),
                    width: pixelScaler(isRecording ? 26 : 50),
                    height: pixelScaler(isRecording ? 26 : 50),
                    backgroundColor: theme.themeBackground,
                  }}
                />
              </CameraButtonContainer>
            </TouchableWithoutFeedback>
          </FooterContainer>
        </View>
      ) : (
        <KeyboardAwareScrollView
          extraHeight={300}
          showsVerticalScrollIndicator={false}
        >
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
            onPlaybackStatusUpdate={(e: AVPlaybackStatus) => {
              // console.log(e);
              if (!isLoaded && e.isLoaded) {
                spinner.stop();
                setIsLoaded(true);
              }
            }}
          />

          <BottomContainer
            style={{
              height: (height - (width * 4) / 3) / 2,
            }}
          >
            <RegTextInput13
              style={{ color: theme.white }}
              onChangeText={(text) => {
                setMomentText(text);
              }}
              selectionColor={theme.chatSelection}
              placeholder="텍스트를 입력하세요..."
              placeholderTextColor={theme.greyTextAlone}
              maxLength={200}
              multiline={true}
              numberOfLines={2}
              autoCorrect={false}
              // onSubmitEditing={() => Keyboard.dismiss()}
            />
          </BottomContainer>
        </KeyboardAwareScrollView>
      )}
      {content.splace ? (
        <RatingModal
          modalVisible={showRating}
          setModalVisible={setShowRating}
          onConfirm={() => navigation.pop()}
          splace={content.splace}
        />
      ) : null}
    </ScreenContainer>
  );
};

export default UploadMoment;
