import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider }    from "./context/AuthContext";
import { ChildProvider }   from "./context/ChildContext";
import { SessionProvider } from "./context/SessionContext";
import { ToastProvider }   from "./context/ToastContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login    from "./pages/Auth/Login";
import SignUp   from "./pages/Auth/SignUp";
import AddChild from "./pages/Auth/AddChild";

import Dashboard from "./pages/Dashboard";
import Learn     from "./pages/Learn";
import Games     from "./pages/Games";
import Rewards   from "./pages/Rewards";
import Profile   from "./pages/Profile";
import Analytics from "./pages/Analytics";

export default function App() {
  return (
    <AuthProvider>
      <ChildProvider>
        <SessionProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login"  element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/add-child" element={
                  <ProtectedRoute><AddChild isOnboarding={false} /></ProtectedRoute>
                }/>
                <Route path="/analytics" element={
                  <ProtectedRoute><Analytics /></ProtectedRoute>
                }/>
                <Route path="/" element={
                  <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>
                }/>
                <Route path="/learn" element={
                  <ProtectedRoute><Layout><Learn /></Layout></ProtectedRoute>
                }/>
                <Route path="/games" element={
                  <ProtectedRoute><Layout><Games /></Layout></ProtectedRoute>
                }/>
                <Route path="/rewards" element={
                  <ProtectedRoute><Layout><Rewards /></Layout></ProtectedRoute>
                }/>
                <Route path="/profile" element={
                  <ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>
                }/>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </SessionProvider>
      </ChildProvider>
    </AuthProvider>
  );
}