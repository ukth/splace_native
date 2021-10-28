import React, { useState, useEffect, useRef, useContext } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../../components/ScreenContainer";
import { useMutation, useQuery } from "@apollo/client";
import { StackNavigationProp } from "@react-navigation/stack";
import { SplaceType, StackGeneratorParamList, ThemeType } from "../../types";
import styled, { ThemeContext } from "styled-components/native";
import {
  BldText16,
  RegText13,
  RegText16,
  RegText33,
} from "../../components/Text";
import { HeaderRightConfirm } from "../../components/HeaderRightConfirm";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import {
  Alert,
  FlatList,
  Image as DefaultImage,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { pixelScaler, uploadPhotos } from "../../utils";
import { ZoomableImage } from "../../components/ImagePicker/ZoomableImageComponent";
import { ImagePickerContext } from "../../contexts/ImagePicker";
import { RegTextInput16 } from "../../components/TextInput";
import { Ionicons } from "@expo/vector-icons";
import { API_URL, tokenVar } from "../../apollo";
import axios from "axios";
import { ProgressContext } from "../../contexts/Progress";
import { REGISTER_OWNER } from "../../queries";
import Image from "../../components/Image";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

const LabelContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${pixelScaler(30)}px;
`;

const LabelsContainer = styled.View`
  padding: ${pixelScaler(30)}px;
  padding-bottom: 0;
`;

const ImageItemContainer = styled.View`
  height: ${pixelScaler(112)}px;
  width: ${pixelScaler(112)}px;
  /* bottom: 0; */
`;

const SelectImageButton = styled.TouchableOpacity`
  position: absolute;
  width: ${pixelScaler(100)}px;
  height: ${pixelScaler(100)}px;
  align-items: center;
  justify-content: center;
  border-radius: ${pixelScaler(10)}px;
  border-width: ${pixelScaler(1.67)}px;
`;

const MinusButton = styled.TouchableOpacity`
  width: ${pixelScaler(25)}px;
  height: ${pixelScaler(25)}px;
  border-radius: ${pixelScaler(25)}px;
  position: absolute;
  top: 0;
  right: 0;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }: { theme: ThemeType }) => theme.greyButton};
`;

const MinusBar = styled.View`
  width: ${pixelScaler(11)}px;
  height: ${pixelScaler(2)}px;
  border-radius: ${pixelScaler(2)}px;
  background-color: ${({ theme }: { theme: ThemeType }) => theme.text};
