import { Route, Routes, Navigate, Outlet } from "react-router-dom";

import IndexPage from "@/pages/index";
import DashboardPage from "@/pages/dashboard-page.tsx";
import ChampionshipsListPage from "@/pages/championship-list-page.tsx";
import MyUpcomingGamesPage from "@/pages/my-upcoming-games-page.tsx";
import MyCompletedGamesPage from "@/pages/my-completed-games.tsx";
import AdminChampionshipsPage from "@/pages/admin/admin-championships-page.tsx";
import AdminChampionshipDetailPage from "@/pages/admin/admin-championship-detail-page.tsx";
import AdminGameEditorPage from "@/pages/admin/admin-game-editor-page.tsx";

function RequireAuth() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate replace to="/login" />;
  }

  return <Outlet />;
}

function RequireAdmin() {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role"); // replace with your real role source

  if (!token) {
    return <Navigate replace to="/login" />;
  }

  if (role !== "admin") {
    return <Navigate replace to="/" />;
  }

  return <Outlet />;
}

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />

      <Route element={<RequireAuth />} path="/app">
        <Route element={<ChampionshipsListPage />} path="championships" />
        <Route element={<MyUpcomingGamesPage />} path="me/games/upcoming" />
        <Route element={<MyCompletedGamesPage />} path="me/games/completed" />
        <Route element={<DashboardPage />} path="" />
      </Route>

      <Route element={<RequireAdmin />}>
        <Route
          element={<AdminChampionshipsPage />}
          path="/admin/championships"
        />
        <Route
          element={<AdminChampionshipDetailPage />}
          path="/admin/championships/:id"
        />
        <Route element={<AdminGameEditorPage />} path="/admin/games/:id" />
      </Route>

      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}

export default App;
