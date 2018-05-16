import React from 'react'
import { Link } from 'react-router-dom'
import { legislatorPath } from '../services/legislator-path'

export default (props) => {
  const {
    compact,
    legislator,
  } = props

  const {
    name,
    party,
    legal_residence,
    address,
  } = legislator

  const photo_url = '/legislator-photos/'
    + legislator.ocdId.replace(/^.+\//, '').replace(':', '.')
    + '.jpg'
  const avatar_styles = { backgroundImage: `url('${photo_url}')`}

  return (
    <div className="legislator-info row middle-xs">
      <div className="col-xs"><div className="box">
        <div className="legislator-avatar" style={avatar_styles} />
      </div></div>
      <div className="col-xs"><div className="box">
        <div className="legislator-name-and-address">
          <div className="legislator-name">
            <Link to={legislatorPath(legislator)}>{name}</Link>
          </div>
          <div className="legislator-subtitle">
            <span>{party}, {legal_residence}</span>
            { !compact &&
              <span> &nbsp;&bull;&nbsp; { address }</span>
            }
          </div>
        </div>
      </div></div>
      <div className="col-xs"><div className="box">
        Buttons
      </div></div>
    </div>
  )
}
