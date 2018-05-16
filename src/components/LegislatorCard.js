import React from 'react'
import { Link } from 'react-router-dom'
import { ocdIdToLegislatorPath } from '../services/legislator-path'

export default function LegislatorCard(props) {
  const {
    ocdId,
    name,
    party,
    legal_residence,
    address,
    photo_url,
  } = props

  const avatar_styles = { backgroundImage: `url('${photo_url}')`}
  const detailLinkTo = ocdIdToLegislatorPath(ocdId)

  return (
    <div className="col-sm-6 col-xs-12" key={ocdId}><div className="box">
      <div className="legislative-card card">
        <div className="legislator-info row middle-xs">
          <div className="col-xs-2"><div className="box">
            <div className="legislator-avatar" style={avatar_styles} />
          </div></div>
          <div className="col-xs-6"><div className="box">
            <div className="legislator-name-and-address">
              <div className="legislator-name">
                <Link to={detailLinkTo}>{name}</Link>
              </div>
              <div className="legislator-subtitle">{party}, {legal_residence}</div>
            </div>
          </div></div>
        </div>
      </div>
    </div></div>
  )
}
