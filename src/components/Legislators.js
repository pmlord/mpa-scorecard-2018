import React from 'react'
import legislators from '../data/index'
import sample from 'lodash/sampleSize'

import LegislatorCard from './LegislatorCard'


export default function(props) {

  const yourLigislators = sample(legislators, 2)
  const visibleLegislators = sample(legislators, 10)

  // Array of legislator cards
  const yourLegislatorCards = yourLigislators.map((legislator) => {
    return <LegislatorCard legislator={legislator} your={true} key={legislator.ocdId} />
  })
  const legislatorCards = visibleLegislators.map((legislator) => {
    return <LegislatorCard legislator={legislator} your={false} key={legislator.ocdId} />
  })

  return (
    <div className="legislator-cards">
      <div className="row">
        {yourLegislatorCards}
      </div>
      <br /><br />
      <div className="row">
        {legislatorCards}
      </div>
    </div>
  )
}
