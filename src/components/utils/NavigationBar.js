/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-vars */
import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { Link } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import { styled, alpha } from '@mui/material/styles'
import InputBase from '@mui/material/InputBase'

import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

import { Dropdown, DropdownMenuItem } from './Dropdown'
import PositionedMenu from './Menu'

const pages = [
  ['Grafo', 'grafo'],
  ['Relações', 'relacoes'],
  ['Personalidades', 'personalidades'],
  ['Topicos', 'topicos'],
  ['Estatística', 'estatistica'],
  ['Sobre', 'sobre'],
]

/*
SELECT ?governo ?name 
(CONCAT(STR(YEAR(?inception)),".", STR(MONTH(?inception)), ".", STR(DAY(?inception))) as ?inceptionDisplayDate)
(CONCAT(STR(YEAR(?abolished)),".", STR(MONTH(?abolished)), ".", STR(DAY(?abolished))) as ?abolishedDisplayDate)
WHERE {
    ?governo wdt:P31 wd:Q16850120 .
    ?governo wdt:P17 wd:Q45 .
    ?governo rdfs:label ?name FILTER(LANG(?name) = "pt")
    ?governo wdt:P571 ?inception . FILTER(LANG(?name) = "pt")
OPTIONAL {
  ?governo wdt:P576 ?abolished . FILTER(LANG(?name) = "pt")
  }  
  FILTER (?inception >= "1991-10-31T00:00:00Z"^^xsd:dateTime)
}
ORDER BY (?inception)
*/

const handleGovernment = (government) => {
  console.log(government)
}

const governos = [
  <DropdownMenuItem onClick={handleGovernment('Q3570375')}>XII Governo (1991 - 1995)</DropdownMenuItem>,
  <DropdownMenuItem onClick={handleGovernment('Q1719936')}>XIII Governo (1995 - 1999)</DropdownMenuItem>,
  <DropdownMenuItem onClick={handleGovernment('Q684129')}>XIV Governo (1999 - 2002)</DropdownMenuItem>,
  <DropdownMenuItem onClick={handleGovernment('Q1719859')}>XV Governo (2002 - 2004)</DropdownMenuItem>,
  <DropdownMenuItem onClick={handleGovernment('Q1146060')}>XVI Governo (2004 - 2005)</DropdownMenuItem>,
  <DropdownMenuItem onClick={handleGovernment('Q239352')}>XVII Governo (2005 - 2009)</DropdownMenuItem>,
  <DropdownMenuItem onClick={handleGovernment('Q1568610')}>XVIII Governo (2009 - 2011)</DropdownMenuItem>,
  <DropdownMenuItem onClick={handleGovernment('Q1626916')}>XIX Governo (2011 - 2015)</DropdownMenuItem>,
  <DropdownMenuItem onClick={handleGovernment('Q21554845')}>XX Governo (2015 - 2015)</DropdownMenuItem>,
  <DropdownMenuItem onClick={handleGovernment('Q21224349')}>XXI Governo (2015 - 2019)</DropdownMenuItem>,
  <DropdownMenuItem onClick={handleGovernment('Q71014092')}>XXII Governo (2019 - 2022)</DropdownMenuItem>,
  <DropdownMenuItem onClick={handleGovernment('Q110819776')}>XXIII Governo (2022 - )</DropdownMenuItem>,
]

// const logo = '/assets/images/logos/politiquices_logo.jpg'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.25) },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}))

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null)
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ mx: 'auto' }}>
          <Link to="/">
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              X
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>

            {/* When buttons appear as menu */}
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <Link to={`/${page[1]}`}>{page[0]}</Link>
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* Buttons text is here */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Link key={page} style={{ textDecoration: 'none' }} to={`/${page[1]}`}>
                <Button
                  key={page[0]}
                  onClick={handleCloseNavMenu}
                  variant="text"
                  sx={{
                    border: 0,
                    gap: 4,
                    margin: 2,
                    my: 3,
                    color: 'black',
                    display: 'block',
                  }}
                  style={{ textTransform: 'none' }}
                >
                  <Typography style={{ fontWeight: 1800, fontSize: 20 }}>{page[0]}</Typography>
                </Button>
              </Link>
            ))}
          </Box>
          {/* Search Box at the end */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
          </Search>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default ResponsiveAppBar
