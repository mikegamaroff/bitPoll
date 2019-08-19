import React from "react";
import { logout } from "./Login";
import MyAccount from "./MyAccount";
//import ImageUpload from "./ImageUpload";

import ReactDOM from "react-dom";
/* import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  NavLink,
  Switch
} from "react-router-dom"; */

var goToMyAccount = function() {
  var element = document.getElementById("user-signed-out");
  ReactDOM.render(<MyAccount />, element);
};

export default class Example extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  //this.state.isOpen
  //this.toggle
  //onClick={logout}
  componentDidMount() {
    var menu = document.getElementById("menu");
    var nav = document.getElementById("nav");
    var exit = document.getElementById("exit");

    menu.addEventListener("click", function(e) {
      nav.classList.toggle("hide-mobile");
      e.preventDefault();
    });

    exit.addEventListener("click", function(e) {
      nav.classList.toggle("hide-mobile");
      e.preventDefault();
    });
  }
  render() {
    return (
      <nav>
        <div className="header">
          <div>
            <img src="images/ppic.png" className="ppic" />
          </div>
          <a href="#">
            <img
              src="images/icons/list-button.svg"
              alt="toggle menu"
              id="menu"
              className="menu"
            />
          </a>
          <ul className="hide-mobile" id="nav">
            <li id="exit" className="exit-btn">
              <img src="images/icons/close-browser.svg" alt="exit menu" />
            </li>
            <li>
              <a href="#" onClick={goToMyAccount}>
                My Account
              </a>
            </li>
            <li>
              <a href="#" onClick={logout}>
                {" "}
                Logout
              </a>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}
