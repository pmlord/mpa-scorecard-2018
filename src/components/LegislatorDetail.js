import React from 'react'
import {
  getLegislatorFromParams,
  abbreviatedChamberTitle,
} from '../services/legislator-helpers'
import LegislatorInfo from './LegislatorInfo'
import ScoreBar from './ScoreBar'
import VoteList from './VoteList'

export default function LegislatorDetail({ match }) {
  const param = match.params.ocdId
  const legislator = getLegislatorFromParams(param)

  const {
    name,
    legislative_chamber,
    districtNum,
    towns,
    mpaScore,
    voterScore,
  } = legislator

  // Fake data until the database is seeded
  const termLimited = 2018 + 2 * parseInt(Math.random() * 4, 10)
  const upForReelection = Math.round(Math.random()) ? '2018' : 'Not seeking re-election'

  return (
    <div className="legislator-detail">
      <div className="container">
        <section>
          <LegislatorInfo legislator={legislator} />
        </section>
        <hr />
        <section className="district-info">
          <div className="row">
            <div className="col-xs-12 col-sm-6"><div className="box">
              <div className="title">Representing {legislative_chamber} District {districtNum}</div>
              <div className="description">{towns}</div>
            </div></div>
            <div className="col-xs-12 col-sm-5 col-sm-offset-1"><div className="box term-info"><div className="row">
              <div className="col-xs-6"><div className="box">
                <div className="title">Term limited</div>
                <div className="description">{termLimited}</div>
              </div></div>
              <div className="col-xs-6"><div className="box">
                <div className="title">Up for re-election</div>
                <div className="description">{upForReelection}</div>
              </div></div>
            </div></div></div>
          </div>
        </section>
        <hr />
        <section className="scores">
          <div className="row">
            <div className="col-xs-12 col-md-5"><div className="mpa-score box">
              <h1>2018 Score</h1>
              <ScoreBar score={mpaScore} />
              <div className="score-bar-sub-text">
                {`${abbreviatedChamberTitle(legislator)} ${name.lastName}'s allignment with our values this legislative session.`}
              </div>
            </div></div>
            <div className="col-xs-12 col-md-5 col-md-offset-2"><div className="voter-score box">
              <h1>Will of the voters</h1>
              <ScoreBar score={voterScore} />
              <div className="score-bar-sub-text">
                {`${abbreviatedChamberTitle(legislator)} ${name.lastName}'s score on respecting referendums the last two years.`}
              </div>
            </div></div>
          </div>
        </section>
        <hr />
        <section className="voting-history">
          <div className="row">
            <div className="col-xs-12 col-sm"><div className="box">
              <h1>Voting history</h1>
            </div></div>
            <div className="col-xs-6 col-sm-4 col-md-3"><div className="box">
              <select className="full-width" />
            </div></div>
            <div className="col-xs-6 col-sm-4 col-md-3"><div className="box">
              <select className="full-width" />
            </div></div>
          </div>
        </section>
      </div>
      <section className="container card-container">
        <VoteList legislator={legislator} />
      </section>
    </div>
  )
}
