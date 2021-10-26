import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import dotenv from "dotenv";
dotenv.config();

const { REACT_APP_GOOGLE_KEY, AUTH_ZERO_DOM, AUTH_ZERO_CLIENT } = process.env;

// Auth0Provider
import { Auth0Provider } from "@auth0/auth0-react";

// PORT number access from process.env or 4000 by default
export const PORT = `http://localhost:${process.env.PORT || 4000}`

// Main REACTDOM renderer via html file in /public
ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={AUTH_ZERO_DOM}
      clientId={AUTH_ZERO_CLIENT}
      redirectUri={window.location.origin}
    ><App GK={REACT_APP_GOOGLE_KEY} />
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);