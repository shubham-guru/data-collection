import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import './App.css';
import Dashboard from './presentation/pages/Dashboard';
import Home from './presentation/pages/Home';
import Login from './presentation/pages/Login';
import Signup from './presentation/pages/Signup';
import { pageRoutes } from './routes';

function App() {
  return (
    <BrowserRouter>
    <div style={{
        display: "flex",
        background: '#111',
        fontSize: '20px',
        color: '#fff',
        alignItems: 'center',
        padding: '10px',
    }}>
      
        <div style={{ margin: '10px' }}>
            <NavLink to={pageRoutes.HOME} style={({ isActive }) => ({ 
                color: isActive ? 'orange' : 'white' })}>
                Home
            </NavLink>
        </div>
        <div style={{ margin: '10px' }}>
            <NavLink to={pageRoutes.LOGIN} style={({ isActive }) => ({ 
                color: isActive ? 'orange' : 'white' })}>
                Login
            </NavLink>
        </div>
        <div style={{ margin: '10px' }}>
            <NavLink to={pageRoutes.SIGNUP} style={({ isActive }) => ({ 
                color: isActive ? 'orange' : 'white' })}>
                Signup
            </NavLink>
        </div>
        <div style={{ position: 'absolute', right: 0, margin: '10px' }}>
          <p>DATA COLLECTION</p>
        </div>
    </div>
    <Routes>
        <Route path={pageRoutes.HOME} element={<Home />} />
        <Route path={pageRoutes.LOGIN} element={<Login />} />
        <Route path={pageRoutes.SIGNUP} element={<Signup />} />
        <Route path={pageRoutes.DASHBOARD} element={<Dashboard />} />
    </Routes>
</BrowserRouter>
  );
}

export default App;
