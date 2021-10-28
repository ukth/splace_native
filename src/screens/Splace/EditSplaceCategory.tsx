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
import { pixelScaler } from "../../utils";
import { theme } from "../../../theme";
import { RegTextInput16 } from "../../components/TextInput";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import { Icons } from "../../icons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { EDIT_SPLACE } from "../../queries";
import useMe from "../../hooks/useMe";
import { ProgressContext } from "../../contexts/Progress";

const LabelContainer = styled.View`
  flex-direction: row;
  padding-left: ${pixelScaler(30)}px;
  align-items: center;
`;

const TagsContainer = styled.View`
  flex-direction: row;
  padding-left: ${pixelScaler(30)}px;
  flex-wrap: wrap;
`;

const Tag = styled.TouchableOpacity`
  padding: 0 ${pixelScaler(10)}px;
  height: ${pixelScaler(25)}px;
  align-items: center;
  justify-content: center;
  border-radius: ${pixelScaler(25)}px;
  margin-right: ${pixelScaler(10)}px;
  flex-direction: row;
  margin-bottom: ${pixelScaler(15)}px;
`;

const EntryContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${pixelScaler(20)}px;
  padding: 0 ${pixelScaler(30)}px;
  justify-content: space-between;
`;

const AddButton = styled.TouchableOpacity`
  border-radius: ${pixelScaler(10)}px;
  width: ${pixelScaler(65)}px;
  height: ${pixelScaler(35)}px;
  border-width: ${pixelScaler(1)}px;
  border-color: ${({ theme }: { theme: ThemeType }) => theme.textHighlight};
  align-items: center;
  justify-content: center;
  margin-left: ${pixelScaler(20)}px;
`;
const TextInputContainer = styled.View`
  flex: 1;
  border-bottom-width: ${pixelScaler(0.67)}px;
  border-bottom-color: ${({ theme }: { theme: ThemeType }) =>
    theme.greyTextLight};
  justify-content: center;
`;

const CategoriesContainer = styled.View`
  flex-direction: row;
  padding: 0 ${pixelScaler(30)}px;
  margin-bottom: ${pixelScaler(15)}px;
  flex-wrap: wrap;
