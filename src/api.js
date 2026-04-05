const BASE = import.meta.env.VITE_POLITIQUICES_API

function get(path) {
  return fetch(`${BASE}${path}`).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    return r.json()
  })
}

export function getPersonsAndParties() {
  return get('/persons_and_parties/')
}

export function getParties() {
  return get('/parties/')
}

export function getPersons() {
  return get('/persons/')
}

export function getQueries({ ent1, ent2, relType, start, end }) {
  const params = new URLSearchParams({ ent1, ent2, rel_type: relType, start, end })
  return get(`/queries?${params}`)
}

export function getRelationships(ent1, relType, ent2, start, end) {
  return get(`/relationships/${ent1}/${relType}/${ent2}/${start}/${end}`)
}

export function getTimeline({ persons, onlyAmongSelected, onlySentiment, start, end, minFreq }) {
  const params = new URLSearchParams()
  persons.forEach((p) => params.append('q', p))
  params.set('selected', onlyAmongSelected)
  params.set('sentiment', onlySentiment)
  params.set('start', start)
  params.set('end', end)
  if (minFreq !== undefined) params.set('min_freq', minFreq)
  return get(`/timeline/?${params}`)
}

export function getPersonality(id) {
  return get(`/personality/${id}`)
}

export function getPersonalityRelationships(id) {
  return get(`/personality/relationships/${id}`)
}

export function getPersonalityTopRelated(id) {
  return get(`/personality/top_related_personalities/${id}`)
}

export function getPersonalitiesPaged(page, portugueseOnly = false) {
  const params = portugueseOnly ? '?portuguese_only=true' : ''
  return get(`/personalities/${page}${params}`)
}

export function getPersonalitiesFiltered(type, id) {
  const paths = {
    education: `/personalities/educated_at/${id}`,
    occupation: `/personalities/occupation/${id}`,
    government: `/personalities/government/${id}`,
    assembly: `/personalities/assembly/${id}`,
    public_office: `/personalities/public_office/${id}`,
    party: `/personalities/party/${id}`,
  }
  return get(paths[type])
}

export function getStats() {
  return get('/stats')
}

export function getQA(question) {
  return get(`/qa/${question}`)
}

export function postCorrection(data) {
  return fetch(`${BASE}/corrections/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then((r) => r.json())
}
