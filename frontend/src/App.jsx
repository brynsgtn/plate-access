// Import necessary components from React Router
import { Routes, Route } from 'react-router-dom'

// Import pages
import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';
import Footer from './pages/Footer';

// Main application component
function App() {

  return (
    <div data-theme="autumn" className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </div>

  )
}

export default App;


// TODO: 
// Navbar component, extract the navbar code from HomePage
// HomePage
// Login page, route and component
// Dashboard page, route and component (Admin and Parking Staff)