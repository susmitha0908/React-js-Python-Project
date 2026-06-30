import React, { useState } from 'react';
import { createCommand } from '../services/api';
import { PlusIcon } from '../components/Icons';

const AddCommand = () => {
  const categories = [
    'Linux',
    'Git',
    'Docker',
    'Kubernetes',
    'Terraform',
    'AWS CLI',
    'Jenkins'
  ];

  const initialFormState = {
    command: '',
    category: 'Linux',
    description: '',
    use_case: '',
    example_output: '',
    difficulty: 'Beginner'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.command || !formData.description || !formData.use_case) {
      setStatus({ type: 'error', message: 'Please fill in all required fields (Command, Description, Use Case).' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await createCommand(formData);
      setStatus({ type: 'success', message: 'DevOps command successfully provisioned to backend registry!' });
      setFormData(initialFormState);
    } catch (err) {
      console.error('Error creating command:', err);
      setStatus({ type: 'error', message: 'Failed to save command. Verify backend connection.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Add Custom Command</h2>
      </div>

      <div className="form-container">
        {status.message && (
          <div className={`status-msg ${status.type}`}>
            <span>{status.type === 'success' ? '✅' : '⚠️'}</span>
            <span>{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Command *</label>
            <input 
              type="text" 
              name="command"
              placeholder="e.g. docker-compose up -d"
              className="form-input code-font"
              value={formData.command}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select 
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Difficulty Level *</label>
              <select 
                name="difficulty"
                className="form-select"
                value={formData.difficulty}
                onChange={handleChange}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea 
              name="description"
              placeholder="Describe what this command does..."
              className="form-textarea"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Real-world Use Case *</label>
            <textarea 
              name="use_case"
              placeholder="Explain how/when developers or DevOps engineers use this in practice..."
              className="form-textarea"
              value={formData.use_case}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Example Output</label>
            <textarea 
              name="example_output"
              placeholder="Show a snippet of what terminal output to expect (optional)..."
              className="form-textarea code-font"
              value={formData.example_output}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <button type="submit" className="form-submit-btn" disabled={loading}>
            {loading ? 'Registering Command...' : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <PlusIcon />
                <span>Register Custom Command</span>
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCommand;
