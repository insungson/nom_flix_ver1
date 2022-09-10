export const makeImagePath = (id: string, format?: string) => {
  // api 에서 이미지 사이즈 조절 옵션이 있기 때문에 아래와 같이 사용함.
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
};
