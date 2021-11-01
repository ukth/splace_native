import React, { useContext, useEffect } from "react";
import { ThemeContext } from "styled-components/native";
import {
  createStackNavigator,
  StackHeaderInterpolationProps,
  StackHeaderInterpolatedStyle,
} from "@react-navigation/stack";
import {
  Mainfeed,
  Search,
  Profile,
  Splace,
  EditSplace,
  EditSplaceCategory,
  EditSplaceInfo,
  EditSplaceIntro,
  EditSplaceItem,
  EditSplaceLocation,
  EditSplaceOperatingtime,
  EditSplaceLocationSearch,
  FixedContents,
  AddFixedContents,
  RegisterOwner,
  SuggestInfo,
  EditFixedContents,
  SplaceLogs,
  Series,
  // Market,
  Payment,
  Chatrooms,
  Chatroom,
  Members,
  AddMembers,
  MomentView,
  Folders,
  Folder,
  AddSaveFolders,
  AddSaveFolder,
  ProfileUsers,
  UserLogs,
  EditProfile,
  Log,
  Report,
  Setting,
  ChangePassword,
  EditInfo,
  BlockedUsers,
  ServicePolicy,
  TermsOfUse,
  Agreement,
  SearchSplaceForAdd,
  ImagesViewer,
  StackPickerAlbums,
  StackPickerAssets,
  MySplaces,
  SuggestNewSplace,
  AddressSelector,
  UploadLog,
  UploadMoment,
  UploadSeries,
  SearchSplaceForUpload,
  // SearchSplaceForLog,
  SelectCategory,
  SelectSeries,
  EditPhotolog,
  EditSeries,
  LogsByCategory,
  LogsByBigCategory,
} from "../screens";
import styled from "styled-components/native";
import { Image, Platform, View, Animated } from "react-native";
import {
  useNavigation,
  getFocusedRouteNameFromRoute,
  useRoute,
} from "@react-navigation/native";
import { StackGeneratorParamList, StackGeneratorProps } from "../types";
import { pixelScaler } from "../utils";
import { RegText13 } from "../components/Text";
import { useWindowDimensions } from "react-native";
import { setStatusBarStyle } from "expo-status-bar";
import useMe from "../hooks/useMe";
import { ImagePickerContext } from "../contexts/ImagePicker";
import { HeaderBackButton } from "../components/HeaderBackButton";

const ProfileImage = styled.TouchableOpacity`
  margin-right: 10px;
  margin-top: 5px;
  width: 36px;
  height: 36px;
  border-radius: 18px;
  border: 1px solid #404040;
`;

const Stack = createStackNavigator<StackGeneratorParamList>();

