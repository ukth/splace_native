import React, { useState, createContext, useEffect } from "react";
import { Alert } from "react-native";
import { SplaceType } from "../types";

const FilterContext = createContext<{
  filter: {
    lat?: number;
    lon?: number;
    distance: number;
    bigCategoryIds: number[];
    ratingtagIds: number[];
    exceptNoKids: boolean;
    pets: boolean;
    parking: boolean;
  };
  setFilter: React.Dispatch<
    React.SetStateAction<{
      lat?: number | undefined;
      lon?: number | undefined;
      distance: number;
      bigCategoryIds: number[];
      ratingtagIds: number[];
      exceptNoKids: boolean;
      pets: boolean;
      parking: boolean;
    }>
  >;
  filterActivated: boolean;
  setFilterActivated: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  filter: {
    exceptNoKids: false,
    pets: false,
    parking: false,
    distance: 1.4,
    bigCategoryIds: [],
    ratingtagIds: [],
  },
  setFilter: () => {},
  filterActivated: false,
  setFilterActivated: () => {},
});

const FilterProvider = ({ children }: { children: any }) => {
  const [filter, setFilter] = useState<{
    lat?: number;
    lon?: number;
    distance: number;
    bigCategoryIds: number[];
    ratingtagIds: number[];
    exceptNoKids: boolean;
    pets: boolean;
    parking: boolean;
  }>({
    exceptNoKids: false,
    pets: false,
    parking: false,
    distance: 1.4,
    bigCategoryIds: [],
    ratingtagIds: [],
  });
  const [filterActivated, setFilterActivated] = useState(false);
  const value = {
    filter,
    setFilter,
    filterActivated,
    setFilterActivated,
  };
  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};

export { FilterContext, FilterProvider };
