import { createRoot } from "react-dom/client";
import React from "react";
import "./index.css";
import App from "./App";
import StarRating from "./starRating";
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StarRating maxRating={10} />
    {/* <App /> */}
  </React.StrictMode>,
);