const StackGenerator = ({ screenName }: StackGeneratorProps) => {
  const theme = useContext(ThemeContext);

  const navigation = useNavigation();
  const route = useRoute();

  const focused = getFocusedRouteNameFromRoute(route) ?? screenName;
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (
      ["Chatroom", "MomentView", "ImagesViewer", "UploadMoment"].includes(
        focused
      )
    ) {
      navigation.setOptions({
        tabBarVisible: false,
      });
    } else {
      navigation.setOptions({
        tabBarVisible: true,
      });
    }
    if (["MomentView", "ImagesViewer", "UploadMoment"].includes(focused)) {
      setStatusBarStyle("light");
    } else {
      setStatusBarStyle("dark");
    }
  }, [focused]);

  const { add } = Animated;

  const forSlideLeft = ({
    current,
    next,
    layouts: { screen },
  }: StackHeaderInterpolationProps): StackHeaderInterpolatedStyle => {
    const progress = add(
      current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolate: "clamp",
      }),
      next
        ? next.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: "clamp",
          })
        : 0
    );

    const translateX = progress.interpolate({
      inputRange: [0, 1, 1.95, 2],
      outputRange: [
        screen.width * 1,
        0,
        -screen.width * 0.3,
        -screen.width * 2,
      ], //[-screen.width, 0, screen.width], // [screen.width, 0, -screen.width],
    });

    const transform = [{ translateX }];

    return {
      leftButtonStyle: { transform },
      rightButtonStyle: { transform },
      titleStyle: { transform },
      backgroundStyle: { transform },
    };
  };
  // console.log(Chatrooms);
  // console.log(Chatroom);
  return (
    <Stack.Navigator
      screenOptions={({ route, navigation }) => {
        return {
          headerStyle: {
            height: pixelScaler(95),
          },
          headerStyleInterpolator: forSlideLeft,
          headerLeft: () =>
            navigation.getState().routes.length > 1 ? (
              <HeaderBackButton onPress={() => navigation.pop()} />
            ) : null,
          // headerStyleInterpolator: HeaderStyleInterpolators.forSlideLeft,
          headerShown: !["MomentView", "ImagesViewer", "UploadMoment"].includes(
            focused
          ),
        };
      }}
    >
      {screenName === "Mainfeed" ? (
        <Stack.Screen name="Mainfeed" component={Mainfeed} />
      ) : null}
      {screenName === "Search" ? (
        <Stack.Screen name="Search" component={Search} />
      ) : null}
      {/* {screenName === "Market" ? (
        <Stack.Screen name="Market" component={Market} />
      ) : null} */}
      {screenName === "Keep" ? (
        <Stack.Screen name="Folders" component={Folders} />
      ) : null}
      {screenName === "Keep" ? (
        <Stack.Screen name="Folder" component={Folder} />
      ) : null}
      {screenName === "Keep" ? (
        <Stack.Screen name="AddSaveFolders" component={AddSaveFolders} />
      ) : null}
      {screenName === "Keep" ? (
        <Stack.Screen name="AddSaveFolder" component={AddSaveFolder} />
      ) : null}
      <Stack.Screen
        name="Profile"
        component={Profile}
        initialParams={{ user: useMe() }}
      />
      <Stack.Screen name="Splace" component={Splace} />
      <Stack.Screen name="EditSplace" component={EditSplace} />
      <Stack.Screen name="EditSplaceCategory" component={EditSplaceCategory} />
      <Stack.Screen name="EditSplaceInfo" component={EditSplaceInfo} />
      <Stack.Screen name="EditSplaceIntro" component={EditSplaceIntro} />
      <Stack.Screen name="EditSplaceItem" component={EditSplaceItem} />
      <Stack.Screen name="EditSplaceLocation" component={EditSplaceLocation} />
      <Stack.Screen
        name="EditSplaceOperatingtime"
        component={EditSplaceOperatingtime}
      />
      <Stack.Screen
        name="EditSplaceLocationSearch"
        component={EditSplaceLocationSearch}
      />
      <Stack.Screen name="FixedContents" component={FixedContents} />
      <Stack.Screen name="AddFixedContents" component={AddFixedContents} />
      <Stack.Screen name="RegisterOwner" component={RegisterOwner} />
      <Stack.Screen name="SuggestInfo" component={SuggestInfo} />
      <Stack.Screen name="EditFixedContents" component={EditFixedContents} />
      <Stack.Screen name="ProfileUsers" component={ProfileUsers} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="UserLogs" component={UserLogs} />
      <Stack.Screen name="Series" component={Series} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="Chatrooms" component={Chatrooms} />
      <Stack.Screen name="Chatroom" component={Chatroom} />
      <Stack.Screen name="Members" component={Members} />
      <Stack.Screen name="AddMembers" component={AddMembers} />
      <Stack.Screen name="MomentView" component={MomentView} />
      <Stack.Screen name="MySplaces" component={MySplaces} />
      <Stack.Screen name="SearchSplaceForAdd" component={SearchSplaceForAdd} />
      <Stack.Screen name="SplaceLogs" component={SplaceLogs} />

      <Stack.Screen name="Log" component={Log} />
      <Stack.Screen name="Report" component={Report} />
      <Stack.Screen name="Setting" component={Setting} />
      <Stack.Screen name="EditInfo" component={EditInfo} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="BlockedUsers" component={BlockedUsers} />
      <Stack.Screen name="ServicePolicy" component={ServicePolicy} />
      <Stack.Screen name="TermsOfUse" component={TermsOfUse} />
      <Stack.Screen name="Agreement" component={Agreement} />
      <Stack.Screen
        name="ImagesViewer"
        component={ImagesViewer}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="StackPickerAlbums" component={StackPickerAlbums} />
      <Stack.Screen name="StackPickerAssets" component={StackPickerAssets} />
      <Stack.Screen name="SuggestNewSplace" component={SuggestNewSplace} />
      <Stack.Screen name="AddressSelector" component={AddressSelector} />
      <Stack.Screen name="UploadLog" component={UploadLog} />
      <Stack.Screen name="UploadMoment" component={UploadMoment} />
      <Stack.Screen name="UploadSeries" component={UploadSeries} />
      <Stack.Screen
        name="SearchSplaceForUpload"
        component={SearchSplaceForUpload}
      />
      {/* <Stack.Screen name="SearchSplaceForLog" component={SearchSplaceForLog} /> */}
      <Stack.Screen name="SelectCategory" component={SelectCategory} />
      <Stack.Screen name="SelectSeries" component={SelectSeries} />
      <Stack.Screen name="EditPhotolog" component={EditPhotolog} />
      <Stack.Screen name="EditSeries" component={EditSeries} />
      <Stack.Screen name="LogsByCategory" component={LogsByCategory} />
      <Stack.Screen name="LogsByBigCategory" component={LogsByBigCategory} />
    </Stack.Navigator>
  );
};

export default StackGenerator;
