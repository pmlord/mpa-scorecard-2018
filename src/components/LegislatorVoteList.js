import React from 'react'
import { Link } from 'react-router-dom'
import map from 'lodash/map'
import { billsById } from '../data/'
import { billPath } from '../services/bill-helpers'


export default function LegislatorVoteList(props) {
  const legislator = props.legislator
  const votes = legislator.votes

  const renderedVotes = map(votes, function(stance, billId) {
    const bill = billsById[billId]
    const key  = legislator.ocdId + billId
    return (
      <Vote
        key={key}
        bill={bill}
        legislator={legislator}
        legislator_stance={stance}
        />
    );
  })

  return (
    <div className="card list">
      {renderedVotes}
    </div>
  )
}


function Vote(props) {
  const { bill, legislator, legislator_stance } = props

  const {
    shorthand_title,
    short_description,
    mpa_stance,
  } = bill

  const billId = bill.id.replace(/\s/g, '\u00A0')

  const lastName = legislator.name.lastName

  let stanceClassName
  if (legislator_stance.match((/Excused|n\/a/i)))
    stanceClassName = 'neutral'
  else if (legislator_stance === mpa_stance)
    stanceClassName = 'good'
  else
    stanceClassName = 'bad'

  return (
    <div className="list-item">
      <div className="row">
        <div className="col-xs-12 col-sm"><div className="box title-description">
          <Link to={billPath(bill)} className="title">
            {shorthand_title} &nbsp;
            <span className="bill-id">{billId}</span>
          </Link>
          <div className="description">{short_description}</div>
        </div></div>
        <div className="col-xs-6 col-sm-2"><div className="box">
          <div className="title">MPA bill stance</div>
          <div className="stance">{mpa_stance}</div>
        </div></div>
        <div className="col-xs-6 col-sm-2"><div className="box">
          <div className="title">
            {lastName} stance
          </div>
          <div className={`stance ${stanceClassName}`}>{legislator_stance}</div>
        </div></div>
      </div>
    </div>
  )
}
