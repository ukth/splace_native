import React, { useState, createContext, useEffect } from "react";
import { SplaceType } from "../types";

const UploadContentContext = createContext<{
  content: {
    isPrivate?: boolean;
    splace?: SplaceType;
    series?: {
      id: number;
      title: string;
    }[];
    category?: string[];
    bigCategory?: {
      id: number;
      name: string;
    }[];
    locationText?: string;
  };
  setContent: React.Dispatch<
    React.SetStateAction<{
      isPrivate?: boolean;
      splace?: SplaceType;
      series?: {
        id: number;
        title: string;
      }[];
      category?: string[];
      bigCategory?: {
        id: number;
        name: string;
      }[];
      locationText?: string;
    }>
  >;
}>({
  content: {},
  setContent: () => {},
});

const UploadContentProvider = ({ children }: { children: React.ReactNode }) => {
  const [content, setContent] = useState<{
    isPrivate?: boolean;
    splace?: SplaceType;
    series?: {
      id: number;
      title: string;
    }[];
    category?: string[];
    bigCategory?: {
      id: number;
      name: string;
    }[];
    locationText?: string;
  }>({});
  const value = {
    content,
    setContent,
  };
  return (
    <UploadContentContext.Provider value={value}>
      {children}
    </UploadContentContext.Provider>
  );
};

export { UploadContentContext, UploadContentProvider };
