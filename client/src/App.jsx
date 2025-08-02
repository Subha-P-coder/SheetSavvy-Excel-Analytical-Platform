import React, { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import Login from "./pages/Auth/LoginPage.jsx";
import EmailVerify from "./pages/Auth/EmailVerify.jsx";
import { ResetPassword } from "./pages/Auth/ResetPassword.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Settings from "./pages/Dashboard/Settings.jsx";
import UploadExcel from "./pages/Dashboard/UploadExcel.jsx";
import AnalyzeData from "./pages/Dashboard/AnalyzeData.jsx";
import History from "./pages/Dashboard/History.jsx";
import ChatWithFile from "./pages/Dashboard/ChatWithFile.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import ProtectedRoute from "../routes/ProtectedRoute.jsx";
import { AppContext } from "./context/AppContext.jsx";
import ManageUsers from "./pages/Admin/ManageUsers.jsx";
import AdminFiles from "./pages/Admin/AdminFiles.jsx";
import AdminAnalytics from "./pages/Admin/AdminAnalytics.jsx";

function App() {
  const { isDarkTheme } = useContext(AppContext);

  useEffect(() => {
    document.body.classList.toggle("dark-theme", isDarkTheme);
  }, [isDarkTheme]);

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload-excel"
          element={
            <ProtectedRoute>
              <UploadExcel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analyze/:id"
          element={
            <ProtectedRoute>
              <AnalyzeData />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat-with-file"
          element={
            <ProtectedRoute>
              <ChatWithFile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-secret"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-users"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <ManageUsers />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-files"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminFiles />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-users"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <ManageUsers />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-analytics"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminAnalytics />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
