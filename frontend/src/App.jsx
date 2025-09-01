// Import necessary components from React Router
import { Routes , Route } from 'react-router-dom'

// Main application component
function App() {
  
  return (
    // Define the routes for the application
    <Routes>
      // Home route
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default App
