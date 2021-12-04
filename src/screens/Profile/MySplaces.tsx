import React, { useContext, useEffect, useState } from "react";
import { Alert, FlatList, View, Image as DefaultImage } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import ScreenContainer from "../../components/ScreenContainer";

import Image from "../../components/Image";
import {
  SaveType,
  SplaceType,
  StackGeneratorParamList,
  ThemeType,
} from "../../types";
import { RouteProp, useNavigation } from "@react-navigation/core";
import { HeaderTitle, StackNavigationProp } from "@react-navigation/stack";
import {
  DeleteButton,
  EditButtonsContainer,
  Item,
  Minus,
  NewFolderButton,
} from "../../components/Folder";
import {
  BldText13,
  BldText16,
  RegText13,
  RegText16,
} from "../../components/Text";
import { pixelScaler, shortenAddress } from "../../utils";
import { HeaderRightConfirm } from "../../components/HeaderRightConfirm";

import {
  ADD_FOLDER_MEMBERS,
  GET_MY_SPLACE,
  LEAVE_FOLDER,
  QUIT_SPLACE_OWNER,
} from "../../queries";
import { useMutation, useQuery } from "@apollo/client";

import { HeaderRightIcon } from "../../components/HeaderRightIcon";
import { NO_THUMBNAIL } from "../../constants";

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
  padding: 0 ${pixelScaler(9)}px;
  align-items: center;
  justify-content: center;
  margin-right: ${pixelScaler(10)}px;
  flex-direction: row;
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
            uri: splace.thumbnail?.length ? splace.thumbnail : NO_THUMBNAIL,
          }}
          style={{
            width: pixelScaler(145),
            height: pixelScaler(145),
            borderRadius: pixelScaler(10),
          }}
        />
      </Item>
      <InfoContainer>
        <BldText13 numberOfLines={1}>{splace.name}</BldText13>
        <BadgesContainer>
          <AddressBadge>
            <DefaultImage
              source={require("../../../assets/images/icons/positionpin_small.png")}
              style={{
                width: pixelScaler(8.3),
                height: pixelScaler(12),
                marginRight: pixelScaler(6),
              }}
            />
            <RegText13>{shortenAddress(splace.address)}</RegText13>
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
          <HeaderRightIcon
            onPress={() => setEditing(true)}
            iconName="edit"
            iconStyle={{
              width: pixelScaler(18),
              height: pixelScaler(18),
            }}
          />
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

  const { data, refetch, fetchMore } = useQuery(GET_MY_SPLACE);

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
