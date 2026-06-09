import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome{user ? `, ${user.name}` : ''}!</h1>
      <p>Your MERN stack application is running.</p>
    </div>
  );
}
