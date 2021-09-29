import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { PORT } from "./index";
// Auth0 Context
import { useAuth0 } from "@auth0/auth0-react";

// Components
import GlobalStyles from "./GlobalStyles";
import Header from "./components/Header";
import ErrorSplash from "./components/Error";
import Homepage from "./components/Homepage";
import Locations from "./components/Properties";
import PropertyDetail from "./components/Properties/Property";
import Hosting from "./components/Properties/Hosting";
import About from "./components/About";
import Contact from "./components/Contact";
import Profile from "./components/Profile";

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

  console.log(data);

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
      {/* Homepage and Properties */}
      <Route exact path="/">
        <Homepage />
      </Route>
      <Route exact path="/locations">
        <Locations />
      </Route>
      <Route path="/locations/:propertyId">
        <PropertyDetail />
      </Route>
      <Route path="/hosting">
        <Hosting
          isAuthenticated={isAuthenticated}
          user={user}
        />
      </Route>

      {/* About/Contact */}
      <Route path="/about">
        <About />
      </Route>
      <Route path="/contact">
        <Contact
          isAuthenticated={isAuthenticated}
          user={user}
        />
      </Route>

      {/* Profile (Authenticated) */}
      <Route path="/profile">
        {isAuthenticated ?
        <Profile user={user} /> : <ErrorSplash />}
      </Route>

    </Switch>
    </BrowserRouter>
  );
}

export default App;
