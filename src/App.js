import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'

import Header from './components/Header'
import Legislators from './components/Legislators'
import LegislatorDetail from './components/LegislatorDetail'
import Bills from './components/Bills'



class App extends Component {

  render() {

    return (
      <div className="App">
        <Header />
        <div className="container">
          <Switch>
            <Route path="/" exact render={() => <Redirect to='/legislators' />} />
            <Route path='/legislators/:ocdId/:slug?' component={LegislatorDetail} />
            <Route path='/legislators' component={Legislators} />
            <Route path="/bills" component={Bills} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default App;
