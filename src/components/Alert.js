import React from "react";
import AlertModal from "../AlertModal";

import { IoMdClose } from "react-icons/io";
import { MdCollections } from "react-icons/md";
import { GoSignOut } from "react-icons/go";
import { FaRegListAlt, FaWallet, FaHome } from "react-icons/fa";

import moment from "moment";
const Alert = props => {
  return (
    <div className="masterContainerBlack">
      <div className="modalClose">
        <IoMdClose onClick={e => props.alertOpen(false)} />
      </div>
      <div className="walletWarningPic">
        <label htmlFor="image">
          <img src="/images/warning.svg" />
        </label>
      </div>

      <div className="modalContent">
        <div className="priceWarningTitleDisplay">
          <br />
          <h3>{props.h3}</h3>
          <p>{props.bodyCopy}</p>
        </div>

        <button
          className="priceWarningBtn"
          id="confirm"
          onClick={e => props.alertAction()}
        >
          {props.buttonLabel}
        </button>
        <div className="spacer" />
      </div>
    </div>
  );
};

export default Alert;
