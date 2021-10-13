import React, { useContext, useState, useEffect } from "react";
import { Image as DefaultImage } from "react-native";
import { ThemeContext } from "styled-components/native";
import * as FileSystem from "expo-file-system";
import * as Crypto from "expo-crypto";
import { themeType } from "../types";

type ImageType = DefaultImage["props"];

const Image = ({
  source: { uri },
  ...props
}: {
  source: { uri: string };
  style: any;
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
      // Use the cached image if it exists
      const metadata = await FileSystem.getInfoAsync(filesystemURI);
      if (metadata.exists) {
        setImgURI(filesystemURI);
        return;
      }

      // otherwise download to cache
      const imageObject = await FileSystem.downloadAsync(
        remoteURI,
        filesystemURI
      );
      setImgURI(imageObject.uri);
    } catch (err) {
      console.log("Image loading error:", err);
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
    // console.log(uri, props);
    componentDidMount();
  }, []);
  // useEffect(() => {
  //   console.log("\n", uri?.substring(50));
  //   console.log(imgURI?.substring(120));
  // }, [imgURI]);
  useEffect(() => {
    // console.log(uri, props);
    componentDidUpdate();
  }, [uri]);

  // useEffect(() => {
  //   console.log("########\n", imgURI, "\n", uri, "\n########");
  // }, [imgURI]);
  const theme = useContext<themeType>(ThemeContext);
  props.style = { backgroundColor: theme.imageBackground, ...props.style };

  return uri !== "" ? (
    <DefaultImage
      resizeMethod="resize"
      {...props}
      source={imgURI !== "" ? { uri: imgURI } : { uri: uri }}
    />
  ) : null;
};

export default Image;
