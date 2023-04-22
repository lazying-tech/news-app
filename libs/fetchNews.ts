import { gql } from "graphql-request";
import sortNewsByImage from "./sortNewsByImage";
const fetchNews = async (
  category?: Category | string,
  keywords?: string,
  isDynamic?: boolean
) => {
  // GraphQL query
  const query = gql`
    query MyQuery(
      $access_key: String!
      $categories: String! # ! mean required in graphQL
      $keywords: String
    ) {
      myQuery(
        access_key: $access_key
        categories: $categories
        countries: "gb"
        sort: "published_desc"
        keywords: $keywords
      ) {
        data {
          author
          category
          description
          image
          published_at
          title
          language
          source
          url
          country
        }
        pagination {
          limit
          count
          offset
          total
        }
      }
    }
  `;

  // Fetch function with Next.js 13 caching
  const res = await fetch(
    "https://sunnybankhills.stepzen.net/api/reeling-elephant/__graphql",
    {
      method: "POST",
      cache: isDynamic ? "no-cache" : "default",
      next: isDynamic ? { revalidate: 0 } : { revalidate: 20 },
      headers: {
        "Content-type": "application/json",
        Authorization: `Apikey ${process.env.STEPZEN_API_KEY}`,
      },
      body: JSON.stringify({
        query,
        variables: {
          access_key: process.env.MEDIASTACK_API_KEY,
          categories: category,
          keywords: keywords,
        },
      }),
    }
  );

  // console.log(
  //   "LOADING NEW DATA FROM API for category>>>> ",
  //   category,
  //   keywords
  // );

  const newsResponse = await res.json();
  // Sort function by images vs not images present
  const newsSorted = sortNewsByImage(newsResponse.data.myQuery);
  // return news

  return newsSorted;
};
export default fetchNews;

// Example import
// stepzen import curl "http://api.mediastack.com/v1/news?access_key=f66c81acc54a5f6a7514a1bc6020cf31"
// stepzen import curl "https://api.mediastack.com/v1/news?access_key=f66c81acc54a5f6a7514a1bc6020cf31&countries=us%2Cgb&limit=100&offset=0&sort=published_desc"
