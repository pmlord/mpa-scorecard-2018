import React from 'react'
import FindMyLegislators from './FindMyLegislators'
import LegislatorCard from './LegislatorCard'
import withStore from '../services/legislators-store'


class Legislators extends React.Component {
  constructor(props) {
    super()

    this.state = {
      showOthers: false,
    }
  }

  toggleShowOthers = () => {
    const prevState = this.state.showOthers

    this.setState({
      showOthers: !prevState
    })
  }

  render() {
    const { store } = this.props
    const { showOthers } = this.state

    const yourLegislators = store.get('yourLegislators')
    const otherLegislators = store.get('otherLegislators')

    // Render legislator cards
    const yourLegislatorCards = yourLegislators.map((legislator) => {
      return <LegislatorCard legislator={legislator} your={true} key={legislator.ocdId} />
    })
    const otherLegislatorCards = showOthers
      ? (
        otherLegislators.map((legislator) => {
          return <LegislatorCard legislator={legislator} your={false} key={legislator.ocdId} />
        })
      )
      : []

    return (
      <div className="legislators">
        <FindMyLegislators />
        { yourLegislators.length === 0 &&
          <h1 className="zero-state-message">
            Enter your address to find your representatives.
          </h1>
        }
        <div className="legislator-cards">
          <div className="row">
            {yourLegislatorCards}
          </div>
        </div>
        <div className="showOthers">
          <button onClick={this.toggleShowOthers} >
            {showOthers ? 'Hide' : 'Show'} Others
          </button>
        </div>
        { showOthers &&
          <div className="legislator-cards">
            <div className="row">
              {otherLegislatorCards}
            </div>
          </div>
        }
      </div>
    )
  }
}

export default withStore(Legislators);
