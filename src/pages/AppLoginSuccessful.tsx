// AppLoginSuccessful.jsx
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const AppLoginSuccessful = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    console.log(window.electron, 'window.electron');
    
    if (window.electron && token) {
      window.electron.send("store-token", token); // Send token to main process
    }
  }, [token]);

  return <h1>App Login Successfully!</h1>;
};

export default AppLoginSuccessful;
