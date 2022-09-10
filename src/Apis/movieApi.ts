const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number;
  backdrop_path: string;
  overview: string;
  release_date: string;
  poster_path: string;
  original_title: string;
  title?: string;
  vote_average: number;
}

export interface IGetMovies {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetMovieDetail {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  original_title: string;
  overview: string;
  vote_average: number;
  genres: [
    {
      id: number;
      name: string;
    }
  ];
  tagline: string;
}
export interface IGetMovieCredit {
  id: number;
  cast: [
    {
      id: number;
      name: string;
      original_name: string;
      character: string;
      profile_path: string;
    }
  ];
  crew: [
    {
      id: number;
      known_for_department: string;
      name: string;
      original_name: string;
      profile_path: string;
    }
  ];
}

export async function getMovies(kind: string) {
  return await (
    await fetch(
      `${BASE_URL}/movie/${kind}?api_key=${API_KEY}&language=ko&page=1&region=kr`
    )
  ).json();
}
export async function getMovieDetail(id: string) {
  return await (
    await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=ko`)
  ).json();
}
export async function getMovieCredit(id: string) {
  return await (
    await fetch(
      `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=ko`
    )
  ).json();
}
