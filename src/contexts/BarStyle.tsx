import React, { useState, createContext } from "react";

const BarStyleContext = createContext({
  barStyle: "light",
  dispatch: (style: string) => {},
});

const BarStyleProvider = ({ children }: { children: React.ReactNode }) => {
  const [barStyle, setBarStyle] = useState("dark-content");
  const dispatch = (style: string) => {
    setBarStyle(style);
  };
  const value = { barStyle, dispatch };
  return (
    <BarStyleContext.Provider value={value}>
      {children}
    </BarStyleContext.Provider>
  );
};

export { BarStyleContext, BarStyleProvider };
