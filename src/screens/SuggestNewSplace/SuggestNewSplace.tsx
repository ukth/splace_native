import React, { useEffect, useContext, useState } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../../components/ScreenContainer";
import { StackNavigationProp } from "@react-navigation/stack";
import { SplaceType, StackGeneratorParamList, ThemeType } from "../../types";
import styled, { ThemeContext } from "styled-components/native";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import { pixelScaler } from "../../utils";
import { BldText16, RegText16 } from "../../components/Text";
import { HeaderRightConfirm } from "../../components/HeaderRightConfirm";
import { RegTextInput16 } from "../../components/TextInput";
import { Alert, Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { useMutation } from "@apollo/client";
import { CREATE_SPLACE, EDIT_SPLACE } from "../../queries";
import { ProgressContext } from "../../contexts/Progress";

const RowContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${pixelScaler(30)}px;
`;

const SuggestNewSplace = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const { onConfirm }: { onConfirm: (splace: SplaceType) => void } =
    useRoute<RouteProp<StackGeneratorParamList, "SuggestNewSplace">>().params;

  const theme = useContext<ThemeType>(ThemeContext);

  const [name, setName] = useState("");
  const [detailAddress, setDetailAddress] = useState("");

  const { spinner } = useContext(ProgressContext);

  const onCompleted = (data: any) => {
    spinner.stop();
    console.log(data);
    if (data?.createSplaces?.ok) {
      Alert.alert(
        "",
        "장소/이벤트 제안이 완료되었습니다.\n검토 후 정식 splace로 등록됩니다."
      );
      onConfirm(data?.createSplaces?.splace);
    } else {
      Alert.alert(
        "장소/이벤트 제안에 실패했습니다.",
        data?.createSplaces?.error
      );
    }
  };

  const [mutation, { loading }] = useMutation(CREATE_SPLACE, { onCompleted });
  const [location, setLocation] = useState<{
    address: string;
    lat: number;
    lon: number;
  }>();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
      headerTitle: () => <BldText16>위치 정보</BldText16>,
      headerStyle: {
        shadowColor: "transparent",
      },
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderRightConfirm
          onPress={() => {
            if (location && name !== "") {
              if (!loading) {
                spinner.start();
                mutation({
                  variables: {
                    name,
                    lat: location?.lat,
                    lon: location?.lon,
                    detailAddress,
                  },
                });
              }
            } else {
              Alert.alert("위치와 이름은 필수값입니다.");
            }
          }}
        />
      ),
    });
  }, [name, location, detailAddress]);

  return (
    <ScreenContainer
      style={{
        padding: pixelScaler(30),
      }}
    >
      <>
        <RowContainer>
          <RegText16>이름</RegText16>
          <RegTextInput16
            value={name}
            style={{
              width: pixelScaler(250),
              position: "absolute",
              left: pixelScaler(70),
            }}
            placeholder="장소/이벤트 명을 입력해주세요"
            autoCorrect={false}
            placeholderTextColor={theme.entryPlaceholder}
            maxLength={20}
            selectionColor={theme.chatSelection}
            onChangeText={(text) => setName(text.trim())}
          />
        </RowContainer>
        <RowContainer>
          <RegText16>위치</RegText16>
          <RegText16
            numberOfLines={1}
            onPress={() =>
              navigation.push("AddressSelector", {
                onConfirm: ({
                  address,
                  lat,
                  lon,
                }: {
                  address: string;
                  lat: number;
                  lon: number;
                }) => {
                  setLocation({ address, lat, lon });
                  navigation.pop();
                },
              })
            }
            style={{
              color: theme.textHighlight,
              position: "absolute",
              left: pixelScaler(70),
              width: pixelScaler(220),
            }}
          >
            {location && location.address !== ""
              ? location.address
              : "주소로 검색"}
          </RegText16>
        </RowContainer>
        <RowContainer>
          <RegText16>상세위치</RegText16>
          <RegTextInput16
            value={detailAddress}
            style={{
              width: pixelScaler(250),
              position: "absolute",
              left: pixelScaler(70),
            }}
            placeholder="(ex. 4층, A구역, 17번 부스)"
            autoCorrect={false}
            placeholderTextColor={theme.entryPlaceholder}
            maxLength={30}
            selectionColor={theme.chatSelection}
            onChangeText={(text) => setDetailAddress(text)}
          />
        </RowContainer>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={{ height: pixelScaler(300) }} />
        </TouchableWithoutFeedback>
      </>
    </ScreenContainer>
  );
};

export default SuggestNewSplace;
