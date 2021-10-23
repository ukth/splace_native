import React, { useState, useEffect, useRef, useContext } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import ScreenContainer from "../../components/ScreenContainer";
import { useMutation, useQuery } from "@apollo/client";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  SplaceType,
  StackGeneratorParamList,
  ThemeType,
  TimeSetType,
} from "../../types";
import styled, { ThemeContext } from "styled-components/native";
import {
  BldText16,
  BldText20,
  RegText13,
  RegText16,
  RegText20,
} from "../../components/Text";
import { HeaderRightConfirm } from "../../components/HeaderRightConfirm";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import { dayNameKor, format2DecimalNumber, pixelScaler } from "../../utils";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Alert, Switch, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { EDIT_SPLACE, EDIT_SPLACE_TIMESETS } from "../../queries";
import { ProgressContext } from "../../contexts/Progress";

const DaysContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${pixelScaler(30)}px;
  justify-content: space-between;
`;

const DaysButton = styled.TouchableOpacity`
  width: ${pixelScaler(35)}px;
`;

const DaysButtonDayName = styled.View`
  height: ${pixelScaler(25)}px;
  width: 100%;
  border-radius: ${pixelScaler(25)}px;
  margin-bottom: ${pixelScaler(3)}px;
  align-items: center;
  justify-content: center;
`;

const DaySelectedIndicator = styled.View`
  width: 100%;
  height: ${pixelScaler(2)}px;
  border-radius: ${pixelScaler(2)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.editSplaceOperationTimeDayIndicator};
`;

const TimePickerContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: ${pixelScaler(30)}px;
  align-items: center;
`;

const TimeBox = styled.TouchableOpacity`
  width: ${pixelScaler(100)}px;
  height: ${pixelScaler(45)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.greyBackground};
  border-radius: ${pixelScaler(10)}px;
  margin-left: ${pixelScaler(20)}px;
  margin-right: ${pixelScaler(20)}px;
  align-items: center;
  justify-content: center;
`;

const TimeBoxLine = styled.View`
  width: ${pixelScaler(30)}px;
  height: ${pixelScaler(2)}px;
  border-radius: ${pixelScaler(2)}px;
  background-color: ${({ theme }: { theme: ThemeType }) => theme.text};
`;

const BreakTimeSwitchContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  height: ${pixelScaler(30)}px;
  margin-bottom: ${pixelScaler(20)}px;
`;

const DeactivateButtons = styled.View`
  top: ${pixelScaler(120)}px;
  width: ${pixelScaler(375)}px;
  height: ${pixelScaler(200)}px;
  position: absolute;
  background-color: rgba(255, 255, 255, 0.6);
  z-index: 2;
`;

const DeactivateBreakTime = styled.View`
  top: ${pixelScaler(250)}px;
  width: ${pixelScaler(375)}px;
  height: ${pixelScaler(70)}px;
  position: absolute;
  background-color: rgba(255, 255, 255, 0.6);
  z-index: 2;
`;

const BreakTimeButton = styled.View`
  width: ${pixelScaler(30)}px;
  height: ${pixelScaler(30)}px;
  border-radius: ${pixelScaler(30)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.greyBackground};
  margin-right: ${pixelScaler(15)}px;
`;

const BreakTimeButtonIndicator = styled.View`
  width: ${pixelScaler(18)}px;
  height: ${pixelScaler(18)}px;
  border-radius: ${pixelScaler(18)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.themeBackground};
`;

const Seperator = styled.View`
  width: ${pixelScaler(315)}px;
  height: ${pixelScaler(0.66)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.lightSeperator};
  margin-top: ${pixelScaler(15)}px;
  margin-bottom: ${pixelScaler(24)}px;
`;

const BreakDaySwitchContainer = styled.View`
  width: ${pixelScaler(315)}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${pixelScaler(24)}px;
`;

const BreakDaySwitch = styled.View`
  flex-direction: row;
  align-items: center;
`;

const BreakWeekContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${pixelScaler(30)}px;
`;

const BreakWeekSelector = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: ${pixelScaler(205)}px;
  margin-left: ${pixelScaler(16)}px;
  margin-right: ${pixelScaler(16)}px;
  align-items: center;
