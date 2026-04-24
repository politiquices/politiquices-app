/**
 * Extracts the Wikidata entity ID from a full URI or returns the value as-is.
 * e.g. "http://www.wikidata.org/entity/Q610788" → "Q610788"
 *      "Q610788" → "Q610788"
 */
export function entityId(wikiId) {
  return typeof wikiId === 'string' && wikiId.includes('/')
    ? wikiId.split('/').at(-1)
    : wikiId
}
