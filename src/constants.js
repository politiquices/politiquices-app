export const MIN_YEAR = parseInt(import.meta.env.VITE_MIN_YEAR, 10)
export const MAX_YEAR = parseInt(import.meta.env.VITE_MAX_YEAR, 10)

export const COLOR_SUPPORTS = '#44861E'
export const COLOR_OPPOSES = '#d32f2f'
export const COLOR_SUPPORTS_BG = '#e8f5e9'
export const COLOR_OPPOSES_BG = '#ffebee'

/*
  SPARQL query used to build ASSEMBLIES (run against Wikidata):

  SELECT ?assembly ?name
  (CONCAT(STR(YEAR(?inception)),".", STR(MONTH(?inception))) as ?inceptionDisplayDate)
  (CONCAT(STR(YEAR(?abolished)),".", STR(MONTH(?abolished))) as ?abolishedDisplayDate)
  (CONCAT(STR(YEAR(?end_time)),".", STR(MONTH(?end_time))) as ?end_timeDisplayDate)
  WHERE {
      ?assembly wdt:P31 wd:Q15238777 .
      ?assembly wdt:P17 wd:Q45 .
      ?assembly rdfs:label ?name FILTER(LANG(?name) = "pt")
      ?assembly wdt:P571 ?inception .
      OPTIONAL { ?assembly wdt:P576 ?abolished . }
      OPTIONAL { ?assembly wdt:P582 ?end_time . }
      FILTER (?inception >= "1991-10-31T00:00:00Z"^^xsd:dateTime)
  }
  ORDER BY (?inception)

  SPARQL query used to build GOVERNMENTS (run against Wikidata):

  SELECT ?governo ?name
  (CONCAT(STR(YEAR(?inception)),".", STR(MONTH(?inception)), ".", STR(DAY(?inception))) as ?inceptionDisplayDate)
  (CONCAT(STR(YEAR(?abolished)),".", STR(MONTH(?abolished)), ".", STR(DAY(?abolished))) as ?abolishedDisplayDate)
  WHERE {
      ?governo wdt:P31 wd:Q16850120 .
      ?governo wdt:P17 wd:Q45 .
      ?governo rdfs:label ?name FILTER(LANG(?name) = "pt")
      ?governo wdt:P571 ?inception . FILTER(LANG(?name) = "pt")
      OPTIONAL { ?governo wdt:P576 ?abolished . FILTER(LANG(?name) = "pt") }
      FILTER (?inception >= "1991-10-31T00:00:00Z"^^xsd:dateTime)
  }
  ORDER BY (?inception)
*/

export const GOVERNMENTS = [
  ['Q3570375', 'XII Governo (1991 - 1995)'],
  ['Q1719936', 'XIII Governo (1995 - 1999)'],
  ['Q684129', 'XIV Governo (1999 - 2002)'],
  ['Q1719859', 'XV Governo (2002 - 2004)'],
  ['Q1146060', 'XVI Governo (2004 - 2005)'],
  ['Q239352', 'XVII Governo (2005 - 2009)'],
  ['Q1568610', 'XVIII Governo (2009 - 2011)'],
  ['Q1626916', 'XIX Governo (2011 - 2015)'],
  ['Q21554845', 'XX Governo (2015 - 2015)'],
  ['Q21224349', 'XXI Governo (2015 - 2019)'],
  ['Q71014092', 'XXII Governo (2019 - 2022)'],
  ['Q110819776', 'XXIII Governo (2022 - 2024)'],
  ['Q123509897', 'XXIV Governo (2024 -)'],
]

export const ASSEMBLIES = [
  ['Q28846999', 'VI Legislatura (1991 - 1995)'],
  ['Q28846985', 'VII Legislatura (1995 - 1999)'],
  ['Q28846952', 'VIII Legislatura (1999 - 2002)'],
  ['Q25438238', 'IX Legislatura (2002 - 2005)'],
  ['Q25431190', 'X Legislatura (2005 - 2009)'],
  ['Q25431189', 'XI Legislatura (2009 - 2011)'],
  ['Q3570377', 'XII Legislatura (2011 - 2015)'],
  ['Q25379987', 'XIII Legislatura (2015 - 2019)'],
  ['Q72073997', 'XIV Legislatura (2019 - 2022)'],
  ['Q110768513', 'XV Legislatura (2022 - 2024)'],
  ['Q125131548', 'XVI Legislatura (2024 -)'],
]
