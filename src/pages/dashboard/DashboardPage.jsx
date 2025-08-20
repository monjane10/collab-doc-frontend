// DashboardPage.jsx
import React from "react";
import UserDashboard from "./userDashboard/UserDashboard";
import AdminDashboard from "./adminDashboard/AdminDashboard"

export default function DashboardPage() {
    const user = JSON.parse(localStorage.getItem("user")); // exemplo de user logado

    return user?.role === "admin" ? <AdminDashboard /> : <UserDashboard />;
}
