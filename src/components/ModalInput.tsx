import React, { useContext, useEffect, useRef, useState } from "react";
import styled, { ThemeContext } from "styled-components/native";
import { theme } from "../../theme";
import { themeType } from "../types";
import { pixelScaler } from "../utils";
import { RegText16 } from "./Text";
import { BldTextInput16 } from "./TextInput";

const Container = styled.KeyboardAvoidingView`
  height: ${pixelScaler(300)}px;
  padding: 0 ${pixelScaler(30)}px;
  padding-bottom: ${pixelScaler(30)}px;
`;

const ItemsContainer = styled.View`
  height: ${pixelScaler(35)}px;
  width: ${pixelScaler(315)}px;
  flex-direction: row;
  align-items: center;
`;

const EntryContainer = styled.View`
  height: ${pixelScaler(35)}px;
  flex: 1;
  border-bottom-width: ${pixelScaler(0.66)}px;
  justify-content: center;
  margin-right: ${pixelScaler(20)}px;
`;

const SubmitButton = styled.TouchableOpacity`
  border-radius: ${pixelScaler(10)}px;
  border-color: ${({ theme }: { theme: themeType }) =>
    theme.modalInputSubmitButton};
  border-width: ${pixelScaler(1)}px;
  height: ${pixelScaler(35)}px;
  padding: 0 ${pixelScaler(20)}px;
  justify-content: center;
`;

const ModalInput = ({
  onSubmit,
  placeholder,
  setModalVisible,
}: {
  onSubmit: (_: string) => void;
  placeholder: string;
  setModalVisible: (_: boolean) => void;
}) => {
  const theme = useContext<themeType>(ThemeContext);
  const [title, setTitle] = useState<string>("");
  const textInputRef = useRef<any>();

  const onSubmitEditing = () => {
    onSubmit(title.trim());
    setModalVisible(false);
  };

  useEffect(() => {
    textInputRef.current.focus();
  }, []);

  return (
    <Container behavior="padding" keyboardVerticalOffset={pixelScaler(165)}>
      <ItemsContainer>
        <EntryContainer>
          <BldTextInput16
            ref={textInputRef}
            value={title}
            maxLength={10}
            onChangeText={(text) => setTitle(text.trim())}
            onSubmitEditing={onSubmitEditing}
            // style={{ color: theme.modalEntry }}
            placeholder={placeholder}
            placeholderTextColor={theme.modalEntry}
          />
        </EntryContainer>
        <SubmitButton onPress={onSubmitEditing}>
          <RegText16 style={{ color: theme.modalInputSubmitButton }}>
            완료
          </RegText16>
        </SubmitButton>
      </ItemsContainer>
    </Container>
  );
};

export default ModalInput;
