import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import { MIN_YEAR as minYear, MAX_YEAR as maxYear } from '../constants'

function TabLabel({ label, count }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {label}
      <Chip label={count} size="small" />
    </Box>
  )
}

function RelatedList({ entries, versusHref }) {
  const { t } = useTranslation()
  if (!entries || entries.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ mt: 2, ml: 2 }}>
        {t('topRelated.noResults')}
      </Typography>
    )
  }

  return (
    <List dense>
      {entries.map((entry) => (
        <ListItem key={entry.wiki_id} alignItems="flex-start">
          <ListItemAvatar>
            <Link href={entry.wiki_id}>
              <Avatar alt={entry.name} src={entry.image_url} sx={{ width: 52, height: 52 }} />
            </Link>
          </ListItemAvatar>
          <ListItemText
            primary={<Link href={entry.wiki_id}>{entry.name}</Link>}
            secondary={
              <Link href={versusHref(entry)}>
                {`${entry.relative} (${entry.freq})`}
              </Link>
            }
          />
        </ListItem>
      ))}
    </List>
  )
}

function TopRelated(data) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState(0)
  const [showSection, setShowSection] = useState(false)

  if (!data.data.relationships.who_opposes_person) {
    return null
  }

  const rels = data.data.relationships
  const wikiId = data.data.wiki_id

  // Sort all arrays by frequency descending
  const apoiadoPor = [...rels.who_supports_person].sort((a, b) => b.freq - a.freq)
  const apoia = [...rels.who_person_supports].sort((a, b) => b.freq - a.freq)
  const opostoPor = [...rels.who_opposes_person].sort((a, b) => b.freq - a.freq)
  const opoeSe = [...rels.who_person_opposes].sort((a, b) => b.freq - a.freq)

  const tabs = [
    {
      label: t('topRelated.supportedBy'),
      entries: apoiadoPor,
      versusHref: (entry) => `/versus/${entry.wiki_id}/ent1_supports_ent2/${wikiId}/${minYear}/${maxYear}`,
    },
    {
      label: t('topRelated.supports'),
      entries: apoia,
      versusHref: (entry) => `/versus/${wikiId}/ent1_supports_ent2/${entry.wiki_id}/${minYear}/${maxYear}`,
    },
    {
      label: t('topRelated.opposedBy'),
      entries: opostoPor,
      versusHref: (entry) => `/versus/${entry.wiki_id}/ent1_opposes_ent2/${wikiId}/${minYear}/${maxYear}`,
    },
    {
      label: t('topRelated.opposes'),
      entries: opoeSe,
      versusHref: (entry) => `/versus/${wikiId}/ent1_opposes_ent2/${entry.wiki_id}/${minYear}/${maxYear}`,
    },
  ]

  const active = tabs[activeTab]

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: showSection ? 1 : 0 }}>
        <Button variant="contained" onClick={() => setShowSection(!showSection)}>
          {t('topRelated.personalities')}
        </Button>
      </Box>
      {showSection && (
        <>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
          >
            {tabs.map((tab, i) => (
              <Tab
                key={tab.label}
                id={`related-tab-${i}`}
                aria-controls={`related-tabpanel-${i}`}
                label={<TabLabel label={tab.label} count={tab.entries.length} />}
              />
            ))}
          </Tabs>
          <Box
            role="tabpanel"
            id={`related-tabpanel-${activeTab}`}
            aria-labelledby={`related-tab-${activeTab}`}
            sx={{ maxHeight: 400, overflowY: 'auto' }}
          >
            <RelatedList entries={active.entries} versusHref={active.versusHref} />
          </Box>
        </>
      )}
    </Box>
  )
}

export default TopRelated
