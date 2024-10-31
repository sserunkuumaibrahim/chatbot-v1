import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000')
      .then((response: AxiosResponse) => setMessage(response.data.message))
      .catch((error: Error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="App">
      <h1>ChatBot SaaS Platform</h1>
      <p>Message from backend: {message}</p>
    </div>
  );
}

export default App;
