import "./App.css";
import React from "react";
import { RouterProvider } from "react-router-dom";
import Router from "../src/components/helper/Router";
import ConfigData from "./configs.json";

function App() {
  return (
    <div className="App">
      <RouterProvider router={Router}></RouterProvider>
    </div>
  );
}

export default App;
