import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCommands } from '../services/api';
import { TerminalIcon, getCategoryIcon } from '../components/Icons';

const Dashboard = () => {
  const [commands, setCommands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getCommands();
        setCommands(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to connect to the DevOps backend API.');
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getCategoryCount = (category) => {
    return commands.filter(c => c.category.toLowerCase() === category.toLowerCase()).length;
  };

  const categories = [
    'Linux',
    'Git',
    'Docker',
    'Kubernetes',
    'Terraform',
    'AWS CLI',
    'Jenkins'
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div style={{ fontSize: '1.2rem', color: 'var(--accent-cyan)' }}>Loading portal diagnostics...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="hero-section">
        <div className="hero-content">
          <h1>
            Master <span className="hero-gradient-text">DevOps Commands</span> in One Place
          </h1>
          <p className="hero-subtitle">
            Browse, search, and save standard DevOps commands with real-world examples, difficulty analysis, and quick copy-paste snippets.
          </p>
        </div>
      </div>

      {error && (
        <div className="status-msg error">
          <span>⚠️</span>
          <span>{error} Make sure the FastAPI server is running on port 8000.</span>
        </div>
      )}

      <div className="section-header">
        <h2 className="section-title">Telemetry & Metrics</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <TerminalIcon />
          </div>
          <div className="stat-info">
            <span className="stat-value">{commands.length}</span>
            <span className="stat-label">Total Commands</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            {getCategoryIcon('Linux')}
          </div>
          <div className="stat-info">
            <span className="stat-value">{getCategoryCount('Linux')}</span>
            <span className="stat-label">Linux Commands</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper">
            {getCategoryIcon('Git')}
          </div>
          <div className="stat-info">
            <span className="stat-value">{getCategoryCount('Git')}</span>
            <span className="stat-label">Git Commands</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper">
            {getCategoryIcon('Docker')}
          </div>
          <div className="stat-info">
            <span className="stat-value">{getCategoryCount('Docker')}</span>
            <span className="stat-label">Docker Commands</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper">
            {getCategoryIcon('Kubernetes')}
          </div>
          <div className="stat-info">
            <span className="stat-value">{getCategoryCount('Kubernetes')}</span>
            <span className="stat-label">Kubernetes Commands</span>
          </div>
        </div>
      </div>

      <div className="section-header">
        <h2 className="section-title">Explore by Domain</h2>
      </div>

      <div className="categories-preview-grid">
        {categories.map((category) => (
          <Link key={category} to={`/category/${category}`} className="category-preview-card">
            <div style={{ color: 'var(--accent-cyan)' }}>
              {getCategoryIcon(category, { className: 'category-preview-icon' })}
            </div>
            <span className="category-preview-name">{category}</span>
            <span className="category-preview-count">{getCategoryCount(category)} commands</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
