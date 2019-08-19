import React, { Component } from "react";
import { connect } from "react-redux";
import { walletCreate } from "../../store/actions/postActions";
import { Redirect } from "react-router-dom";
import { firestoreConnect, dispatch } from "react-redux-firebase";
import { compose } from "redux";
import { passEncrypt, passDecrypt } from "../auth/passEncrypt.js";
import { getNewWallet } from "./BitIndex.js";

class GetWallet extends Component {
  state = {
    walletPIN: ""
  };

  handleChange = e => {
    this.setState({
      [e.target.id]: passEncrypt(e.target.value)
    });
    //console.log(this.state);
  };

  walletSubmit = (state, props) => {
    return function(e) {
      e.preventDefault();
      document.querySelector(".statusMsg").setAttribute("style", "opacity:1;");

      //console.log(state);
      //props.walletCreate(state);
      getNewWallet();
      const pinCreator = document.querySelector(".pinCreator");
      pinCreator.classList.toggle("pinCreatorHide");
      const mnemonicDisplay = document.querySelector(".mnemonicDisplay");
      mnemonicDisplay.classList.toggle("mnemonicDisplayHide");
    };
  };

  render() {
    const { auth, authError, user, walletPIN } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;

    return (
      <div>
        <div className="pinCreator">
          <h3>Set a PIN to create your wallet</h3>
          <div className="walletWidget">
            <form
              className="white"
              name="walletForm"
              onSubmit={this.walletSubmit(this.state, this.props)}
            >
              <div>
                <input
                  className="walletPIN"
                  type="text"
                  id="walletPIN"
                  placeholder="&nbsp;"
                  onChange={this.handleChange}
                />
              </div>
              <div>
                <button type="submit" className="btnPIN">
                  Create wallet »
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="mnemonicDisplay">
          <h3>Keep this passphrase safe!</h3>
          <div className="walletWidget">Hello</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const id = state.firebase.auth.uid;
  const users = state.firestore.data.users;
  //const user = state.firestore.data.users;
  const user = users ? users[id] : null;
  //const user = users[id];

  let walletPIN = "";
  let ncrement = "";
  user != null ? (walletPIN = user.walletPIN) : null;

  return {
    auth: state.firebase.auth,
    authError: state.auth.authError,
    user: user,
    walletPIN: walletPIN
  };
};

const mapDispatchToProps = dispatch => {
  return {
    walletCreate: wall => dispatch(walletCreate(wall))
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect(props => {
    const uid = props.auth.uid;
    return [{ collection: "users", doc: uid }];
  })
)(GetWallet);
