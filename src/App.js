import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'

import Header from './components/Header'
import Legislators from './components/Legislators'
import LegislatorDetail from './components/LegislatorDetail'
import Bills from './components/Bills'
import BillDetail from './components/BillDetail'


class App extends Component {

  render() {

    return (
      <div className="App">
        <Header />
        <div className="">
          <Switch>
            <Route path="/" exact render={() => <Redirect to='/legislators' />} />
            <Route path='/legislators/:ocdId/:slug?' component={LegislatorDetail} />
            <Route path='/legislators' component={Legislators} />
            <Route path='/bills/:billId/:slug?' component={BillDetail} />
            <Route path="/bills" component={Bills} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default App;
