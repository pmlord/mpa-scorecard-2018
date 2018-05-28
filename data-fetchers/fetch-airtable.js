require('dotenv').config()
const fs = require('fs')
const _ = require('lodash')

// Configure Airtable API
// const Airtable = require('airtable')
//                .configure({ apiKey: process.env.AIRTABLE_API_KEY });
// const base = Airtable.base(process.env.AIRTABLE_BASE);

const Airtable = require('airtable');
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE);


// Abstracted function to fetch all records of a particular table
function getRecordsFromTable(tableName, iteratee, cb) {
  console.log('fetching', tableName)

  base(tableName).select({
    view: "Grid view"
  }).eachPage(function page(records, fetchNextPage) {

    records.forEach(function(record) {
      iteratee(record)
    });

    fetchNextPage();
  }, function done(err) {
    if (err) { console.error(err); return; }
    console.log('retrieved', tableName)
    cb()
  });
}


// Fetch Legislator's table and merge with existing legislator data

fs.readFile('./src/data/legislators.json', function(err, data) {
  if (err) {
    console.log(err)
    return;
  }

  const legislators = JSON.parse(data)
  const legislatorsByOcdId = {}

  legislators.forEach(function(legislator) {
    legislatorsByOcdId[legislator.ocdId] = legislator
  })


  const billNameRegExp = /^LD/

  getRecordsFromTable('legislators', function(record) {
    const fields = record.fields

    const ocdIdChamber = fields.legislative_chamber === "House" ? 'sldl' : 'sldu'
    const ocdId = `ocd-division/country:us/state:me/${ocdIdChamber}:${fields.district_number}`

    const votes = {}
    _.forOwn(fields, function(value, key) {
      if (key.match(billNameRegExp)) {
        votes[key] = value
      }
    })

    const legislator = {
      political_party: fields.political_party,
      term_limited: fields.term_limited,
      seeking_reelection: parseBool(fields.seeking_reelection),
      votes: votes,
    }

    Object.assign(legislatorsByOcdId[ocdId], legislator)
  }, function() {

    console.log('--- Done ---')
    const payload = JSON.stringify(legislators, null, '  ')

    fs.writeFile('./src/data/legislators.json', payload, function(err) {
      if (err) console.log(err)
    })
  })
})




function parseBool(input) {
  if (input == null) return null

  const str = input.toLowerCase()
  return str === 'true' || str === 't'
}
