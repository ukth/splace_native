import React from "react";
import styled from "styled-components/native";
import { pixelScaler } from "../utils";

const ModalButtonBox = styled.TouchableOpacity`
  border-radius: ${pixelScaler(10)}px;
  background-color: #f2f2f7;
  margin-bottom: ${pixelScaler(3)}px;
  height: ${pixelScaler(60)}px;
  width: ${pixelScaler(315)}px;
  justify-content: center;
  align-items: center;
`;

export default ModalButtonBox;
