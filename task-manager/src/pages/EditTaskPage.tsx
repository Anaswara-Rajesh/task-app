import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiChevronDown } from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../styles/EditTask.css';

interface EditTaskPageProps {
  tasks?: Array<{
    id: string;
    title: string;
    description: string;
    status: string;
    dueDate: string;
    createdAt: string;
  }>;
  onEdit?: (taskId: string, updatedTask: { title: string; description: string; status: string }) => void;
}

export const EditTaskPage: React.FC<EditTaskPageProps> = ({ tasks = [], onEdit }) => {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();
  const Back = FiArrowLeft as React.ElementType;
  const ChevronDown = FiChevronDown as React.ElementType;
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: '#D0D0D0' },
    { value: 'in-progress', label: 'In Progress', color: '#FFB03C' },
    { value: 'completed', label: 'Completed', color: '#368A04' }
  ];

  const getStatusColor = (statusValue: string) => {
    const option = statusOptions.find(opt => opt.value === statusValue);
    return option ? option.color : '#D0D0D0';
  };

  const getStatusLabel = (statusValue: string) => {
    const option = statusOptions.find(opt => opt.value === statusValue);
    return option ? option.label : statusValue;
  };

  useEffect(() => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
    }
    setLoading(false);
  }, [taskId, tasks]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim() && taskId) {
      if (onEdit) {
        onEdit(taskId, { title, description, status });
      }
      
      toast.success('Task updated successfully!', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: 'white',
          color: '#034EA2',
          padding: '12px 20px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: '1px solid #034EA2',
        },
      });
      
      navigate('/');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const selectStatus = (value: string) => {
    setStatus(value);
    setIsDropdownOpen(false);
  };

  if (loading) {
    return (
      <div className="app">
        <header className="app-header" onClick={() => navigate('/')}>
          <h1><Back size={28}/> Loading...</h1>
        </header>
        <div className="edit-task-container">
          <p>Loading task details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header" onClick={() => navigate('/')}>
        <h1><Back size={28}/> Edit Task</h1>
      </header>
      <div className="edit-task-container">
        <form onSubmit={handleSubmit} className="edit-task-form">
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

          <div className="form-group">
            <div className="custom-dropdown" ref={dropdownRef}>
              <div 
                className="dropdown-selected"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="option-with-dot">
                  <span 
                    className="status-dot" 
                    style={{ backgroundColor: getStatusColor(status) }}
                  ></span>
                  <span>{getStatusLabel(status)}</span>
                </div>
                <ChevronDown 
                  size={18} 
                  color="#034EA2"
                  className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}
                />
              </div>
              
              {isDropdownOpen && (
                <div className="dropdown-options">
                  {statusOptions.map(option => (
                    <div
                      key={option.value}
                      className={`dropdown-option ${status === option.value ? 'selected' : ''}`}
                      onClick={() => selectStatus(option.value)}
                    >
                      <div className="option-with-dot">
                        <span 
                          className="status-dot" 
                          style={{ backgroundColor: option.color }}
                        ></span>
                        <span>{option.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
              className="btn btn-edit"
              disabled={!title.trim() || !description.trim()}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};