import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();

    function handleSignOut() {
        localStorage.removeItem("access_token");
        navigate("/login", { replace: true });
    }

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <button
                    onClick={handleSignOut}
                    className="bg-gray-800 text-white rounded px-4 py-2 hover:bg-gray-900"
                >
                    Sign Out
                </button>
            </div>

            <div className="max-w-4xl mx-auto mt-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-700">
                        Welcome! This is a placeholder dashboard. We’ll build more here
                        later.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;