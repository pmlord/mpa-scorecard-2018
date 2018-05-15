const _           = require('lodash')
const fs          = require('fs')
const nodeFetch   = require('node-fetch')
const Cache       = require('file-system-cache').default
const fetchCached = require('fetch-cached').default
const asyncLib    = require('async')
const cheerio     = require('cheerio')





// ==========
// = Config =
// ==========

const config = {
  useCache: true // process.env.USE_CACHE === true,
}

if (config.useCache) {
  console.log(); console.warn('Warning: using cached legislator data when available. This may not be fresh data.'); console.log()
}





// ================
// = Set up cache =
// ================

if (!fs.existsSync('./tmp')){
    fs.mkdirSync('./tmp');
}
if (!fs.existsSync('./tmp/data-fetch')){
    fs.mkdirSync('./tmp/data-fetch');
}

const cache = Cache({
  basePath: './tmp/data-fetch',
})





// =================
// = Fetch wrapper =
// =================

const fetch = fetchCached({
  fetch: (url) => { console.log('fetching', url); return nodeFetch(url) },
  cache: {
    get: (config.useCache) ? (k) => cache.get(k) : (k) => Promise.resolve(null),
    set: (k, v) => cache.set(k, v)
  }
})

async function fetchJSON(url) {
  const response   = await fetch(url)
  const parsedJSON = await response.json()
  return parsedJSON
}





// ----------------------------------------------------------------------------
// Legislative fetching and parsing
// ----------------------------------------------------------------------------

const PARTY_ABBREVIATIONS = {
  D: 'Democrat',
  R: 'Republican',
  I: 'Independent',
}

async function fetchTownList() {
  try {

    // Fetch the Maine Legislature's list of representatives by town
    const response = await fetch('https://legislature.maine.gov/house/townlist.htm')

    // Parse response into Cheerio.js
    const html = await response.text()
    const $ = cheerio.load(html)

    // Filter <p> elements to get just towns
    const towns = $('p').filter((i, el) => {
      const text = $(el).text()
      return text.match('House District') && text.match('Senate District')
    })
    const townsText = towns.text()

    // Scrape URLs for each legislator.
    const allHrefs = $(towns).find('a')
      .map((i, el) => {
        return $(el).attr('href')
      })
      .get()
    const hrefs = _.uniq(allHrefs)

    // Collect the full list of towns
    const townNames = []
    $(towns).each((i, town) => {
      const townName = matchClosure($(town).text(), /^(.+) - House District/i)
      townNames.push(townName)
    })
    fs.writeFile(
      './src/data/townNames.json',
      JSON.stringify(townNames, null, '  '),
      (err) => { if (err) throw err; console.log('saved ./src/data/townNames.json') }
    )

    // Fetch each legislator's bio page and parse
    asyncLib.mapLimit(hrefs, 10, async function(href) {
      let legislator
      if (href.match('http://legislature.maine.gov/')) {
        // The URL belongs to a senator

        // The senator bio pages are missing party affiliation and
        // legal_residence, so we need to painstakingly pull these from the
        // townlist before passing information to the parseSen function.
        // I know. This is terrible.
        const name = $(towns).find(`a[href="${href}"]`).first().text()
        const regexp = new RegExp(`${name} \\((\\w)-([^\\s]+)\\)`)
        const match = townsText.match(regexp)
        const party_abbreviation = match[1]
        const legal_residence = match[2]
        const url = href
        const html = await fetch(url).then(res => res.text())
        return parseSen({url, html, legal_residence, party_abbreviation})
      }
      else {
        // The URL belongs to a rep
        const url = `http://legislature.maine.gov/house/${href}`
        const html = await fetch(url).then(res => res.text())
        return parseRep(url, html)
      }
    }, (err, results) => {
      if (err) { console.log(err) }

      // Prune results into final legislators array
      const legislators = _(results)
        .compact()
        .sortBy(['legislative_chamber', 'districtNum'])
        .value()

      // Write the combined info of all legislators to file
      fs.writeFile(
        './src/data/legislators.json',
        JSON.stringify(legislators, null, '  '),
        (err) => { if (err) throw err; console.log('saved ./src/data/legislators.json') }
      )

      // Check each legislator and verify that none of their properties have
      // null values. If they do, log it in the console and write to file.
      const null_props = []
      legislators.forEach((legislator) => {
        _.forOwn(legislator, (value, key, obj) => {
          if (value == null)
            null_props.push([key, legislator.url])
        })
      })
      fs.writeFile(
        './src/data/legislator_errors.json',
        JSON.stringify(null_props, null, '  '),
        (err) => { if (err) throw err; console.log('saved ./src/data/legislator_errors.json') }
      )
      if (null_props.length !== 0) {
        console.log('\nThe following scraped properties returned null:')
        console.log(...null_props)
        console.log()
      }
    })

  } catch(err) { throw err }
}

