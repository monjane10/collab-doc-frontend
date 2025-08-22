// DashboardPage.jsx

import UserDashboard from "./userDashboard/UserDashboard";
import AdminDashboard from "./adminDashboard/AdminDashboard"

export default function DashboardPage() {
    const user = JSON.parse(localStorage.getItem("user")); 

    return user?.role === "admin" ? <AdminDashboard /> : <UserDashboard />;
}
