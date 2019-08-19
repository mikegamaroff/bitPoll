import React, { Component } from "react";
import { vote, getOptions, getPolls } from "../../store/actions/pollActions";
import { IoIosTrash, IoMdClose } from "react-icons/io";
import NavBar from "../layout/NavBar";
import NavBottom from "../layout/NavBottom";
import Poll from "./Poll";
import CreatePoll from "./CreatePoll";

import AlertModal from "../../AlertModal";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect, Link, NavLink } from "react-router-dom";
import { MdErrorOutline, MdError, MdCheckCircle } from "react-icons/md";

import Loader from "react-loader-spinner";
let pollObj;
let optionsArray = [];
let optionHeaders = [];
let OptArr;

let j = 0;
class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //states
      showCreate: false,
      firstRefresh: true
    };
  }

  showPollCreate = val => {
    this.setState({ showCreate: val });
    if (!val) {
      this.setState({ firstRefresh: true });
    }
  };

  getPollData = () => {
    this.props.getPolls().then(polls => {
      console.log(polls);
      this.setState({ polls: polls });
    });
  };

  componentDidUpdate(previousProps) {
    console.log(previousProps);

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
  }
  handleChange = e => {};

  render() {
    const polls = this.props.polls;

    if (polls) {
    }

    return (
      <div className="topContainer">
        {this.state.showCreate ? (
          <AlertModal>
            <CreatePoll showPollCreate={this.showPollCreate} />
          </AlertModal>
        ) : null}
        <NavBar />
        <NavBottom showPollCreate={this.showPollCreate} />

        <div className="masterContainer">
          <div className="contentPanelList">
            {this.state.polls &&
              this.state.polls.map(
                (poll, i) => (
                  //return (
                  /*      <div key={poll.id + i}>
                    {poll ? ( */
                  <div className="pollHolder" key={poll.id + i}>
                    <Poll
                      poll={poll}
                      vote={this.props.vote}
                      getOptions={this.props.getOptions}
                    />
                  </div>
                )
                /*     ) : null}
                  </div> */
                //);
              )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const polls = state.firestore.data.polls;
  const options = state.firestore.data.options;
  return {
    polls: polls,
    options: options
  };
};

const mapDispatchToProps = dispatch => {
  return {
    vote: creds => dispatch(vote(creds)),
    getOptions: opts => dispatch(getOptions(opts)),
    getPolls: polls => dispatch(getPolls(polls))
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect(props => {
    return [{ collection: "polls", orderBy: ["createdAt", "desc"] }];
  })
)(Feed);
