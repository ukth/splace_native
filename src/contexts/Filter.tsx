import React, { useState, createContext } from "react";

const FilterContext = createContext<{
  filter: {
    lat?: number;
    lon?: number;
    locationText?: string;
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
      locationText?: string;
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

const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [filter, setFilter] = useState<{
    lat?: number;
    lon?: number;
    locationText?: string;
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
