import { connect, createStore } from 'undux'
import legislators from '../data/'
import { fetchDivisionsByAddress } from './civic-info-api'
import partition from 'lodash/partition'


// Store
const store = createStore({
  streetAddress: '',
  town: '',
  zip: '',
  yourLegislators: [],
  otherLegislators: legislators,
  isFetching: false,
  error: null,
})


// Actions

export const setTown = store.set('town')
export const setStreetAddress = store.set('streetAddress')
export const setZip = store.set('zip')

function clearLegislators() {
  store.set('yourLegislators')([])
  store.set('outerLegislators')(legislators)
}
function setIsFetching() {
  store.set('isFetching')(true)
  store.set('error')(null)
  clearLegislators()
}
function receiveLegislators({ yours, others }) {
  store.set('isFetching')(false)
  store.set('error')(null)
  store.set('yourLegislators')(yours)
  store.set('outerLegislators')(others)
}
function receiveError(error) {
  store.set('isFetching')(false)
  store.set('error')(error)
  store.set('yourLegislators')([])
  store.set('outerLegislators')(legislators)
  console.log(error)
}

export function fetchLegislators() {
  setIsFetching(true)

  const streetAddress = store.get('streetAddress')
  const town = store.get('town')
  const zip = store.get('zip')
  const address = `${streetAddress}, ${town}, ME ${zip}`
  console.log(address)

  fetchDivisionsByAddress(address)
    .then(function(ocdIds) {
      // Partition full list of legislators into 'yours' and 'others'
      const [yours, others] = partition(legislators, function(legislator) {
        return ocdIds.some(function(ocdId) {
          return legislator.ocdId === ocdId
        })
      })

      // Update store
      receiveLegislators({ yours, others })
    })
    .catch(function(error) {
      receiveError(error)
    })
}


// Connect store

const withStore = connect(store)
export default withStore
