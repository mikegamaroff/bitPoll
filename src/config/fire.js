import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import * as firebaseui from "firebaseui";
var config = {
  apiKey: "AIzaSyDKiQ25fMvf3iJtuExUkEZCsFDt0_cl-uA",
  authDomain: "bitpoll-1e728.firebaseapp.com",
  databaseURL: "https://bitpoll-1e728.firebaseio.com",
  projectId: "bitpoll-1e728",
  storageBucket: "bitpoll-1e728.appspot.com",
  messagingSenderId: "408941826672",
  appId: "1:408941826672:web:72c19e7169c5cac5"
};

firebase.initializeApp(config);
//firebase.firestore().settings({ timestampsInSnapshots: true });

export default firebase;
