import legislators from './legislators.json'

const legislatorsByOcdId = {}
legislators.forEach(function(legislator) {
  legislatorsByOcdId[legislator.ocdId] = legislator
})

// Add fake placeholder data until AirTable is ready
legislators.forEach(function(legislator) {
  legislator.mpaScore = parseInt(Math.random() * 100 * 16 / 15, 10)
  legislator.voterScore = parseInt(Math.random() * 100 * 16 / 15, 10)
});

export default legislators
export { legislatorsByOcdId }
