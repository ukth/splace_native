import React, { useState, createContext, useEffect } from "react";
import { Alert } from "react-native";

const ImagePickerContext = createContext<{
  images: {
    edited: boolean;
    url: string;
    orgUrl: string;
  }[];
  setImages: React.Dispatch<
    React.SetStateAction<
      {
        edited: boolean;
        url: string;
        orgUrl: string;
      }[]
    >
  >;
  showPicker: boolean;
  setShowPicker: React.Dispatch<React.SetStateAction<boolean>>;
  imageSize: number;
  setImageSize: React.Dispatch<React.SetStateAction<0 | 1 | 2>>;
}>({
  images: [],
  setImages: () => {},
  showPicker: false,
  setShowPicker: () => {},
  imageSize: 0,
  setImageSize: () => {},
});

const ImagePickerProvider = ({ children }: { children: any }) => {
  const [images, setImages] = useState<
    {
      edited: boolean;
      url: string;
      orgUrl: string;
    }[]
  >([]);
  const [showPicker, setShowPicker] = useState(false);
  const [imageSize, setImageSize] = useState<0 | 1 | 2>(1);
  const value = {
    images,
    setImages,
    showPicker,
    setShowPicker,
    imageSize,
    setImageSize,
  };
  return (
    <ImagePickerContext.Provider value={value}>
      {children}
    </ImagePickerContext.Provider>
  );
};

export { ImagePickerContext, ImagePickerProvider };