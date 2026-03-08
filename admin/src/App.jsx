import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Components
import Navbar from "./components/Navbar/Navbar";
import DashboardPage from "./components/DashboardPage/DashboardPage";
import AddPage from "./components/AddPage/AddPage";
import ListPage from "./components/ListPage/ListPage";
import AppointmentsPage from "./components/AppointmentsPage/AppointmentsPage";
import ServiceDashboard from "./components/ServiceDashboard/ServiceDashboard";
import AddService from "./components/AddService/AddService";
import ListServicePage from "./components/ListServicePage/ListServicePage";
import ServiceAppointmentsPage from "./components/ServiceAppointmentsPage/ServiceAppointmentsPage";

export default function App() {
    return (
        <div className="min-h-screen flex bg-slate-50/50">
            {/* Sidebar */}
            <Navbar />

            {/* Main content */}
            <main className="flex-1 overflow-auto">
                <Routes>
                    <Route path="/" element={<Navigate to="/h" replace />} />
                    <Route path="/h" element={<DashboardPage />} />
                    <Route path="/add" element={<AddPage />} />
                    <Route path="/list" element={<ListPage />} />
                    <Route path="/appointments" element={<AppointmentsPage />} />
                    <Route path="/service-dashboard" element={<ServiceDashboard />} />
                    <Route path="/add-service" element={<AddService />} />
                    <Route path="/list-service" element={<ListServicePage />} />
                    <Route path="/service-appointments" element={<ServiceAppointmentsPage />} />
                </Routes>
            </main>
        </div>
    );
}
