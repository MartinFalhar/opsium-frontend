import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import RoutesConfig from "./routes";
import ToastContainer from "./components/modal/ToastContainer";

function App() {
  return (
    <BrowserRouter>
      <RoutesConfig />
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
