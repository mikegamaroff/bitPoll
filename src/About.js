import React from "react";
import NavBar from "./components/layout/NavBar";
import NavBottom from "./components/layout/NavBottom";
import ReactDOM from "react-dom";

import { Link, NavLink } from "react-router-dom";

class About extends React.Component {
  render() {
    return (
      <div className="masterContainer">
        <NavBar />

        <NavBottom noCompose="true" />

        <div className="contentPanelList">
          <div className="bodyContent">
            <h3>Honest polling with Bitcoin</h3>
            <h2>What's it all about?</h2>
            <p>
              It is hard to know if a poll is being taken with the right
              cross-section of audience that makes the outcome relevant to us.
              More and more we look to the public conensus to help guide our
              daily decisions, and to do this accurately and reliably is
              becoming increasingly more difficult.
            </p>
            <h2>How does BitPoll help?</h2>
            <p>
              BitIndex is the first Bitcoin enabled polling system that allows
              you to set up your own polls, and earn real money for each vote
              you receive. USers who are passionate about the issues will donate
              small micro-payments at a time, enough to attract a motivated and
              meaningful audience.
            </p>
            <h2>Benefits</h2>
            <p>
              Users can now browse a stream of polls that they know were paid
              for by the poll-owner, and then choose which ones they feel
              passionate enough about to commit a small micro-payment to vote.
              This leads to a self-moderated outcome of quality results,
              authenticated and decentralized, ensuring accuracy and a public
              option you can trust.
            </p>
            <h2>Enabled with economy</h2>
            <p>
              The great equalizer for all public services is payments. If people
              are motivated to pay for something, the quality of the results are
              massively increased. People will not pay even a small amount
              unless they are motivated and invested in the outcome.
            </p>
            <h2>Why Bitcoin?</h2>
            <p>
              Paying for anything is complicated. If it's cash, you have to be
              there in person. If it's online, you need to fill out credit card
              info. Plus, many services that are enabled through MICRO-payments
              are not possible with traditional payment systems. Bitcoin makes
              services like BitPoll possible by enabling users to both earn and
              transact in small, easy payments that open up whole new online
              economies and utilities that will benefit the world like never
              thought possible.
            </p>
            <h2>The fees</h2>
            <p>
              It's simple. It costs you a $1 worth of BSV to create a poll, but
              you earn $3c for every vote received. If your poll is popular, you
              can start to calculate your earnings.
            </p>
            <h2>Credits</h2>
            <p>
              BitPoll was conceived, designed, built and presented by Mike
              Gamaroff. <a href="mailto:mike@gamaroff.com">mike@gamaroff.com</a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
export default About;
