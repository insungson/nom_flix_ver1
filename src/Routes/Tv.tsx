import { useQuery } from "react-query";
import styled from "styled-components";
import { IGetTv, getTv } from "@Apis/tvShowApi";
import { makeImagePath } from "@Utils/utils";
import { useEffect, useCallback } from "react";
import TvSlider from "@Components/tvs/tvSlider";
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

const Tv = () => {
  const navigate = useNavigate();

  const { data: ontheairData, isLoading: ontheairLoading } = useQuery<IGetTv>(
    ["tv", "ontheair"],
    () => getTv("on_the_air")
  );
  const { data: popularData } = useQuery<IGetTv>(["tv", "popular"], () =>
    getTv("popular")
  );
  const { data: topratedData } = useQuery<IGetTv>(["tv", "toprated"], () =>
    getTv("top_rated")
  );

  const onClickDetailBtn = useCallback(
    (tvId: string) => {
      navigate(`/tv/${tvId}`);
    },
    [navigate]
  );

  return (
    <Wrapper>
      {ontheairLoading ? (
        <Loader>Loading....</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(
              ontheairData?.results[0]?.backdrop_path || ""
            )}
          >
            <Title>
              <span>{ontheairData?.results[0]?.name}</span>
              <span id="vote">★ {ontheairData?.results[0]?.vote_average}</span>
            </Title>
            <Overview>{ontheairData?.results[0]?.overview}</Overview>
            <BannerBtn
              onClick={() =>
                onClickDetailBtn(ontheairData?.results[0]?.id + "")
              }
            >
              See Detail
            </BannerBtn>
          </Banner>
          <TvSlider dataType="ontheair" data={ontheairData} />
          <TvSlider dataType="popular" data={popularData} />
          <TvSlider dataType="toprated" data={topratedData} />
        </>
      )}
    </Wrapper>
  );
};

export default Tv;
