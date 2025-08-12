// AppLoginSuccessful.jsx
import React, { useEffect } from "react";
// import { useSearchParams } from "react-router-dom";

const AppLoginSuccessful = () => {
  // const [searchParams] = useSearchParams();
  // const token = searchParams.get("token");

useEffect(() => {
  setTimeout(() => {
    window.location.href = `briefme://loginSuces.html`;
  }, 300);
}, []);

  return <h1>App Login Successfully!</h1>;
};

export default AppLoginSuccessful;
