import React from "react";
import Login from "../components/login/Login";

export default function HomePages() {
  return (
    <div className="layout-main">
      <header>Header z Pages - ten tady ale nemá být</header>
      <main>
        <p>Načítá se Outlet</p>
        <Login />
      </main>
    </div>
  );
}
