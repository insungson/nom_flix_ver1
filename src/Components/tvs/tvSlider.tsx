import styled from "styled-components";
import { AnimatePresence, motion, useScroll, Variants } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import { IGetTv } from "@Apis/tvShowApi";
import { makeImagePath } from "@Utils/utils";
import nextImg from "@images/next.png";
import prevImg from "@images/prev.png";
import DetailTv from "./detailTv";

const Slider = styled.div`
  position: relative;
  top: -100px;
  height: 50vh;
`;

const SliderTitle = styled.h2`
  margin-bottom: 20px;
  padding-left: 10px;
  color: white;
  font-weight: 800;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px; // 행과 열 사이의 간격을 설정한다. 첫번째가 행, 두번째가 열 의 간격이다.
  grid-template-columns: repeat(
    6,
    1fr
  ); // css grid 에서 열의 정의를 한다. repeat(): 반복되는 패턴을 짧게 줄여준다.
  position: absolute; // 원래 포지션에서 흐름적인 요소가 없이 초기 컨테이너 기준으로 위치를 잡는다.
  width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  h4 {
    text-align: center;
    font-size: 18px;
  }
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const BoxInfos = styled(motion.div)`
  position: relative;
  bottom: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${(props) => props.theme.white};
  opacity: 0;
  span {
    text-align: center;
    margin: 2px 0;
    font-size: 6px;
    font-weight: 600;
    text-shadow: none;
  }
  #vote {
    font-weight: 800;
    font-size: 16px;
    color: ${(props) => props.theme.red};
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 14px;
  }
`;

// custom 만 바꿔서는 왼쪽으로 움직이고, 오른쪽으로 움직이는게 동작이 되지 않는다!!.
// 아래의 css 변수에서 x 축의 방향을 처리해 주고 custom 에서 방향을 정해줘야 한다!!
const rowVariants: Variants = {
  hidden: (isNext: boolean) => ({
    x: isNext ? window.outerWidth + 5 : -window.outerWidth - 5,
  }),
  visible: {
    x: 0,
  },
  exit: (isNext: boolean) => ({
    x: isNext ? -window.outerWidth - 5 : window.outerWidth + 5,
  }),
};

const boxVariants: Variants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants: Variants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const boxInfosVariants: Variants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.3,
      duration: 0.3,
      type: "tween",
    },
  },
};

const PrevIcon = styled(motion.img)`
  position: absolute;
  width: 60px;
  top: 90px;
  left: 0;
  cursor: pointer;
`;

const NextIcon = styled(motion.img)`
  position: absolute;
  width: 60px;
  top: 90px;
  right: 0;
  cursor: pointer;
`;

const IconVariants = {
  initial: {
    opacity: 0.3,
  },
  hover: {
    opacity: 0.7,
  },
};

const offset = 6;

interface IProps {
  dataType: string;
  data?: IGetTv;
  isLoading?: boolean;
}

const TvSlider = ({ dataType, data, isLoading = false }: IProps) => {
  const [title, setTitle] = useState("");
  const [isNext, setIsNext] = useState(true);

  // tv url 접근 or search url 접근인지 구분하기 위한 state
  const [isSearched, setIsSearched] = useState(false);

  const [hoverCardId, setHoverCardId] = useState<string | null>(null);

  // 클릭시 해당 티비 모달 창
  const bigTvMatch: PathMatch<string> | null = useMatch("/tv/:id");
  console.log("bigTvMatch: ", bigTvMatch);
  // search 에서 해당 silder 모듈을 사용할 경우
  const bigSearchedTvMatch: PathMatch<string> | null =
    useMatch("/search/tv/:tvId");
  console.log("bigSearchedTvMatch: ", bigSearchedTvMatch);
  useEffect(() => {
    switch (dataType) {
      case "popular":
        setIsSearched(false);
        return setTitle("Popular");
      case "onair":
        setIsSearched(false);
        return setTitle("OnAir");
      case "top_rated":
        setIsSearched(false);
        return setTitle("TopRated");
      case "search":
        setIsSearched(true);
        return setTitle("Searched TV Show");
      default:
        break;
    }
  }, [dataType]);

  const navigate = useNavigate();

  // 슬라이드 다음페이지 넘기기 위한 인덱스
  const [index, setIndex] = useState(0);
  // leaving: 토글 버튼 열고 닫는 flag
  const [leaving, setLeaving] = useState(false);
  // 토글 처리
  const toggleLeaving = useCallback(() => setLeaving((prev) => !prev), []);

  // 슬라이드 증가 처리
  const increaseIndex = useCallback(() => {
    if (data) {
      if (leaving) return;
      setIsNext(true);
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  }, [data, toggleLeaving, leaving]);
  // 슬라이드 감소 처리
  const decreaseIndex = useCallback(() => {
    if (data) {
      if (leaving) return;
      setIsNext(false);
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.ceil(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex - 1 : prev - 1));
    }
  }, [data, toggleLeaving, leaving]);

  const onBoxClicked = useCallback(
    (tvId: number) => {
      if (isSearched) {
        navigate(`/search/tv/${tvId}`);
      } else {
        navigate(`/tv/${tvId}`);
      }
    },
    [navigate, isSearched]
  );

  return (
    <>
      {data && (
        <>
          <Slider>
            <SliderTitle>{title}</SliderTitle>
            <AnimatePresence
              custom={isNext}
              initial={false}
              onExitComplete={toggleLeaving}
            >
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
                custom={isNext}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + dataType + ""} // 문자열로 처리하기 위한 '' 처리 + 다른 곳에서 같은 movieId 가 사용될 수 있기 때문에 dataType도 사용함.
                      key={tv.id}
                      variants={boxVariants}
                      whileHover="hover"
                      initial="normal"
                      onClick={() => onBoxClicked(tv.id)}
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(tv.backdrop_path, "w500")}
                      onMouseEnter={() => setHoverCardId(tv.id + "")}
                      onMouseLeave={() => setHoverCardId(null)}
                    >
                      {tv.id + "" === hoverCardId ? (
                        ""
                      ) : (
                        <h4>
                          {tv?.name?.toUpperCase()} ({tv?.original_name})
                        </h4>
                      )}
                      <Info variants={infoVariants}>
                        <h4>
                          {tv?.name?.toUpperCase()} ({tv?.original_name})
                        </h4>
                        <BoxInfos variants={boxInfosVariants}>
                          <span id="vote">
                            {tv?.vote_average
                              ? `★ ${tv.vote_average.toFixed(1)}`
                              : "No Rating Infos"}
                          </span>
                        </BoxInfos>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <PrevIcon
              src={prevImg}
              variants={IconVariants}
              initial="initial"
              whileHover="hover"
              onClick={decreaseIndex}
            />
            <NextIcon
              src={nextImg}
              variants={IconVariants}
              initial="initial"
              whileHover="hover"
              onClick={increaseIndex}
            />
          </Slider>
          {/* TV 확대 및 상세 정보창 */}
          <AnimatePresence>
            {bigTvMatch && (
              <DetailTv
                tvId={bigTvMatch?.params?.id + ""}
                dataType={dataType}
                isSearched={isSearched}
              />
            )}
            {bigSearchedTvMatch && (
              <DetailTv
                tvId={bigSearchedTvMatch?.params?.tvId + ""}
                dataType={dataType}
                isSearched={isSearched}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
};

export default TvSlider;
