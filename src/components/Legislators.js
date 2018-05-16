import React from 'react'
import legislators from '../data/index'
import sample from 'lodash/sampleSize'

import LegislatorCard from './LegislatorCard'


export default function(props) {

  const visibleLegislators = sample(legislators, 5)

  // Array of legislator cards
  const legislatorCards = visibleLegislators.map((legislator) => {
    return <LegislatorCard legislator={legislator} key={legislator.ocdId} />
  })

  return (
    <div className="legislator-cards">
      <div className="row">
        {legislatorCards}
      </div>
    </div>
  )
}
