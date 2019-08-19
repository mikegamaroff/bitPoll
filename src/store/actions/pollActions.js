import { getFirestore } from "redux-firestore";
import { dispatch } from "react-redux-firebase";
import { passEncrypt, passDecrypt } from "../../components/wallet/passEncrypt";

export const pollCreate = pollstate => {
  return (dispatch, getState, { getFirestore }) => {
    // make async call to database

    /*  addressDerived: "msb3f4vKkRKSNX48kJS895sufyqTSNsEC1"
    bsvPrice: "131.80469186"
    charLimitColor: "black"
    commentBox: false
    convertedBSV: 0.0015173966660643277
    convertedBSVtoFixed: "0.0015"
    fee: 4192
    firstRefresh: false
    formShow: false
    goToWallet: false
    loading: true
    noFunds: false
    option1: "Wine"
    option2: "Beer"
    option3: "Juice"
    pollID: "jzgq7jhqn47w79zs6jg"
    pollQuestion: "Your favorite drink"
    pricePoll: "$0.20"
    priceWarning: true
    title: "Drinks"
    txID: "35f7eeca7dc7cdd345ef0315250395a44592a71fe1401cddbfb2d253efe35f81"
    walletPIN: "1111"
 */

    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    console.log(pollstate);
    return new Promise(function(resolve, reject) {
      firestore
        .collection("polls")
        .doc(pollstate.pollID)
        .set({
          id: pollstate.pollID,
          pollQuestion: pollstate.pollQuestion,
          //pollName: pollstate.title,
          ownerWallet: pollstate.addressDerived,
          txID: pollstate.txID,
          createdAt: new Date()
        })
        .then(() => {
          firestore
            .collection("options")
            .doc(pollstate.pollID)
            .set({
              [pollstate.option1]: 0,
              [pollstate.option2]: 0,
              [pollstate.option3]: 0
            });

          console.log("success");
          resolve(true);
          dispatch({ type: "CREATE_POLL_SUCCESS" });
        })
        .catch(err => {
          console.log("fail");
          dispatch({ type: "CREATE_POLL_ERROR" }, err);
        });
    });
  };
};
export const vote = stuff => {
  return (dispatch, getState, { getFirestore }) => {
    // make async call to database
    const firestore = getFirestore();
    const pollRecord = firestore.collection("options").doc(stuff[0]);

    console.log(stuff);
    const increment = firestore.FieldValue.increment(1);
    const recordName = stuff[1];
    console.log({ [recordName]: increment });
    //  var obj = { [stuff[1]]: (stuff[2] = stuff[2] + 1) };

    return new Promise(function(resolve, reject) {
      pollRecord
        .set(
          {
            [recordName]: increment
          },
          { merge: true }
        )
        .then(() => {
          console.log("success");
          resolve(true);
          dispatch({ type: "CREATE_POST_SUCCESS" });
        })
        .catch(err => {
          console.log("fail");
          dispatch({ type: "CREATE_POST_ERROR" }, err);
        });
    });
  };
};

export const walletCreate = wallet => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // make async call to database
    const firestore = getFirestore();
    firestore.collection("users");

    const uid = getState().firebase.auth.uid;

    const knownRecord = firestore.collection("users").doc(uid);

    firestore
      .collection("users")
      .doc(knownRecord.id)
      .set(
        {
          addressDerived: wallet.addressDerived,
          walletPIN: passEncrypt(wallet.walletPIN),
          uid: uid,
          createdAt: new Date()
        },
        { merge: true }
      )

      .then(() => {
        dispatch({ type: "WALLET_CREATE_SUCCESS" });
        // document.querySelector("#userName").value = this.StaticRangezuserName;
        return "success";
      })
      .catch(err => {
        dispatch({ type: "WALLET_CREATE_FAIL", err });
        return "fail";
      });
  };
};

export const getOptions = pid => {
  return (dispatch, getState, { getFirestore }) => {
    // make async call to database
    const firestore = getFirestore();
    let optionsArray = [];
    var docRef = firestore.collection("options").doc(pid);
    return new Promise(function(resolve, reject) {
      docRef.onSnapshot(function(doc) {
        resolve(doc.data());

        // search.searchFunc(hitsArray);
        //  console.log(hitsArray);
      });
    });
  };
};

export const getPolls = pid => {
  return (dispatch, getState, { getFirestore }) => {
    // make async call to database
    const firestore = getFirestore();
    let pollArray = [];
    var docRef = firestore.collection("polls").orderBy("createdAt", "desc");
    return new Promise(function(resolve, reject) {
      docRef.onSnapshot(function(data) {
        data.forEach(function(doc) {
          pollArray.push(doc.data());
          resolve(pollArray);
        });

        // search.searchFunc(hitsArray);
        //  console.log(hitsArray);
      });
    });
  };
};
