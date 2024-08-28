import './App.css';

import Login from './pages/Login';
import Home from './pages/Home';

import { useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({
    username: '',
    id: '',
  });

  function authenticatedUser(data: { username: string; id: string }) {
    setUser(data);
    setIsAuthenticated(true);
  }

  return (
    <>
      <div>
        {isAuthenticated ? (
          <Home user={user} />
        ) : (
          <Login authenticatedUser={authenticatedUser} />
        )}
      </div>
    </>
  );
}

export default App;
