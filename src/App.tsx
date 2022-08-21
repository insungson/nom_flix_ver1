import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Router from "./Router";
import Header from "@Components/Header";

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Header />
      <Router />
    </BrowserRouter>
  );
}

export default App;
