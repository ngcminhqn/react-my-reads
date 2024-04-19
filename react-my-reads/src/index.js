import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomeScreen from "./routers/HomeScreen";
import DetailScreen from "./routers/DetailScreen";
import SearchScreen from "./routers/SearchScreen";
import NotFoundScreen from "./routers/NotFoundScreen";
import Loading from "./components/Loading";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeScreen />,
  },
  {
    path: "/books/:bookId",
    element: <DetailScreen />,
  },
  {
    path: "/search",
    element: <SearchScreen />,
  },
  {
    path: "/not-found",
    element: <NotFoundScreen />,
  },
  {
    path: "*",
    element: <NotFoundScreen />,
  },
]);

ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={router} fallbackElement={<Loading />} />
  </React.StrictMode>,
  document.getElementById("root")
);
