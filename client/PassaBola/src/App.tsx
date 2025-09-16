import {Route, Routes, Navigate} from "react-router-dom";

import IndexPage from "@/pages/index"
import DashboardPage from "@/pages/Dashboard";

function RequireAuth({ children }: { children: JSX.Element }) {
    const token = localStorage.getItem("access_token");
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

function App() {
    return (
        <Routes>
            <Route element={<IndexPage/>} path="/"/>
            <Route
                path="/dashboard"
                element={
                    <RequireAuth>
                        <DashboardPage />
                    </RequireAuth>
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;