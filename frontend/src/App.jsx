// Import necessary components from React Router
import { Routes , Route } from 'react-router-dom'

// Import pages
import HomePage from './pages/HomePage';

// Main application component
function App() {
  
  return (
    // Define the routes for the application
    <Routes>
      <Route path="/" element={<HomePage />} /> {/* Home route */}
    </Routes>
  )
}

export default App;
