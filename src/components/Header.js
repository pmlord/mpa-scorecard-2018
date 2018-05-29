import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/images/mpa-logo.png'

export default function Header(props) {
  return (
    <div className="header">
      <div className="banner container">
        <Link to="/" className="brand">
          <img src={logo} alt="" />
        </Link>
        &nbsp;
        <span className="scorecard-title"> 2018&nbsp;Legislative&nbsp;Scorecard</span>
      </div>
      <nav className="container">
        <NavLink to="/legislators" activeClassName="active">Legislators</NavLink>
        <NavLink to="/bills" activeClassName="active">Bills</NavLink>
      </nav>
    </div>
  )
}
