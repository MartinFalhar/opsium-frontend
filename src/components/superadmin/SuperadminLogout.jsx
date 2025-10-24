import React from "react";

function Logout() {
  // Clear user session or token here if needed.
  localStorage.removeItem("user"); // Example: remove user from localStorage
  window.location.href = "/"; // Redirect to login page
  return null; // No UI needed for logout component
}

export default Logout;
