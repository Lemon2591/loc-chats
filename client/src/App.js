import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRouting from "./Router/Private/PrivateRouting"
import PrivateRouter from "./Router/Private/PrivateRouter"
import PublicRouting from "./Router/Public/PublicRouting";
import PublicRouter from "./Router/Public/PublicRouter";
import ErrPage from "./Fearture/Err";

function App() {
  return (

    <Router>
      <Routes>
        <Route exact={true} path="/" element={<PublicRouter />}>
          {PublicRouting.map((PublicRoute, index) => {
            const { path, Component, exact } = PublicRoute;
            return (
              <Route
                key={index}
                path={path}
                element={<Component />}
                exact={`${exact}`}
              />
            );
          })}
        </Route>
        <Route path="/" exact={true} element={<PrivateRouter />}>
          {PrivateRouting.map((privateRoute, index) => {
            const { path, Component, exact } = privateRoute;
            return (
              <Route
                key={index}
                path={path}
                element={<Component />}
                exact={`${exact}`}
              />
            );
          })}
        </Route>
        <Route path="*" element={<ErrPage />} />
      </Routes>
    </Router>

  );
}

export default App;
