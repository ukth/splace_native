import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Image as DefaultImage,
} from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import ScreenContainer from "../../components/ScreenContainer";

import Image from "../../components/Image";
import {
  FolderType,
  SaveType,
  SplaceType,
  StackGeneratorParamList,
  ThemeType,
} from "../../types";
import { RouteProp, useNavigation } from "@react-navigation/core";
import { HeaderTitle, StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import {
  DeleteButton,
  EditButtonsContainer,
  Item,
  Minus,
  NewFolderButton,
  SortButton,
} from "../../components/Folder";
import {
  BldText13,
  BldText16,
  BldText20,
  RegText13,
  RegText16,
  RegText20,
} from "../../components/Text";
import { BLANK_IMAGE, pixelScaler, strCmpFunc } from "../../utils";
import { HeaderRightMenu } from "../../components/HeaderRightMenu";
import BottomSheetModal from "../../components/BottomSheetModal";
import ModalButtonBox from "../../components/ModalButtonBox";
import { HeaderRightConfirm } from "../../components/HeaderRightConfirm";
import { Splace } from "..";
import {
  ADD_FOLDER_MEMBERS,
  EDIT_FOLDER,
  GET_FOLDER_INFO,
  GET_MY_SPLACE,
  LEAVE_FOLDER,
  QUIT_SPLACE_OWNER,
  REMOVE_SAVE,
} from "../../queries";
import { fromPromise, useMutation, useQuery } from "@apollo/client";
import ModalMapView from "../../components/ModalMapView";
import { FloatingMapButton } from "../../components/FloatingMapButton";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import { Icons } from "../../icons";
import { HeaderRightEdit } from "../../components/HeaderRightEdit";

const SplaceItemContainer = styled.View`
  width: ${pixelScaler(170)}px;
  height: ${pixelScaler(225)}px;
  align-items: center;
`;

const InfoContainer = styled.View`
  width: ${pixelScaler(145)}px;
  margin-top: ${pixelScaler(15)}px;
`;

const BadgesContainer = styled.View`
  flex-direction: row;
  margin-top: ${pixelScaler(12)}px;
`;

const AddressBadge = styled.TouchableOpacity`
  border-width: ${pixelScaler(0.7)}px;
  height: ${pixelScaler(20)}px;
  width: ${pixelScaler(74)}px;
  align-items: center;
  justify-content: center;
  margin-right: ${pixelScaler(10)}px;
`;

const SplaceItem = ({
  splace,
  refetch,
  editing,
}: {
  splace: SplaceType;
  refetch: () => void;
  editing: boolean;
}) => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const onDeleteCompleted = (data: {
    removeSave: {
      ok: boolean;
      error: string;
    };
  }) => {
    const {
      removeSave: { ok, error },
    } = data;
    if (ok) {
      Alert.alert("삭제되었습니다.\n", error);
      refetch();
    } else {
      Alert.alert("삭제에 실패했습니다.\n", error);
    }
  };

  const [mutation, { loading }] = useMutation(QUIT_SPLACE_OWNER, {
    onCompleted: onDeleteCompleted,
  });

  return (
    <SplaceItemContainer>
      {editing ? (
        <DeleteButton
          onPress={() => {
            Alert.alert(
              "",
              "'" +
                splace.name +
                "'에 대한 접근 권한을 삭제하시겠습니까? 기록된 게시물과 정보는 사라지지 않습니다.",
              [
                {
                  text: "취소",
                  style: "cancel",
                },
                {
                  text: "확인",
                  onPress: () => {
                    mutation({
                      variables: {
                        splaceId: splace.id,
                      },
                    });
                  },
                },
              ]
            );
          }}
        >
          <Minus />
        </DeleteButton>
      ) : null}
      <Item
        onPress={() => {
          navigation.push("Splace", {
            splace,
          });
        }}
      >
        <Image
          source={{
            uri: splace.thumbnail ?? BLANK_IMAGE,
          }}
          style={{
            width: pixelScaler(145),
            height: pixelScaler(145),
            borderRadius: pixelScaler(10),
          }}
        />
      </Item>
      <InfoContainer>
        <BldText13>{splace.name}</BldText13>
        <BadgesContainer>
          <AddressBadge>
            <RegText13>{splace.address}</RegText13>
          </AddressBadge>
        </BadgesContainer>
      </InfoContainer>
    </SplaceItemContainer>
  );
};

const MySplaces = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "MySplaces">;
}) => {
  const [editing, setEditing] = useState<boolean>(false);
  const theme = useContext<ThemeType>(ThemeContext);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [showMap, setShowMap] = useState(false);

  const [saves, setSaves] = useState<SaveType[]>();

  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        editing ? (
          <HeaderRightConfirm onPress={() => setEditing(false)} />
        ) : (
          <HeaderRightEdit onPress={() => setEditing(true)} />
        ),
      headerTitle: () => <BldText16>등록된 공간 관리</BldText16>,
    });
  }, [editing]);

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onInviteCompleted = (data: {
    addFolderMembers: {
      ok: boolean;
      error: string;
    };
  }) => {
    const {
      addFolderMembers: { ok, error },
    } = data;
    if (ok) {
      navigation.pop();
    } else {
      // console.log(data);
      Alert.alert("초대에 실패하였습니다.\n", error);
    }
  };

  const [inviteMutation, { loading: inviteMutationLoading }] = useMutation(
    ADD_FOLDER_MEMBERS,
    {
      onCompleted: onInviteCompleted,
    }
  );

  const onLeaveCompleted = (data: any) => {
    const {
      quitFolder: { ok, error },
    } = data;
    if (ok) {
      navigation.navigate("Folders");
    } else {
      Alert.alert("폴더를 나갈 수 없습니다.\n", error);
    }
  };

  const [leaveMutation, { loading: leaveMutationLoading }] = useMutation(
    LEAVE_FOLDER,
    {
      onCompleted: onLeaveCompleted,
    }
  );

  const { data, refetch } = useQuery(GET_MY_SPLACE);

  navigation.addListener("focus", async () => {
    await refetch();
  });

  return (
    <ScreenContainer>
      <FlatList
        style={{ left: pixelScaler(17.5), width: pixelScaler(340) }}
        ListHeaderComponent={() => (
          <EditButtonsContainer>
            <NewFolderButton
              onPress={() => {
                navigation.push("SearchSplaceForAdd");
              }}
            >
              <RegText13>+ 장소 추가하기</RegText13>
            </NewFolderButton>
          </EditButtonsContainer>
        )}
        data={data?.getMySplace?.splaces}
        renderItem={({ item, index }) => (
          <SplaceItem splace={item} editing={editing} refetch={refetch} />
        )}
        keyExtractor={(item, index) => "" + index}
        numColumns={2}
      />
      {!data?.getMySplace || data?.getMySplace?.splaces?.length > 0 ? null : (
        <View
          style={{
            flex: 1.3,
            alignItems: "center",
          }}
        >
          <RegText16 style={{ lineHeight: pixelScaler(23) }}>
            소유한 공간이 없습니다.
          </RegText16>
        </View>
      )}
    </ScreenContainer>
  );
};

export default MySplaces;
