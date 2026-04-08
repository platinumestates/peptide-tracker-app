import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DailyLog from './pages/DailyLog';
import Protocol from './pages/Protocol';
import Cycles from './pages/Cycles';
import Inventory from './pages/Inventory';
import Journal from './pages/Journal';
import Settings from './pages/Settings';
import More from './pages/More';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter basename="/peptide-tracker-app">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/log" element={<DailyLog />} />
            <Route path="/protocol" element={<Protocol />} />
            <Route path="/cycles" element={<Cycles />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/more" element={<More />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}
