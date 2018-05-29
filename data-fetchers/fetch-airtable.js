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
        votes[key] = _.capitalize(value)
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

    // Fetch bills from Airtable and calculate voting score
    createFakeBillData(legislators, function(bills) {
      // Index bills by id
      const billsById = {}
      bills.forEach(function(bill) {
        billsById[bill.id] = bill
      })

      // Iterate through each legislator's votes and tally scores
      legislators.forEach(function(legislator) {
        let mpaTally = 0,
            mpaTotal = 0,
            voterTally = 0,
            voterTotal = 0;

        _.forOwn(legislator.votes, function(legislator_stance, billId) {
          const bill = billsById[billId]
          const { mpa_stance, voter_stance } = bill

          if (legislator_stance !== 'Excused') {
            if (bill.mpa_stance) {
              if (legislator_stance === bill.mpa_stance) mpaTally++
              mpaTotal++
            }
            if (bill.voter_stance) {
              if (legislator_stance === bill.voter_stance) voterTally++
              voterTotal++
            }
          }
        })

        legislator.mpaScore = Math.round(mpaTally / mpaTotal * 100)
        legislator.voterScore = Math.round(voterTally / voterTotal * 100)
      })

      // Write to file
      const payload = JSON.stringify(legislators, null, '  ')
      fs.writeFile('./src/data/legislators.json', payload, function(err) {
        if (err) console.log(err)
        console.log('--- Done ---')
      })
    })
  })
})




// ----------------------------------------------------------------------------
// Fake Bill information (lorem ipsum)
// ----------------------------------------------------------------------------

const faker = require('faker')

const stances = [
  'Opposed',
  'Supported',
]

function createFakeBillData(legislators, cb) {
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
      official_title: faker.commerce.product(),
      shorthand_title: faker.company.catchPhrase(),
      quote: faker.lorem.paragraph(),
      quote_attribution: faker.name.findName(),
      what_is_the_bill: faker.lorem.paragraph(),
      why_it_matters: faker.lorem.paragraph(),
      what_happened: faker.lorem.sentence(),
      short_description: faker.lorem.sentence(),
      bill_text_url: faker.internet.url(),
      more_info_url: faker.internet.url(),
      mpa_stance: _.sample(stances),
      voter_stance: (Math.random() >= 0.75) ? _.sample(stances) : null,
      photo: 'https://picsum.photos/300/300',
    }

    return bill
  })

  cb(bills)

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
