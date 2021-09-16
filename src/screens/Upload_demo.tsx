import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import QRCode from "react-native-qrcode-svg";
import ImageZoom from "react-native-image-pan-zoom";
import { Dimensions } from "react-native";
import { pixelScaler } from "../utils";
import styled from "styled-components/native";
import { RegText13 } from "../components/Text";

const Button = styled.TouchableOpacity`
  border-width: 1px;
  border-radius: 12.5px;
  height: 25px;
  padding: 0 10px;
  justify-content: center;
  margin-left: 20px;
  margin-top: 20px;
`;

const Moment = () => {
  // const [hasPermission, setHasPermission] = useState(null);
  // const [scanned, setScanned] = useState(false);
  // useEffect(() => {
  //   (async () => {
  //     const { status } = await BarCodeScanner.requestPermissionsAsync();
  //     setHasPermission(status === "granted");
  //   })();
  // }, []);
  // const handleBarCodeScanned = ({ type, data }) => {
  //   setScanned(true);
  //   console.log(type);
  //   console.log(data);
  //   alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  // };
  // if (hasPermission === null) {
  //   return <Text>Requesting for camera permission</Text>;
  // }
  // if (hasPermission === false) {
  //   return <Text>No access to camera</Text>;
  // }
  // console.log(StyleSheet.absoluteFillObject);
  // return (
  //   <View style={{ flex: 1, backgroundColor: "#f0d0c0" }}>
  //     <QRCode
  //       size={300}
  //       value="https://www.instagram.com/dreamost_heo?utm_source=qr"
  //       logo={require("../../assets/images/super.png")}
  //       color="#00a4b7"
  //       logoSize={30}
  //       logoBackgroundColor="#ffffff"
  //       logoBorderRadius={10}
  //     />
  //   </View>
  // );

  const [photoSize, setPhotoSize] = useState(2);
  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        backgroundColor: "#ffffff",
      }}
    >
      <View
        style={{
          marginTop: pixelScaler(30),
          marginHorizontal: pixelScaler(30),
          zIndex: 2,
        }}
      >
        <ImageZoom
          style={{
            borderRadius: pixelScaler(15),
          }}
          cropWidth={pixelScaler(315)}
          cropHeight={
            photoSize === 1
              ? pixelScaler(394)
              : photoSize === 2
              ? pixelScaler(315)
              : pixelScaler(252)
          }
          imageWidth={pixelScaler(315)}
          imageHeight={
            photoSize === 1
              ? pixelScaler(394)
              : photoSize === 2
              ? pixelScaler(315)
              : pixelScaler(252)
          }
          useNativeDriver={true}
        >
          <Image
            style={{
              width: pixelScaler(315),
              height:
                photoSize === 1
                  ? pixelScaler(394)
                  : photoSize === 2
                  ? pixelScaler(315)
                  : pixelScaler(252),
              zIndex: 0,
            }}
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png",
            }}
          />
        </ImageZoom>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Button onPress={() => setPhotoSize(1)}>
          <RegText13>4:3</RegText13>
        </Button>
        <Button onPress={() => setPhotoSize(2)}>
          <RegText13>1:1</RegText13>
        </Button>
        <Button onPress={() => setPhotoSize(3)}>
          <RegText13>3:4</RegText13>
        </Button>
      </View>
    </View>
  );
};

export default Moment;
