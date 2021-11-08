import React, { useContext, useEffect, useRef, useState } from "react";
import styled, { ThemeContext } from "styled-components/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  RegistrationStackParamList,
  StackGeneratorParamList,
  ThemeType,
} from "../../../types";
import { useNavigation } from "@react-navigation/core";
import ScreenContainer from "../../../components/ScreenContainer";
import { setStatusBarStyle } from "expo-status-bar";
import { BldText16, BldText9 } from "../../../components/Text";
import { HeaderRightIcon } from "../../../components/HeaderRightIcon";
import { pixelScaler } from "../../../utils";
import { HeaderBackButton } from "../../../components/HeaderBackButton";
import {
  Alert,
  Image,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import { TasteCupItems } from "../../../constants";
import { HeaderRightConfirm } from "../../../components/HeaderRightConfirm";
import { useMutation } from "@apollo/client";
import { UPLOAD_PREFERENCE } from "../../../queries";
import { ProgressContext } from "../../../contexts/Progress";
import { isLoggedInVar } from "../../../apollo";

const ItemsContainer = styled.View`
  padding: ${pixelScaler(15)}px ${pixelScaler(30)}px;
`;

const Item = styled.TouchableOpacity`
  flex: 1;
  margin-top: ${pixelScaler(15)}px;
  margin-bottom: ${pixelScaler(15)}px;
  border-radius: ${pixelScaler(10)}px;
  align-items: center;
  justify-content: center;
`;

const SelectedBackground = styled.View`
  position: absolute;
  background-color: rgba(255, 255, 255, 0.6);
  width: 100%;
  height: 100%;
`;

const TasteCup = () => {
  const navigation =
    useNavigation<StackNavigationProp<RegistrationStackParamList>>();

  const scrollRef = useRef<any>();

  const { width } = useWindowDimensions();

  const [selectedItems, setSelectedItems] = useState<(number | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ]);

  const [scrollIndex, setScrollIndex] = useState(0);

  const { spinner } = useContext(ProgressContext);

  const theme = useContext<ThemeType>(ThemeContext);

  const onCompleted = (data: any) => {
    console.log(data);
    spinner.stop();
    if (data?.createPreference?.ok) {
      console.log(data);
      isLoggedInVar(true);
    } else {
      Alert.alert("에러 발생");
    }
  };

  const [mutation, { loading }] = useMutation(UPLOAD_PREFERENCE, {
    onCompleted,
  });

  useEffect(() => {
    setStatusBarStyle("dark");
    navigation.setOptions({
      headerTitle: () => (
        <BldText16>둘 중 하나를 선택해 주세요({scrollIndex + 1}/5)</BldText16>
      ),
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => {
            if (scrollIndex > 0) {
              scrollToIndex(scrollIndex - 1);
            }
          }}
        />
      ),
      headerRight: () =>
        selectedItems[0] !== null &&
        selectedItems[1] !== null &&
        selectedItems[2] !== null &&
        selectedItems[3] !== null &&
        selectedItems[4] !== null ? (
          <HeaderRightConfirm
            onPress={() => {
              if (!loading) {
                spinner.start();
                mutation({
                  variables: {
                    preference: [
                      selectedItems[0],
                      selectedItems[1],
                      selectedItems[2],
                      selectedItems[3],
                      selectedItems[4],
                    ],
                  },
                });
              }
            }}
          />
        ) : (
          <HeaderRightIcon
            iconName="close"
            iconStyle={{ width: pixelScaler(11), height: pixelScaler(11) }}
            onPress={() => navigation.getParent()?.navigate("InitialScreen")}
          />
        ),
      headerStyle: {
        shadowColor: "transparent",
      },
    });
  }, [scrollIndex, selectedItems]);

  const scrollToIndex = (index: number) => {
    setScrollIndex(index);
    scrollRef.current.scrollTo({ x: width * index, animated: true });
  };

  return (
    <ScreenContainer>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        ref={scrollRef}
        scrollEnabled={false}
      >
        {TasteCupItems.map((items, index) => (
          <ItemsContainer key={index + ""}>
            {items.map((item) => (
              <Item
                onPress={() => {
                  const tmp = { ...selectedItems };
                  tmp[index] = item.id;
                  setSelectedItems(tmp);
                  if (scrollIndex < 4) {
                    setTimeout(() => {
                      scrollToIndex(scrollIndex + 1);
                    }, 150);
                  }
                }}
                key={item.id}
              >
                <Image
                  source={item.source}
                  style={{
                    flex: 1,
                    width: pixelScaler(315),
                    borderRadius: pixelScaler(10),
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 1,
                    shadowRadius: 50,
                    elevation: 5,
                  }}
                >
                  <BldText9
                    style={{ color: theme.white, marginBottom: pixelScaler(5) }}
                  >
                    {item.title}
                  </BldText9>
                  <BldText16
                    style={{ color: theme.white, lineHeight: pixelScaler(23) }}
                  >
                    {item.line1}
                  </BldText16>
                  <BldText16 style={{ color: theme.white }}>
                    {item.line2}
                  </BldText16>
                </View>
                {selectedItems[index] === item.id ? (
                  <SelectedBackground />
                ) : null}
              </Item>
            ))}
          </ItemsContainer>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
};

export default TasteCup;
