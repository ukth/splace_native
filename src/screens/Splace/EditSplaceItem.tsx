import React, { useState, useEffect, useRef, useContext } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../../components/ScreenContainer";
import { useMutation, useQuery } from "@apollo/client";
import { StackNavigationProp } from "@react-navigation/stack";
import { SplaceType, StackGeneratorParamList, ThemeType } from "../../types";
import styled, { ThemeContext } from "styled-components/native";
import { BldText16, RegText13, RegText16 } from "../../components/Text";
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
import { EDIT_SPLACE } from "../../queries";
import Image from "../../components/Image";
import useMe from "../../hooks/useMe";
import { Icon } from "../../components/Icon";

const LabelContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${pixelScaler(30)}px;
  align-items: center;
`;

const LabelsContainer = styled.View`
  padding: ${pixelScaler(30)}px;
  padding-bottom: 0;
`;

const ImageItemContainer = styled.View`
  height: ${pixelScaler(112)}px;
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

const EditSplaceItem = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const { splace, urls }: { splace: SplaceType; urls?: string[] } =
    useRoute<RouteProp<StackGeneratorParamList, "EditSplace">>().params;

  const { setShowPicker, images, setImages, imageSize } =
    useContext(ImagePickerContext);
  const { spinner } = useContext(ProgressContext);
  const theme = useContext<ThemeType>(ThemeContext);

  const [itemName, setItemName] = useState(splace.itemName ?? "");
  const [itemPrice, setItemPrice] = useState(
    splace.itemPrice?.toString() ?? ""
  );
  const [menuImages, setMenuImages] = useState<
    { url: string; width: number }[]
  >(
    splace.menuUrls?.map((url) => {
      return { url, width: 0 };
    }) ?? []
  );
  const me = useMe();

  const onCompleted = (data: any) => {
    spinner.stop();
    if (data?.editSplaces?.ok) {
      if (splace.owner?.id === me.id) {
        Alert.alert("정보가 변경되었습니다.");
      } else if (me.authority === "editor") {
        Alert.alert(
          "정보 변경 완료",
          "건강한 커뮤니티 환경을 위해 같은 장소에 대한 정보 변경은 1시간에 한 번만 가능합니다."
        );
      }
      navigation.pop();
    } else {
      if (splace.owner?.id === me.id || me.authority === "editor") {
        Alert.alert("정보 변경에 실패했습니다.");
        // console.log(data);
      }
    }
  };

  const [mutation, { loading }] = useMutation(EDIT_SPLACE, { onCompleted });

  //Image.getSize(selectedImages[focusedImageIndex].uri, (img_w, img_h) =>

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldText16>판매 상품 관리</BldText16>,
      headerRight: () => (
        <HeaderRightConfirm
          onPress={async () => {
            spinner.start(true, 30);

            let variables: {
              itemName?: string;
              itemPrice?: number;
              menuUrls?: string[];
            } = { menuUrls: [] };

            if (images.length !== 0) {
              const awsUrls = await uploadPhotos(
                images.map((image) => image.url)
              );
              setImages([]);
              if (awsUrls.length === images.length) {
                variables.menuUrls = [
                  ...menuImages.map((image) => image.url),
                  ...awsUrls,
                ];
              } else {
                Alert.alert("업로드에 실패했습니다.");
                spinner.stop();
                return;
              }
            }

            if (itemName !== "" && !isNaN(Number(itemPrice))) {
              variables.itemName = itemName;
              variables.itemPrice = Number(itemPrice);
            }

            mutation({
              variables: {
                splaceId: splace.id,
                ...variables,
              },
            });
          }}
        />
      ),
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
    });
  }, [itemName, itemPrice, images]);

  useEffect(() => {
    if (menuImages.filter((image) => image.width === 0).length > 0) {
      const tmp = [...menuImages];
      for (let i = 0; i < tmp.length; i++) {
        if (tmp[i].width === 0) {
          DefaultImage.getSize(tmp[i].url, (img_w, img_h) => {
            const w = (img_w / img_h) * pixelScaler(100);
            tmp[i].width = w;
            setMenuImages(tmp);
          });
          break;
        }
      }
    }
  }, [menuImages]);

  useEffect(() => {
    setImages([]);
    // console.log(menuUrls, splace);
  }, []);

  return (
    <ScreenContainer>
      <LabelsContainer>
        <LabelContainer>
          <BldText16 style={{ marginRight: pixelScaler(10) }}>
            대표상품
          </BldText16>
          <RegText13 style={{ color: theme.greyTextLight }}>
            한 가지만 등록할 수 있습니다.
          </RegText13>
        </LabelContainer>
        <LabelContainer>
          <RegText16 style={{ marginRight: pixelScaler(30) }}>이름</RegText16>
          <RegTextInput16
            value={itemName}
            onChangeText={(text) => setItemName(text.trim())}
            selectionColor={theme.chatSelection}
            style={{ width: pixelScaler(230) }}
            placeholder="상품 이름"
            placeholderTextColor={theme.greyTextLight}
            autoCorrect={false}
            maxLength={30}
          />
        </LabelContainer>
        <LabelContainer style={{ marginBottom: pixelScaler(45) }}>
          <RegText16 style={{ marginRight: pixelScaler(30) }}>가격</RegText16>
          <RegTextInput16
            value={itemPrice?.toString() ?? ""}
            onChangeText={(text) => {
              if (!isNaN(Number(text)) || text === "") {
                setItemPrice(text);
              }
            }}
            selectionColor={theme.chatSelection}
            style={{ width: pixelScaler(230) }}
            placeholder="상품 가격"
            placeholderTextColor={theme.greyTextLight}
            keyboardType="number-pad"
            maxLength={9}
          />
        </LabelContainer>
        <BldText16
          style={{ marginTop: pixelScaler(0), marginBottom: pixelScaler(18) }}
        >
          메뉴/판매목록 사진
        </BldText16>
      </LabelsContainer>
      <FlatList
        data={[...(menuImages ?? []), ...images]}
        ListHeaderComponent={
          <ImageItemContainer
            style={{
              marginLeft: pixelScaler(30),
              width: pixelScaler(110),
            }}
          >
            <SelectImageButton
              style={{ position: "absolute", bottom: 0 }}
              onPress={() => setShowPicker(true)}
            >
              <Icon
                name="gallery_black"
                style={{
                  zIndex: 1,
                  width: pixelScaler(25),
                  height: pixelScaler(20),
                }}
              />
            </SelectImageButton>
          </ImageItemContainer>
        }
        renderItem={({ item }) => (
          <ImageItemContainer
            style={{
              width:
                "width" in item
                  ? item.width + 10
                  : pixelScaler(
                      imageSize === 0 ? 143.3 : imageSize === 1 ? 110 : 85
                    ),
            }}
          >
            {"width" in item ? (
              <Image
                source={{ uri: item.url }}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  height: pixelScaler(100),
                  width: item.width,
                  borderRadius: pixelScaler(10),
                }}
              />
            ) : (
              <DefaultImage
                source={{ uri: item.url }}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  height: pixelScaler(100),
                  width: pixelScaler(
                    imageSize === 0 ? 133.3 : imageSize === 1 ? 100 : 75
                  ),
                  borderRadius: pixelScaler(10),
                }}
              />
            )}
            {!("width" in item) || item.width ? (
              <MinusButton
                onPress={
                  "width" in item
                    ? () => {
                        const tmp = [...menuImages];
                        // console.log("hello");
                        // console.log();
                        setMenuImages(
                          tmp.filter((images) => images.url !== item.url)
                        );
                      }
                    : () => {
                        const tmp = [...images];
                        setImages(
                          tmp.filter((image) => image.url !== item.url)
                        );
                      }
                }
              >
                <MinusBar />
              </MinusButton>
            ) : null}
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

export default EditSplaceItem;
