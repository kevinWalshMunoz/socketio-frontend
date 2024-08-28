import './App.css';
import io from 'socket.io-client';

import { useState, useEffect } from 'react';

const socket = io();

function App() {
  const [userCreateForm, setUserCreateForm] = useState({
    username: '',
    password: '',
  });

  const [userLoginForm, setUserLoginForm] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    socket.on('createUser', (data) => {
      console.log(data);
    });

    socket.on('login', (data) => {
      console.log(data);
    });
  }, []);

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUserCreateForm({ ...userCreateForm, [e.target.name]: e.target.value });
  }

  function handleLoginFormChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUserLoginForm({ ...userLoginForm, [e.target.name]: e.target.value });
  }

  function handleCreateUserSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    socket.emit('createUser', userCreateForm);
  }

  function handleLoginSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    socket.emit('login', userLoginForm);
  }

  return (
    <>
      <div>
        <h1>Welcome</h1>
        <h2>Sign Up</h2>
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
          <button type='submit'>Sign Up</button>
        </form>
        <h2>Sign In</h2>
        <form onSubmit={handleLoginSubmit}>
          <input
            type='text'
            name='username'
            value={userLoginForm.username}
            placeholder='Username'
            onChange={handleLoginFormChange}
          />
          <input
            type='password'
            name='password'
            value={userLoginForm.password}
            placeholder='Password'
            onChange={handleLoginFormChange}
          />
          <button type='submit'>Sign In</button>
        </form>
      </div>
    </>
  );
}

export default App;
