import { BrowserRouter as Router } from 'react-router-dom'
import AppRouter from './router/AppRouter'

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <AppRouter />
      </div>
    </Router>
  )
}

export default App
