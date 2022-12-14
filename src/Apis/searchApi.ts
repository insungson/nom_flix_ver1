const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

interface ISearchResult {
  id: number;
  name?: string;
  title?: string;
}

export interface IGetSearchKey {
  page: number;
  results: ISearchResult[];
  total_pages: number;
  total_results: number;
}

export async function getSearchKey(keyword: string) {
  return await (
    await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&language=ko&query=${keyword}&page=1&include_adult=false&region=KR`
    )
  ).json();
}

export async function getSearchMovie(keyword: string) {
  return await (
    await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=ko&query=${keyword}&page=1&include_adult=false&region=KR`
    )
  ).json();
}
export async function getSearchTv(keyword: string) {
  return await (
    await fetch(
      `${BASE_URL}/search/tv?api_key=${API_KEY}&language=ko&&page=1&query=${keyword}&include_adult=false`
    )
  ).json();
}
