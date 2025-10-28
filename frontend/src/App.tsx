import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen/SplashScreen';
import HomeScreen from './pages/HomeScreen/HomeScreen';
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

const AppContent: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  const handleLoadingComplete = () => {
    setShowSplash(false);
    navigate('/home');
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          showSplash ? (
            <SplashScreen onLoadingComplete={handleLoadingComplete} />
          ) : (
            <HomeScreen />
          )
        }
      />
      <Route path="/home" element={<HomeScreen />} />
    </Routes>
  );
};

export default App;
