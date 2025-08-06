import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/AdminDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import GuestUpload from "./pages/GuestUpload";
import SiteManagement from "./pages/SiteManagement";
import Login from "./pages/Login";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/client/:clientId" element={<ClientDashboard />} />
          <Route path="/album/:albumId" element={<GuestUpload />} />
          <Route path="/site-management" element={<SiteManagement />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;