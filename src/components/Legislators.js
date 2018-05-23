import React from 'react'
import FindMyLegislators from './FindMyLegislators'
import LegislatorCard from './LegislatorCard'
import withStore from '../services/legislators-store'


export default withStore(function Legislators(props) {
  const { store } = props

  const yourLegislators = store.get('yourLegislators')
  // const otherLegislators = store.get('otherLegislators')

  // Array of legislator cards
  const yourLegislatorCards = yourLegislators.map((legislator) => {
    return <LegislatorCard legislator={legislator} your={true} key={legislator.ocdId} />
  })
  // const otherLegislatorCards = otherLegislators.map((legislator) => {
  //   return <LegislatorCard legislator={legislator} your={false} key={legislator.ocdId} />
  // })

  return (
    <div>
      <FindMyLegislators />
      <div className="legislator-cards">
        <div className="row">
          {yourLegislatorCards}
        </div>
      </div>
    </div>
  )
});

// <br /><br />
// <div className="row">
//   {otherLegislatorCards}
// </div>
