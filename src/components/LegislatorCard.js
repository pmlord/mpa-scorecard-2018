import React from 'react'

import LegislatorInfo from './LegislatorInfo'

export default function LegislatorCard(props) {
  const { legislator } = props

  return (
    <div className="col-md-6 col-xs-12"><div className="box">
      <div className="legislator-card card">
        <LegislatorInfo legislator={legislator} compact />
      </div>
    </div></div>
  )
}
