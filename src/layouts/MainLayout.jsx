import React from "react";
import { useState  } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../features/footers/Footer";
import MainHeader from "../features/headers/MainHeader";
import MainMenu from "../features/main-menu/MainMenu";

import "./MainLayout.css";
const MainLayout = () => {
  //state evidence velikosti menu
  const [isMenuExtended, setIsMenuExtended] = useState(true);



  // useEffect(() => {
  //   // Collapse menu automatically when viewing a client layout
  //   // match paths like /client or /client/123
  //   const isClientPath = /^\/client(\/|$)/.test(location.pathname);
  //   if (isClientPath && isMenuExtended) {
  //     setIsMenuExtended(false);
  //   }



  //   // optional: expand menu when leaving client view — keep current behaviour
  // }, [location.pathname, isMenuExtended]);


  return (
    <div className="layout-main">
      <MainHeader className="layout-header" />
      <section className="layout-section">
        <nav className="layout-nav"
              style={{ width: isMenuExtended ? "200px" : "60px" }}
        >
          <MainMenu rights={0} isMenuExtended={isMenuExtended} setIsMenuExtended={setIsMenuExtended}/>
        </nav>
        <div className="layout-content">
          <Outlet />
          {/* Pages/HomePage.jsx*/}
        </div>
      </section>
      <Footer className="layout-footer" footerText="Martin Falhar" />
    </div>
  );
};

export default MainLayout;
