import React from "react";
import ContentLoader, { Circle, Rect } from "react-content-loader/native";
import { pixelScaler } from "../utils";

export const PhotologSkeleton = () => (
  <ContentLoader
    style={{
      height: pixelScaler(800),
    }}
  >
    <Circle
      cx={String(pixelScaler(43))}
      cy={String(pixelScaler(30))}
      r={String(pixelScaler(15))}
    />
    <Rect
      x={String(pixelScaler(66))}
      y={String(pixelScaler(22))}
      rx={String(pixelScaler(3))}
      ry={String(pixelScaler(3))}
      width={String(pixelScaler(150))}
      height={String(pixelScaler(16))}
    />
    <Rect
      x={String(pixelScaler(30))}
      y={String(pixelScaler(60))}
      rx={String(pixelScaler(15))}
      ry={String(pixelScaler(15))}
      width={String(pixelScaler(315))}
      height={String(pixelScaler(394))}
    />
    <Rect
      x={String(pixelScaler(30))}
      y={String(pixelScaler(474))}
      rx={String(pixelScaler(3))}
      ry={String(pixelScaler(3))}
      width={String(pixelScaler(150))}
      height={String(pixelScaler(20))}
    />
    <Rect
      x={String(pixelScaler(30))}
      y={String(pixelScaler(510))}
      rx={String(pixelScaler(3))}
      ry={String(pixelScaler(3))}
      width={String(pixelScaler(300))}
      height={String(pixelScaler(15))}
    />
    <Rect
      x={String(pixelScaler(30))}
      y={String(pixelScaler(531))}
      rx={String(pixelScaler(3))}
      ry={String(pixelScaler(3))}
      width={String(pixelScaler(300))}
      height={String(pixelScaler(15))}
    />
  </ContentLoader>
);
