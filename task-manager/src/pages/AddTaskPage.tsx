import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../styles/AddTask.css';

interface AddTaskPageProps {
  onAdd?: (task: { title: string; description: string }) => void;
}

export const AddTaskPage: React.FC<AddTaskPageProps> = ({ onAdd }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const Back = FiArrowLeft as React.ElementType;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      if (onAdd) {
        onAdd({ title, description });
      }
      toast.success('Task added successfully!', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: 'white',
          color: '#034EA2',
          padding: '12px 20px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '500',
        },
      });
      
      navigate('/');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="app">
      <header className="app-header" onClick={() => navigate('/')}>
        <h1><Back size={28}/> Add Task</h1>
      </header>
      <div className="add-task-container">
        <form onSubmit={handleSubmit} className="add-task-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter the title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <textarea
              placeholder="Enter the description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              rows={6}
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={handleCancel}
              className="btn btn-cancel"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-add"
              disabled={!title.trim() || !description.trim()}
            >
              ADD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};