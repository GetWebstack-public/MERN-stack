import React, { useEffect, useState } from 'react';
import { getTodos, createTodo, toggleTodo, deleteTodo } from '../api/todos';

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTodos()
      .then(({ data }) => setTodos(data))
      .catch(() => setError('Failed to load todos'))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      const { data } = await createTodo(input.trim());
      setTodos([data, ...todos]);
      setInput('');
    } catch {
      setError('Failed to add todo');
    }
  };

  const handleToggle = async (id) => {
    try {
      const { data } = await toggleTodo(id);
      setTodos(todos.map((t) => (t._id === id ? data : t)));
    } catch {
      setError('Failed to update todo');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((t) => t._id !== id));
    } catch {
      setError('Failed to delete todo');
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: '2rem auto', padding: '0 1rem' }}>
      <h2>Todos</h2>

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button type="submit" disabled={!input.trim()}>Add</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : todos.length === 0 ? (
        <p style={{ color: '#888' }}>No tasks yet. Add one above!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {todos.map((todo) => (
            <li
              key={todo._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.6rem 0',
                borderBottom: '1px solid #eee',
              }}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo._id)}
              />
              <span
                style={{
                  flex: 1,
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? '#aaa' : 'inherit',
                }}
              >
                {todo.title}
              </span>
              <button
                onClick={() => handleDelete(todo._id)}
                style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