`;

const RegisterOwner = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const {
    splaceId,
    confirmScreen,
  }: { splaceId: number; confirmScreen: string } =
    useRoute<RouteProp<StackGeneratorParamList, "RegisterOwner">>().params;

  const { spinner } = useContext(ProgressContext);
  const theme = useContext<ThemeType>(ThemeContext);

  const [name, setName] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [corpNum, setCorpNum] = useState("");

  const { images, setImages } = useContext(ImagePickerContext);

  const onCompleted = (data: any) => {
    spinner.stop();
    if (data?.getOwnerAuthority?.ok) {
      Alert.alert(
        "",
        "소유주 등록 신청이 완료되었습니다.\n검토까지 24 - 72시간이 소요되며\n후속 절차는 DM으로 안내됩니다."
      );
      navigation.pop();
    } else {
      Alert.alert(
        "소유주 등록에 실패했습니다.",
        data?.getOwnerAuthority?.error
      );
    }
  };

  const [mutation, { loading }] = useMutation(REGISTER_OWNER, { onCompleted });

  //Image.getSize(selectedImages[focusedImageIndex].uri, (img_w, img_h) =>

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldText16>소유주 등록</BldText16>,
      headerRight: () => (
        <HeaderRightConfirm
          onPress={async () => {
            console.log(name, birthDay, corpNum, images);
            if (
              name !== "" &&
              birthDay !== "" &&
              corpNum !== "" &&
              images.length > 0
            ) {
              spinner.start(false, 30);
              const formattedImages = [];
              for (let i = 0; i < images.length; i++) {
                const image = images[i];
                const manipResult = await manipulateAsync(image.url, [], {
                  compress: 1,
                  format: SaveFormat.JPEG,
                });
                formattedImages.push(manipResult.uri);
              }

              const awsUrls = await uploadPhotos(formattedImages);
              console.log(awsUrls);
              setImages([]);
              if (awsUrls.length === images.length) {
                mutation({
                  variables: {
                    splaceId,
                    birthDay,
                    name,
                    corpNum,
                    imageUrls: awsUrls,
                  },
                });
              } else {
                spinner.stop();
                Alert.alert("업로드에 실패했습니다.");
                return;
              }
            } else {
              Alert.alert("필수정보가 모두 입력되지 않았습니다.");
            }
          }}
        />
      ),
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
    });
  }, [birthDay, corpNum, name, images]);

  useEffect(() => {
    setImages([]);
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("카메라 권한이 필요합니다.");
        navigation.pop();
      }
    })();
  }, []);

  return (
    <ScreenContainer>
      <LabelsContainer>
        <LabelContainer>
          <RegText16>소유주 성명</RegText16>
          <RegTextInput16
            onChangeText={(text) => {
              setName(text);
            }}
            selectionColor={theme.chatSelection}
            style={{
              position: "absolute",
              left: pixelScaler(118),
              width: pixelScaler(200),
            }}
            placeholder="사업자등록증에 기재된 성명"
            placeholderTextColor={theme.greyTextLight}
            maxLength={10}
          />
        </LabelContainer>
        <LabelContainer>
          <RegText16>소유주 생년월일</RegText16>
          <RegTextInput16
            onChangeText={(text) => {
              setBirthDay(text);
            }}
            selectionColor={theme.chatSelection}
            style={{
              position: "absolute",
              left: pixelScaler(118),
              width: pixelScaler(200),
            }}
            keyboardType="number-pad"
            placeholder="20000101"
            placeholderTextColor={theme.greyTextLight}
            maxLength={8}
          />
        </LabelContainer>
        <LabelContainer>
          <RegText16>사업자등록번호</RegText16>
          <RegTextInput16
            onChangeText={(text) => {
              setCorpNum(text);
            }}
            selectionColor={theme.chatSelection}
            style={{
              position: "absolute",
              left: pixelScaler(118),
              width: pixelScaler(200),
            }}
            placeholder="사업자등록번호"
            keyboardType="number-pad"
            placeholderTextColor={theme.greyTextLight}
            maxLength={10}
          />
        </LabelContainer>
        <LabelContainer>
          <RegText16>사업자등록증</RegText16>
        </LabelContainer>
      </LabelsContainer>
      <FlatList
        data={images}
        ListHeaderComponent={
          <ImageItemContainer
            style={{
              marginLeft: pixelScaler(30),
              width: pixelScaler(110),
            }}
          >
            <SelectImageButton
              style={{ position: "absolute", bottom: 0, flexDirection: "row" }}
              onPress={async () => {
                navigation.push("StackPickerAlbums", {
                  rootScreen: "RegisterOwner",
                  params: { splaceId },
                });
              }}
            >
              <Ionicons name="camera" size={30} />
              <BldText16>+</BldText16>
            </SelectImageButton>
          </ImageItemContainer>
        }
        renderItem={({ item }) => (
          <ImageItemContainer
            style={{
              width: 110,
            }}
          >
            <DefaultImage
              source={{ uri: item.url }}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                height: pixelScaler(100),
                width: pixelScaler(100),
                borderRadius: pixelScaler(10),
              }}
            />

            <MinusButton
              onPress={async () => {
                const tmp = [...images];
                setImages(tmp.filter((url) => url !== item));
              }}
            >
              <MinusBar />
            </MinusButton>
          </ImageItemContainer>
        )}
        keyExtractor={(item, index) => index + ""}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        ListFooterComponent={<View style={{ width: pixelScaler(50) }} />}
      />
    </ScreenContainer>
  );
};

export default RegisterOwner;
