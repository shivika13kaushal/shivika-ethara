import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const projRes = await api.get('/projects');
      setProjects(projRes.data);

      const taskRes = await api.get('/tasks/my-tasks');
      setMyTasks(taskRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', { name: newProjectName, description: newProjectDesc });
      setNewProjectName('');
      setNewProjectDesc('');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating project');
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}/status`, { status: newStatus });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating task');
    }
  };

  return (
    <div className="container">
      <h1>Dashboard</h1>
      
      {user?.role === 'Admin' && (
        <div className="glass-panel" style={{marginBottom: '2rem'}}>
          <h3>Create New Project</h3>
          <form onSubmit={handleCreateProject} style={{display: 'flex', gap: '1rem', alignItems: 'flex-end', marginTop: '1rem'}}>
            <div className="input-group" style={{marginBottom: 0, flex: 1}}>
              <label>Name</label>
              <input type="text" className="input-field" value={newProjectName} onChange={e=>setNewProjectName(e.target.value)} required />
            </div>
            <div className="input-group" style={{marginBottom: 0, flex: 2}}>
              <label>Description</label>
              <input type="text" className="input-field" value={newProjectDesc} onChange={e=>setNewProjectDesc(e.target.value)} />
            </div>
            <button type="submit" className="btn">Create</button>
          </form>
        </div>
      )}

      <h2>Your Projects</h2>
      <div className="grid" style={{marginBottom: '3rem'}}>
        {projects.length === 0 ? <p>No projects found.</p> : projects.map(p => (
          <div key={p._id} className="glass-panel card" onClick={() => navigate(`/projects/${p._id}`)}>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <div style={{fontSize: '0.875rem', color: 'var(--text-muted)'}}>
              Owner: {p.owner.name}
            </div>
          </div>
        ))}
      </div>

      <h2>Your Assigned Tasks</h2>
      <div className="grid">
        {myTasks.length === 0 ? <p>No tasks assigned.</p> : myTasks.map(t => (
          <div key={t._id} className="glass-panel card" style={{cursor: 'default', transform: 'none', boxShadow: 'none'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
              <h3>{t.title}</h3>
              <span className={`badge ${
                t.status === 'Completed' ? 'badge-completed' : 
                t.status === 'In Progress' ? 'badge-progress' : 'badge-pending'
              }`}>
                {t.status}
              </span>
            </div>
            <p>{t.description}</p>
            <div style={{fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem'}}>
              Project: {t.project?.name}
            </div>
            <div style={{display: 'flex', gap: '0.5rem'}}>
              {t.status !== 'In Progress' && t.status !== 'Completed' && (
                <button className="btn btn-secondary" style={{fontSize: '0.75rem', padding: '0.5rem 1rem'}} onClick={() => updateTaskStatus(t._id, 'In Progress')}>Start</button>
              )}
              {t.status === 'In Progress' && (
                <button className="btn" style={{fontSize: '0.75rem', padding: '0.5rem 1rem'}} onClick={() => updateTaskStatus(t._id, 'Completed')}>Complete</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
