import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { PORT } from "./index";
// Auth0 Context
import { useAuth0 } from "@auth0/auth0-react";

// Components
import GlobalStyles from "./GlobalStyles";
import Header from "./components/Header";
import Homepage from "./components/Homepage";
import About from "./components/About";
import Contact from "./components/Contact";

// Main App Component
const App = () => {
  // Auth0 Login Redirect Handler
  const {
    loginWithRedirect, error, isAuthenticated,
    logout, user,// isLoading,
  } = useAuth0();
  
  const [data, setData] = useState(""); // TESTING

  useEffect(() =>
    fetch(PORT)
    .then(res => res.json())
    .then(data => setData(data))
, [setData]);

  return (
    <BrowserRouter>
    <GlobalStyles />
    <Header
      loginWithRedirect={loginWithRedirect}
      isAuthenticated={isAuthenticated}
      error={error}
      logout={logout}
      user={user}
    />
    <Switch>
      <Route exact path="/">
        <Homepage />{data}
      </Route>
      <Route path="/about">
        <About />
      </Route>
      <Route path="/contact">
        <Contact
          isAuthenticated={isAuthenticated}
          user={user}
        />
      </Route>
    </Switch>
    </BrowserRouter>
  );
}

export default App;
