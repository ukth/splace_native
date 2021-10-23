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
  var timer: NodeJS.Timeout;
  const spinner = {
    start: () => {
      timer = setTimeout(() => {
        Alert.alert("요청시간 초과");
        setInProgress(false);
      }, 10000);

      setInProgress(true);
    },
    stop: () => {
      setInProgress(false);
      clearTimeout(timer);
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
