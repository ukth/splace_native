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
import { Alert, Keyboard } from "react-native";
import { useMutation } from "@apollo/client";
import { EDIT_SPLACE } from "../../queries";
import { ProgressContext } from "../../contexts/Progress";

const RowContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${pixelScaler(30)}px;
`;

const EditSplaceLocation = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const { splace }: { splace: SplaceType } =
    useRoute<RouteProp<StackGeneratorParamList, "EditSplaceLocation">>().params;

  const theme = useContext<ThemeType>(ThemeContext);

  const [detailAddress, setDetailAddress] = useState(splace.detailAddress);

  const { spinner } = useContext(ProgressContext);

  const onCompleted = (data: any) => {
    spinner.stop();
    if (data?.editSplaces?.ok) {
      Alert.alert("상세주소가 변경되었습니다.");
      navigation.pop();
    } else {
      Alert.alert("상세주소를 변경할 수 없습니다.");
    }
  };

  const [mutation, { loading }] = useMutation(EDIT_SPLACE, { onCompleted });

  useEffect(() => {
    Alert.alert(
      "위치 정보 변경 요청",
      "해당 공간의 위치가 변경되었나요?\nsplace에 위치 정보 변경을 제안해 보세요."
    );
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
      headerTitle: () => <BldText16>위치 정보</BldText16>,
      headerRight: () => (
        <HeaderRightConfirm
          onPress={() => {
            if (!loading) {
              spinner.start();
              mutation({
                variables: {
                  splaceId: splace.id,
                  detailAddress,
                },
              });
            }
          }}
        />
      ),
    });
  }, [detailAddress]);

  return (
    <ScreenContainer style={{ padding: pixelScaler(30) }}>
      <RowContainer>
        <RegText16>위치</RegText16>
        <RegText16
          onPress={() =>
            navigation.push("EditSplaceLocationSearch", { splace })
          }
          style={{
            color: theme.textHighlight,
            position: "absolute",
            left: pixelScaler(70),
          }}
        >
          {splace.address}
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
          onBlur={() => Keyboard.dismiss()}
        />
      </RowContainer>
    </ScreenContainer>
  );
};

export default EditSplaceLocation;
