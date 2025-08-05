import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import RoutesConfig from "./routes";

import Login from "./components/login/Login.jsx";
import Footer from "./components/footers/Footer.jsx";
import Note from "./components/note/Note.jsx";
import CreateArea from "./components/CreateArea.jsx";
import Hello from "./components/Hello.jsx";
import Layout from "./layouts/MainLayout.jsx";

function App() {
  return (
    <BrowserRouter>
      <RoutesConfig />
    </BrowserRouter>
  );
}

export default App;
