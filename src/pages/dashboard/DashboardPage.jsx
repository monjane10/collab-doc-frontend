// DashboardPage.jsx
import React from "react";
import UserDashboard from "../UserDashboard";
import AdminDashboard from "./AdminDashboard";

export default function DashboardPage() {
    const user = JSON.parse(localStorage.getItem("user")); // exemplo de user logado

    return user?.role === "admin" ? <AdminDashboard /> : <UserDashboard />;
}
