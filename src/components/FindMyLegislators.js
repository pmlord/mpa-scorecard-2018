import React from 'react'
import Select from './Select'
import towns from '../data/townNames.json'

import withLegislatorsStore, {
  setTown,
  setStreetAddress,
  fetchLegislators,
} from '../services/legislators-store'

export default withLegislatorsStore(function FindMyLegislators(props) {
  const { store } = props
  const town = store.get('town')
  const streetAddress = store.get('streetAddress')

  return (
    <div className="find-my-legislators">
      <form onSubmit={(e) => {fetchLegislators(); e.preventDefault(); return false;}}>
        <Select
          placeholder="Town Name"
          options={towns}
          onChange={(e) => setTown(e.target.value)}
          value={town}
          />
        <input
          placeholder="Street address"
          onChange={(e) => setStreetAddress(e.target.value)}
          value={streetAddress}
          />
        <input
          type="submit"
          value="Find my reps"
          />
      </form>
    </div>
  )
})
