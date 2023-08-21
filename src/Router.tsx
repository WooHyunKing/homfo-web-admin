import React from "react";
import { Route, Routes } from "react-router-dom";
import Main from "./pages/main/Main";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />}>
        <Route></Route>
      </Route>
    </Routes>
  );
};

export default Router;