`;

const validateCategoryName = (name: string) => {
  const exp = /^[0-9a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣]*$/;
  return exp.test(name);
};

const EditSplaceCategory = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const { splace }: { splace: SplaceType } =
    useRoute<RouteProp<StackGeneratorParamList, "EditSplaceCategory">>().params;

  const [selectedBigCategoryIds, setSelectedBigCategoryIds] = useState<
    number[]
  >([]);

  // const {width, height} = useWindowDimensions();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryText, setCategoryText] = useState("");

  const [bigCategoryList, setBigCategoryList] = useState<any[]>([
    { id: 0, name: "음식점" },
    { id: 1, name: "음식점" },
    { id: 2, name: "음식점" },
    { id: 3, name: "음식점" },
    { id: 4, name: "음식점" },
    { id: 5, name: "음식점" },
    { id: 6, name: "음식점" },
    { id: 7, name: "음식점" },
    { id: 8, name: "음식점" },
    { id: 9, name: "음식점" },
    { id: 10, name: "음식점" },
    { id: 11, name: "음식점" },
  ]);
  const theme = useContext<ThemeType>(ThemeContext);
  const me = useMe();
  const { spinner } = useContext(ProgressContext);

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
      }
    }
  };

  const [mutation, { loading }] = useMutation(EDIT_SPLACE, { onCompleted });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldText16>편집모드</BldText16>,
      headerRight: () => (
        <HeaderRightConfirm
          onPress={() => {
            mutation({
              variables: {
                splaceId: splace.id,
                categories: selectedCategories,
                bigCategoryIds: selectedBigCategoryIds,
              },
            });
          }}
        />
      ),
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
    });
  }, [selectedCategories, selectedBigCategoryIds]);

  return (
    <ScreenContainer style={{ paddingTop: pixelScaler(30) }}>
      <LabelContainer style={{ marginBottom: pixelScaler(30) }}>
        <BldText16 style={{ marginRight: pixelScaler(10) }}>
          주요 카테고리
        </BldText16>
        <RegText13 style={{ color: theme.greyTextLight }}>최대 3개</RegText13>
      </LabelContainer>
      <TagsContainer>
        {bigCategoryList.map((bigCategory, index) => (
          <Tag
            key={index + ""}
            style={
              selectedBigCategoryIds.includes(bigCategory.id)
                ? { backgroundColor: theme.themeBackground }
                : { borderWidth: pixelScaler(0.67) }
            }
          >
            <RegText16
              style={
                selectedBigCategoryIds.includes(bigCategory.id)
                  ? { color: theme.white }
                  : {}
              }
              onPress={() => {
                if (selectedBigCategoryIds.includes(bigCategory.id)) {
                  const tmp = [...selectedBigCategoryIds];
                  tmp.splice(tmp.indexOf(bigCategory.id), 1);
                  setSelectedBigCategoryIds(tmp);
                } else {
                  setSelectedBigCategoryIds([
                    ...selectedBigCategoryIds,
                    bigCategory.id,
                  ]);
                }
              }}
            >
              {bigCategory.name}
            </RegText16>
          </Tag>
        ))}
      </TagsContainer>
      <LabelContainer
        style={{
          marginTop: pixelScaler(20),
          marginBottom: pixelScaler(10),
        }}
      >
        <BldText16 style={{ marginRight: pixelScaler(10) }}>
          세부 카테고리
        </BldText16>
        <RegText13 style={{ color: theme.greyTextLight }}>최대 10개</RegText13>
      </LabelContainer>
      <EntryContainer>
        <TextInputContainer>
          <RegTextInput16
            placeholder="원하는 카테고리를 직접 입력하세요"
            placeholderTextColor={theme.greyTextLight}
            selectionColor={theme.chatSelection}
            value={categoryText}
            onChangeText={(text) => {
              if (validateCategoryName(text.trim())) {
                setCategoryText(text.trim());
                console.log(text);
              }
            }}
            onBlur={Keyboard.dismiss}
            onSubmitEditing={Keyboard.dismiss}
          />
        </TextInputContainer>
        <AddButton
          onPress={() => {
            if (
              selectedCategories.length < 10 &&
              !selectedCategories.includes(categoryText)
            ) {
              setSelectedCategories([...selectedCategories, categoryText]);
              setCategoryText("");
            }
          }}
        >
          <RegText16 style={{ color: theme.textHighlight }}>추가</RegText16>
        </AddButton>
      </EntryContainer>
      <ScrollView>
        <CategoriesContainer>
          {selectedCategories.map((categoryName, index) => (
            <Tag
              style={{ backgroundColor: theme.themeBackground }}
              key={index + ""}
              onPress={() => {
                setSelectedCategories(
                  selectedCategories.filter((name) => name !== categoryName)
                );
              }}
            >
              <RegText16
                style={{ color: theme.white, marginRight: pixelScaler(5) }}
              >
                {categoryName}
              </RegText16>
              <Image
                source={Icons.close_white}
                style={{ width: pixelScaler(10), height: pixelScaler(10) }}
              />
            </Tag>
          ))}
        </CategoriesContainer>
        {/* {categoryRows &&
          categoryRows.map((categories, index) => (
            <CategoriesContainer key={index + ""}>
              {categories.map((categoryName, index) => (
                <Tag
                  style={{ backgroundColor: theme.themeBackground }}
                  key={index + ""}
                  onPress={() => {
                    setSelectedCategories(
                      selectedCategories.filter((name) => name !== categoryName)
                    );
                  }}
                >
                  <RegText16
                    style={{ color: theme.white, marginRight: pixelScaler(5) }}
                  >
                    {categoryName}
                  </RegText16>
                  <Image
                    source={Icons.close_white}
                    style={{ width: pixelScaler(10), height: pixelScaler(10) }}
                  />
                </Tag>
              ))}
            </CategoriesContainer>
          ))} */}
        <View style={{ height: pixelScaler(200) }} />
      </ScrollView>
    </ScreenContainer>
  );
};

export default EditSplaceCategory;
