export const ocdIdToLegislatorPath = (ocdId) => {
  const snippit = ocdId
    .replace('ocd-division/country:us/state:me/', '')
    .replace(':', '-')
  return `/legislators/${snippit}`
}

export const legislatorPathToOcdid = (snippit) => {
  const unescapedSnippit = snippit.replace('-', ':')
  return `ocd-division/country:us/state:me/${unescapedSnippit}`
}
