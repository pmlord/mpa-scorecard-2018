import getKeys from 'lodash/keys'
const apiKey = process.env.REACT_APP_CIVIC_INFI_API_KEY

function url(address) {
  return `https://www.googleapis.com/civicinfo/v2/representatives?address=${address}&includeOffices=true&levels=administrativeArea1&roles=legislatorLowerBody&roles=legislatorUpperBody&key=${apiKey}`
}

export function fetchDivisionsByAddress(address) {
  return fetchJSON(url(address))
    .then(function(data) {
      if (data.error) {
        console.error('TODO: handle error state', data.error)
      }
      else if (!data.divisions) {
        console.error('TODO: handle second error state')
      }
      else {
        return getKeys(data.divisions)
      }
    })
}

function fetchJSON(url) {
  return fetch(url)
    .then(
      (res) => {
        return res.json()
      },
      (err) => { console.error(err) }
    )
}

// findLegislators('81 Main St. Yarmouth, ME 04096')
//   .then(ocdIds => console.log('ocdids', ocdIds))
