import React, { useRef, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ScreenContainer from "../../components/ScreenContainer";

const Notification = () => {
  const notification: readonly any[] | null | undefined = [];

  return (
    <ScreenContainer>
      <FlatList data={notification} renderItem={() => <></>} />
    </ScreenContainer>
  );
};

export default Notification;
