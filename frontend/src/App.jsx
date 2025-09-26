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
import GateSimulationPage from './pages/GateSimulationPage';


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
          <Route path="/gate-simulation" element={!user ? <Navigate to="/login" /> : <GateSimulationPage />} />
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

// PARKING STAFF
// Vehicle Management Page (parking staff)  - vehicle requests component (view only, proposed changes details)
// System Monitoring Page
// Access Panel Page
// Gate simulation page
// Navbar links

// ADMIN
// System Monitoring Page




// HomePage - functionality, and styling
// Dashboard page, route and component (Admin and Parking Staff)
// Protect routes


// Low priority
// Blacklist feature - shared blacklist list or online blacklist list
// Vehicle Management Page - improve styling
// User Management Page- styling
// CreateUserForm component - styling 
// UserList component - styling
// Navbar component -  styling 
// Footer component - styling



// Done
// Modals - confirmation blacklist and delete vehicle
// view vehicle (add modal for blacklist)