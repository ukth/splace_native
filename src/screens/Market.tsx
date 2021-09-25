import React, { useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { isLoggedInVar, logUserOut, tokenVar } from "../apollo";

export default function Market({ navigation }: { navigation: any }) {
  return (
    <ScrollView>
      <TouchableOpacity
        style={{ width: 100, height: 100, backgroundColor: "#f8e0f8" }}
        onPress={() => navigation.push("Chatrooms")}
      >
        <Text>kakao</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ width: 100, height: 100, backgroundColor: "#f8a0f8" }}
        onPress={async () => {
          console.log("press logout");
          await logUserOut();
          console.log("logout!");
        }}
      >
        <Text>logout</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ width: 100, height: 100, backgroundColor: "#c8e0d8" }}
        onPress={() => navigation.push("Payment", { pay_method: "card" })}
      >
        <Text>card</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ width: 100, height: 100, backgroundColor: "#c8e0d8" }}
        onPress={() =>
          navigation.push("MomentView", {
            chatroom: {
              chatroomId: 1,
              title: null,
              members: [
                { userId: 1, username: "dreamost_heo" },
                { userId: 2, username: "ukth_1234" },
              ],
            },
          })
        }
      >
        <Text>MomentView</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
