import slug from 'slug'
import { legislatorsByOcdId } from '../data/index'

export const legislatorPath = (legislator) => {
  const ocdId = legislator.ocdId
  const snippit = ocdId
    .replace('ocd-division/country:us/state:me/', '')
    .replace(':', '-')
  const nameSlug = slug(legislator.name)

  return `/legislators/${snippit}/${nameSlug}`
}

export const getLegislatorFromParams = (snippit) => {
  const unescapedSnippit = snippit.replace('-', ':')
  const ocdId = `ocd-division/country:us/state:me/${unescapedSnippit}`

  return legislatorsByOcdId[ocdId]
}
