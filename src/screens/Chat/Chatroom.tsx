import { Ionicons } from "@expo/vector-icons";
// import { RouteProp } from "@react-navigation/native";
import React, { Fragment, useRef, useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";

import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  TouchableOpacity,
  View,
} from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import {
  BldText13,
  BldText16,
  RegText13,
  RegText9,
} from "../../components/Text";
import {
  MessageType,
  RoomType,
  StackGeneratorParamList,
  ThemeType,
} from "../../types";
import { pixelScaler } from "../../utils";
import * as Clipboard from "expo-clipboard";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import client, { userIdVar } from "../../apollo";
import {
  ADD_ROOM_MEMBERS,
  EDIT_ROOM_TITLE,
  GET_MESSAGES,
  GET_ROOM_INFO,
  LEAVE_ROOM,
  NEW_MESSAGE,
  READ_ROOM,
  SEND_MESSAGE,
} from "../../queries";
import { ApolloCache, gql, useMutation, useQuery } from "@apollo/client";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import { BldTextInput16 } from "../../components/TextInput";
import { HeaderRightConfirm } from "../../components/HeaderRightConfirm";

const Entry = styled.View`
  width: 100%;
  padding: ${pixelScaler(10)}px ${pixelScaler(15)}px;
  /* background-color: #f0e0d0; */
  /* align-items: center; */
  flex-direction: row;
  border-top-width: ${pixelScaler(0.3)}px;
  /* border-top-color: ${({ theme }: { theme: ThemeType }) =>
    theme.chatEntryBorderTop}; */
  border-top-color: rgba(60, 60, 67, 0.2);
  margin-bottom: ${pixelScaler(30)}px;
`;

const EntryTextInputContainer = styled.View`
  flex-direction: row;
  padding: 0px ${pixelScaler(15)}px;
  /* height: ${pixelScaler(35)}px; */
  /* padding-top: ${pixelScaler(4)}px;
  padding-bottom: ${pixelScaler(7)}px; */
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.chatEntryInputBackground};
  flex: 1;
  border-radius: ${pixelScaler(10)}px;

  justify-content: space-between;
`;

const StyledTextInput = styled.TextInput`
  width: ${pixelScaler(270)}px;
  font-size: ${pixelScaler(13.5)}px;
  /* background-color: #f0d0a0; */
  margin-top: ${pixelScaler(6)}px;
  margin-bottom: ${pixelScaler(8)}px;
  line-height: ${pixelScaler(17)}px;
  max-height: ${pixelScaler(120)}px;
`;

const EntryRightContainer = styled.View`
  width: ${pixelScaler(60)}px;
  align-items: center;
  justify-content: flex-end;
`;

const SendButton = styled.TouchableOpacity`
  position: absolute;
  bottom: ${pixelScaler(8)}px;
  right: ${pixelScaler(15)}px;
`;

const DateSectioningLine = styled.View`
  height: ${pixelScaler(45)}px;
  align-items: center;
  justify-content: center;
`;

const UsernameContainer = styled.View`
  height: ${pixelScaler(40)}px;
  width: 100%;
`;

const Username = styled.View`
  position: absolute;
  left: ${pixelScaler(25)}px;
  bottom: ${pixelScaler(10)}px;
`;

const ChatBubbleContainer = styled.View`
  flex-direction: ${({ isMine }: { isMine: boolean }) =>
    isMine ? "row-reverse" : "row"};
  align-items: center;
  margin-bottom: ${pixelScaler(5)}px;
`;

const ChatBubble = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  padding: ${pixelScaler(10)}px ${pixelScaler(10)}px;
  max-width: ${pixelScaler(237)}px;
  background-color: ${(props: { theme: ThemeType; isMine: boolean }) =>
    props.isMine ? props.theme.myChatBubble : props.theme.otherChatBubble};
  border-radius: ${pixelScaler(10)}px;
  margin-left: ${({ isMine }: { isMine: boolean }) =>
    isMine ? pixelScaler(5) : pixelScaler(15)}px;
  margin-right: ${({ isMine }: { isMine: boolean }) =>
    isMine ? pixelScaler(15) : pixelScaler(5)}px;
