import React, { useEffect, useState } from "react";
import {
  filterActivity,
  filterContinent,
  getContinents,
  getCountries,
  orderCountriesName,
  orderCountriesPopulation,
} from "../redux/actions"; // getRecipes
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { Button, Card, Input, Pagination, Titles } from "../components";
import { ThunkAction } from "redux-thunk";
import { ActionTypes } from "../types";

const Home = () => {
  const dispatch = useDispatch();
  const { countries, continents } = useSelector((state: RootState) => state);

  let [page, setPage] = useState(1);
  let itemsXPage = 12;
  let lastPage = page * itemsXPage;
  let firstPage = lastPage - itemsXPage;
  let displayedItems = countries.slice(firstPage, lastPage);

  let handlePag = (pageNum: number) => {
    setPage(pageNum);
  };

  useEffect(() => {
    dispatch<any>(getCountries());
    dispatch<any>(getContinents());
  }, [dispatch]);

  console.log(continents);

  return (
    <div className="flex flex-col items-center justify-center">
      <Titles
        title="Explore the world's countries"
        subtitle={`There are ${countries.length} countries waiting for you`}
      />

      <Pagination
        pages={itemsXPage}
        total={countries.length}
        handlePag={handlePag}
      />
      <div className="grid grid-cols-4 gap-2 mt-5">
        {displayedItems.map((item, i) => (
          <Card key={i} {...item} />
        ))}
      </div>
    </div>
  );
};

export default Home;
