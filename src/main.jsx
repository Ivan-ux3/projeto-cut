// Em src/main.jsx ou src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Certifique-se de importar seu App.jsx

// Pega o elemento 'root' do index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza seu aplicativo
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);