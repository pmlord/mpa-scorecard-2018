import { connect, createStore } from 'undux'
import legislators from '../data/'
import { fetchDivisionsByAddress } from './civic-info-api'
import partition from 'lodash/partition'


// Store
const store = createStore({
  town: 'Brunswick',
  streetAddress: '57 Main St.',
  yourLegislators: [],
  otherLegislators: legislators,
  errors: null,
})


// Actions

export const setTown = store.set('town')
export const setStreetAddress = store.set('streetAddress')
const setYourLegislators = store.set('yourLegislators')
const setOtherLegislators = store.set('otherLegislators')

export function fetchLegislators() {
  const town = store.get('town')
  const streetAddress = store.get('streetAddress')
  const address = `${streetAddress}, ${town}, ME`

  fetchDivisionsByAddress(address).then(function(ocdIds) {
    const [yours, others] = partition(legislators, function(legislator) {
      return ocdIds.some(function(ocdId) {
        return legislator.ocdId === ocdId
      })
    })

    setYourLegislators(yours)
    setOtherLegislators(others)
  })
}


// Connect store

const withStore = connect(store)
export default withStore

fetchLegislators()
