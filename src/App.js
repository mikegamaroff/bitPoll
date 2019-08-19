import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Feed from "./components/feed/Feed";
import Wallet from "./components/wallet/Wallet";
import Home from "./Home.js";
import About from "./About.js";
//<button onClick={logout}>Logout</button>

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/wallet" component={Wallet} />
            <Route path="/about" component={About} />
            <Route path="/feed" component={Feed} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
