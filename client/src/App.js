import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { PORT } from "./index";

// Components
import GlobalStyles from "./GlobalStyles";

// Main App Component
const App = () => {
  const [data, setData] = useState(""); // TESTING

  useEffect(() =>
    fetch(PORT)
    .then(res => res.json())
    .then(data => setData(data))
, [setData]);

  return (
    <BrowserRouter>
    <GlobalStyles />
    <Switch>
      <Route exact to="/">
        {data}
      </Route>
    </Switch>
    </BrowserRouter>
  );
}

export default App;
