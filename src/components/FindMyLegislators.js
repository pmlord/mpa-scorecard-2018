import React from 'react'
import Select from './Select'
import towns from '../data/townNames.json'

import withStore, {
  setStreetAddress,
  setTown,
  setZip,
  fetchLegislators,
} from '../services/legislators-store'

export default withStore(function FindMyLegislators(props) {
  const { store } = props
  const streetAddress = store.get('streetAddress')
  const town = store.get('town')
  const zip = store.get('zip')

  return (
    <div className="find-my-legislators">
      <form onSubmit={(e) => {console.log('submittyFace'); fetchLegislators(); e.preventDefault(); return false;}}>
        <input
          placeholder="Street address"
          onChange={(e) => setStreetAddress(e.target.value)}
          value={streetAddress}
          />
        <Select
          placeholder="Town Name"
          options={towns}
          onChange={(e) => setTown(e.target.value)}
          value={town}
          />
        <input
          className="zip"
          placeholder="Zip"
          onChange={(e) => setZip(e.target.value)}
          value={zip}
          />
        <input
          type="submit"
          value="Find my reps"
          />
      </form>
    </div>
  )
})
