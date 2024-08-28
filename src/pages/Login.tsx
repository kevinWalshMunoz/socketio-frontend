import { useState, useEffect } from 'react';
import io from 'socket.io-client';

import Signup from './Signup';

const socket = io();

function Login({ authenticatedUser }) {
  const [showSignup, setShowSignup] = useState(false);
  const [userLoginForm, setUserLoginForm] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    socket.on('login', (message, user) => {
      authenticatedUser(user);
    });
  }, [authenticatedUser]);

  const handleSignupClick = () => {
    setShowSignup(true);
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    socket.emit('login', userLoginForm);
  }

  function handleLoginFormChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUserLoginForm({ ...userLoginForm, [e.target.name]: e.target.value });
  }

  if (showSignup) {
    return <Signup authenticatedUser={authenticatedUser}/>;
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
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
        <button type='button' onClick={handleSignupClick}>
          Go to Sign Up
        </button>
      </form>
    </div>
  );
}

export default Login;
