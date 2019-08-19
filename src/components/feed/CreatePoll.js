import React, { Component } from "react";
import { connect } from "react-redux";
import { pollCreate } from "../../store/actions/pollActions";
import { MdErrorOutline, MdError, MdCheckCircle } from "react-icons/md";

import { Redirect, NavLink } from "react-router-dom";
import Loader from "react-loader-spinner";
import { passDecrypt } from "../wallet/passEncrypt";
import { IoMdClose } from "react-icons/io";
import AlertModal from "../../AlertModal";
import Alert from "../Alert";
import ReactDOM from "react-dom";

import {
  getTx,
  getPrice,
  priceSheet,
  bsvToDollar,
  getKey,
  getUTXO,
  getBROADCAST,
  idMaker
} from "../wallet/BitIndex";

import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";

import moment from "moment";
let socialPost = {
  imgHash: null,
  content: ""
};
let charLimitText;
class Comment extends Component {
  state = {
    txID: "",
    firstRefresh: false,
    commentBox: false,
    charLimitColor: "black",
    loading: false,
    noFunds: false,
    formShow: true,
    priceWarning: false,
    goToWallet: false
  };
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    getPrice()
      .then(doc => {
        let bsvPrice = doc.ticker.price;

        this.setState({
          bsvPrice: bsvPrice
        });
      })

