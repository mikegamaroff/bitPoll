import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { walletCreate } from "../../store/actions/pollActions";

import GetWallet from "./GetWallet";
import { firestoreConnect, dispatch } from "react-redux-firebase";
import NavBar from "../layout/NavBar";
import NavBottom from "../layout/NavBottom";
import { compose } from "redux";

import { GoMention } from "react-icons/go";
import { MdErrorOutline, MdError, MdCheckCircle } from "react-icons/md";
import Loader from "react-loader-spinner";
import { TiUpload } from "react-icons/ti";

//this.forceUpdate();
let profBtn = "";
let userName = "";
let displayName = "";
let profBio = "";
let imgHash = "";
let imgHashPresent;
let firstRefresh = false;
class Wallet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imgUpdated: false
    };
  }
  componentDidUpdate() {
    if (!firstRefresh && this.props.user) {
      this.setState(
        {
          user: { ...this.state.user, prevUserName: this.props.user.userName }

          // addressDerived: result.addressDerived
        },
        () => {
          firstRefresh = true;
          console.log(this.state);
        }
      );
    }
  }

  handleChange = e => {
    console.log(
      e.target.value
        .split(" ")
        .join("")
        .toLowerCase()
    );
  };

  userInputUpdate = val => {
    this.setState({
      userInput: val,
      user: { ...this.state.user, prevUserName: this.state.user.userName }
    });
  };

  updateUser = user => {
    this.setState({
      user: user
      // addressDerived: result.addressDerived
    });
  };

  handleSubmit = (state, props, userInputUpdate, updateUser) => {
    return function(e) {
      e.preventDefault();
      e.stopPropagation();

      if (!state.imgUpdated && props.user.imgHash) {
        state.user.imgHash = props.user.imgHash;
      }
      console.log(state);
      props.profileSettings(state).then(r => {
        console.log(r);
        if (r == "userInputErr") {
          userInputUpdate(r);
        } else if (r == "updateSuccess") {
          userInputUpdate(r);
        } else if (r == "updateFail") {
          userInputUpdate(r);
        } else {
          updateUser(r);
        }
      });
    };
  };

  render() {
    const { auth, authError, user } = this.props;

    return (
      <div className="masterContainer">
        <NavBar />

        <NavBottom noCompose="true" />

        <div className="contentPanelList">
          <div className="settingsPanel">
            <div className="walletInfo">
              <GetWallet />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Wallet;
