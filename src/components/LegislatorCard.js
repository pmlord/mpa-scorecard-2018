import React from 'react'

import LegislatorInfo from './LegislatorInfo'

const badgeTexts = [
  { Senate: 'Senator', House: 'Representative' },
  { Senate: 'Your Senator', House: 'Your Representative' },
]

export default function LegislatorCard(props) {
  const {
    legislator,
    your,
  } = props
  const { legislative_chamber } = legislator

  const badgeText = badgeTexts[Number(your)][legislative_chamber]

  return (
    <div className="col-md-6 col-xs-12"><div className="box">
      <div className={`legislator-card card ${your ? 'your' : ''}`}>
        <div class="badge">{badgeText}</div>
        <LegislatorInfo legislator={legislator} compact />
      </div>
    </div></div>
  )
}