      .then(() => {
        priceSheet()
          .then(price => {
            //// CONVERSION FROM USD TO BSV

            let divisible = this.state.bsvPrice / price.pricePoll;
            let convertedBSV = 1 / divisible;

            let convertedBSVtoFixed = convertedBSV.toFixed(4);
            let pollPriceToString = price.pricePoll.toLocaleString("en-US", {
              style: "currency",
              currency: "USD"
            });
            this.setState({
              pricePoll: pollPriceToString,
              convertedBSV: convertedBSV,
              convertedBSVtoFixed: convertedBSVtoFixed
            });
          })

          .then(() => {
            // VALUES ACQUIRED - PROCEED
            console.log(this.state.pricePoll + " === " + this.state.bsvPrice);
          });
      });
  }
  alertOpen = val => {
    this.setState({ noFunds: val });
  };
  alertAction = val => {
    this.alertOpen(false);
    this.setState({ goToWallet: true });
  };
  preCheck = val => {
    let id =
      Date.now().toString(36) +
      Math.random()
        .toString(36)
        .substr(2);

    this.setState({
      priceWarning: true,
      formShow: false,
      pollID: id
    });
  };

  pollSubmit = () => {
    /* bsvPrice: "132.44438255"
    charLimitColor: "black"
    convertedBSV: 0.00151006781978463
    convertedBSVtoFixed: "0.0015"
    firstRefresh: false
    formShow: true
    loading: false
    noFunds: false
    option1: "Your mom"
    option2: "His mom"
    option3: "Her dad"
    pollQuestion: "Poll question arse"
    pricePoll: "$0.20"
    priceWarning: false
    title: "Tile arse"
    txID: "" */

    let bsv = this.state.convertedBSV;

    let opReturn =
      "BitPoll Create: " +
      this.state.pollQuestion +
      "  AND  ID:" +
      this.state.pollID;
    this.setState({ loading: true });

    const retrievedMnem = passDecrypt(localStorage.getItem("userMnemonic"));

    //  NEED TO KNOW WHO TO PAY
    getKey(retrievedMnem, this.state.walletPIN, 1).then(result => {
      this.setState({
        //addressDerived: result.addressDerived
        addressDerived: result.addressDerived
      });

      /// START POLL
      getUTXO(
        opReturn, // OP_RETURN
        result.pkeyDerived, // from private key
        result.addressDerived, // from address
        false, // pay to user or make false
        bsv // amount paid
      )
        .then(stuff => {
          let body = stuff[0];
          let fee = stuff[1];
          if (stuff == "NoFunds") {
            this.setState({
              noFunds: true,
              loading: false
            });
          } else {
            if (body) {
              getBROADCAST(body).then(body => {
                if (body) {
                  this.setState(prevState => ({
                    txID: body,
                    fee: fee
                  }));
                  /// CREATE POLL
                  this.props.pollCreate(this.state).then(result => {
                    // Go and refresh the Like count on the post
                    //console.log({postid: this.props.postid, postuid: this.props.postuid, displayName: this.props. });
                    this.props.showPollCreate(false);
                  });
                } else {
                  console.log(
                    "BROADCASTING ERROR. PROBABLY Failed - StatusCodeError: 400 - 64: too-long-mempool-chain"
                  );
                }
              });
            } else {
              console.log("TRANSACTION DIDN'T HAPPEN");
            }
          }
        })

        .catch(err => {
          // statusMsg.innerHTML = err;
          // statusMsg.style.color = "red";
          //dispatch({ type: "COMMENT_FAIL", err });
          console.log(err);
        });
    });
  };

  charLimit = e => {
    charLimitText = document.querySelector(".charLimit");
    charLimitText.innerHTML = "Characters: " + (180 - e.length);
  };

  charChange = e => {
    console.log(e.target.value);
    this.setState({
      comment: e.target.value
    });
    this.charLimit(e.target.value);

    if (e.target.value.length > 160) {
      this.setState({
        charLimitColor: "charRed"
      });
    } else {
      this.setState({
        charLimitColor: "charBlack"
      });
    }
  };

  render() {
    const {
      auth,
      profile,
      posts,
      id,
      postuid,
      postid,
      user,
      posthash,
      post,
      postcontent,
      refresh
    } = this.props;

    //const user = users[postuid];
    // profile = current user
    // user = post owner
    // post = post details

    if (this.state.goToWallet) return <Redirect to="/wallet" />;

    return (
      <div>
        {this.state.loading ? (
          <div className="masterContainerBlack">
            <div className="loaderCenter">
              <Loader type="Puff" color="#9BB327" height={60} width={60} />
            </div>
          </div>
        ) : null}

        {this.state.noFunds ? (
          <AlertModal>
            <Alert
              alertOpen={this.alertOpen}
              alertAction={this.alertAction}
              h3={"Insufficient Funds"}
              bodyCopy={
                "When you vote or create a bitPoll, you need to load funds into your BSV wallet."
              }
              buttonLabel={"Go to wallet"}
            />
          </AlertModal>
        ) : null}

        {this.state.priceWarning ? (
          <AlertModal>
            <div className="masterContainerBlack">
              <div className="modalClose">
                <IoMdClose onClick={e => this.props.showPollCreate(false)} />
              </div>
              <div className="priceWarningPic">
                <label htmlFor="image">
                  <img src="/images/purse.svg" />
                </label>
              </div>
              <div className="modalContent">
                <div className="priceWarningTitleDisplay">
                  <h2>Fork out</h2>
                  <p>
                    You pay to create this poll, but people pay YOU to vote on
                    it.
                  </p>
                  <div className="donationAmount">
                    {this.state.convertedBSVtoFixed}BSV = {this.state.pricePoll}
                  </div>
                  <div className="finePrint">* Transaction fee included</div>
                  <h3>Enter PIN to authorize</h3>
                  <div>
                    <input
                      className="walletPIN"
                      type="text"
                      id="walletPIN"
                      placeholder="&nbsp;"
                      onChange={e =>
                        this.setState({
                          walletPIN: e.target.value
                        })
                      }
                    />
                  </div>

                  <div className="priceWarningButtonContainer">
                    <button
                      className="priceWarningBtn"
                      id="cancel"
                      onClick={e => this.setState({ priceWarning: false })}
                    >
                      Cancel
                    </button>
                    <button
                      className="priceWarningBtn"
                      id="confirm"
                      onClick={() => this.pollSubmit()}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </AlertModal>
        ) : null}

        {this.state.formShow ? (
          <div className="masterContainerBlack">
            <div className="modalClose">
              <IoMdClose onClick={e => this.props.showPollCreate(false)} />
            </div>
            <div className="priceWarningPic" id="imgColorFill">
              <label htmlFor="image">
                <img src="/images/statement.svg" />
              </label>
            </div>
            <div className="modalContent">
              <div className="priceWarningTitleDisplay">
                <form className="white">
                  <div className="spacer" />
                  <div>
                    <textarea
                      type="text"
                      id="pollQuestion"
                      className="commentInput"
                      placeholder="Poll question"
                      onChange={e =>
                        this.setState({
                          pollQuestion: e.target.value
                        })
                      }
                      /*  defaultValue={"default value"} */
                    />

                    <span className="border" />
                  </div>
                  <div className="spacer" />
                  <div>
                    <label htmlFor="option1" className="userName">
                      <input
                        type="text"
                        id="option1"
                        placeholder="&nbsp;"
                        onChange={e =>
                          this.setState({
                            option1: e.target.value
                          })
                        }
                        /*      defaultValue={"default value"} */
                      />

                      <span className="label">Option 1</span>
                      <span className="border" />
                    </label>
                  </div>
                  <div className="spacer" />

                  <div>
                    <label htmlFor="option2" className="userName">
                      <input
                        rows="4"
                        id="option2"
                        placeholder="&nbsp;"
                        onChange={e =>
                          this.setState({
                            option2: e.target.value
                          })
                        }
                        /*     defaultValue={"default value"} */
                      />

                      <span className="label">Option 2</span>
                      <span className="border" />
                    </label>
                  </div>
                  <div className="spacer" />

                  <div>
                    <label htmlFor="option3" className="userName">
                      <input
                        rows="4"
                        id="option3"
                        placeholder="&nbsp;"
                        onChange={e =>
                          this.setState({
                            option3: e.target.value
                          })
                        }
                        /*     defaultValue={"default value"} */
                      />

                      <span className="label">Option 3</span>
                      <span className="border" />
                    </label>
                  </div>
                  <div className="profileStatus">
                    {this.state.userInput == "updateSuccess" ? (
                      <div className="formStatus">
                        <p id={this.state.userInput}>Profile updated!</p>
                        <MdCheckCircle color="green" size={20} />
                      </div>
                    ) : this.state.userInput == "updateFail" ? (
                      <div className="formStatus">
                        <p id={this.state.userInput}>Update error!</p>
                        <MdError color="red" size={20} />
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <button
                      onClick={e => this.preCheck()}
                      type="submit"
                      className="priceWarningBtn"
                      id="confirm"
                    >
                      Create poll »
                    </button>
                  </div>
                </form>
              </div>

              <div className="spacer" />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => {
  // const posts = state.firestore.data.posts;

  //const user = state.firestore.data.chosenUser;

  //const users = state.firestore.data.users ? users[id] : null;
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile
    // posts: posts
    // user: user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    pollCreate: creds => dispatch(pollCreate(creds))
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Comment);
