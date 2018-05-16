import React from 'react'
import legislators, { legislatorsByOcdId } from '../data/index'

import LegislatorCard from './LegislatorCard'


export default function(props) {

  // Array of legislator cards
  const legislatorCards = legislators.map((props) => {
    return <LegislatorCard {...props} />
  })

  return (
    <div className="legislative-cards">
      <div className="row">
        {legislatorCards}
      </div>
    </div>
  )
}