`;

const Chatroom = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const route = useRoute<RouteProp<StackGeneratorParamList, "Chatroom">>();
  const textInputRef = useRef<any>();
  const theme = useContext<ThemeType>(ThemeContext);

  const [chatroom, setChatroom] = useState<RoomType>(route.params.room);

  const [reloaded, setReloaded] = useState<boolean>(false);
  const [myMessage, setMyMessage] = useState<string>("");
  const [sendable, setSendable] = useState<boolean>(false);
  const [titleEditing, setTitleEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const titleRef = useRef<any>();

  const {
    data: messageData,
    loading: loadingMessage,
    subscribeToMore,
    refetch,
  } = useQuery(GET_MESSAGES, {
    variables: {
      chatroomId: chatroom.id,
    },
  });

  const [read_chatroom, { loading }] = useMutation(READ_ROOM);

  const onInviteCompleted = (data: {
    addChatMembers: {
      ok: boolean;
      error: string;
    };
  }) => {
    const {
      addChatMembers: { ok, error },
    } = data;
    if (ok) {
      navigation.pop();
    } else {
      // console.log(data);
      Alert.alert("초대에 실패하였습니다.\n", error);
    }
  };

  const [inviteMutation, { loading: inviteMutationLoading }] = useMutation(
    ADD_ROOM_MEMBERS,
    {
      onCompleted: onInviteCompleted,
    }
  );

  const onLeaveCompleted = (data: any) => {
    const {
      quitChatroom: { ok, error },
    } = data;
    if (ok) {
      navigation.navigate("Chatrooms");
    } else {
      Alert.alert("채팅방을 나갈 수 없습니다.\n", error);
    }
  };

  const [leaveMutation, { loading: leaveMutationLoading }] = useMutation(
    LEAVE_ROOM,
    {
      onCompleted: onLeaveCompleted,
    }
  );

  const {
    data: roomInfo,
    loading: roomInfoLoading,
    refetch: refetchMembers,
  } = useQuery(GET_ROOM_INFO, {
    variables: {
      chatroomId: chatroom.id,
    },
  });

  const onEditCompleted = (data: any) => {
    const {
      editChatroom: { ok, error },
    } = data;
    if (ok) {
      refetch();
      setTitleEditing(false);
      setChatroom({ ...chatroom, title });
    } else {
      Alert.alert("채팅방을 나갈 수 없습니다.\n", error);
    }
  };

  const [editMutation, { loading: editRoomLoading }] = useMutation(
    EDIT_ROOM_TITLE,
    {
      onCompleted: onEditCompleted,
    }
  );

  useEffect(() => {
    navigation.dangerouslyGetParent()?.setOptions({
      tabBarVisible: false,
    });
    navigation.setOptions({
      headerTitle: () => {
        return titleEditing ? (
          <View
            style={{
              height: 50,
              alignItems: "center",
            }}
          >
            <BldTextInput16
              ref={titleRef}
              // value={title}
              selectionColor={theme.chatSelection}
              // placeholder={chatroom.title ? chatroom.title : ""}
              // placeholderTextColor={theme.text}
              onChangeText={(text) => setTitle(text.trim())}
              maxLength={20}
              textAlign="center"
            />
            <View style={{ width: pixelScaler(225) }} />
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setTitleEditing(true);
              // console.log(titleRef);
            }}
          >
            <BldText16 numberOfLines={1}>
              {chatroom.title
                ? chatroom.title
                : chatroom.members.map((member) => member.username).join(", ")}
            </BldText16>
          </TouchableOpacity>
        );
      },
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
      headerRight: () =>
        titleEditing ? (
          <HeaderRightConfirm
            onPress={() => {
              editMutation({
                variables: {
                  chatroomId: chatroom.id,
                  title,
                },
              });
            }}
          />
        ) : (
          <TouchableOpacity
            onPress={() =>
              navigation.push("Members", {
                title: roomInfo.title,
                vars: {
                  chatroomId: chatroom.id,
                },
                membersData: roomInfo?.getRoomInfo?.room?.members,
                refetchMembers,
                inviteMutation,
                leaveMutation,
              })
            }
          >
            <Ionicons name="menu" size={25} style={{ marginRight: 10 }} />
          </TouchableOpacity>
        ),
    });

    if (!reloaded) {
      refetch();
      setReloaded(true);
      // console.log("refetch!");
    }
    if (!loading) {
      read_chatroom({
        variables: { chatroomId: chatroom.id },
      });
      // console.log("read!");
    }
  }, [roomInfoLoading, titleEditing, title, chatroom]);

  useEffect(() => {
    if (titleEditing) {
      titleRef.current?.focus();
    }
  }, [titleRef.current]);

  useEffect(() => {
    if (myMessage.trim() !== "") {
      setSendable(true);
    } else {
      setSendable(false);
    }
  }, [myMessage]);

  const onSendMessageCompleted = async (data: any) => {
    const {
      sendMessage: { ok, error, message, readedRecord },
    } = data;

    if (!ok) {
      Alert.alert("메세지 전송에 실패했습니다.");
      console.log(error);
    }
  };

  const updateCache = (message: MessageType) => {
    const newMessage = client.cache.writeFragment({
      fragment: gql`
        fragment NewMessage on Message {
          id
          text
          __typename
          author {
            __typename
            name
            id
            username
          }
          createdAt
          isMine
        }
      `,
      data: {
        ...message,
      },
    });

    client.cache.modify({
      id: `getRoomMessagesResult:${chatroom.id}`,
      fields: {
        messages(prev) {
          const existingMessage = prev.find(
            (aMessage: any) => aMessage.__ref === newMessage?.__ref
          );

          if (existingMessage) {
            return prev;
          }
          return [newMessage, ...prev];
        },
      },
    });

    client.cache.modify({
      id: `Chatroom:${chatroom.id}`,
      fields: {
        lastMessage(prev) {
          const newRef = { __ref: `Message:${message.id}` };
          return newRef;
        },
      },
    });

    client.cache.modify({
      id: `getMyRooms`,
      fields: {
        myRooms(prev) {
          return prev;
        },
      },
    });
  };

  const updateSendMessage = (
    cache: ApolloCache<any>,
    result:
      | {
          data: {
            sendMessage: {
              ok: boolean;
              message: MessageType;
            };
          };
        }
      | any
  ) => {
    const {
      data: {
        sendMessage: { ok, message },
      },
    } = result;
    if (ok) {
      updateCache(message);
      // refetch();
      // console.log("cache mod!");
      setMyMessage("");
      read_chatroom({
        variables: { chatroomId: chatroom.id },
      });
    }
  };

  const updateQuery = (prev: any, options: any) => {
    const { newMessage: message } = options.subscriptionData.data;
    updateCache(message);
    if (!loading) {
      read_chatroom({
        variables: { chatroomId: chatroom.id },
      });
    }
    // console.log("sub mod!");
  };

  useEffect(() => {
    if (messageData?.getRoomMessages) {
      subscribeToMore({
        document: NEW_MESSAGE,
        variables: {
          chatroomId: chatroom.id,
        },
        updateQuery,
      });
    }
  }, [messageData]);

  const [mutation, { loading: loadingSendMessage, error }] = useMutation(
    SEND_MESSAGE,
    {
      onCompleted: onSendMessageCompleted,
      update: updateSendMessage,
    }
  );

  const _handlePressSendButton = () => {
    if (!loadingSendMessage && sendable) {
      if (myMessage.trim() !== "") {
        setSendable(false);
        textInputRef.current.clear();
        mutation({
          variables: {
            chatroomId: chatroom.id,
            text: myMessage.trim(),
          },
        });
      }
    }
  };

  const messages = [...(messageData?.getRoomMessages?.messages ?? [])];

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={pixelScaler(65)}
      style={{ backgroundColor: theme.chatRoomBackground, flex: 1 }}
    >
      {loadingMessage ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <BldText16>Loading...</BldText16>
        </View>
      ) : (
        <FlatList
          inverted
          style={{ width: "100%" }}
          // data={data?.getRoomMessages?.messages}
          data={messages}
          keyExtractor={(message: any) => "" + message.id}
          renderItem={({ item, index }) => {
            // DateSectioningLine
            var date = new Date(Number(item.createdAt));
            // console.log(item.createdAt);

            const hrs = date.getHours();

            const min = date.getMinutes();
            // console.log(hrs, min);
            // console.log(date.getFullYear(), date.getMonth(), date.getDate());

            const showDate =
              index === messages.length - 1 ||
              Math.floor((Number(item.createdAt) + 3600000 * 9) / 86400000) !==
                Math.floor(
                  (Number(messages[index + 1].createdAt) + 3600000 * 9) /
                    86400000
                );

            const showTime =
              index === 0 ||
              item.author.id !== messages[index - 1].author.id ||
              Math.floor(Number(item.createdAt) / 60000) !==
                Math.floor(Number(messages[index - 1].createdAt) / 60000);

            const showName =
              showDate ||
              (index === messages.length - 1 && !item.isMe) ||
              messages[index + 1].author.id !== item.author.id;

            return (
              <View>
                {showDate ? (
                  <DateSectioningLine>
                    <RegText13 style={{ color: theme.chatTimeText }}>
                      {date.getFullYear()}년 {date.getMonth() + 1}월{" "}
                      {date.getDate()}일
                    </RegText13>
                  </DateSectioningLine>
                ) : null}
                {showName ? (
                  <UsernameContainer>
                    {item.isMine ? null : (
                      <Username>
                        <RegText13>
                          {item.author.name ?? item.author.username}
                        </RegText13>
                      </Username>
                    )}
                  </UsernameContainer>
                ) : null}
                <ChatBubbleContainer isMine={item.isMine}>
                  <ChatBubble isMine={item.isMine}>
                    <RegText13
                      selectable={true}
                      style={{
                        color: item.isMine
                          ? theme.myChatText
                          : theme.otherChatText,
                        lineHeight: pixelScaler(17),
                      }}
                    >
                      {item.text}
                    </RegText13>
                  </ChatBubble>
                  {showTime ? (
                    <RegText9 style={{ color: theme.chatTimeText }}>
                      {hrs < 12 ? "오전 " : "오후 "}
                      {/* {hrs % 12 <= 10 ? "0" : null} */}
                      {hrs % 12}:{min < 10 ? "0" : null}
                      {min}
                    </RegText9>
                  ) : null}
                </ChatBubbleContainer>
              </View>
            );
          }}
        />
      )}
      <Entry>
        <EntryTextInputContainer>
          <StyledTextInput
            ref={textInputRef}
            placeholder="텍스트 입력..."
            placeholderTextColor={theme.chatEntryPlaceholder}
            selectionColor={theme.chatSelection}
            multiline={true}
            onChangeText={(text) => setMyMessage(text)}
            maxLength={1000}
            autoCapitalize="none"
          />

          {sendable ? (
            <SendButton
              onPress={_handlePressSendButton}
              hitSlop={{ top: 10, bottom: 10, left: 15, right: 15 }}
            >
              <BldText16 style={{ color: theme.chatSendText }}>전송</BldText16>
            </SendButton>
          ) : (
            <SendButton
              // onPress={_handlePressSendButton}
              hitSlop={{ top: 10, bottom: 10, left: 15, right: 15 }}
            >
              <BldText16 style={{ color: theme.chatSendText }}>??</BldText16>
            </SendButton>
          )}
        </EntryTextInputContainer>
      </Entry>
    </KeyboardAvoidingView>
  );
};

export default Chatroom;
