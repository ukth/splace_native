import React, { useState, createContext, useEffect } from "react";
import { Alert } from "react-native";

const ProgressContext = createContext<{
  inProgress: boolean;
  spinner: {
    start: (setTimeOut?: boolean, timeOut?: number) => void;
    stop: () => void;
  };
  timer: NodeJS.Timeout | undefined;
}>({
  inProgress: false,
  spinner: {
    start: () => {},
    stop: () => {},
  },
  timer: undefined,
});

const ProgressProvider = ({ children }: { children: any }) => {
  const [inProgress, setInProgress] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const spinner = {
    start: (setTimeOut = true, timeOut = 10) => {
      if (setTimeOut !== false) {
        setTimer(
          setTimeout(() => {
            Alert.alert("요청시간 초과");
            setInProgress(false);
          }, timeOut * 1000)
        );
      }

      setInProgress(true);
    },
    stop: () => {
      if (timer) {
        clearTimeout(timer);
      }
      setInProgress(false);
    },
  };
  const value = { inProgress, spinner, timer };
  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export { ProgressContext, ProgressProvider };
