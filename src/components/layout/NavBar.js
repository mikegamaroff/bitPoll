import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import Links from "./Links";
import { connect } from "react-redux";
import { compose } from "redux";

import { firestoreConnect } from "react-redux-firebase";
import { FaLeaf } from "react-icons/ti";

let profBtn = "";
let imgHash = "";
let userName = "";
let refreshOnce = false;
class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstRefresh: true,
      navColor: "navGeneric"
    };
  }

  render() {
    const { auth, authError, user, profileID, profUserName } = this.props;

    let opened = false;
    var openMenu = () => {
      const nav = document.querySelector(".nav-links");
      const burger = document.querySelector(".burger");
      const navLinks = document.querySelectorAll(".nav-links li");

      if (!opened) {
        navLinks.forEach((link, index) => {
          link.style.animation = `navLinkFade 0.3s ease forwards ${index / 7 +
            0.3}s`;
        });
        opened = true;
      } else {
        navLinks.forEach(link => {
          link.style.animation = `navLinkFadeBack 1s ease forwards ${0.5}s`;
        });
        opened = false;
      }
      console.log("Opened " + opened);
      // Toggle nav
      nav.classList.toggle("nav-active");
      burger.classList.toggle("toggle");
      nav.addEventListener("transitionend", function(e) {
        console.log("finished");
      });
    };

    return (
      <nav id={this.state.navColor}>
        <div className="profPic">
          <label htmlFor="image">
            <img src="/images/logoFull.svg" />
          </label>
        </div>
        <div className="sideNav" />
        <div className="burger" onClick={openMenu}>
          <div className="line1"> </div>
          <div className="line2"> </div>
          <div className="line3"> </div>
        </div>
        <ul className="nav-links" id="navlinker">
          <Links />
        </ul>
      </nav>
    );
  }
}

export default NavBar;
