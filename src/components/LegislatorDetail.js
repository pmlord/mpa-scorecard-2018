import React from 'react'
import { getLegislatorFromParams } from '../services/legislator-path'
import LegislatorInfo from './LegislatorInfo'

export default ({ match }) => {
  const param = match.params.ocdId
  const legislator = getLegislatorFromParams(param)

  const {
    legislative_chamber,
    districtNum,
    towns,
  } = legislator

  // Fake data until the database is seeded
  const termLimited = 2018 + 2 * parseInt(Math.random() * 4)
  const upForReelection = Math.round(Math.random()) ? '2018' : 'Not seeking reelection'

  return (
    <div className="legislator-detail">
      <section>
        <LegislatorInfo legislator={legislator} />
      </section>
      <hr />
      <section className="district-info">
        <div className="row">
          <div className="col-md-6 col-xs-12"><div className="box">
            <div className="title">Representing {legislative_chamber} District {districtNum}</div>
            <div className="description">{towns}</div>
          </div></div>
          <div className="col-md-3 col-xs-6"><div className="box">
            <div className="title">Term limited</div>
            <div className="description">{termLimited}</div>
          </div></div>
          <div className="col-md-3 col-xs-6"><div className="box">
            <div className="title">Up for reelection</div>
            <div className="description">{upForReelection}</div>
          </div></div>
        </div>
      </section>
      <hr />
    </div>
  )
}
