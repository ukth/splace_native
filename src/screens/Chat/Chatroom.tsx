import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import React, { Fragment, useRef, useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";

import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import {
  BldText16,
  RegText13,
  RegText16,
  RegText9,
} from "../../components/Text";
import {
  MessageType,
  StackGeneratorParamList,
  themeType,
  UserType,
} from "../../types";
import { getHour, getMinute, isSameDay, pixelScaler } from "../../utils";
import * as Clipboard from "expo-clipboard";
import { StackNavigationProp } from "@react-navigation/stack";
import client, { logUserIn, userIdVar } from "../../apollo";
import {
  GET_MESSAGES,
  GET_ROOMS,
  NEW_MESSAGE,
  READ_CHATROOM,
  SEND_MESSAGE,
} from "../../queries";
import {
  ApolloCache,
  DefaultContext,
  gql,
  MutationUpdaterFunction,
  OperationVariables,
  useLazyQuery,
  useMutation,
  useQuery,
} from "@apollo/client";
import useMe from "../../hooks/useMe";
import { HeaderBackButton } from "../../components/HeaderBackButton";

const Container = styled.KeyboardAvoidingView`
  background-color: ${({ theme }: { theme: themeType }) => theme.background};
  flex: 1;
`;
const ChatContainer = styled.ScrollView`
  width: 100%;
`;

const Entry = styled.View`
  width: 100%;
  padding: ${pixelScaler(10)}px ${pixelScaler(15)}px;
  /* background-color: #f0e0d0; */
  /* align-items: center; */
  flex-direction: row;
  border-top-width: ${pixelScaler(0.3)}px;
  /* border-top-color: ${({ theme }: { theme: themeType }) =>
    theme.chatEntryBorderTop}; */
  border-top-color: rgba(60, 60, 67, 0.2);
  margin-bottom: ${pixelScaler(30)}px;
`;

const EntryLeftContainer = styled.View`
  width: ${pixelScaler(60)}px;
  align-items: center;
  justify-content: flex-end;
`;

const EntryTextInputContainer = styled.View`
  flex-direction: row;
  padding: 0px ${pixelScaler(15)}px;
  /* height: ${pixelScaler(35)}px; */
  /* padding-top: ${pixelScaler(4)}px;
  padding-bottom: ${pixelScaler(7)}px; */
  background-color: ${({ theme }: { theme: themeType }) =>
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
  background-color: ${(props: { theme: themeType; isMine: boolean }) =>
    props.isMine ? props.theme.myChatBubble : props.theme.otherChatBubble};
  border-radius: ${pixelScaler(10)}px;
  margin-left: ${({ isMine }: { isMine: boolean }) =>
    isMine ? pixelScaler(5) : pixelScaler(15)}px;
  margin-right: ${({ isMine }: { isMine: boolean }) =>
    isMine ? pixelScaler(15) : pixelScaler(5)}px;
`;

const Chatroom = ({
  navigation,
  route,
}: {
  navigation: StackNavigationProp<StackGeneratorParamList>;
  route: RouteProp<StackGeneratorParamList, "Chatroom">;
}) => {
  const chatroom = route.params.room;
  const me = useMe();

  // const [messages, setMessages] = useState<any[]>([]);
  const [reloaded, setReloaded] = useState<boolean>(false);

  const textInputRef = useRef<any>();

  const [myMessage, setMyMessage] = useState<string>("");

  const theme = useContext<themeType>(ThemeContext);

  const [sendable, setSendable] = useState<boolean>(false);

  const {
    data: messageData,
    loading: loadingMessage,
    subscribeToMore,
    refetch,
  } = useQuery(GET_MESSAGES, {
    variables: {
      chatroomId: chatroom.id,
    },
    // onCompleted: onGetMessagesCompleted,
  });

  const [read_chatroom, { loading }] = useMutation(READ_CHATROOM);

  useEffect(() => {
    navigation.dangerouslyGetParent()?.setOptions({
      tabBarVisible: false,
    });
    navigation.setOptions({
      title:
        chatroom.title ??
        (chatroom.members.length === 2
          ? chatroom.members.filter((member) => member.id !== userIdVar())[0]
              .username
          : "no chatroom title"),
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.push("ChatMembers", { room: chatroom })}
        >
          <Ionicons name="menu" size={25} style={{ marginRight: 10 }} />
        </TouchableOpacity>
      ),
    });
    // console.log("refetch!", messageData?.getRoomMessages?.messages.length);
    if (!reloaded) {
      refetch();
      setReloaded(true);
      console.log("refetch!");
    }
    if (!loading) {
      read_chatroom({
        variables: { chatroomId: chatroom.id },
      });
      console.log("read!");
    }
  }, []);

  // useEffect(() => {

  // }, [loading]);

  useEffect(() => {
    if (myMessage.trim() !== "") {
      setSendable(true);
    } else {
      setSendable(false);
    }
  }, [myMessage]);

  const onGetMessagesCompleted = async (data: any) => {};

  const onSendMessageCompleted = async (data: any) => {
    const {
      sendMessage: { ok, error, message },
    } = data;

    if (!ok) {
      Alert.alert("메세지 전송에 실패했습니다.");
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
          unreadCount
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
          // console.log(prev);
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
    // console.log(cache.data);
    // console.log(result);
    const {
      data: {
        sendMessage: { ok, message },
      },
    } = result;
    if (ok) {
      // console.log(cache);

      // const newMessage = cache.writeFragment({
      //   fragment: gql`
      //     fragment NewMessage on Message {
      //       id
      //       text
      //       __typename
      //       author {
      //         __typename
      //         name
      //         id
      //         username
      //       }
      //       createdAt
      //       isMine
      //       unreadCount
      //     }
      //   `,
      //   data: {
      //     ...message,
      //     text: myMessage.trim(),
      //     __typename: "Message",
      //     author: {
      //       __typename: "User",
      //       name: me.name,
      //       id: me.id,
      //       username: me.username,
      //     },
      //     isMine: true,
      //   },
      // });
      // console.log(message);

      // console.log(newMessage);
      updateCache(message);
      // refetch();
      console.log("cache mod!");
      setMyMessage("");
      // console.log(cache);
    }
  };

  const updateQuery = (prev: any, options: any) => {
    const { newMessage: message } = options.subscriptionData.data;
    // console.log(message.id);
    // console.log(message);
    // const newMessage = client.cache.writeFragment({
    //   fragment: gql`
    //     fragment NewMessage on Message {
    //       id
    //       text
    //       __typename
    //       author {
    //         __typename
    //         name
    //         id
    //         username
    //       }
    //       createdAt
    //       isMine
    //       unreadCount
    //     }
    //   `,
    //   data: {
    //     ...message,
    //   },
    // });
    // console.log(message);

    // // console.log(newMessage);
    updateCache(message);
    if (!loading) {
      read_chatroom({
        variables: { chatroomId: chatroom.id },
      });
    }
    // refetch();
    console.log("sub mod!");
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

  console.log("reload!");

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
                  <ChatBubble
                    isMine={item.isMine}
                    onLongPress={() => {
                      Clipboard.setString(item.text);
                    }}
                  >
                    <RegText13
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
        {/* <EntryLeftContainer>
          <TouchableOpacity style={{ marginBottom: pixelScaler(4) }}>
            <Ionicons name="server-outline" size={pixelScaler(25)} />
          </TouchableOpacity>
        </EntryLeftContainer> */}
        <EntryTextInputContainer>
          <StyledTextInput
            ref={textInputRef}
            placeholder="텍스트 입력..."
            placeholderTextColor={theme.chatEntryPlaceholder}
            selectionColor={theme.chatSelection}
            multiline={true}
            onChangeText={(text) => setMyMessage(text)}
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
              onPress={_handlePressSendButton}
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
