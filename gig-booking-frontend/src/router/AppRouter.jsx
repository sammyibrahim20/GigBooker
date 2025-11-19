import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import BandDashboardPage from "../pages/BandDashboardPage.jsx";
import VenueDashboardPage from "../pages/VenueDashboardPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import SignupPage from "../pages/SignupPage.jsx";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/band" element={<BandDashboardPage />} />
      <Route path="/venue" element={<VenueDashboardPage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
}
