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




// ----------------------------------------------------------------------------
// Fetch Legislator's table and merge with existing legislator data
// ----------------------------------------------------------------------------

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

    const fakeLegislatorFields = {
      mpaScore: parseInt(parseInt(Math.random() * 16, 10) / 15 * 100, 10),
      voterScore: parseInt(parseInt(Math.random() * 16, 10) / 15 * 100, 10),
    }

    Object.assign(legislatorsByOcdId[ocdId], fakeLegislatorFields, legislator)
  }, function() {

    console.log('--- Done ---')
    const payload = JSON.stringify(legislators, null, '  ')

    fs.writeFile('./src/data/legislators.json', payload, function(err) {
      if (err) console.log(err)
    })

    createFakeBillData(legislators)
  })
})




// ----------------------------------------------------------------------------
// Fake Bill information (lorem ipsum)
// ----------------------------------------------------------------------------

const faker = require('faker')

const stances = [
  'opposed',
  'supported',
]

function createFakeBillData(legislators) {
  // Get array of all bill ids
  const billIds = _(legislators)
    .map(function(legislator) {
      return _.keys(legislator.votes)
    })
    .flatten()
    .uniq()
    .value()

  // Create array of fake bills
  const bills = billIds.map(function(billId) {
    const bill = {
      id: billId,
      name: faker.company.catchPhrase(),
      quote: `"${faker.lorem.paragraph()}"\n - ${faker.name.findName()}`,
      what_is_the_bill: faker.lorem.paragraph(),
      why_it_matters: faker.lorem.paragraph(),
      what_happened: faker.lorem.sentence(),
      short_description: faker.lorem.sentence(),
      bill_text_url: faker.internet.url(),
      more_info_url: faker.internet.url(),
      mpa_stance: _.sample(stances),
      voter_stance: _.sample(stances),
      photo: 'https://picsum.photos/300/300',
    }

    return bill
  })

  // Write to file
  fs.writeFile(
    './src/data/bills.json',
    JSON.stringify(bills, null, '  '),
    function(err) {
      if (err) console.log(err)
    }
  )
}





// ----------------------------------------------------------------------------
// Utility Functions
// ----------------------------------------------------------------------------

function parseBool(input) {
  if (input == null) return null

  const str = input.toLowerCase()
  return str === 'true' || str === 't'
}
