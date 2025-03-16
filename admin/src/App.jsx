import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import AddAgent from './pages/AddAgent';
import ViewAgents from './pages/ViewAgents';
import DistributeLists from './pages/DistributeLists';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check if user is authenticated on load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  
  // Handle login
  const handleLogin = (token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem("distribute",0)
    setIsAuthenticated(true);
  };
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem("distribute")
    setIsAuthenticated(false);
  };
  
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex h-screen bg-gray-100">
        {isAuthenticated && <Sidebar />}
        <div className="flex-1 flex flex-col overflow-hidden">
          {isAuthenticated && <Navbar onLogout={handleLogout} />}
          <Routes>
            <Route path="/login" element={
              !isAuthenticated ? 
                <Login onLogin={handleLogin} /> : 
                <Navigate to="/dashboard" />
            } />
            <Route path="/dashboard" element={
              isAuthenticated ? 
                <Dashboard /> : 
                <Navigate to="/login" />
            } />
            <Route path="/agents/add" element={
              isAuthenticated ? 
                <AddAgent /> : 
                <Navigate to="/login" />
            } />
            <Route path="/agents/view" element={
              isAuthenticated ? 
                <ViewAgents /> : 
                <Navigate to="/login" />
            } />
            <Route path="/lists/distribute" element={
              isAuthenticated ? 
                <DistributeLists /> : 
                <Navigate to="/login" />
            } />
            <Route path="*" element={
              isAuthenticated ? 
                <Navigate to="/dashboard" /> : 
                <Navigate to="/login" />
            } />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;