import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const { user } = useContext(AuthContext);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');

  useEffect(() => {
    fetchProjectDetails();
    if (user?.role === 'Admin') {
      fetchUsers();
    }
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const pRes = await api.get(`/projects/${id}`);
      setProject(pRes.data);
      const tRes = await api.get(`/tasks/project/${id}`);
      setTasks(tRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const uRes = await api.get('/auth/users');
      setUsers(uRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', {
        title: newTaskTitle,
        description: newTaskDesc,
        project: id,
        assignedTo: newTaskAssignee || null
      });
      setNewTaskTitle('');
      setNewTaskDesc('');
      setNewTaskAssignee('');
      fetchProjectDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating task');
    }
  };

  if (!project) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h1>{project.name}</h1>
      <p style={{color: 'var(--text-muted)', marginBottom: '2rem'}}>{project.description}</p>

      {user?.role === 'Admin' && (
        <div className="glass-panel" style={{marginBottom: '3rem'}}>
          <h3>Add New Task</h3>
          <form onSubmit={handleCreateTask} style={{display: 'flex', gap: '1rem', alignItems: 'flex-end', marginTop: '1rem'}}>
            <div className="input-group" style={{marginBottom: 0, flex: 1}}>
              <label>Title</label>
              <input type="text" className="input-field" value={newTaskTitle} onChange={e=>setNewTaskTitle(e.target.value)} required />
            </div>
            <div className="input-group" style={{marginBottom: 0, flex: 2}}>
              <label>Description</label>
              <input type="text" className="input-field" value={newTaskDesc} onChange={e=>setNewTaskDesc(e.target.value)} />
            </div>
            <div className="input-group" style={{marginBottom: 0, flex: 1}}>
              <label>Assign To</label>
              <select className="input-field" value={newTaskAssignee} onChange={e=>setNewTaskAssignee(e.target.value)}>
                <option value="">Unassigned</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn">Add Task</button>
          </form>
        </div>
      )}

      <h2>Project Tasks</h2>
      <div className="grid">
        {tasks.length === 0 ? <p>No tasks yet.</p> : tasks.map(t => (
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
            <div style={{fontSize: '0.875rem', color: 'var(--text-muted)'}}>
              Assigned: {t.assignedTo ? t.assignedTo.name : 'Unassigned'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDetails;
