import React, { Component } from "react";
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
import { IoMdClose } from "react-icons/io";
import AlertModal from "../../AlertModal";
import Loader from "react-loader-spinner";
import { passDecrypt } from "../wallet/passEncrypt";
import Alert from "../Alert";
import { Redirect } from "react-router-dom";
let pollObj;
let pollArray;
let pollVotes;
let options;

class Poll extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //states
      showCreate: false,
      firstRefresh: false,
      loading: false,
      noFunds: false,
      formShow: true,
      priceWarning: false,
      goToWallet: false
    };
  }

  getPollData = () => {
    this.props.getOptions(this.props.poll.id).then(option => {
      console.log(option);
      this.setState({ option: option });
    });
  };

  componentDidUpdate() {
    if (this.state.firstRefresh) {
      this.getPollData();
      this.setState({ firstRefresh: false });
    }

    /*  if (
      previousState.option &&
      previousState.option !== previousProps.options
    ) {
      this.getPollData();
    } */
  }

  componentDidMount() {
    if (this.props.getOptions) {
      this.getPollData();
    }
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

            let divisible = this.state.bsvPrice / price.priceVote;
            let convertedBSV = 1 / divisible;

            let convertedBSVtoFixed = convertedBSV.toFixed(4);
            let pollPriceToString = price.priceVote.toLocaleString("en-US", {
              style: "currency",
              currency: "USD"
            });
            this.setState({
              priceVote: pollPriceToString,
              convertedBSV: convertedBSV,
              convertedBSVtoFixed: convertedBSVtoFixed
            });
          })

          .then(() => {
            // VALUES ACQUIRED - PROCEED
            console.log(this.state.priceVote + " === " + this.state.bsvPrice);
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
  preCheck = (id, record, votes, ownerWallet, e) => {
    console.log(e.target.id);

    this.setState({
      priceWarning: true,
      pollID: id,
      recordName: record,
      votesCount: votes,
      ownerWallet: ownerWallet
    });

    document.getElementById(e.target.id).classList.toggle("pollButtonOn");
  };

  /*   voteCall = (id, record, votes) => {
    console.log(id + " -- " + record + " -- " + votes);
    this.props.vote([id, record, votes]).then(option => {
      this.setState({ firstRefresh: true });
    });
  };
 */
  voteSubmit = () => {
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
    priceVote: "$0.20"
    priceWarning: false
    title: "Tile arse"
    txID: "" */

    let bsv = this.state.convertedBSV;

    let opReturn =
      "BitPoll Vote: " +
      this.state.recordName +
      "  AND  ID:" +
      this.state.pollID;
    this.setState({ loading: true, priceWarning: false });

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
        this.state.ownerWallet, // pay to user or make false
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

                  this.props
                    .vote([
                      this.state.pollID,
                      this.state.recordName,
                      this.state.votesCount,
                      this.state.txID
                    ])
                    .then(option => {
                      this.setState({ firstRefresh: true, loading: false });
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

  render() {
    const { poll } = this.props;

    //const Poll = ({ poll, options, vote, getOptions }) => {
    /*  console.log(poll); */
    /* 
  id: "jzh603ezxrq9ffebhdh"
ownerWallet: "msb3f4vKkRKSNX48kJS895sufyqTSNsEC1"
pollName: "Smells"
pollQuestion: "What */
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
                <IoMdClose
                  onClick={e => this.setState({ priceWarning: false })}
                />
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
                    You are leaving an important mark. Thank you for your
                    donation and for to keeping polls TRUE.
                  </p>
                  <div className="donationAmount">
                    {this.state.convertedBSVtoFixed}BSV = {this.state.priceVote}
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
                      onClick={() => this.voteSubmit()}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </AlertModal>
        ) : null}
        <div className="pollTitle">
          <h3>{poll.pollQuestion}</h3>
          <div className="chainLink">
            <a
              href={"https://test.whatsonchain.com/tx/" + poll.txID}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/images/chainIcon.svg" />
            </a>
          </div>
        </div>

        {this.state.option ? (
          <div>
            {Object.values(this.state.option).map((pollOption, j) => {
              return (
                <div key={j + "xxx" + j} className="optionRowHolder">
                  <div className="pollTestHolder">
                    <div>{Object.keys(this.state.option)[j]}</div>
                    <div className="totalVotes">{pollOption}</div>

                    {/*  <div>{console.log(Object.keys(this.state.option)[j])}</div> */}
                    <div
                      className="pollButton"
                      id={"btn" + j + poll.id}
                      onClick={e =>
                        this.preCheck(
                          poll.id,
                          Object.keys(this.state.option)[j],
                          pollOption,
                          poll.ownerWallet,
                          e
                        )
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  }
}

export default Poll;
