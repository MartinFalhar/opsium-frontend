import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Footer.css"; // Assuming you have a CSS file for styling

function Footer() {
  const year = new Date().getFullYear();
  const [user, setUser] = useState(null);

  // useEffect(() => {
  //   axios.get("http://localhost:3000").then((res) => {
  //     setUser(res.data);
  //   });
  // }, []);

  return (
    <div>
      Hello {user?.name}
      <footer>
        <p>Copyright ⓒ {year}</p>
      </footer>
    </div>
  );
}

export default Footer;
