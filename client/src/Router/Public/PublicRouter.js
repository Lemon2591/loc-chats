import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function PublicRouter() {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.accessToken;
    return !token ? <Outlet /> : <Navigate to={{ pathname: "/dashboard" }} />;
}

export default PublicRouter;