import React, { useContext, useState, useEffect } from "react";
import { Image as DefaultImage } from "react-native";
import { ThemeContext } from "styled-components/native";
import * as FileSystem from "expo-file-system";
import * as Crypto from "expo-crypto";
