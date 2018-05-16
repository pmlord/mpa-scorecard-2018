import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { withRouter } from 'react-router'

export default function Header(props) {
  return (
    <div className="header">
      <div className="brand container">
        <Link to="/" className="name">Maine Peoples Alliance</Link>
        <span className="scorecard">Scorecard</span>
      </div>
      <nav className="container">
        <NavLink to="/legislators" activeClassName="active">Legislators</NavLink>
        <NavLink to="/bills" activeClassName="active">Bills</NavLink>
      </nav>
    </div>
  )
}
