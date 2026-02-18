import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';
import { SearchBar } from './components/SearchBar';
import { TaskList } from './components/TaskList';
import { Task } from './types';
import { CollapsibleSection } from './components/CollapsibleSection';
import { AddTaskPage } from './pages/AddTaskPage';
import { EditTaskPage } from './pages/EditTaskPage';

const MainApp: React.FC<{
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  openSection: string | null;
  setOpenSection: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ tasks, setTasks, searchQuery, setSearchQuery, openSection, setOpenSection }) => {
  const navigate = useNavigate();

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const handleSectionToggle = (sectionTitle: string) => {
    setOpenSection(prevOpen => prevOpen === sectionTitle ? null : sectionTitle);
  };

  const handleEdit = (taskId: string) => {
    navigate(`/edit-task/${taskId}`);
  };

  const handleDelete = (taskId: string) => {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  return (
  <div className="app">
    <header className="app-header">
      <h1>TO DO APP</h1>
    </header>

    <main className="app-main">
      <div className="content-wrapper">
        <div className="search-bar-container">
          <SearchBar 
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery} 
          />
        </div>

        <div className="tasks-container">
          <CollapsibleSection 
            title="In Progress" 
            count={getTasksByStatus('in-progress').length}
            isOpen={openSection === 'in-progress'}
            onToggle={() => handleSectionToggle('in-progress')}
          >
            <TaskList
              tasks={getTasksByStatus('in-progress')}
              status="in-progress"
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </CollapsibleSection>

          <CollapsibleSection 
            title="Pending" 
            count={getTasksByStatus('pending').length}
            isOpen={openSection === 'pending'}
            onToggle={() => handleSectionToggle('pending')}
          >
            <TaskList
              tasks={getTasksByStatus('pending')}
              status="pending"
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </CollapsibleSection>

          <CollapsibleSection 
            title="Completed" 
            count={getTasksByStatus('completed').length}
            isOpen={openSection === 'completed'}
            onToggle={() => handleSectionToggle('completed')}
          >
            <TaskList
              tasks={getTasksByStatus('completed')}
              status="completed"
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </CollapsibleSection>
        </div>

        <button 
          className="add-task-button"
          onClick={() => navigate('/add-task')}
        >
          +
        </button>
      </div>
    </main>
  </div>
);
};

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openSection, setOpenSection] = useState<string | null>('in-progress');
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Lorem Ipsum',
      description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.',
      dueDate: 'Wed, 31 July 2024',
      status: 'in-progress',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Lorem Ipsum',
      description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.',
      dueDate: 'Wed, 31 July 2024',
      status: 'in-progress',
      createdAt: new Date().toISOString()
    }
  ]);

  const handleAddTask = (newTask: { title: string; description: string }) => {
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      dueDate: new Date().toLocaleDateString('en-US', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    setTasks(prevTasks => [...prevTasks, task]);
  };

  const handleEditTask = (taskId: string, updatedTask: { title: string; description: string; status: string }) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              title: updatedTask.title, 
              description: updatedTask.description,
              status: updatedTask.status as 'pending' | 'in-progress' | 'completed'
            }
          : task
      )
    );
  };

  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={
          <MainApp 
            tasks={tasks}
            setTasks={setTasks}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            openSection={openSection}
            setOpenSection={setOpenSection}
          />
        } />
        <Route path="/add-task" element={
          <AddTaskPage onAdd={handleAddTask} />
        } />
        <Route path="/edit-task/:taskId" element={
          <EditTaskPage tasks={tasks} onEdit={handleEditTask} />
        } />
      </Routes>
    </Router>
  );
};

export default App;