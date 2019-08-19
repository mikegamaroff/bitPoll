import React from "react";
import { FaWallet, FaLock } from "react-icons/fa";
import QRCode from "qrcode.react";
export const MnemBreak = props => {
  var mnemArray = props.str.split(" ");
  //var mnemonicWords = document.querySelector(".mnemonicWords");

  return (
    <div className="mnemonicWords">
      <h3>Keep this passphrase safe!</h3>
      {mnemArray &&
        mnemArray.map((word, i) => {
          return (
            <p className="mnemWord" id={"mnemWord_" + word} key={word + i}>
              {word}
            </p>
          );
        })}
      <div className="walletViewContainer">
        <div className="walletView" onClick={props.togSet}>
          <FaWallet size={20} color="white" className="walletIcon" />
          <p> View your wallet</p>
        </div>
      </div>
    </div>
  );
};

export const QrShow = props => {
  return (
    <div className="mnemonicWords">
      <div className="addressText">{props.addrStr}</div>
      <QRCode
        value={props.addrStr}
        size={120}
        fgColor="#ca83e1"
        fgColor="#30023f"
      />
      <div className="walletViewContainer">
        <div className="walletView" onClick={props.togSet}>
          <FaLock size={20} color="white" className="walletIcon" />
          <p> View passphrase</p>
        </div>
      </div>
    </div>
  );
};
