//import BitIndex from "./BitIndex";
import React from "react";
import firebase from "firebase";
import fire from "./config/fire";
import ReactDOM from "react-dom";

class FireStore extends React.Component {
  componentDidMount() {
    fire.auth().onAuthStateChanged(function(user) {
      if (user) {
        ///////////////
      } else {
        //////////////////////
      }
    });
  }
  render() {
    return <div />;
  }
}

export default FireStore;
