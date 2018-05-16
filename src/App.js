import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'

import Header from './components/Header'

import './App.css'


class App extends Component {

  render() {

    return (
      <div className="App">
        <Header />
        <div className="container">
          <Switch>
            <Route path="/" exact render={() => <Redirect to='/legislators' />} />
            <Route path='/legislators' render={() => <h1>Legislators</h1>} />
            <Route path="/bills" render={() => <h1>Bills</h1>} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default App;
