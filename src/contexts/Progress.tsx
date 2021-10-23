import React, { useState, createContext } from "react";
import { Alert } from "react-native";

const ProgressContext = createContext({
  inProgress: false,
  spinner: {
    start: () => {},
    stop: () => {},
  },
});

const ProgressProvider = ({ children }: { children: any }) => {
  const [inProgress, setInProgress] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const spinner = {
    start: () => {
      setTimer(
        setTimeout(() => {
          Alert.alert("요청시간 초과");
          setInProgress(false);
        }, 10000)
      );

      setInProgress(true);
    },
    stop: () => {
      if (timer) {
        clearTimeout(timer);
      }
      setInProgress(false);
    },
  };
  const value = { inProgress, spinner };
  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export { ProgressContext, ProgressProvider };
