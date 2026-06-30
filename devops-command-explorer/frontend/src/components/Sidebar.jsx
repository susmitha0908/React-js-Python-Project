import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { DashboardIcon, TerminalIcon, StarIcon, PlusIcon, CloseIcon, getCategoryIcon } from './Icons';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const categories = [
    'Linux',
    'Git',
    'Docker',
    'Kubernetes',
    'Terraform',
    'AWS CLI',
    'Jenkins'
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Link to="/" className="logo-container" style={{ margin: 0, textDecoration: 'none' }} onClick={() => toggleSidebar(false)}>
          <TerminalIcon className="logo-icon" />
          <span className="logo-text">DevOps Explorer</span>
        </Link>
        <button 
          className="mobile-menu-btn" 
          onClick={() => toggleSidebar(false)}
          style={{ padding: '0.25rem', marginTop: '-0.25rem' }}
        >
          <CloseIcon />
        </button>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
        <div>
          <div className="nav-section-title" style={{ marginTop: 0 }}>Menu</div>
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => toggleSidebar(false)}>
                <DashboardIcon />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/commands" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => toggleSidebar(false)}>
                <TerminalIcon />
                <span>All Commands</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/favorites" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => toggleSidebar(false)}>
                <StarIcon />
                <span>Favorites</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/add" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => toggleSidebar(false)}>
                <PlusIcon />
                <span>Add Command</span>
              </NavLink>
            </li>
          </ul>

          <div className="nav-section-title">Categories</div>
          <ul className="nav-links">
            {categories.map((category) => (
              <li key={category}>
                <NavLink 
                  to={`/category/${category}`} 
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => toggleSidebar(false)}
                >
                  {getCategoryIcon(category)}
                  <span>{category}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
