import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const apiUrl = 'http://localhost:8080/todos';

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!form.title.trim()) {
      alert('Title is required');
      return;
    }

    setAdding(true);
    try {
      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form })
      });
      setForm({ title: '', description: '' });
      fetchTodos();
    } catch (error) {
      console.error('Error adding TODO:', error);
      alert('Failed to add TODO. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await fetchTodos();
    } catch (error) {
      console.error('Error deleting TODO:', error);
      alert('Failed to delete TODO. Please try again.');
    }
  };

  const toggleCompleted = async (todo) => {
    try {
      const updated = { ...todo, completed: !todo.completed };
      const res = await fetch(`${apiUrl}/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (!res.ok) throw new Error('Update failed');
      await fetchTodos();
    } catch (error) {
      console.error('Error updating TODO:', error);
      alert('Failed to update TODO. Please try again.');
    }
  };

  return (
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="display-5">✅ TODO App</h1>
          <p className="text-muted">Manage your tasks efficiently</p>
        </div>

        <div className="card shadow-sm p-4 mb-4">
          <h5 className="mb-3">Add New TODO</h5>
          <div className="row g-3">
            <div className="col-md-5">
              <input
                  className="form-control"
                  placeholder="Title"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="col-md-5">
              <input
                  className="form-control"
                  placeholder="Description"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="col-md-2 d-grid">
              <button
                  className="btn btn-primary"
                  onClick={addTodo}
                  disabled={adding}
              >
                {adding ? 'Adding...' : 'Add TODO'}
              </button>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>TODO List</h5>
          <button className="btn btn-outline-secondary btn-sm" onClick={fetchTodos}>
            🔁 Refresh
          </button>
        </div>

        {loading ? <p>Loading...</p> : (
            <ul className="list-group">
              {todos.length === 0 && <li className="list-group-item text-center">No TODOs found.</li>}
              {todos.map(todo => (
                  <li
                      className="list-group-item d-flex justify-content-between align-items-center"
                      key={todo.id}
                  >
                    <div className="d-flex align-items-center">
                      <input
                          type="checkbox"
                          className="form-check-input me-3"
                          checked={todo.completed}
                          onChange={() => toggleCompleted(todo)}
                          id={`todo-${todo.id}`}
                      />
                      <label htmlFor={`todo-${todo.id}`} className="form-check-label mb-0">
                        <strong>{todo.title}</strong>{' '}
                        <span className="text-muted">{todo.description}</span>{' '}
                        {todo.completed ? (
                            <span className="badge bg-success ms-2">Done</span>
                        ) : (
                            <span className="badge bg-warning text-dark ms-2">In Progress</span>
                        )}
                      </label>
                    </div>
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteTodo(todo.id)}
                    >
                      🗑 Delete
                    </button>
                  </li>
              ))}
            </ul>
        )}
      </div>
  );
}

export default App;