import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  PanResponder,
} from "react-native";
import styled from "styled-components/native";
import { pixelScaler } from "../utils";

const ModalDragBar = styled.View`
  position: absolute;
  width: ${pixelScaler(100)}px;
  height: ${pixelScaler(4)}px;
  border-radius: ${pixelScaler(2)}px;
  background-color: #d1d1d6;
  top: ${pixelScaler(12)}px;
  z-index: 1;
  /* margin-bottom: ${pixelScaler(30)}px; */
`;

const BottomSheetModal = ({
  children,
  ...props
}: {
  children: any;
  modalVisible: boolean;
  setModalVisible: any;
  style?: any;
  // height: number;
}) => {
  const { modalVisible, setModalVisible } = props;
  const [showModal, setShowModal] = useState(modalVisible);
  const screenHeight = Dimensions.get("screen").height;
  const panY = useRef(new Animated.Value(screenHeight)).current;
  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const resetBottomSheet = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  });

  const closeBottomSheet = Animated.timing(panY, {
    toValue: screenHeight,
    duration: 300,
    useNativeDriver: true,
  });

  const panResponders = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: (event, gestureState) => {
        panY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dy > 0 && gestureState.vy > 1.5) {
          setModalVisible(false);
        } else {
          setModalVisible(true);
        }
      },
    })
  ).current;

  useEffect(() => {
    if (modalVisible) {
      openModal();
    } else {
      closeModal();
    }
  }, [modalVisible]);

  const openModal = () => {
    setShowModal(true);
    resetBottomSheet.start();
  };

  const closeModal = () => {
    closeBottomSheet.start(() => {
      setShowModal(false);
    });
  };

  return (
    <Modal
      visible={showModal}
      animationType={"fade"}
      transparent
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback
          onPress={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.background} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={{
            // height: props.height,
            ...styles.bottomSheetContainer,
            ...props.style,
            transform: [{ translateY: translateY }],
          }}
          {...panResponders.panHandlers}
        >
          <ModalDragBar />
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  background: {
    flex: 1,
  },
  bottomSheetContainer: {
    paddingTop: pixelScaler(45),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});

export default BottomSheetModal;
