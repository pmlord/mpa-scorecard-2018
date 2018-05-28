import legislators from './legislators.json'

const legislatorsByOcdId = {}
legislators.forEach(function(legislator) {
  legislatorsByOcdId[legislator.ocdId] = legislator
})

export default legislators
export { legislatorsByOcdId }