function parseSen({url, html, legal_residence, party_abbreviation}) {
  // Load into Cheerio.js
  const $html = cheerio.load(html)
  const $ = cheerio.load($html('#content').html())
  const text = $.text()

  // console.log($.html())
  // console.log(text)

  // Legislative Chamber
  const legislative_chamber = 'Senate'

  // Parse header
  const header = $('h1').text()

  // District number
  const districtNum = parseInt(matchClosure(
    header,
    /^district\s*([0-9]+)/i
  ))

  // Open Civic Data district ID
  const ocdId = `ocd-division/country:us/state:me/sldu:${districtNum}`

  // Representing towns
  const towns = matchClosure(
    text,
    /Representing Senate District.+?:\s+(.+)/i
  )

  // Party
  const party = PARTY_ABBREVIATIONS[party_abbreviation]

  // Name
  const name = matchClosure(
    header,
    /(Sen|Pres)\.\s+(.+)/,
    2
  )

  // Address
  const address = matchClosure(
    text,
    /address.*?:\s*(.+)/i
  )

  // Email
  const email = matchClosure(
    text,
    /e-?mail:\s*(.+)/i
  )

  // Phone
  const cell_phone = matchClosure(
    text,
    /cell \w*phone:\s*(.+)\s*/i
  )
  const home_phone = matchClosure(
    text,
    /home \w*phone:\s*(.+)\s*/i
  )
  const business_phone = matchClosure(
    text,
    /business \w*phone:\s*(.+)\s*/i
  )
  const generic_phone = matchClosure(
    text,
    /phone:\s*(.+)\s*/i
  )
  const phone = cell_phone || home_phone || business_phone || generic_phone

  const senator = {
    name,
    ocdId,
    legislative_chamber,
    districtNum,
    towns,
    party,
    legal_residence,
    address,
    email,
    phone,
    url,
  }

  return senator
}

function parseRep(url, html) {
  // Load into Cheerio.js
  const $ = cheerio.load(html)
  const text = $.text()

  // Legislative Chamber
  const legislative_chamber = 'House'

  // Name
  const name = $('table td:nth-child(2) h2').text()

  // Hometown
  // const hometown = matchClosure(
  //   $('table td:nth-child(2) h4').text(),
  //   /\(\w+?-(.+)\)/
  // )
  const legal_residence = matchClosure(
    text,
    /Legal Residence:\s+(.+)/i
  )

  // Representing
  const representing = matchClosure(
    text,
    /representing:\s+(.+)/i
  )

  // District number
  const districtNum = parseInt(matchClosure(
    representing,
    /^district ([0-9]+)/i
  ))

  // Open Civic Data district ID
  const ocdId = `ocd-division/country:us/state:me/sldl:${districtNum}`

  // Representing towns
  const towns = matchClosure(
    representing,
    /.+?-\s+(.+)/i
  )

  // Address
  const address = matchClosure(
    text,
    /address.*?:\s*(.+)/i
  )

  // Email
  const email = matchClosure(
    text,
    /e-?mail:\s*(.+)/i
  )

  // Phone
  const cell_phone = matchClosure(
    text,
    /cell \w*phone:\s*(.+)\s*/i
  )
  const home_phone = matchClosure(
    text,
    /home \w*phone:\s*(.+)\s*/i
  )
  const business_phone = matchClosure(
    text,
    /business \w*phone:\s*(.+)\s*/i
  )
  const generic_phone = matchClosure(
    text,
    /phone:\s*(.+)\s*/i
  )
  const phone = cell_phone || home_phone || business_phone || generic_phone

  // Party affiliation
  const party_abbreviation = matchClosure(
      $('table td:nth-child(2) h4').text(),
      /\((\w+?)-(.+)\)/
    )
  const party_full_name = matchClosure(
    text,
    /party.*:\s*(.*)/i
  )
  const party = (party_full_name != null)
    ? party_full_name
    : PARTY_ABBREVIATIONS[party_abbreviation]

  // Deceased
  const deceased = text.match(/died|deceased/i)

  // Assemble relevant info into object
  const rep = {
    name,
    ocdId,
    legislative_chamber,
    districtNum,
    towns,
    party,
    legal_residence,
    address,
    email,
    phone,
    url,
  }

  return (deceased) ? null : rep
}

function matchClosure(str, regexp, n=1) {
  const match = str.match(regexp)
  if (match) return match[n]
  else return null
}




// =============
// = Utilities =
// =============

function parseBool(inputStr) {
  if (typeof(inputStr) !== 'string') return false

  const str = inputStr.toLowerCase()
  return str === 'true' || str === 't'
}




// ----------------------------------------------------------------------------
// Actions
// ----------------------------------------------------------------------------

fetchTownList()
