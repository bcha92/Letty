import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { PORT, REACT_APP_GOOGLE_KEY } from "./index";

// Auth0 Context
import { useAuth0 } from "@auth0/auth0-react";

// Components
import GlobalStyles from "./GlobalStyles";
import Header from "./components/Header";
import ErrorSplash from "./components/Error";
import Homepage from "./components/Homepage";
import Locations from "./components/Properties";
import PropertyDetail from "./components/Properties/Property";
import HostingIntro from "./components/HostIntro";
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
        <Locations
          PORT={PORT}
          GK={REACT_APP_GOOGLE_KEY}
        />
      </Route>
      <Route path="/locations/:propertyId">
        <PropertyDetail
          isAuthenticated={isAuthenticated}
          user={user}
          PORT={PORT}
          GK={REACT_APP_GOOGLE_KEY}
        />
      </Route>
      <Route path="/hosting">
        {isAuthenticated ? <Hosting
          loginWithRedirect={loginWithRedirect}
          isAuthenticated={isAuthenticated}
          user={user}
          PORT={PORT}
        /> : <HostingIntro loginWithRedirect={loginWithRedirect} /> }
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
        <Profile
          user={user}
          PORT={PORT}
        /> : <ErrorSplash />}
      </Route>

    </Switch>
    </BrowserRouter>
  );
}

export default App;
