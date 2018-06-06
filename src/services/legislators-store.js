import { connect, createStore } from 'undux'
import { legislators } from '../data/'
import { fetchDivisionsByAddress } from './civic-info-api'
import partition from 'lodash/partition'
import isEmpty from 'lodash/isEmpty'

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


// Selectors

function getAddress() {
  const streetAddress = store.get('streetAddress')
  const town = store.get('town')
  const zip = store.get('zip')

  if (
       isEmpty(streetAddress)
    && isEmpty(town)
    && isEmpty(zip)
  ) {
    return false
  }

  return `${streetAddress}, ${town}, ME ${zip}`
}


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
  clearLegislators()
}

export function fetchLegislators() {
  if (store.get('isFetching')) return false

  setIsFetching(true)
  const address = getAddress()
  if (address === false) {
    receiveError({
      message: 'Please enter an address'
    })
    return false
  }

  fetchDivisionsByAddress(address)
    .then(function(response) {
      const { data, ocdIds } = response

      receiveRawData(data)

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

function receiveRawData(data) {
  const { normalizedInput, offices, officials } = data;

  const zippedOffices = offices.map((office) => {
    return {
      districtName: office.name,
      officialName: officials[office.officialIndices[0]].name,
    };
  });

  store.set('dataCheck')({
    normalizedInput,
    offices: zippedOffices,
  });
}




// Connect store

const withStore = connect(store)
export default withStore
