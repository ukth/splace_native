import React, { useContext, useState, useEffect } from "react";
import { Image as DefaultImage, ImageStyle, StyleProp } from "react-native";
import { ThemeContext } from "styled-components/native";
import * as FileSystem from "expo-file-system";
import * as Crypto from "expo-crypto";
import { ThemeType } from "../types";

const Image = ({
  source: { uri },
  ...props
}: {
  source: { uri: string };
  style: ImageStyle;
}) => {
  const [imgURI, setImgURI] = useState<string>("");

  const getImageFilesystemKey = async (remoteURI: string) => {
    const hashed = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      remoteURI
    );
    return `${FileSystem.cacheDirectory}${hashed}`;
  };

  const loadImage = async (filesystemURI: string, remoteURI: string) => {
    try {
      const metadata = await FileSystem.getInfoAsync(filesystemURI);
      if (metadata.exists) {
        // console.log(filesystemURI);
        setImgURI(filesystemURI);
        // console.log(FileSystem.cacheDirectory);
        // DefaultImage.getSize(filesystemURI, (w, h) => {
        //   console.log(w, h);
        // });
        return;
      }
      const imageObject = await FileSystem.downloadAsync(
        remoteURI,
        filesystemURI
      );
      setImgURI(imageObject.uri);
    } catch (err) {
      setImgURI(remoteURI);
    }
  };

  const componentDidMount = async () => {
    if (uri) {
      const filesystemURI = await getImageFilesystemKey(uri);
      await loadImage(filesystemURI, uri);
    }
  };

  const componentDidUpdate = async () => {
    if (uri) {
      const filesystemURI = await getImageFilesystemKey(uri);
      if (uri === imgURI || filesystemURI === imgURI) {
        return null;
      }
      await loadImage(filesystemURI, uri);
    }
  };

  useEffect(() => {
    componentDidMount();
  }, []);

  useEffect(() => {
    componentDidUpdate();
  }, [uri]);

  const theme = useContext<ThemeType>(ThemeContext);
  props.style = { backgroundColor: theme.imageBackground, ...props.style };

  return uri !== "" ? (
    <DefaultImage
      resizeMethod="resize"
      {...props}
      source={imgURI !== "" ? { uri: imgURI } : { uri: uri }}
    />
  ) : // <DefaultImage resizeMethod="resize" {...props} source={{ uri: uri }} />
  null;
};

export default Image;
