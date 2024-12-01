import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import TradePage from './pages/TradePage'
import Dashboard from './pages/Dashboard'
import Leaderboard from './pages/Leaderboard'

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="trade" element={<TradePage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="leaderboard" element={<Leaderboard />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

export default App