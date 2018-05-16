import React from 'react'
import { Link } from 'react-router-dom'
import { legislatorPath } from '../services/legislator-path'
import iconLink from '../assets/images/icon-link.png'
import iconPhone from '../assets/images/icon-phone.png'
import iconEmail from '../assets/images/icon-email.png'

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
    url,
    phone,
    email,
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
              <span>
                <span className="bull">&nbsp;&nbsp;&bull;&nbsp;&nbsp;</span>
                { address }
              </span>
            }
          </div>
        </div>
      </div></div>
      <div className="col-xs"><div className="box legislator-actions">
        { !compact &&
          <a className="legislator-action" href={url} target="_blank">
            <img src={iconLink} />
          </a>
        }
        <a className="legislator-action" href={`tel:${phone}`}>
          <img src={iconPhone} />
        </a>
        <a className="legislator-action" href={`mailto:${email}`} target="_blank">
          <img src={iconEmail} />
        </a>
      </div></div>
    </div>
  )
}
