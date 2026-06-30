import React, { useState, useEffect } from 'react';
import { getCommands, toggleFavorite, getFavorites, deleteCommand } from '../services/api';
import CommandCard from '../components/CommandCard';
import { SearchIcon } from '../components/Icons';

const AllCommands = () => {
  const [commands, setCommands] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    'Linux',
    'Git',
    'Docker',
    'Kubernetes',
    'Terraform',
    'AWS CLI',
    'Jenkins'
  ];

  const fetchCommandsAndFavs = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (categoryFilter) params.category = categoryFilter;
      if (difficultyFilter) params.difficulty = difficultyFilter;

      const [commandsData, favsData] = await Promise.all([
        getCommands(params),
        getFavorites()
      ]);

      setCommands(commandsData);
      setFavorites(favsData.map(f => f.id));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching commands/favs:', err);
      setError('Failed to fetch commands from the server.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCommandsAndFavs();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, categoryFilter, difficultyFilter]);

  const handleToggleFav = async (id) => {
    try {
      const result = await toggleFavorite(id);
      if (result.is_favorite) {
        setFavorites(prev => [...prev, id]);
      } else {
        setFavorites(prev => prev.filter(favId => favId !== id));
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this command?')) {
      try {
        await deleteCommand(id);
        setCommands(prev => prev.filter(c => c.id !== id));
        setFavorites(prev => prev.filter(favId => favId !== id));
      } catch (err) {
        console.error('Error deleting command:', err);
        alert('Could not delete command. Try again.');
      }
    }
  };

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">All DevOps Commands</h2>
      </div>

      <div className="filters-bar">
        <div className="search-input-wrapper">
          <SearchIcon />
          <input 
            type="text" 
            placeholder="Search commands, descriptions or use cases..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select 
          className="filter-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select 
          className="filter-select"
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
        >
          <option value="">All Difficulties</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {error && (
        <div className="status-msg error">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '4rem 0' }}>
          <div style={{ color: 'var(--accent-cyan)' }}>Running command directory query...</div>
        </div>
      ) : commands.length === 0 ? (
        <div className="empty-state">
          <SearchIcon />
          <h3>No Commands Found</h3>
          <p>We couldn't find any commands matching your search queries or filter selections. Try relaxing your filters.</p>
        </div>
      ) : (
        <div className="grid-layout">
          {commands.map(command => (
            <CommandCard 
              key={command.id}
              command={command}
              isFavorite={favorites.includes(command.id)}
              onToggleFav={handleToggleFav}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllCommands;
