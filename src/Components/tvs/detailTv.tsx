import { useEffect, useCallback } from "react";
import { useQuery } from "react-query";
import { makeImagePath } from "@Utils/utils";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getTvCredit,
  getTvDetail,
  IGetTvCredit,
  IGetTvDetail,
} from "@Apis/tvShowApi";
import { motion, useScroll } from "framer-motion";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
`;

const BigTv = styled(motion.div)`
  position: absolute;
  width: 55vw;
  height: 60vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  background-color: ${(props) => props.theme.black.lighter};
  /* 스크롤바 활성화 및 숨기기 */
  overflow-y: scroll;
  /* -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  } */
`;

const BigCover = styled.div<{ posterPath: string }>`
  background-image: linear-gradient(to top, black, transparent),
    url(${(props) => makeImagePath(props.posterPath, "w500")});
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 40px;
  position: relative;
  text-align: center;
  top: -300px;
`;

const BigTitleGenre = styled.div`
  /* margin-top: 30px; */
  top: -250px;
  text-align: center;
  font-size: 18px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
  position: relative;
  span {
    border-radius: 7px;
    padding: 5px;
    margin: 0 5px;
    color: black;
    font-weight: 800;
    background-color: ${(props) => props.theme.white.lighter};
  }
`;

const BigOverview = styled.p`
  margin-top: 30px;
  padding: 20px;
  position: relative;
  top: -140px;
  color: ${(props) => props.theme.white.lighter};
`;

const CreditsInfoBox = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 0 30px;
`;

const CreditsInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 20px;
  #title {
    font-size: 28px;
    color: grey;
    margin-bottom: 10px;
  }
  #name {
    margin-bottom: 20px;
  }
`;
const CreditInfoImg = styled.div<{ posterpath: string }>`
  background-image: url(${(props) => props.posterpath});
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin: 0 10px;
  :hover {
    cursor: pointer;
  }
`;
const CreditInfoCast = styled.div`
  display: flex;
  justify-content: center;
  #title {
    font-size: 28px;
    color: grey;
    margin-bottom: 10px;
  }
  #name {
    font-size: 14px;
  }
`;

interface IProps {
  dataType: string;
  tvId: string;
  isSearched: boolean;
}

const DetailTv = ({ dataType, tvId, isSearched }: IProps) => {
  console.log("isSearched: ", isSearched);
  const navigate = useNavigate();
  const onOverayClick = () => (isSearched ? navigate(-1) : navigate("/tv"));

  const { scrollY } = useScroll();

  // 캐스팅 정보 API data
  const { isLoading: isCreditLoading, data: creditData } =
    useQuery<IGetTvCredit>(["movie", `${dataType}_credit`], () =>
      getTvCredit(tvId)
    );
  console.log("creditData: ", creditData);
  // 상세정보 API data
  const { isLoading: isDetailLoading, data: detailData } =
    useQuery<IGetTvDetail>(["movie", `${dataType}_detail`], () =>
      getTvDetail(tvId)
    );
  console.log("detailData: ", detailData);
  const DirectorInfo = creditData?.crew.find(
    (item) => item.known_for_department === "Directing"
  );
  const CastInfos = creditData?.cast.slice(0, 3);

  const onClickSearchCast = useCallback((name: string) => {
    window.open(`https://www.google.com/search?q=${name}`);
  }, []);

  return (
    <>
      {/* 로딩화면 */}
      {isCreditLoading && isDetailLoading ? (
        <>Loading.....</>
      ) : (
        <>
          {/* 껍대기 부분 */}
          <Overlay
            onClick={onOverayClick}
            exit={{ opacity: 0 }} // 상위 컴포넌트에서 Animate Present 로 감쌌기 때문에 여기서 이 속성이 사용 가능하다.
            animate={{ opacity: 1 }} // movieSlider 에서 사용한 Variants 속성 대신 비교를 위해 이렇게 사용하였다.
          />
          {/* 모달부분 */}
          <BigTv style={{ top: scrollY.get() + 100 }} layoutId={tvId}>
            {detailData && creditData && (
              <>
                <BigCover // movieSlider 에서 백그라운드 이미지 처리하는 방법과 비교해서 살펴보기
                  posterPath={makeImagePath(detailData.backdrop_path, "w500")}
                />
                <BigTitle>{`${detailData?.name}(${detailData?.original_name})`}</BigTitle>
                <BigTitleGenre>
                  {detailData?.genres.map((genre) => (
                    <span key={genre.id}>{genre.name}</span>
                  ))}
                </BigTitleGenre>
                <BigOverview>{detailData?.overview}</BigOverview>
                {/* 아래에 사진부분 추가처리해주기 */}
                <CreditsInfoBox>
                  {DirectorInfo && (
                    <CreditsInfo
                      onClick={() =>
                        onClickSearchCast(DirectorInfo?.original_name)
                      }
                    >
                      <span id="title">Director</span>
                      <CreditInfoImg
                        posterpath={makeImagePath(
                          DirectorInfo?.profile_path ?? ""
                        )}
                      />
                      <span id="name">{DirectorInfo?.original_name}</span>
                    </CreditsInfo>
                  )}
                  <CreditInfoCast>
                    {CastInfos?.map((castObj) => (
                      <CreditsInfo
                        key={castObj.id}
                        onClick={() =>
                          onClickSearchCast(castObj?.original_name)
                        }
                      >
                        <span id="title">Actor</span>
                        <CreditInfoImg
                          posterpath={makeImagePath(
                            castObj?.profile_path ?? ""
                          )}
                        />
                        <span id="name">{castObj?.original_name}</span>
                      </CreditsInfo>
                    ))}
                  </CreditInfoCast>
                </CreditsInfoBox>
              </>
            )}
          </BigTv>
        </>
      )}
    </>
  );
};

export default DetailTv;
