import styled from "styled-components";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import { IGetMovies } from "@Apis/movieApi";
import { makeImagePath } from "@Utils/utils";

const Slider = styled.div`
  position: relative;
  top: -100px;
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

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
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
  padding: 10px;
  background-color: ${(props) => props.theme.white};
  opacity: 0;
  span {
    text-align: center;
    margin: 2px 0;
    font-size: 12px;
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
    font-size: 18px;
  }
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

const boxVariants = {
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

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const boxInfosVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.3,
      duration: 0.3,
      type: "tween",
    },
  },
};

const offset = 6;

interface IProps {
  dataType: string;
  data?: IGetMovies;
  isLoading?: boolean;
}

const MovieSlider = ({ dataType, data, isLoading = false }: IProps) => {
  const [title, setTitle] = useState("");

  useEffect(() => {
    switch (dataType) {
      case "upcoming":
        return setTitle("UpComing");
      case "now":
        return setTitle("Now");
      case "popular":
        return setTitle("Popular");
      case "toprated":
        return setTitle("TopRated");
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
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  }, [data, toggleLeaving, offset]);
  //
  const onBoxClicked = useCallback((movieId: number) => {
    navigate(`/moives/${movieId}`);
  }, []);

  return (
    // <>
    // {!!data && (
    <Slider>
      <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
        <Row
          variants={rowVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "tween", duration: 1 }}
          key={index}
        >
          {data?.results
            .slice(1)
            .slice(offset * index, offset * index + offset)
            .map((movie) => (
              <Box
                layoutId={movie.id + ""} // 문자열로 처리하기 위한 '' 처리
                key={movie.id}
                variants={boxVariants}
                whileHover="hover"
                initial="normal"
                onClick={() => onBoxClicked(movie.id)}
                transition={{ type: "tween" }}
                bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
              >
                <Info variants={infoVariants}>
                  <h4>
                    {movie?.title?.toUpperCase()} ({movie.original_title})
                  </h4>
                  <BoxInfos variants={boxInfosVariants}>
                    <span id="vote">
                      {movie.vote_average
                        ? `★ ${movie.vote_average.toFixed(1)}`
                        : "No Rating Infos"}
                    </span>
                    <span>Release Date: {movie.release_date}</span>
                  </BoxInfos>
                </Info>
              </Box>
            ))}
        </Row>
      </AnimatePresence>
    </Slider>
    // )}
    // </>
  );
};

export default MovieSlider;
