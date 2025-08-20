import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout.jsx";


import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import EditorPage from "./pages/editor/EditorPage";
import CreateDocumentPage from "./pages/document/CreateDocumentPage.jsx";
import History from "./pages/history/HistoryPage";
import UsersPage from "./pages/users/UsersPage";
import ProfilePage from "./pages/profile/profile.jsx";

createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
					<Routes>
					<Route path="/" element={<LoginPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
						<Route element={<Layout />}>
							<Route path="/dashboard" element={<DashboardPage />} />
							<Route path="/editor/new" element={<CreateDocumentPage />} />
							<Route path="/editor/:id" element={<EditorPage />} />
							<Route path="/history/:documentId" element={<History />} />
							<Route path="/users" element={<UsersPage />} />
              <Route path="/profile" element={<ProfilePage />} />
						</Route>
					</Routes>
		</BrowserRouter>
	</React.StrictMode>
);

