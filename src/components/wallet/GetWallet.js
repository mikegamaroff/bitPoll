import React, { Component } from "react";
import { connect } from "react-redux";
import { walletCreate } from "../../store/actions/pollActions";
import { Redirect } from "react-router-dom";
import { firestoreConnect, dispatch } from "react-redux-firebase";
import { compose } from "redux";
import { passEncrypt, passDecrypt } from "./passEncrypt";
import {
  getKey,
  getNewWallet,
  getBalance,
  getPrice,
  findAddress
} from "./BitIndex";
import { MnemBreak, QrShow } from "./walletMethods";
import { FaEquals } from "react-icons/fa";
import Loader from "react-loader-spinner";
import AlertModal from "../../AlertModal";
import { IoMdClose, IoMdArrowBack } from "react-icons/io";
//localStorage.removeItem("userMnemonic");
let retrievedMnem = null;
let mnem;
let pin;
let pinCreation = document.getElementById("pinCreation");
let mnemonicDisplay = document.getElementById("mnemonicDisplay");
class GetWallet extends Component {
  state = {
    walletPIN: "",
    h: "",
    btn: "",
    mnem: "",
    mnemShow: "",
    qrShow: false,
    addrStr: "",
    pinShow: true,
    newWalletWarning: false,
    loading: false,
    invalidPin: false
  };

  mnemBreak = function(str) {
    var mnemArray = str.split(" ");
    var mnemonicWords = document.querySelector(".mnemonicWords");

    mnemArray
      .map(mnemWord => {
        var iDiv = document.createElement("div");
        iDiv.className = "mnemWord";
        iDiv.id = "mnemWord_" + mnemWord;
        iDiv.innerHTML = mnemWord;
        mnemonicWords.appendChild(iDiv);
      })
      .join(" ");
  }.bind(this);
  /* 
  panelToggle = function() {
    let pinCreation = document.getElementById("pinCreation");
    let mnemonicDisplay = document.getElementById("mnemonicDisplay");
    pinCreation.classList.toggle("pinCreatorShow");
    mnemonicDisplay.classList.toggle("hide");
  }.bind(this);
 */
  getWalletDetails = function() {
    /*  retrievedMnem = passDecrypt(localStorage.getItem("userMnemonic"));

    if (retrievedMnem != null) { 
    /// SHOW THE MNEMONIC
         this.setState({
        mnem: retrievedMnem,
        mnemShow: 1
      }); */
  }.bind(this);

  showMnem = e => {
    this.setState({
      mnemShow: 1,
      qrShow: ""
    });
  };
  showQR = e => {
    this.setState({
      qrShow: true,
      mnemShow: "",
      pinShow: false,
      existingWallet: false
    });
  };

  newWallet = e => {
    console.log(e);
    this.setState({ loading: true });
    this.walletCreation().then(([a]) => {
      // this.panelToggle();
      console.log("all loaded");
      this.keyGenerator();
      this.setState({
        newWalletWarning: false,
        existingMnem: false,
        newWallet: true,
        pinShow: false
      });
    });
  };

  viewReset = e => {
    //return Promise.all([getNewWallet()]);

    this.setState({
      existingWallet: false,
      btn: "Unlock Wallet",
      pinShow: true,
      qrShow: false,
      mnemShow: false
    });
  };

  existingWallet = e => {
    //return Promise.all([getNewWallet()]);

    //   if (!this.state.existingWallet) {
    //this.panelToggle();
    this.setState({
      existingWallet: true,
      btn: "Retrieve Wallet",
      pinShow: false,
      qrShow: false,
      mnemShow: false
    });
    //   }

    /*     else {
      this.setState({ existingWallet: false, btn: "Retrieve Wallet" });
    } */
  };

