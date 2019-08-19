import bsv from "bsv";
import Mnemonic from "bsv/mnemonic";
import { bindActionCreators } from "redux";
import { passEncrypt, passDecrypt } from "./passEncrypt";
//import bitindex from "bitindex-sdk";
var Transaction = bsv.Transaction;

var bitindex = require("bitindex-sdk").instance({
  api_key: "2Lrmam5m7tEiX87QqnmqtVHXscuUCuxc6rLjPNFq1f49mDLuEynDPVTsQH2rjrd4Kv",
  network: "test"
});

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

/// Only happens if the user doesn't already have a wallet
export const getNewWallet = pin => {
  const mnemonic = Mnemonic.fromRandom();

  passLocalStorage("userMnemonic", passEncrypt(mnemonic.toString()));
  //let retrievedMnem = localStorage.getItem("userMnemonic");
  return mnemonic.toString();
  //console.log(passDecrypt(retrievedMnem));
};

// happens every time a transaction is made
export const getKey = (mnemonic, pin, n) => {
  return new Promise(function(resolve, reject) {
    //export const getKey = (mnemonic, pin, n) => {
    // let mnemonic = Mnemonic.fromRandom();
    let newmnemonic = new Mnemonic(mnemonic);
    let seed = newmnemonic.toSeed(pin);

    if (!n) {
      n = 0;
    }

    //MASTER PRIVATE KEY
    let hdPrivateKey = bsv.HDPrivateKey.fromSeed(seed, "testnet");

    // This creates a derivation path
    // The format is not important
    // This one looks like this "m/44'/0/0/0"
    // any of the zeroes can be incremented to create new addresses
    // I usually increment the last number

    let receiveDerived = hdPrivateKey
      .deriveChild(44, true) // adding a true hardens the key
      .deriveChild(0)
      .deriveChild(0)
      .deriveChild(n);

    //Get the derived HD private key
    var receivePriv = new bsv.HDPrivateKey(receiveDerived);
    //var receivePriv = receiveDerived.privateKey;
    // GET Address from MASTER Pkey
    var masterAddress = new bsv.Address(hdPrivateKey.publicKey, "testnet");

    // GET Address from DERIVED Pkey
    var address = new bsv.Address(receivePriv.publicKey, "testnet");

    // GET CHANGE address
    let receiveDerivedChange = hdPrivateKey
      .deriveChild(44, true) // adding a true hardens the key
      .deriveChild(0)
      .deriveChild(0)
      .deriveChild(n + 1);

    // GET DERIVED CHANGE Pkey
    var receivePrivChange = new bsv.HDPrivateKey(receiveDerivedChange);

    // GET DERIVED CHANGE ADDRESS
    var derivedAddressChangeReceive = new bsv.Address(
      receivePrivChange.publicKey,
      "testnet"
    );
    // console.log(derivedAddressChangeReceive.toObject());
    // GET PUBLIC KEY FROM MASTER Pkey
    let hdPublicKey = new bsv.HDPublicKey.fromHDPrivateKey(hdPrivateKey);

    // GET PUBLIC KEY FROM DERIVED Pkey
    let hdPublicKeyDerived = new bsv.HDPublicKey.fromHDPrivateKey(receivePriv);

    // GET PUBLIC KEY FROM CHANGE pkey
    let hdPublicKeyChange = new bsv.HDPublicKey.fromHDPrivateKey(
      receivePrivChange
    );

    /*   let hdPublicKeyChange = new bsv.HDPublicKey.fromHDPrivateKey(
    receivePrivChange,
    "testnet"
  ); */
    /*  /// CONSOLE LOG OUT ALL THE VALUES
    console.log("Master privateHDKey: " + hdPrivateKey.toString());
    console.log("Derived privateHDKey: " + receivePriv.privateKey);
    console.log("Address from MASTER Pkey: " + masterAddress.toString());
    console.log("Address from DERIVED Pkey: " + address.toString());
    console.log("Change DERIVED Pkey: " + receivePrivChange.toString());
    console.log(
      "Change DERIVED Address: " + derivedAddressChangeReceive.toString()
    );
    console.log("Public key from MASTER Pkey: " + hdPublicKey.toString());
    console.log(
      "Public key from DERIVED Pkey: " + hdPublicKeyDerived.toString()
    );
    console.log("Public key from CHANGE Pkey: " + hdPublicKeyChange.toString());
   
    */

    resolve({
      pkeyMaster: hdPrivateKey.toString(),
      pkeyDerived: receivePriv.privateKey.toString(),
      addressMaster: masterAddress.toString(),
      addressDerived: address.toString(),
      changeDerivedPkey: receivePrivChange.toString(),
      changeDerivedAddress: derivedAddressChangeReceive.toString(),
      pubKeyMaster: hdPublicKey.toString(),
      pubKeyDerived: hdPublicKeyDerived.toString(),
      pubKeyChange: hdPublicKeyChange.toString()
    });

    /*     return {
      pkeyMaster: hdPrivateKey.toString(),
      pkeyDerived: receivePriv.privateKey.toString(),
      addressMaster: masterAddress.toString(),
      addressDerived: address.toString(),
      changeDerivedPkey: receivePrivChange.toString(),
      changeDerivedAddress: derivedAddressChangeReceive.toString(),
      pubKeyMaster: hdPublicKey.toString(),
      pubKeyDerived: hdPublicKeyDerived.toString(),
      pubKeyChange: hdPublicKeyChange.toString()
    }; */

    /*   return {
    pkeyMaster: hdPrivateKey.toString(),
    pkeyDerived: receivePriv.privateKey.toString(),
    addressMaster: masterAddress.toString(),
    addressDerived: address.toString(),
    changeDerivedPkey: receivePrivChange.toString(),
    changeDerivedAddress: derivedAddressChangeReceive.toString(),
    pubKeyMaster: hdPublicKey.toString(),
    pubKeyDerived: hdPublicKeyDerived.toString(),
    pubKeyChange: hdPublicKeyChange.toString()
  }; */
  })
    .then(r => {
      return r;
    })
    .catch(err => {
      console.log(err);
    });
};

