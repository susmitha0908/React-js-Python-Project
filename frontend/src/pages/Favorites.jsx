import React, { useState, useEffect } from 'react';
import { getFavorites, toggleFavorite, deleteCommand } from '../services/api';
import CommandCard from '../components/CommandCard';
import { StarIcon } from '../components/Icons';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    try {
      const data = await getFavorites();
      setFavorites(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Failed to fetch favorite commands.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleToggleFav = async (id) => {
    try {
      await toggleFavorite(id);
      // Immediately remove from UI list since we are in Favorites view
      setFavorites(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this command?')) {
      try {
        await deleteCommand(id);
        setFavorites(prev => prev.filter(c => c.id !== id));
      } catch (err) {
        console.error('Error deleting command:', err);
        alert('Could not delete command. Try again.');
      }
    }
  };

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">My Bookmarked Commands</h2>
      </div>

      {error && (
        <div className="status-msg error">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '4rem 0' }}>
          <div style={{ color: 'var(--accent-cyan)' }}>Loading bookmarked cache...</div>
        </div>
      ) : favorites.length === 0 ? (
        <div className="empty-state">
          <StarIcon style={{ color: '#fbbf24', filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.4))' }} />
          <h3>No Favorites Added</h3>
          <p>You haven't favorited any commands yet. Go to "All Commands" and click the star icon to save them here.</p>
        </div>
      ) : (
        <div className="grid-layout">
          {favorites.map(command => (
            <CommandCard 
              key={command.id}
              command={command}
              isFavorite={true}
              onToggleFav={handleToggleFav}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
