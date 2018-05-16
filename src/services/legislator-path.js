import { legislatorsByOcdId } from '../data/index'

export const legislatorPath = (legislator) => {
  const ocdId = legislator.ocdId
  const snippit = ocdId
    .replace('ocd-division/country:us/state:me/', '')
    .replace(':', '-')
  return `/legislators/${snippit}`
}

export const getLegislatorFromParams = (snippit) => {
  const unescapedSnippit = snippit.replace('-', ':')
  const ocdId = `ocd-division/country:us/state:me/${unescapedSnippit}`

  return legislatorsByOcdId[ocdId]
}
