import { useEffect } from 'react';

// Import necessary components from React Router
import { Routes, Route, Navigate } from 'react-router-dom'

// Import react-hot-toast dependency;
import { Toaster } from 'react-hot-toast';

// Import pages
import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import UserManagementPage from './pages/UserManagementPage';
import VehicleManagementPage from './pages/VehicleManagementPage';
import AccessControlPage from './pages/AccessControlPage';
import AccessLogPage from './pages/AccessLogPage';


import LoadingSpinner from './components/LoadingSpinner';

import { useUserStore } from './stores/useUserStore';

// Main application component
function App() {

  const { user, checkAuth, checkingAuth } = useUserStore();

  useEffect(() => {
    // Check user authentication status
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Log user in console
    console.log("Logged in user:", user);
  }, [user]);


  if (checkingAuth) {
    return (
      <div data-theme="autumn" className="min-h-screen flex items-center justify-center bg-base-100">
        <LoadingSpinner />
      </div>
    )
  };
  return (
    <div data-theme="autumn" className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
          <Route path="/dashboard" element={!user ? <Navigate to="/login" /> : <DashboardPage />} />
          <Route path="/access-control" element={!user ? <Navigate to="/login" /> : <AccessControlPage />} />
          <Route path="/access-logs" element={!user ? <Navigate to="/login" /> : <AccessLogPage />} />
          <Route path="/profile" element={!user ? <Navigate to="/login" /> : <ProfilePage />} />
          <Route path="/user-management" element={!user ? <Navigate to="/login" /> : <UserManagementPage />} />
          <Route path="/vehicle-management" element={!user ? <Navigate to="/login" /> : <VehicleManagementPage />} />

        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>

  )
}

export default App;


// TODO: 

// PRIORITY
// validation on entarnce cannot entry again if last entry is not exit
// Add utility function to remove white spaces and extra characters from license plate number
// Dashboard page - integrate with LPR (camera, verification alerts)
// Access control page - integrate with LPR 
// Protect routes
// hide access logs and vehicle management for it admin

// Testing
// Deployment

// Low priority
// Blacklist feature - shared blacklist list or online blacklist list
// Navbar component -  styling
// IT Admin - view user logs 
