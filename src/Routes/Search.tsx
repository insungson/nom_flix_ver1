import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { makeImagePath } from "@Utils/utils";
import {
  getSearchKey,
  getSearchMovie,
  getSearchTv,
  IGetSearchKey,
} from "@Apis/searchApi";
import { IGetMovies } from "@Apis/movieApi";
import { IGetTv } from "@Apis/tvShowApi";
import TvSlider from "@Components/tvs/tvSlider";
import MovieSlider from "@Components/movies/movieSlider";
import {
  PathMatch,
  useMatch,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

const Wrapper = styled.div`
  margin-top: 80px;
  height: 40vh;
`;
const KeywordWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: center;
  height: 250px;
  color: white;
  margin-top: 20px;
  padding-top: 40px;
  padding-left: 20px;
`;
const Title = styled.h2`
  color: yellowgreen;
`;
const KeywordResult = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  margin: 10px;
`;
const Keyword = styled.div`
  margin: 10px;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
`;
const NormalScreen = styled.div`
  margin-top: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  span:nth-child(2) {
    font-size: 18px;
    margin-top: 20px;
  }
`;

const Search = () => {
  // const searchMatch: PathMatch<string> | null = useMatch("/search/:keyword");
  const [searchedKeyword, setSearchedKeyword] = useState<string | null>(null); // 검색된 keyword

  const location = useLocation();

  useEffect(() => {
    if (!!location) {
      if (!!location?.search) {
        const keyword = location.search.split("=");
        if (keyword?.length > 1) {
          setSearchedKeyword(keyword[1]);
        } else {
          setSearchedKeyword(null);
        }
      }
    }
  }, [location]);

  const { data: keywordData, isLoading: keywordDataLoading } =
    useQuery<IGetSearchKey>(
      ["search", "keyword"],
      //@ts-ignore
      () => getSearchKey(searchedKeyword),
      { enabled: !!searchedKeyword }
    );

  const { data: movieSearchedData, isLoading: movieSearchDataLoading } =
    useQuery<IGetMovies>(
      ["search", "movie"],
      //@ts-ignore
      () => getSearchMovie(searchedKeyword),
      { enabled: !!searchedKeyword }
    );
  console.log("movieSearchedData: ", movieSearchedData);

  const { data: tvSearchedData, isLoading: tvSearchedDataLoading } =
    useQuery<IGetTv>(
      ["search", "tv"],
      //@ts-ignore
      () => getSearchTv(searchedKeyword),
      { enabled: !!searchedKeyword }
    );

  return (
    <Wrapper>
      {keywordDataLoading && movieSearchDataLoading ? (
        <>Loading....</>
      ) : (
        <>
          {keywordData?.results && tvSearchedData?.results ? (
            <>
              <KeywordWrapper>
                <Title>Keyword Searched Result List</Title>
                <KeywordResult>
                  {keywordData.results.slice(0, 18).map((keywordObj, index) => (
                    <Keyword key={index}>
                      {keywordObj?.name ? keywordObj.name : keywordObj?.title}
                    </Keyword>
                  ))}
                </KeywordResult>
              </KeywordWrapper>
              {movieSearchDataLoading ? (
                <>Loading...</>
              ) : (
                movieSearchedData?.results && (
                  <MovieSlider dataType="search" data={movieSearchedData} />
                )
              )}
              {tvSearchedDataLoading ? (
                <>Loading...</>
              ) : (
                tvSearchedData?.results && (
                  <TvSlider dataType="search" data={tvSearchedData} />
                )
              )}
            </>
          ) : (
            <NormalScreen>
              <span>There is no Searched Result.</span>
              <span>
                You have to click search icon on the top right for searching
                keyword.
              </span>
            </NormalScreen>
          )}
        </>
      )}
    </Wrapper>
  );
};

export default Search;
