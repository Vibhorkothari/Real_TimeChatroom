import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import useChatStore from './store/chatStore';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import LoadingScreen from './components/common/LoadingScreen';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function App() {
  const { isAuthenticated, loading, initialize } = useAuthStore();
  const { initializeSocket, disconnectSocket } = useChatStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isAuthenticated) {
      initializeSocket();
    } else {
      disconnectSocket();
    }
  }, [isAuthenticated, initializeSocket, disconnectSocket]);

  if (loading) {
    return <LoadingScreen message="Initializing ChatRoom..." />;
  }

  return (
    <ThemeProvider>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} 
          />
          <Route 
            path="/dashboard/*" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
          />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
