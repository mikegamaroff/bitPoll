import React from "react";
import firebase from "firebase";
import fire from "./config/fire";
import ui from "./config/fire";

//import Home from "./Home";
import ReactDOM from "react-dom";
import * as firebaseui from "firebaseui";
class Login extends React.Component {
  render() {
    function getUiConfig() {
      return {
        callbacks: {
          // Called when the user has been successfully signed in.
          signInSuccess: function(user, credential, redirectUrl) {
            handleSignedInUser(user);
            // Do not redirect.
            return false;
          }
        },
        // Opens IDP Providers sign-in flow in a popup.
        signInFlow: "popup",
        signInOptions: [
          // The Provider you need for your app. We need the Phone Auth
          // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
          {
            provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
            //provider: firebase.auth.TwitterAuthProvider.PROVIDER_ID,
            recaptchaParameters: {
              //size: getRecaptchaMode()
              //type: "image",
              size: "invisible",
              // badge: "bottomright",
              display: "none",
              visibility: "none"
            }
          }
        ],
        // Terms of service url.
        tosUrl: "https://www.google.com"
      };
    }

    // Initialize the FirebaseUI Widget using Firebase.
    var ui = firebaseui.auth.AuthUI.getInstance();

    /**
     * Displays the UI for a signed in user.
     * @param {!firebase.User} user
     */
    var handleSignedInUser = function(user) {
      //ReactDOM.render(<Home />, document.getElementById("root"));
      /*  document.getElementById("user-signed-in").style.display = "block";
      document.getElementById("user-signed-out").style.display = "none";
      document.getElementById("phone").textContent = user.phoneNumber;
      if (user.photoURL) {
        document.getElementById("photo").src = user.photoURL;
        document.getElementById("photo").style.display = "block";
      } else {
        document.getElementById("photo").style.display = "none";
      } */
    };

    /**
     * Displays the UI for a signed out user.
     */
    var handleSignedOutUser = function() {
      document.getElementById("user-signed-in").style.display = "none";
      document.getElementById("user-signed-out").style.display = "block";
      ui.start("#firebaseui-container", getUiConfig());
    };

    // Listen to change in auth state so it displays the correct UI for when
    // the user is signed in or not.
    fire.auth().onAuthStateChanged(function(user) {
      document.getElementById("loading").style.display = "none";
      document.getElementById("loaded").style.display = "block";
      console.log(user);
      if (user) {
        handleSignedInUser(user);
      } else {
        handleSignedOutUser(user);
      }
      //user ? handleSignedInUser(user) : handleSignedOutUser(user);
    });

    /**
     * Deletes the user's account.
     */
    var deleteAccount = function() {
      fire
        .auth()
        .currentUser.delete()
        .catch(function(error) {
          if (error.code == "auth/requires-recent-login") {
            // The user's credential is too old. She needs to sign in again.
            fire
              .auth()
              .signOut()
              .then(function() {
                // The timeout allows the message to be displayed after the UI has
                // changed to the signed out state.
                setTimeout(function() {
                  alert("Please sign in again to delete your account.");
                }, 1);
              });
          }
        });
    };

    /**
     * Initializes the app.
     */
    var initApp = function() {
      document.getElementById("loaded").style.display = "none";

      /*   document.getElementById("sign-out").addEventListener("click", function() {
        fire.auth().signOut();
      });
      document
        .getElementById("delete-account")
        .addEventListener("click", function() {
          deleteAccount();
        }); */
    };

    // window.addEventListener("load", initApp);

    return (
      <div id="container">
        <div id="loading">Loading...</div>

        <div id="loaded">
          <div id="LoginLogo">
            <img src="images/logo.png" />
          </div>
          <div id="main">
            <div id="user-signed-in" className="hidden">
              <p />
            </div>

            <div id="user-signed-out" className="hidden">
              <div id="firebaseui-spa">
                <div id="firebaseui-container" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;

export var logout = function() {
  fire.auth().signOut();
  ReactDOM.render(<Login />, document.getElementById("root"));
};
