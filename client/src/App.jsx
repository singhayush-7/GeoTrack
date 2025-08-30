import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import { useSelector } from 'react-redux';

export default function App() {
  const { token } = useSelector((s) => s.user);
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={token ? <Home /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to={token ? '/' : '/login'} replace />} />
    </Routes>
  );
}
