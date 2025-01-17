import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // or use a context/state management solution

  return token ? children : <Navigate to="/app/auth/login" />;
};

export default PrivateRoute;
