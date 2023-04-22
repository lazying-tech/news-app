import React from "react";
import { categories } from "../constants";
import fetchNews from "../libs/fetchNews";
import NewsList from "./NewsList";
import response from "../response.json";
import sortNewsByImage from "../libs/sortNewsByImage";
const HomePage = async () => {
  const responseSorted = sortNewsByImage(response);
  // fetch the news data
  const news: NewsResponse =
    (await fetchNews(categories.join(","))) || responseSorted;

  return <div>{<NewsList news={news} />}</div>;
};

export default HomePage;
