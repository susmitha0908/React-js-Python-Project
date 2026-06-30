import React, { useState } from 'react';
import { CopyIcon, CheckIcon, StarIcon, TrashIcon } from './Icons';

const CommandCard = ({ command, isFavorite, onToggleFav, onDelete }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDifficultyClass = (diff) => {
    const d = diff.toLowerCase();
    if (d === 'beginner') return 'beginner';
    if (d === 'intermediate') return 'intermediate';
    if (d === 'advanced') return 'advanced';
    return 'beginner';
  };

  return (
    <div className="command-card">
      <div>
        <div className="card-top">
          <span className="category-tag">{command.category}</span>
          <div className="action-buttons">
            <button 
              className={`action-btn fav-btn ${isFavorite ? 'active' : ''}`} 
              onClick={() => onToggleFav(command.id)}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              <StarIcon fill={isFavorite ? "currentColor" : "none"} />
            </button>
            {onDelete && (
              <button 
                className="action-btn delete-btn" 
                onClick={() => onDelete(command.id)}
                title="Delete Command"
              >
                <TrashIcon />
              </button>
            )}
          </div>
        </div>

        <div className="command-card-title">
          $ {command.command}
        </div>

        <div className="card-body">
          <div>
            <div className="card-section-label">Description</div>
            <p className="card-section-text">{command.description}</p>
          </div>
          
          <div>
            <div className="card-section-label">Real-world Use Case</div>
            <p className="card-section-text" style={{ fontStyle: 'italic' }}>
              {command.use_case}
            </p>
          </div>

          {command.example_output && (
            <div>
              <div className="card-section-label">Example Output</div>
              <div className="terminal-block">
                {command.example_output}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card-footer">
        <span className={`difficulty-badge ${getDifficultyClass(command.difficulty)}`}>
          {command.difficulty}
        </span>
        <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
          {copied ? (
            <>
              <CheckIcon style={{ width: '14px', height: '14px' }} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon style={{ width: '14px', height: '14px' }} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CommandCard;
