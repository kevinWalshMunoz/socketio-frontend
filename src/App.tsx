import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

import { useState, useEffect } from 'react';

const socket = io({
  auth: {
    serverOffset: 0,
  },
  ackTimeout: 1000,
  retries: 3
});

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  const handleSumit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessages((prevMessages) => [...prevMessages, message]);
    socket.emit('message', message, uuidv4());
    setMessage('');
  }

  useEffect(() => {
    socket.on('message', (message: string, serverOffset: number) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      socket.auth.serverOffset = serverOffset;
    });

    return () => {
      socket.off();
    }
  }, []);

  return (
    <div className="App">
      <div>
        <form onSubmit={handleSumit}>
          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
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