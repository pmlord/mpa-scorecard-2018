import React from 'react'
import { Link } from 'react-router-dom'
import { legislators } from '../data/'
import { legislatorPath } from '../services/legislator-helpers'
import LegislatorInfo from './LegislatorInfo'


export default function BillVoteList(props) {
  const bill = props.bill

  const renderedVotes = legislators.map(function(legislator) {
    const stance = legislator.votes[bill.id];
    if (stance == null) return null;
    const key = 'bill-vote' + legislator.ocdId + bill.id
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
    <div>
      <section className="container">
        <div className="row">
          <div className="col-xs-12 col-sm"><div className="box">
            <h1>Votes</h1>
          </div></div>
          <div className="col-xs-6 col-sm-4 col-md-3"><div className="box">
            <select className="full-width" />
          </div></div>
          <div className="col-xs-6 col-sm-4 col-md-3"><div className="box">
            <select className="full-width" />
          </div></div>
        </div>
      </section>
      <section className="container card-container">
        <div className="card list">
          {renderedVotes}
        </div>
      </section>
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

  const lastName = legislator.name.lastName

  const billId = bill.id.replace(/\s/g, '\u00A0')

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
          <LegislatorInfo legislator={legislator} superCompact includeTitle />
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
        <div className="col-xs-12 col-sm-2"><div className="box">
          <Link to={legislatorPath(legislator)} className="button full-width">Voting record</Link>
        </div></div>
      </div>
    </div>
  )
}
