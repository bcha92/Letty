import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// PORT number access from process.env or 4000 by default
export const PORT = `http://localhost:${process.env.PORT || 4000}`

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);