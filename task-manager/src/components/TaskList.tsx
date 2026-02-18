import React, { useState, useEffect } from 'react';
import '../styles/TaskList.css';
import { Task } from '../types';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface TaskListProps {
  tasks: Task[];
  status: string;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, status, onEdit, onDelete }) => {
  const [exitingTasks, setExitingTasks] = useState<Set<string>>(new Set());
  const [enteringTasks, setEnteringTasks] = useState<Set<string>>(new Set());
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'in-progress':
        return '#FFB03C';
      case 'pending':
        return '#D0D0D0';
      case 'completed':
        return '#368A04';
      default:
        return '#D0D0D0';
    }
  };
  
  const FiEdit = FiEdit2 as React.ElementType;
  const FiTrash = FiTrash2 as React.ElementType;

useEffect(() => {
  const entering = new Set<string>();

  tasks.forEach(task => {
    if (!exitingTasks.has(task.id)) {
      entering.add(task.id);
    }
  });

  setEnteringTasks(entering);

  const timer = setTimeout(() => {
    setEnteringTasks(new Set());
  }, 500);

  return () => clearTimeout(timer);
}, [tasks, exitingTasks]);


  const handleEdit = (taskId: string) => {
    setEditingTaskId(taskId);
    
    setTimeout(() => {
      setEditingTaskId(null);
      onEdit(taskId);
    }, 300);
  };

  const handleDelete = (taskId: string) => {
    setExitingTasks(prev => new Set(prev).add(taskId));
    setTimeout(() => {
      setExitingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
      onDelete(taskId);
      
      toast.success('Task deleted successfully!', {
        duration: 2000,
        position: 'top-right',
        style: {
          background: 'white',
          color: '#E32A34',
          padding: '12px 20px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: '1px solid #E32A34',
        },
      });
    }, 300);
  };

  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <p>No tasks in {status}</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task, index) => {
        const isExiting = exitingTasks.has(task.id);
        const isEntering = enteringTasks.has(task.id);
        const isEditing = editingTaskId === task.id;
        
        return (
          <div 
            key={task.id} 
            className={`
              task-card 
              ${task.status} 
              ${isExiting ? 'task-card-exit' : ''}
              ${isEntering ? 'task-card-enter' : ''}
              ${isEditing ? 'task-card-editing' : ''}
            `}
            style={{ 
              animationDelay: isEntering ? `${index * 50}ms` : '0ms',
            }}
          >
            <div className="task-checkbox">
              <div className={`task-initial-circle ${isEditing ? 'pulse-animation' : ''}`}>
                {task.title.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="task-content">
              <div className="task-header">
                <h3 className={`task-title ${isEditing ? 'editing' : ''}`}>{task.title}</h3>
                <div className="task-status-container">
                  <span className="task-status-circle" style={{ backgroundColor: getStatusColor(task.status) }}></span>
                  <span className="task-status">
                    {task.status}
                  </span>
                </div>
              </div>
              <p className={`task-description ${isEditing ? 'editing' : ''}`}>{task.description}</p>
              <div className="task-footer">
                <span className="task-date">{task.dueDate}</span>
                <div className="task-actions">
                  <button 
                    className="task-action-btn edit-btn"
                    onClick={() => handleEdit(task.id)}
                    title="Edit task"
                    disabled={isExiting}
                  >
                    <FiEdit color='#034EA2'/>
                  </button>
                  <button 
                    className="task-action-btn delete-btn"
                    onClick={() => handleDelete(task.id)}
                    title="Delete task"
                    disabled={isExiting}
                  >
                    <FiTrash color='#E32A34'/>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};