`;

const BreakWeekButton = styled.TouchableOpacity`
  width: ${pixelScaler(30)}px;
  height: ${pixelScaler(25)}px;
  border-radius: ${pixelScaler(25)}px;
  align-items: center;
  padding-top: ${pixelScaler(4.6)}px;
`;

const BreakDaySelector = styled.View`
  flex-direction: row;
  margin-bottom: ${pixelScaler(60)}px;
  justify-content: space-between;
`;

const BreakDayButton = styled.TouchableOpacity`
  width: ${pixelScaler(35)}px;
  height: ${pixelScaler(25)}px;
  border-radius: ${pixelScaler(25)}px;
  align-items: center;
  padding-top: ${pixelScaler(4.6)}px;
`;

const NoticeContainer = styled.View`
  align-items: center;
`;

const EditSplaceOperatingtime = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const { splace }: { splace: SplaceType } =
    useRoute<RouteProp<StackGeneratorParamList, "EditSplaceOperatingtime">>()
      .params;
  const theme = useContext<ThemeType>(ThemeContext);

  const [focusedDay, setFocusedDay] = useState<number>(1);

  const [holidayBreak, setHolidayBreak] = useState(splace.holidayBreak);
  const [operatingTime, setOperatingTime] = useState<
    {
      open?: number;
      close?: number;
      breakOpen?: number;
      breakClose?: number;
      addBreakTime: boolean;
    }[]
  >();

  const [breakWeeks, setBreakWeeks] = useState<number[]>([]);
  const [breakDays, setBreakDays] = useState<number[]>([]);

  const [selectedTime, setSelectTime] = useState<
    "open" | "close" | "breakOpen" | "breakClose"
  >("open");

  const [showDatePicker, setShowDatePicker] = useState(false);

  const timeSets: TimeSetType[] = splace.timeSets ?? [];

  const [selectedDays, setSelectedDay] = useState<number[]>(
    timeSets.filter((ts) => ts.open).map((ts) => ts.day)
  );

  const [isFirst, setIsFirst] = useState(
    timeSets?.filter((ts) => ts.open).length === 0
  );

  const { spinner } = useContext(ProgressContext);

  const onCompleted = (data: any) => {
    spinner.stop();
    console.log(data);
    if (data?.editTimeSets?.ok) {
      Alert.alert("변경이 완료되었습니다.");
      navigation.pop();
    } else {
      Alert.alert("운영시간을 변경할 수 없습니다.");
    }
  };

  const [mutation, { loading }] = useMutation(EDIT_SPLACE_TIMESETS, {
    onCompleted,
  });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldText16>운영시간 선택</BldText16>,
      headerRight: () => (
        <HeaderRightConfirm
          onPress={() => {
            if (operatingTime) {
              let breakDays_var = [];
              for (let i = 0; i < breakWeeks.length; i++) {
                for (let j = 0; j < breakDays.length; j++) {
                  breakDays_var.push(i * 7 + j);
                }
              }
              let operatingTime_vars = [];
              console.log(selectedDays);
              for (let i = 0; i < 7; i++) {
                operatingTime_vars.push([
                  ...(selectedDays.includes(i)
                    ? [operatingTime[i].open, operatingTime[i].close]
                    : []),
                  ...(selectedDays.includes(i) && operatingTime[i].addBreakTime
                    ? [operatingTime[i].breakOpen, operatingTime[i].breakClose]
                    : []),
                ]);
              }
              if (!loading) {
                spinner.start();

                mutation({
                  variables: {
                    splaceId: splace.id,
                    breakDays: breakDays_var,
                    sun: operatingTime_vars[0],
                    mon: operatingTime_vars[1],
                    tue: operatingTime_vars[2],
                    wed: operatingTime_vars[3],
                    thr: operatingTime_vars[4],
                    fri: operatingTime_vars[5],
                    sat: operatingTime_vars[6],
                    holidayBreak,
                  },
                });
              }
            } else {
              Alert.alert("운영시간을 불러올 수 없습니다. 다시 시도해주세요");
            }
          }}
        />
      ),
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
    });
  }, [holidayBreak, breakDays, breakWeeks, operatingTime, selectedDays]);

  useEffect(() => {
    const tmp = timeSets
      .slice()
      .sort((a: TimeSetType, b: TimeSetType) => a.day - b.day);
    // console.log(tmp);
    setOperatingTime(
      tmp.map((ts) => {
        return {
          open: Number(ts.open),
          close: Number(ts.close),
          breakOpen: Number(ts.breakOpen),
          breakClose: Number(ts.breakClose),
          addBreakTime: ts.breakOpen !== null,
        };
      })
    );
  }, []);

  useEffect(() => {
    console.log(operatingTime);
  }, [operatingTime]);

  return (
    <ScreenContainer style={{ padding: pixelScaler(30) }}>
      {selectedDays.includes(focusedDay) ? null : <DeactivateButtons />}
      {operatingTime && operatingTime[focusedDay].addBreakTime ? null : (
        <DeactivateBreakTime />
      )}
      <BldText16
        style={{
          marginBottom: pixelScaler(30),
        }}
      >
        운영시간
      </BldText16>
      <DaysContainer>
        {[1, 2, 3, 4, 5, 6, 0].map((number) => (
          <DaysButton
            key={number}
            onPress={() => {
              if (focusedDay != number) {
                setIsFirst(false);
              }
              if (!selectedDays.includes(number)) {
                const tmp = [...selectedDays];
                tmp.push(number);
                setSelectedDay(tmp);
              } else if (focusedDay === number) {
                const tmp = [...selectedDays];
                tmp.splice(selectedDays.indexOf(number), 1);
                setSelectedDay(tmp);
              }
              setFocusedDay(number);
            }}
          >
            <DaysButtonDayName
              style={
                selectedDays.includes(number)
                  ? { backgroundColor: theme.themeBackground }
                  : {}
              }
            >
              <RegText16
                style={
                  selectedDays.includes(number) ? { color: theme.white } : {}
                }
              >
                {dayNameKor[number]}
              </RegText16>
            </DaysButtonDayName>
            {focusedDay === number ? <DaySelectedIndicator /> : null}
          </DaysButton>
        ))}
      </DaysContainer>
      <TimePickerContainer>
        <TimeBox
          onPress={() => {
            setSelectTime("open");
            setShowDatePicker(true);
          }}
        >
          <BldText20>
            {operatingTime && operatingTime[focusedDay].open
              ? format2DecimalNumber(
                  Math.floor((operatingTime[focusedDay].open ?? 0) / 3600000)
                ) +
                " : " +
                format2DecimalNumber(
                  Math.floor(
                    ((operatingTime[focusedDay].open ?? 0) % 3600000) / 60000
                  )
                )
              : "00 : 00"}
          </BldText20>
        </TimeBox>
        <TimeBoxLine />
        <TimeBox
          onPress={() => {
            setSelectTime("close");
            setShowDatePicker(true);
          }}
        >
          <BldText20>
            {operatingTime && operatingTime[focusedDay].close
              ? format2DecimalNumber(
                  Math.floor((operatingTime[focusedDay].close ?? 0) / 3600000)
                ) +
                " : " +
                format2DecimalNumber(
                  Math.floor(
                    ((operatingTime[focusedDay].close ?? 0) % 3600000) / 60000
                  )
                )
              : "00 : 00"}
          </BldText20>
        </TimeBox>
      </TimePickerContainer>
      <BreakTimeSwitchContainer
        onPress={() => {
          if (operatingTime) {
            const tmp = [...operatingTime];
            tmp[focusedDay].addBreakTime = !tmp[focusedDay].addBreakTime;
            setOperatingTime(tmp);
          }
        }}
      >
        <BreakTimeButton>
          {operatingTime && operatingTime[focusedDay].addBreakTime ? (
            <BreakTimeButtonIndicator />
          ) : null}
        </BreakTimeButton>
        <RegText16>브레이크 타임 추가</RegText16>
      </BreakTimeSwitchContainer>
      <TimePickerContainer>
        <TimeBox
          onPress={() => {
            setSelectTime("breakClose");
            setShowDatePicker(true);
          }}
        >
          <BldText20>
            {operatingTime && operatingTime[focusedDay].breakClose
              ? format2DecimalNumber(
                  Math.floor(
                    (operatingTime[focusedDay].breakClose ?? 0) / 3600000
                  )
                ) +
                " : " +
                format2DecimalNumber(
                  Math.floor(
                    ((operatingTime[focusedDay].breakClose ?? 0) % 3600000) /
                      60000
                  )
                )
              : "00 : 00"}
          </BldText20>
        </TimeBox>
        <TimeBoxLine />
        <TimeBox
          onPress={() => {
            setSelectTime("breakOpen");
            setShowDatePicker(true);
          }}
        >
          <BldText20>
            {operatingTime && operatingTime[focusedDay].breakOpen
              ? format2DecimalNumber(
                  Math.floor(
                    (operatingTime[focusedDay].breakOpen ?? 0) / 3600000
                  )
                ) +
                " : " +
                format2DecimalNumber(
                  Math.floor(
                    ((operatingTime[focusedDay].breakOpen ?? 0) % 3600000) /
                      60000
                  )
                )
              : "00 : 00"}
          </BldText20>
        </TimeBox>
      </TimePickerContainer>
      <Seperator />
      <BreakDaySwitchContainer>
        <BldText16>휴무일</BldText16>
        <BreakDaySwitch>
          <RegText13>공휴일 휴무</RegText13>
          <Switch
            trackColor={{
              false: theme.switchTrackFalse,
              true: theme.themeBackground,
            }}
            style={{ marginLeft: pixelScaler(15) }}
            value={holidayBreak}
            onValueChange={(value) => {
              setHolidayBreak(value);
            }}
          />
        </BreakDaySwitch>
      </BreakDaySwitchContainer>
      <BreakWeekContainer>
        <RegText16>매월</RegText16>
        <BreakWeekSelector>
          {[0, 1, 2, 3, 4, 5].map((i: number) => (
            <BreakWeekButton
              key={i}
              style={
                breakWeeks.includes(i)
                  ? { backgroundColor: theme.themeBackground }
                  : {}
              }
              onPress={() => {
                if (breakWeeks.includes(i)) {
                  const tmp = [...breakWeeks];
                  tmp.splice(tmp.indexOf(i), 1);
                  setBreakWeeks(tmp);
                } else {
                  setBreakWeeks([...breakWeeks, i]);
                }
              }}
            >
              <RegText16
                style={breakWeeks.includes(i) ? { color: theme.white } : {}}
              >
                {i + 1}
              </RegText16>
            </BreakWeekButton>
          ))}
        </BreakWeekSelector>
        <RegText16>번째 주</RegText16>
      </BreakWeekContainer>
      <BreakDaySelector>
        {[1, 2, 3, 4, 5, 6, 0].map((i: number) => (
          <BreakDayButton
            key={i}
            style={
              breakDays.includes(i)
                ? { backgroundColor: theme.editSplaceBreakDayRedBackground }
                : {}
            }
            onPress={() => {
              if (breakDays.includes(i)) {
                const tmp = [...breakDays];
                tmp.splice(tmp.indexOf(i), 1);
                setBreakDays(tmp);
              } else {
                setBreakDays([...breakDays, i]);
              }
            }}
          >
            <RegText16
              style={breakDays.includes(i) ? { color: theme.white } : {}}
            >
              {dayNameKor[i]}
            </RegText16>
          </BreakDayButton>
        ))}
      </BreakDaySelector>
      <NoticeContainer>
        <RegText13 style={{ color: theme.editSplacePlaceholder }}>
          기타 사항은 소개글에 작성하실 수 있습니다.
        </RegText13>
      </NoticeContainer>
      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="time"
        onConfirm={(date) => {
          const utc =
            Math.floor(
              ((date.valueOf() + 9 * 60 * 60 * 1000) % 86400000) / 60000
            ) * 60000;
          if (isFirst && operatingTime) {
            for (let i = 0; i < 7; i++) {
              operatingTime[i][selectedTime] = utc;
            }
          } else if (operatingTime) {
            operatingTime[focusedDay][selectedTime] = utc;
          }
          setShowDatePicker(false);
          // console.log(utc);
        }}
        confirmTextIOS="확인"
        cancelTextIOS="취소"
        onCancel={() => setShowDatePicker(false)}
        date={
          new Date(0)
          // operatingTime
          //   ? (operatingTime[focusedDay][selectedTime] ?? 0) -
          //     9 * 60 * 60 * 1000
          //   : 0
        }
        locale="ko"
        themeVariant="light"
        isDarkModeEnabled={false}
      />
    </ScreenContainer>
  );
};

export default EditSplaceOperatingtime;
