import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AllCommands from './pages/AllCommands';
import CategoryView from './pages/CategoryView';
import Favorites from './pages/Favorites';
import AddCommand from './pages/AddCommand';
import { MenuIcon, TerminalIcon } from './components/Icons';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = (state) => {
    setSidebarOpen(state !== undefined ? state : !sidebarOpen);
  };

  return (
    <div className="app-container">
      {/* Overlay to close sidebar on mobile click outside */}
      {sidebarOpen && (
        <div 
          onClick={() => toggleSidebar(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 95,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="main-wrapper">
        <header className="top-navbar">
          <button className="mobile-menu-btn" onClick={() => toggleSidebar(true)} style={{ marginRight: 'auto' }}>
            <MenuIcon />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
              API Telemetry: Online
            </span>
          </div>
        </header>

        <main className="content-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/commands" element={<AllCommands />} />
            <Route path="/category/:categoryName" element={<CategoryView />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/add" element={<AddCommand />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>© {new Date().getFullYear()} DevOps Command Explorer. Tailored for Cloud Operations & Engineers.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