export const passLocalStorage = (storedName, mnemHash) => {
  localStorage.setItem(storedName, mnemHash);
};

export async function getUTXO(
  content,
  pkeyDerived,
  addressMaster,
  payToUserAddress, // Like and comment only
  bsv // amount to pay
) {
  let bsvToSetoshi;
  const fee = (content.length + 1000) * 4;
  if (bsv == 0) {
    bsvToSetoshi = 10;
  } else {
    bsvToSetoshi = Math.round(bsv * 100000000) - fee;
  }

  console.log("++++++++" + bsvToSetoshi);
  console.log("++++++++" + bsv);

  console.log("BYTES " + content.length);
  console.log("FEE " + fee);
  console.log("POST " + content);
  console.log("--------------------------");
  console.log("addressDerived: " + addressMaster);
  /*  var result = await fetch(
    "https://api.bitindex.network/api/v3/test/addr/" + addressDerived + "/utxo"
  ); */
  var result = await bitindex.address.getUtxos(addressMaster);

  let utxos = await result;

  if (!payToUserAddress) {
    payToUserAddress = "n4kS9jdEKjwAhMBbQ4np9etDnY7eWxgov9";
  }

  //// Check if there are UTXOs. Error gets thrown if user
  //// has never received funds into their wallet
  if (isEmpty(utxos)) {
    return "NoFunds";
    console.log("object Empty - NO FUNDS");
  } else {
    console.log("object NOT Empty");

    let tx = new Transaction()

      .from(utxos)
      .to(payToUserAddress, bsvToSetoshi)
      .fee(fee)
      .change(addressMaster)
      .addData(content)
      .sign(pkeyDerived);

    let body = tx.toString();
    //console.log(tx.toString());
    /*     console.log(body);
    console.log("POST " + post);
    console.log("CONTENT " + content); */
    return [body, fee];
  }
}

