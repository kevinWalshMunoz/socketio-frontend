import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

import { useState, useEffect } from "react";

const socket = io({
  auth: {
    serverOffset: 0,
  },
  ackTimeout: 10000,
  retries: 3,
});

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [user, setUser] = useState({
    id: 0,
    username: "",
    password: "",
  });
  const [isCreateUserVisible, setIsCreateUserVisible] = useState(true);
  const [isSignup, setIsSignup] = useState(true);

  function handleCreateUserSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    socket.emit("createUser", user);
  }

  const handleLoginUserSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("login", user);
    setUser({
      id: 0,
      username: "",
      password: "",
    })
  };


  function handleUserUpdate(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setUser((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSignup) {
      handleCreateUserSubmit(e);
    } else {
      handleLoginUserSubmit(e);
    }
  };

  const handleMessageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessages((prevMessages) => [...prevMessages, message]);
    socket.emit("message", message, uuidv4());
    setMessage("");
  };

  useEffect(() => {
    socket.on("message", (message: string, serverOffset: number) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      socket.auth.serverOffset = serverOffset;
    });

    socket.on("createUser", (id: number) => {
      setUser((prevUser) => ({
        ...prevUser,
        id,
      }));
      setIsCreateUserVisible(false);
    });

    socket.on("login", (id: number, username: string) => {
      setUser((prevUser) => ({
        ...prevUser,
        id,
        username,
      }));
      setIsCreateUserVisible(false);
    });

    return () => {
      socket.off();
    };
  }, []);

  return (
    <div className="App">
      {isCreateUserVisible ? (
        <div>
          <h1>{isSignup ? "Create User" : "Login"}</h1>
          <button onClick={() => setIsSignup(!isSignup)}>
            Switch to {isSignup ? "Login" : "Signup"}
          </button>
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              placeholder="Username"
              onChange={handleUserUpdate}
              name="username"
              value={user.username}
            />
            <input
              type="password"
              placeholder="Fake Password (not encripted)"
              onChange={handleUserUpdate}
              name="password"
              value={user.password}
            />
            <button type="submit">{isSignup ? "Create" : "Login"}</button>
          </form>
        </div>
      ) : (
        <h1>Welcome {user.username}</h1>
      )}

      <div>
        <form onSubmit={handleMessageSubmit}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
