import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// Auth0Provider
import { Auth0Provider } from "@auth0/auth0-react";
// PORT number access from process.env or 4000 by default
export const PORT = `http://localhost:${process.env.PORT || 4000}`

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-abh4ezl1.us.auth0.com"
      clientId="vZztKT6TjPBIE7wrnrLMKvCXUWu7VByV"
      redirectUri={window.location.origin}
    ><App />
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);