import React, { useState, useEffect, useRef, useContext } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../../components/ScreenContainer";
import { useMutation, useQuery } from "@apollo/client";
import { StackNavigationProp } from "@react-navigation/stack";
import { SplaceType, StackGeneratorParamList, ThemeType } from "../../types";
import styled, { ThemeContext } from "styled-components/native";
import { BldText16, RegText16 } from "../../components/Text";
import { HeaderRightConfirm } from "../../components/HeaderRightConfirm";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import { pixelScaler } from "../../utils";
import { RegTextInput16 } from "../../components/TextInput";
import { EDIT_SPLACE } from "../../queries";
import { Alert } from "react-native";
import { ProgressContext } from "../../contexts/Progress";

const EntryContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${pixelScaler(30)}px;
`;

const EditSplaceInfo = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const { splace }: { splace: SplaceType } =
    useRoute<RouteProp<StackGeneratorParamList, "EditSplaceInfo">>().params;

  const theme = useContext<ThemeType>(ThemeContext);
  const [name, setName] = useState(splace.name);
  const [phone, setPhone] = useState(splace.phone);
  const [url, setUrl] = useState(splace.url);

  const { spinner } = useContext(ProgressContext);

  const validatePhone = (text: string) => {
    const exp = /^[0-9]+$/;
    return exp.test(String(text).toLowerCase());
  };
  const validateUrl = (text: string) => {
    const exp = /^[0-9a-z_\-.&?=:\/]*$/;
    return exp.test(String(text).toLowerCase());
  };

  const onCompleted = (data: any) => {
    if (data?.editSplaces?.ok) {
      Alert.alert("정보가 변경되었습니다.");
      navigation.pop();
    } else {
      Alert.alert("정보 변경에 실패했습니다.", data?.editSplaces?.error);
    }
    spinner.stop();
  };

  const [mutation, { loading }] = useMutation(EDIT_SPLACE, { onCompleted });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldText16>기본정보</BldText16>,
      headerRight: () => (
        <HeaderRightConfirm
          onPress={() => {
            let variables: {
              phone?: string;
              url?: string;
              name?: string;
              splaceId: number;
            } = {
              splaceId: splace.id,
            };
            if (phone !== "" && phone) {
              if (!validatePhone(phone)) {
                Alert.alert("유효하지 않은 전화번호입니다.");
                return;
              }
              variables.phone = phone;
            }
            if (url !== "" && url) {
              if (!validateUrl(url)) {
                Alert.alert("유효하지 않은 홈페이지 주소입니다.");
                return;
              }
              variables.url = url;
            }
            if (name !== "" && name) {
              variables.name = name;
            }
            if (Object.keys(variables)) {
              spinner.start();
              mutation({ variables });
            } else {
              navigation.pop();
            }
          }}
        />
      ),
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
    });
  }, [url, phone, name]);

  return (
    <ScreenContainer style={{ padding: pixelScaler(30) }}>
      <EntryContainer>
        <RegText16>
          이름<RegText16 style={{ color: theme.textHighlight }}>*</RegText16>
        </RegText16>
        <RegTextInput16
          value={name}
          onChangeText={(text) => setName(text.trim())}
          style={{
            position: "absolute",
            left: pixelScaler(74),
            width: pixelScaler(200),
          }}
          placeholder="상호명 및 이벤트명"
          placeholderTextColor={theme.editSplacePlaceholder}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={20}
          selectionColor={theme.chatSelection}
        />
      </EntryContainer>
      <EntryContainer>
        <RegText16>전화번호</RegText16>
        <RegTextInput16
          value={phone}
          onChangeText={(text) => setPhone(text.trim())}
          style={{
            position: "absolute",
            left: pixelScaler(74),
            width: pixelScaler(200),
          }}
          placeholder="010-0000-0000"
          placeholderTextColor={theme.editSplacePlaceholder}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={20}
          keyboardType="number-pad"
          selectionColor={theme.chatSelection}
        />
      </EntryContainer>
      <EntryContainer>
        <RegText16>홈페이지</RegText16>
        <RegTextInput16
          value={url}
          onChangeText={(text) => setUrl(text.trim())}
          style={{
            position: "absolute",
            left: pixelScaler(74),
            width: pixelScaler(200),
          }}
          placeholder="www.splace.co.kr"
          placeholderTextColor={theme.editSplacePlaceholder}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={200}
          selectionColor={theme.chatSelection}
        />
      </EntryContainer>
    </ScreenContainer>
  );
};

export default EditSplaceInfo;
