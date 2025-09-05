// Import necessary components from React Router
import { Routes, Route } from 'react-router-dom'

// Import pages
import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

// Main application component
function App() {

  return (
    <div data-theme="autumn" className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>
      <Footer />
    </div>

  )
}

export default App;


// TODO: 
// Navbar - functionality and styling
// HomePage - separate components, functionality, and styling
// Login page, route and component
// Dashboard page, route and component (Admin and Parking Staff)