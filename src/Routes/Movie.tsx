import { useQuery } from "react-query";
import styled from "styled-components";
import { IGetMovies, getMovies } from "@Apis/movieApi";
import { makeImagePath } from "@Utils/utils";
import { useEffect, useCallback } from "react";
import MovieSlider from "@Components/movies/movieSlider";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  height: 300vh;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 75vh;
  padding: 60px;
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.3),
      rgba(0, 0, 0, 0.5),
      rgba(0, 0, 0, 1)
    ),
    url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
`;

const BannerBtn = styled.div`
  font-weight: 800;
  font-size: 18px;
  width: 150px;
  text-align: center;
  color: white;
  background-color: ${(props) => props.theme.white};
  border-radius: 5px;
  margin: 5px 0;
  padding: 5px;
  margin-top: 15px;
  cursor: pointer;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
  &:hover {
    background-color: white;
    color: ${(props) => props.theme.black.darker};
  }
`;

const Title = styled.h2`
  display: flex;
  align-items: center;
  width: 80%;
  font-weight: 800;
  font-size: 64px;
  margin-bottom: 20px;
  color: rgba(254, 211, 48, 0.8);
  text-shadow: 2px 2px 2px black;
  #vote {
    margin-left: 20px;
    color: ${(props) => props.theme.red};
    font-size: 40px;
  }
`;

const Overview = styled.p`
  width: 55%;
  font-size: 18px;
  font-weight: 1000;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1;
`;

const Movie = () => {
  const navigate = useNavigate();

  const { data: nowData, isLoading: nowLoading } = useQuery<IGetMovies>(
    ["movies", "nowPlaying"],
    () => getMovies("now_playing")
  );
  const { data: popularData, isLoading: popularLoading } = useQuery<IGetMovies>(
    ["movies", "popular"],
    () => getMovies("popular")
  );
  const { data: topRatedData, isLoading: topRatedLoading } =
    useQuery<IGetMovies>(["movies", "top_rated"], () => getMovies("top_rated"));
  const { data: upcomingData, isLoading: upcomingLoading } =
    useQuery<IGetMovies>(["movies", "upcoming"], () => getMovies("upcoming"));

  useEffect(() => {
    if (nowData) {
      console.log("nowData: ", nowData);
    }
  }, [nowData]);

  const onClickDetailBtn = useCallback(
    (movieId: string) => {
      navigate(`/movies/${movieId}`);
    },
    [navigate]
  );

  return (
    <Wrapper>
      {nowLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(nowData?.results[0].backdrop_path || "")}
          >
            <Title>
              <span>{nowData?.results[0].title}</span>
              <span id="vote">★ {nowData?.results[0].vote_average}</span>
            </Title>
            <Overview>{nowData?.results[0].overview}</Overview>
            <BannerBtn
              onClick={() => onClickDetailBtn(nowData?.results[0]?.id + "")}
            >
              See Detail
            </BannerBtn>
          </Banner>
          <MovieSlider dataType="now" data={nowData} />
          <MovieSlider dataType="popular" data={popularData} />
          <MovieSlider dataType="toprated" data={topRatedData} />
          <MovieSlider dataType="upcoming" data={upcomingData} />
        </>
      )}
    </Wrapper>
  );
};

export default Movie;
