import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import Login from './login/login.jsx';
import Dashboard from './dashboard/dashboard.jsx';
import Pendaftaran from './pendaftaran/pendaftaran.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pendaftaran" element={<Pendaftaran />} />
      </Routes>
    </Router>
  );
};

export default App;