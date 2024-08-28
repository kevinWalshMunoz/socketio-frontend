import { useState, useEffect } from 'react';
import io from 'socket.io-client';

import Login from './Login';

const socket = io();

function Signup({ authenticatedUser }) {
  const [showLogin, setShowLogin] = useState(false);
  const [userCreateForm, setUserCreateForm] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    socket.on('createUser', (data) => {
      authenticatedUser(data);
    });
  }, [authenticatedUser]);

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUserCreateForm({ ...userCreateForm, [e.target.name]: e.target.value });
  }

  function handleCreateUserSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    socket.emit('createUser', userCreateForm);
  }

  const handleSignupClick = () => {
    setShowLogin(true);
  };

  if (showLogin) {
    return <Login authenticatedUser={authenticatedUser} />;
  }
  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleCreateUserSubmit}>
        <input
          name='username'
          value={userCreateForm.username}
          type='text'
          placeholder='Username'
          onChange={handleFormChange}
        />
        <input
          name='password'
          value={userCreateForm.password}
          type='password'
          placeholder='Password'
          onChange={handleFormChange}
        />
        <button type='submit'>Signup</button>
        <button onClick={handleSignupClick}>Go to Login</button>
      </form>
    </div>
  );
}

export default Signup;
