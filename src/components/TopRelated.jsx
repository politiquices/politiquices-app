import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import CardHeader from '@mui/material/CardHeader'
import { MIN_YEAR as minYear, MAX_YEAR as maxYear } from '../constants'

function TopRelated(data) {
  if (data.data.relationships.who_opposes_person) {
    // sort by freq.
    data.data.relationships.who_opposes_person.sort((a, b) => b.freq - a.freq)
    data.data.relationships.who_supports_person.sort((a, b) => b.freq - a.freq)
    data.data.relationships.who_person_supports.sort((a, b) => b.freq - a.freq)
    data.data.relationships.who_person_opposes.sort((a, b) => b.freq - a.freq)

    const whoOpposesPerson = data.data.relationships.who_opposes_person.map((entry) => (
      <Stack spacing={1}>
        <CardHeader
          avatar={
            <Link href={`${entry.wiki_id}`}>
              <Avatar alt={entry.name} src={entry.image_url} sx={{ width: 66, height: 66 }} />
            </Link>
          }
          title={<Link href={`${entry.wiki_id}`}>{entry.name}</Link>}
          subheader={
            <Link
              href={`/versus/${entry.wiki_id}/${'ent1_opposes_ent2'}/${data.data.wiki_id}/${minYear}/${maxYear}`}
            >{`${entry.relative} (${entry.freq})`}</Link>
          }
        />
      </Stack>
    ))

    const whoSupportsPerson = data.data.relationships.who_supports_person.map((entry) => (
      <Stack spacing={1}>
        <CardHeader
          avatar={
            <Link href={`${entry.wiki_id}`}>
              <Avatar alt={entry.name} src={entry.image_url} sx={{ width: 66, height: 66 }} />
            </Link>
          }
          title={<Link href={`${entry.wiki_id}`}>{entry.name}</Link>}
          subheader={
            <Link
              href={`/versus/${entry.wiki_id}/${'ent1_supports_ent2'}/${data.data.wiki_id}/${minYear}/${maxYear}`}
            >{`${entry.relative} (${entry.freq})`}</Link>
          }
        />
      </Stack>
    ))

    const whoPersonSupports = data.data.relationships.who_person_supports.map((entry) => (
      <Stack spacing={1}>
        <CardHeader
          avatar={
            <Link href={`${entry.wiki_id}`}>
              <Avatar alt={entry.name} src={entry.image_url} sx={{ width: 66, height: 66 }} />
            </Link>
          }
          title={<Link href={`${entry.wiki_id}`}>{entry.name}</Link>}
          subheader={
            <Link
              href={`/versus/${data.data.wiki_id}/${'ent1_supports_ent2'}/${entry.wiki_id}/${minYear}/${maxYear}`}
            >{`${entry.relative} (${entry.freq})`}</Link>
          }
        />
      </Stack>
    ))

    const whoPersonOpposes = data.data.relationships.who_person_opposes.map((entry) => (
      <Stack spacing={1} align="center">
        <CardHeader
          avatar={
            <Link href={`${entry.wiki_id}`}>
              <Avatar alt={entry.name} src={entry.image_url} sx={{ width: 66, height: 66 }} />
            </Link>
          }
          title={<Link href={`${entry.wiki_id}`}>{entry.name}</Link>}
          subheader={
            <Link
              href={`/versus/${data.data.wiki_id}/${'ent1_opposes_ent2'}/${entry.wiki_id}/${minYear}/${maxYear}`}
            >{`${entry.relative} (${entry.freq})`}</Link>
          }
        />
      </Stack>
    ))

    return (
      <Grid container direction="row" spacing={1} justifyContent="space-evenly">
        <Box sx={{ width: '15%' }}>
          <Typography align="center">Oposto Por</Typography>
          {whoOpposesPerson}
        </Box>
        <Box sx={{ width: '15%' }}>
          <Typography align="center">Apoiado Por</Typography>
          {whoSupportsPerson}
        </Box>
        <Box sx={{ width: '15%' }}>
          <Typography align="center">Apoia</Typography>
          {whoPersonSupports}
        </Box>
        <Box sx={{ width: '15%' }}>
          <Typography align="center">Opõe-se</Typography>
          {whoPersonOpposes}
        </Box>
      </Grid>
    )
  }
  return null
}

export default TopRelated
