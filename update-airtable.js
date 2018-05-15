require('dotenv').config()

// Configure Airtable API
const Airtable = require('airtable')
               .configure({ apiKey: process.env.AIRTABLE_API_KEY });
const base = Airtable.base(process.env.AIRTABLE_BASE);

// Abstracted function to fetch all records of a particular table
function getRecordsFromTable(tableName, cb) {
  console.log('fetching', tableName)

  base(tableName).select({
    view: "Grid view"
  }).eachPage(function page(records, fetchNextPage) {

    records.forEach(function(record) {
      cb(record)
    });

    fetchNextPage();
  }, function done(err) {
    if (err) { console.error(err); return; }
    console.log('retrieved', tableName)
  });
}
