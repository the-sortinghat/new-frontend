import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Home } from "@pages/Home";
import { RegisterSystem } from "@pages/RegisterSystem";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/register",
    element: <RegisterSystem />,
  },
]);
