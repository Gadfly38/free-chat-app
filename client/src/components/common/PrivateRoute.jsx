import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // const token = localStorage.getItem("token"); // or use a context/state management solution
  const token = useSelector((state) => state.auth.token);

  console.log(token);

  return token ? children : <Navigate to="/app/auth/login" />;
};

export default PrivateRoute;
