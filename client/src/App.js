import React, { useState, useEffect } from "react";
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
import HostingIntro from "./components/HostIntro";
import Hosting from "./components/Properties/Hosting";
import About from "./components/About";
import Contact from "./components/Contact";
import Profile from "./components/Profile";

// Main App Component
const App = ({ GK }) => {
  // Auth0 Login Redirect Handler
  const {
    loginWithRedirect, error, isAuthenticated,
    logout, user,
  } = useAuth0();

  // Image Rendering State
  const [images, setImages] = useState(null);
  useEffect(() => {
    fetch("/images")
    .then(res => res.json())
    .then(data => setImages(data.data))
    .catch(err => console.log("image fetch error:", err))
  }, [setImages])

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
        <Homepage images={images} />
      </Route>
      <Route exact path="/locations">
        <Locations
          PORT={PORT}
          GK={GK}
        />
      </Route>
      <Route path="/locations/:propertyId">
        <PropertyDetail
          isAuthenticated={isAuthenticated}
          user={user}
          PORT={PORT}
          GK={GK}
        />
      </Route>
      <Route path="/hosting">
        {isAuthenticated ?
        <Hosting
          loginWithRedirect={loginWithRedirect}
          isAuthenticated={isAuthenticated}
          user={user}
          PORT={PORT}
          images={images}
        /> :
        <HostingIntro
          loginWithRedirect={loginWithRedirect}
          images={images}
        />}
      </Route>

      {/* About/Contact */}
      <Route path="/about">
        <About images={images} />
      </Route>
      <Route path="/contact">
        <Contact
          isAuthenticated={isAuthenticated}
          user={user}
          images={images}
        />
      </Route>

      {/* Profile (Authenticated) */}
      <Route path="/profile">
        {isAuthenticated ?
        <Profile
          user={user}
          PORT={PORT}
          images={images}
        /> : <ErrorSplash />}
      </Route>

    </Switch>
    </BrowserRouter>
  );
}

export default App;
