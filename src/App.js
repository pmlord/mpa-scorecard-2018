import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import queryString from 'query-string'

import './App.css'

window.queryString = queryString

class App extends Component {
  handleChange = (e) => {
    const { history } = this.props
    const searchQueryParam = queryString.stringify({ q: e.target.value })
    history.replace(`/?${searchQueryParam}`)
  }

  render() {
    const {
      location,
      match,
      history,
    } = this.props

    const params = queryString.parse(location.search)
    console.log('location', location)
    console.log(params)
    const q = params.q || ''

    return (
      <div>
        <Link to='/'>Home</Link>&nbsp;
        <input onChange={this.handleChange} value={q} />
        <hr />
        {q}
      </div>
    )
  }
}

export default withRouter(App);
