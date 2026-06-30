import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCommandsByCategory, toggleFavorite, getFavorites, deleteCommand } from '../services/api';
import CommandCard from '../components/CommandCard';
import { getCategoryIcon, TerminalIcon } from '../components/Icons';

const CategoryView = () => {
  const { categoryName } = useParams();
  const [commands, setCommands] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      const [categoryCommands, favsData] = await Promise.all([
        getCommandsByCategory(categoryName),
        getFavorites()
      ]);
      setCommands(categoryCommands);
      setFavorites(favsData.map(f => f.id));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching category commands:', err);
      setError(`Failed to fetch commands for category: ${categoryName}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, [categoryName]);

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
        <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center' }}>
            {getCategoryIcon(categoryName)}
          </span>
          <span>{categoryName} Commands</span>
        </h2>
      </div>

      {error && (
        <div className="status-msg error">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '4rem 0' }}>
          <div style={{ color: 'var(--accent-cyan)' }}>Querying category telemetry...</div>
        </div>
      ) : commands.length === 0 ? (
        <div className="empty-state">
          <TerminalIcon />
          <h3>No Commands in {categoryName}</h3>
          <p>We don't have any commands saved for this category yet. You can add one using the "Add Command" form!</p>
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

export default CategoryView;
