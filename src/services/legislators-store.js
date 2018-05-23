import { connect, createStore } from 'undux'
import legislators from '../data/'
import { fetchDivisionsByAddress } from './civic-info-api'
import partition from 'lodash/partition'


// Store
const store = createStore({
  streetAddress: '57 Main St.',
  town: 'Brunswick',
  zip: '',
  yourLegislators: [],
  otherLegislators: legislators,
  isFetching: false,
  errors: null,
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
  store.set('errors')(null)
  clearLegislators()
}
function receiveLegislators({yours, others}) {
  setYourLegislators(yours)
  setOtherLegislators(others)
  store.set('errors')(null)
  store.set('isFetching')(false)
}

const setYourLegislators = store.set('yourLegislators')
const setOtherLegislators = store.set('otherLegislators')

export function fetchLegislators() {
  console.log('fetching...')
  setIsFetching(true)

  const streetAddress = store.get('streetAddress')
  const town = store.get('town')
  const zip = store.get('zip')
  const address = `${streetAddress}, ${town}, ME ${zip}`
  console.log(address)

  fetchDivisionsByAddress(address).then(function(ocdIds) {
    console.log('done.')
    if (ocdIds == null)
      return []

    const [yours, others] = partition(legislators, function(legislator) {
      return ocdIds.some(function(ocdId) {
        return legislator.ocdId === ocdId
      })
    })

    receiveLegislators({yours, others})
  })
}


// Connect store

const withStore = connect(store)
export default withStore

fetchLegislators()
