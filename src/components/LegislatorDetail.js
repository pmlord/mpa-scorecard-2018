import React from 'react'
import { getLegislatorFromParams } from '../services/legislator-path'
import LegislatorInfo from './LegislatorInfo'

export default ({ match }) => {
  const param = match.params.ocdId
  const legislator = getLegislatorFromParams(param)

  return (
    <div>
      <br />
      <LegislatorInfo legislator={legislator} />
    </div>
  )
}