export async function getBROADCAST(body) {
  var result = await fetch(
    "https://api.bitindex.network/api/v3/test/tx/send",

    {
      //mode: "no-cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json"
      },
      body: JSON.stringify({ rawtx: body })
    }
  );

  let tx = await result.json();

  return tx.txid;

  /*   
  (response => response.json());
  console.log(body); */
  //.then(data => getTX(data));
}

export async function getBalance(key) {
  console.log(key);

  //var r = await bitindex.xpub.getStatus(key);
  var r = await bitindex.address.getStatus(key);
  let balanceDetails = await r;
  //var result = await bitindex.address.getUtxos(address);

  return balanceDetails;
}

export async function getTx(txid) {
  // console.log(txid);

  var r = await bitindex.tx.get(txid);

  let txDetails = await r;

  let opReturn = txDetails.vout[1].scriptPubKey.hex.slice(6);
  let imgHash = hex2a(opReturn);

  let base64Image = imgHash.split(";base64,").pop();
  let newBase64Image = base64Image.split("***").shift();
  let caption = base64Image.split("***").pop();
  //let newbase64Image = base64Image.substring(0, base64Image.length - 1);
  //return r.json();

  //var result = await bitindex.address.getUtxos(address);

  return [caption, newBase64Image, txDetails];
}

export async function getTxComment(txid) {
  // console.log(txid);

  var r = await bitindex.tx.get(txid);

  let txDetails = await r; //let newbase64Image = base64Image.substring(0, base64Image.length - 1); //return r.json();

  let opReturn = txDetails.vout[1].scriptPubKey.hex.slice(4);
  let commentHash = hex2a(opReturn);

  // let commentSplit = commentHash.split(";base64,").pop();
  let comment = commentHash.split("***").shift();
  //let caption = base64Image.split("***").pop();
  //var result = await bitindex.address.getUtxos(address);
  return new Promise(function(resolve, reject) {
    resolve(comment);
  });
  //return [caption, newBase64Image, txDetails];
}

export async function getTxStatement(txid) {
  // console.log(txid);

  var r = await bitindex.tx.get(txid);

  let txDetails = await r;
  return new Promise(function(resolve, reject) {
    resolve(txDetails);
  });
  //return [txDetails];
}

/* 

export async function getTx(txid) {
  console.log(txID.txid);
  fetch("https://api.bitindex.network/api/v3/test/tx/" + txID.txid, {
    method: "GET"
  })
    .then(function(response) {
      return response.json();

      //var foundUtxo = this.responseText;
      //var UtxoObj = JSON.parse(foundUtxo);
    })

    .then(function(myJson) {
      let UtxoObj = myJson;
      //console.log("FINAL LOG " + myJson);

      let opReturn = myJson.vout[1].scriptPubKey.hex.slice(6);
      // console.log(myJson.vout[1].scriptPubKey.hex);
      let imgHash = hex2a(opReturn);
      let base64Image = imgHash.split(";base64,").pop();
      let newbase64Image = base64Image.substring(0, base64Image.length - 1);
      //var txObj = JSON.parse(this.response);
      //Buffer(txObj.hex, "hex").toString();
      //console.log(base64Image);
      //console.log(opReturn);
      preview = document.querySelector("#footer");
      preview.src = "data:image/png;base64," + newbase64Image;

      // console.log(txObj.vout[1].scriptPubKey.hex);

      //getBROADCAST(body);
    });
}
 */

export function hex2a(hex) {
  var str = "";
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

export async function getPrice() {
  return new Promise(function(resolve, reject) {
    fetch("https://api.cryptonator.com/api/ticker/bsv-usd", { mode: "cors" })
      .then(response => response.json())
      .then(jsonBody => {
        //console.log(jsonBody);
        resolve(jsonBody);
        // return jsonBody;
      });
  });
}

export async function priceSheet() {
  return {
    priceVote: 0.1,
    pricePoll: 1
  };
}

export async function bsvToDollar(bsv, bsvPrice) {
  let divisible = 100000000 / bsv;
  let dollarAmount = bsvPrice / divisible;

  dollarAmount = dollarAmount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  });
  //console.log(dollarAmount);
  return dollarAmount.toString();
}
