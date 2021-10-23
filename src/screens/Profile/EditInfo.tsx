import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../../components/ScreenContainer";
import { useMutation, useQuery } from "@apollo/client";
import { StackGeneratorParamList, ThemeType, UserType } from "../../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { ProgressContext } from "../../contexts/Progress";
import { EDIT_MY_INFO, GET_ME } from "../../queries";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import { RegTextInput16 } from "../../components/TextInput";
import { pixelScaler } from "../../utils";
import { HeaderRightConfirm } from "../../components/HeaderRightConfirm";
import styled, { ThemeContext } from "styled-components/native";
import { RegText16 } from "../../components/Text";
import { View } from "../../components/Themed";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import useMe from "../../hooks/useMe";

const RowContainer = styled.View`
  width: 100%;
  height: ${pixelScaler(45)}px;
  flex-direction: row;
  align-items: center;
  padding-left: ${pixelScaler(30)}px;
`;

const EditInfo = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const me: UserType = useMe();

  const [email, setEmail] = useState<string>(me.email ?? "");
  const [birthDay, setBirthDay] = useState(
    new Date(Number(me.birthDay) !== 0 ? Number(me.birthDay) : "2000-01-01")
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const textInputRef = useRef<any>();

  const validateEmail = (text: string) => {
    const exp =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/;
    return exp.test(String(text).toLowerCase());
  };

  const validateEmailLetter = (text: string) => {
    const exp = /^[0-9a-z.@]*$/;
    return exp.test(String(text).toLowerCase());
  };

  const theme = useContext<ThemeType>(ThemeContext);
  const { spinner } = useContext(ProgressContext);

  const { data, refetch } = useQuery(GET_ME);

  const onCompleted = ({
    editProfile: { ok, error },
  }: {
    editProfile: {
      ok: boolean;
      error: string;
    };
  }) => {
    refetch();
    if (ok) {
      Alert.alert("수정이 완료되었습니다.");
      navigation.pop();
    } else {
      Alert.alert("정보를 수정할 수 없습니다.\n" + error);
    }
    spinner.stop();
  };

  const [mutation, { loading }] = useMutation(EDIT_MY_INFO, { onCompleted });

  useEffect(() => {
    navigation.setOptions({
      title: "개인정보 수정",
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
      headerRight: () => (
        <HeaderRightConfirm
          onPress={() => {
            mutation({
              variables: {
                email,
                birthDay: birthDay.valueOf().toString(),
              },
            });
          }}
        />
      ),
    });
  }, [email, birthDay]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ flex: 1 }}>
        <RowContainer style={{ marginTop: pixelScaler(15) }}>
          <RegText16 style={{ width: pixelScaler(75) }}>이메일</RegText16>
          <RegTextInput16
            ref={textInputRef}
            value={email}
            style={{
              color: theme.textHighlight,
              width: pixelScaler(200),
            }}
            returnKeyType="done"
            keyboardType="email-address"
            onBlur={() => textInputRef.current.blur()}
            selectionColor={theme.chatSelection}
            maxLength={20}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(text) => {
              if (validateEmailLetter(text)) {
                setEmail(text.trim().toLowerCase());
              }
            }}
            placeholder="super@lunen.co.kr"
            placeholderTextColor={theme.editInfoGreyText}
          />
        </RowContainer>
        <RowContainer>
          <RegText16 style={{ width: pixelScaler(75) }}>생년월일</RegText16>
          <RegText16
            style={{
              color: birthDay ? theme.textHighlight : theme.editInfoGreyText,
              width: pixelScaler(200),
            }}
            onPress={() => {
              textInputRef.current.blur();
              setShowDatePicker(true);
            }}
          >
            {birthDay.getUTCFullYear() +
              "-" +
              (birthDay.getUTCMonth() < 9 ? "0" : "") +
              (birthDay.getUTCMonth() + 1) +
              "-" +
              (birthDay.getUTCDate() < 10 ? "0" : "") +
              birthDay.getUTCDate()}
          </RegText16>
        </RowContainer>

        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="date"
          onConfirm={(date) => {
            setBirthDay(date);
            console.log(date);
            setShowDatePicker(false);
          }}
          date={birthDay}
          confirmTextIOS="확인"
          cancelTextIOS="취소"
          onCancel={() => setShowDatePicker(false)}
          locale="ko"
          themeVariant="light"
          isDarkModeEnabled={false}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EditInfo;
