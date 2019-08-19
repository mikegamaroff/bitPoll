import React from "react";

import ReactDOM from "react-dom";

import { Link, NavLink } from "react-router-dom";

class Home extends React.Component {
  render() {
    return (
      <div className="splashPanel">
        <div className="logoSplash">
          <img src="/images/logoFull.svg" />
        </div>
        <div className="splashIntroTextSmall">
          Hello, welcome to BitPoll, the first Bitcoin-powered polling system.
        </div>

        <div className="splashIntroText">Public consensus you can TRUST.</div>
        <NavLink to="/feed">
          <div className="enterBtn">To the polls!</div>
        </NavLink>
        <div className="bsvImgHolderSplash">
          <img src="/images/Satoshivision.png" />
          <div className="bsvImgCaption">Built on Bitcoin Satoshi Vision</div>
        </div>
        <button className="" id="phone-sign-in-recaptcha" />
      </div>
    );
  }
}
export default Home;
