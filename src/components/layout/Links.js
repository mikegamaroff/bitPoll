import React from "react";
import { NavLink } from "react-router-dom";
import { MdCollections } from "react-icons/md";
import { GoSignOut } from "react-icons/go";
import { FaRegListAlt, FaWallet, FaHome } from "react-icons/fa";

const Links = props => {
  return (
    <div>
      <div className="sideNavHeader" />
      <ul className="right">
        <li>
          <div className="navIcon">
            <FaHome size="20" color="#007235" />
          </div>
          <NavLink to="/">Home</NavLink>
        </li>

        <li>
          <div className="navIcon">
            <FaWallet size="20" color="#007235" />
          </div>
          <NavLink to="/wallet">Wallet</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Links;
