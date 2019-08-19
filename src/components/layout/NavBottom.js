import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { MdSearch } from "react-icons/md";
import { TiHomeOutline } from "react-icons/ti";
import { FaBell } from "react-icons/fa";

class NavBottom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //states
    };
  }

  render() {
    return (
      <div className="bottomNavContainer">
        <div className="navBottom">
          <div className="searchHolder" />
          <div className="navBottomContainer">
            <div className="navBottomIcons">
              <NavLink to="/feed">
                <img src="/images/icon-home.svg" />
              </NavLink>
            </div>
            <div className="navBottomIcons">
              <NavLink to="/wallet">
                <img src="/images/purse.svg" />
              </NavLink>
            </div>
            <div className="navBottomIcons">
              <NavLink to="/about">
                <img src="/images/open-book.svg" />
              </NavLink>
            </div>
            {!this.props.noCompose ? (
              <div>
                <div className="navBottomIconCompose">
                  <img
                    className="composeIcon"
                    id="compose"
                    src="/images/composeLogo.svg"
                    onClick={() => this.props.showPollCreate(true)}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default NavBottom;
///////
