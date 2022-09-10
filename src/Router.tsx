import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const Movie = lazy(() => import("@Routes/Movie"));
const Tv = lazy(() => import("@Routes/Tv"));
const Search = lazy(() => import("@Routes/Search"));

const Router = () => {
  return (
    <>
      <Routes>
        <Route
          path="/movie"
          element={
            <Suspense fallback={<>loading...</>}>
              <Movie />
            </Suspense>
          }
        />
        <Route
          path="/tv"
          element={
            <Suspense fallback={<>loading...</>}>
              <Tv />
            </Suspense>
          }
        />
        <Route
          path="/search"
          element={
            <Suspense fallback={<>loading...</>}>
              <Search />
            </Suspense>
          }
        />
        <Route path="/movies/:movieId" element={<Movie />} />
        <Route path="/" element={<Navigate replace to="/movie" />} />
      </Routes>
    </>
  );
};

export default Router;