  walletCreation = e => {
    return Promise.all([getNewWallet()]);
  };

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
    console.log(e.target.value);
    console.log(passEncrypt(e.target.value));
  };

  bsvExchange = (price, balance) => {
    return Promise.all(["$" + (price / (1 / balance)).toFixed(2)]);
  };

  keyGenerator = () => {
    if (this.state.existingMnem) {
      console.log(this.state.existingMnem);
      localStorage.removeItem("userMnemonic");

      localStorage.setItem(
        "userMnemonic",
        passEncrypt(this.state.existingMnem)
      );

      mnem = this.state.existingMnem;
      pin = this.state.walletPIN;
    } else if (this.state.newWallet) {
      mnem = passDecrypt(localStorage.getItem("userMnemonic"));
      pin = this.state.walletPIN;
      this.setState({ newWallet: false });
    } else {
      mnem = passDecrypt(localStorage.getItem("userMnemonic"));
      // pin = passDecrypt(this.props.profile.walletPIN);
      pin = this.state.walletPIN;
    }

    getKey(mnem, pin, 1).then(result => {
      this.setState(
        {
          addressDerived: result.addressDerived
          // addressDerived: result.addressDerived
        },
        () => {
          // this.props.walletCreate(this.state);
          console.log(result.addressDerived);
          getBalance(result.addressDerived).then(response => {
            console.log(response);
            getPrice().then(doc => {
              let bsvPrice = doc.ticker.price;
              let currentBalance = response.balance.toFixed(4);
              this.bsvExchange(bsvPrice, response.balance).then(doc => {
                this.setState({
                  dollarBalance: doc,
                  unconfirmedBalance: response.unconfirmedBalance,
                  currentBalance: currentBalance + " BSV",
                  mnem: passDecrypt(localStorage.getItem("userMnemonic")),
                  addrStr: response.addrStr
                });
                this.showQR();
                this.setState({ loading: false });
              });
              /*     this.setState({
                bsvPrice: bsvPrice
              }); */
            });
          });
        }
      );
    });
  };

  existingWalletSubmit = (state, props) => {
    return function(e) {
      e.preventDefault();
      this.setState({ loading: true });

      this.keyGenerator();
    }.bind(this);
  };

  walletSubmit = (state, props) => {
    return function(e) {
      e.preventDefault();
      this.setState({ loading: true });
      retrievedMnem = passDecrypt(localStorage.getItem("userMnemonic"));

      // PIN CHECK

      if (retrievedMnem == undefined) {
        this.walletCreation().then(([a]) => {
          // this.panelToggle();
          console.log("all loaded");
          this.keyGenerator();
        });
      } else {
        // if (state.walletPIN == passDecrypt(props.user.walletPIN)) {
        // this.panelToggle();
        this.keyGenerator();
        //  } else {
        //   this.setState({ invalidPin: true, loading: false });
        // PIN FAILED
        //   console.log("INVALID PIN");
        // }
      }

      // stuff to do if there is no mnemonic
    }.bind(this);
  };

  componentDidMount() {
    this._isMounted = true;
    let pinCreation = document.getElementById("pinCreation");
    let mnemonicDisplay = document.getElementById("mnemonicDisplay");
    retrievedMnem = passDecrypt(localStorage.getItem("userMnemonic"));

    if (retrievedMnem != undefined) {
      if (this._isMounted) {
        this.setState({
          h: "Unlock your wallet",
          btn: "Unlock »"
        });
      }
    } else {
      if (this._isMounted) {
        this.setState({
          h: "Set a PIN to create wallet",
          btn: "Create Wallet »"
        });
      }
    }
    // pinCreation.classList.toggle("pinCreatorShow");
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    if (pinCreation != undefined) {
      //  pinCreation.classList.toggle("pinCreatorShow");
    }

    return (
      <div>
        {this.state.loading ? (
          <div className="loadBlack">
            <Loader type="Puff" color="white" height={50} width={50} />
          </div>
        ) : null}
        {this.state.invalidPin ? (
          <AlertModal>
            <div className="masterContainerBlack">
              <div className="modalClose">
                <IoMdClose
                  onClick={e => this.setState({ invalidPin: false })}
                />
              </div>
              <div className="walletWarningPic">
                <label htmlFor="image">
                  <img src="/images/warning.svg" />
                </label>
              </div>

              <div className="modalContent">
                <div className="priceWarningTitleDisplay">
                  <br />
                  <h3>Invalid PIN</h3>
                  <p>
                    Your pin is very important. It is actually part of your
                    wallet address hash, and you cannot recover your wallet
                    without it.
                  </p>
                </div>

                <button
                  className="priceWarningBtn"
                  id="confirm"
                  onClick={() => this.setState({ invalidPin: false })}
                >
                  Try again
                </button>
                <div class="spacer" />
              </div>
            </div>
          </AlertModal>
        ) : null}

        {this.state.newWalletWarning ? (
          <AlertModal>
            <div className="masterContainerBlack">
              <div className="modalClose">
                <IoMdClose
                  onClick={e => this.setState({ newWalletWarning: false })}
                />
              </div>
              <div className="walletWarningPic">
                <label htmlFor="image">
                  <img src="/images/warning.svg" />
                </label>
              </div>

              <div className="modalContent">
                <div className="priceWarningTitleDisplay">
                  <p>
                    This will replace any existing wallets with a new one. You
                    can always recover an old wallet with your secret
                    passphrase.
                  </p>
                  <h3>Choose a PIN</h3>
                  <input
                    className="walletPIN"
                    type="text"
                    id="walletPIN"
                    placeholder="&nbsp;"
                    onChange={this.handleChange}
                  />
                </div>

                <button
                  className="priceWarningBtn"
                  id="confirm"
                  onClick={() => this.newWallet()}
                >
                  Got it
                </button>
              </div>
            </div>
          </AlertModal>
        ) : null}

        <div className="mnemonicDisplay">
          <div className="walletTabContainer">
            <div
              className="walletTab"
              id="walletNew"
              onClick={e => this.setState({ newWalletWarning: true })}
            >
              Create wallet
            </div>
            <div
              className="walletTab"
              id="walletExisting"
              onClick={this.existingWallet}
            >
              Connect another
            </div>
          </div>
          <div className="walletWidget" id="mnemonicDisplay">
            {this.state.pinShow ? (
              <div>
                <h3>{this.state.h}</h3>
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
                      {this.state.btn}
                    </button>
                  </div>
                </form>
              </div>
            ) : null}

            {this.state.mnemShow ? (
              <div>
                <MnemBreak str={this.state.mnem} togSet={this.showQR} />
              </div>
            ) : null}
            {this.state.qrShow ? (
              <div>
                <QrShow
                  str={this.state.mnem}
                  togSet={this.showMnem}
                  addrStr={this.state.addrStr}
                />
                {this.state.currentBalance ? (
                  <div className="balanceDisplay" id="balanceDisplay">
                    <div className="balance">{this.state.currentBalance}</div>
                    <div>
                      <FaEquals color="aliceBlue" />
                    </div>
                    <div className="balance">{this.state.dollarBalance}</div>
                  </div>
                ) : null}
                {this.state.unconfirmedBalance > 0 ? (
                  <div className="unconfirmedBalance">
                    Unconfirmed: {this.state.unconfirmedBalance}BSV
                  </div>
                ) : this.state.unconfirmedBalance < 0 ? (
                  <div className="unconfirmedBalanceRed">
                    Unconfirmed: {this.state.unconfirmedBalance}BSV
                  </div>
                ) : null}
                <div className="spacer" />
              </div>
            ) : null}

            {this.state.existingWallet ? (
              <div className="existingWalletForm">
                <div className="walletBackBtn" onClick={this.viewReset}>
                  <IoMdArrowBack color="darkgreen" size={30} />
                </div>
                <form
                  className="white"
                  name="existingWalletForm"
                  onSubmit={this.existingWalletSubmit(this.state, this.props)}
                >
                  <h3>Enter your 12 word phrase</h3>
                  <p>* Separate with spaces</p>
                  <div>
                    <textarea
                      className="mnemInp"
                      rows="14"
                      cols="10"
                      wrap="soft"
                      id="existingMnem"
                      placeholder="&nbsp;"
                      onChange={this.handleChange}
                    />
                  </div>
                  <p>Enter your PIN</p>
                  <input
                    type="text"
                    className="existingPin"
                    id="walletPIN"
                    onChange={this.handleChange}
                  />
                  <div>
                    <button type="submit" className="btnPIN">
                      {this.state.btn}
                    </button>
                  </div>
                </form>
              </div>
            ) : null}
          </div>
        </div>
        <div className="bsvImageHolder">
          <img src="/images/bsv.png" />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    //  walletCreate: wall => dispatch(walletCreate(wall))
    // resetTotalPosts: reset => dispatch(resetTotalPosts(reset))
  };
};

export default compose(
  connect(
    null,
    mapDispatchToProps
  )
)(GetWallet);
