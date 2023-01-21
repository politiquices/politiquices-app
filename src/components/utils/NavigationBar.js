/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
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
import AdbIcon from '@mui/icons-material/Adb'
import { Link } from 'react-router-dom'
import { styled, alpha } from '@mui/material/styles'
import InputBase from '@mui/material/InputBase'
import SearchIcon from '@mui/icons-material/Search'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

const pages = [
  ['Estatística', 'estatistica'],
  ['Grafo', 'grafo'],
  ['Pesquisa', 'pesquisa'],
  ['Personalidades', 'personalidades'],
  ['Queries', 'queries'],
  ['Relações', 'relacoes'],
  ['Topicos', 'topicos'],
  ['Sobre', 'sobre'],
]

/*
SELECT ?assembly ?name
(CONCAT(STR(YEAR(?inception)),".", STR(MONTH(?inception))) as ?inceptionDisplayDate)
(CONCAT(STR(YEAR(?abolished)),".", STR(MONTH(?abolished))) as ?abolishedDisplayDate)
(CONCAT(STR(YEAR(?end_time)),".", STR(MONTH(?end_time))) as ?end_timeDisplayDate)
WHERE {
    ?assembly wdt:P31 wd:Q15238777 .
    ?assembly wdt:P17 wd:Q45 .
    ?assembly rdfs:label ?name FILTER(LANG(?name) = "pt")
    ?assembly wdt:P571 ?inception .

    OPTIONAL {
      ?assembly wdt:P576 ?abolished .    
    }
      OPTIONAL {
  ?assembly wdt:P582 ?end_time .
    }
  FILTER (?inception >= "1991-10-31T00:00:00Z"^^xsd:dateTime)
}
ORDER BY (?inception)
*/
const assembleias = [
  ['Q28846999', 'VI Legislatura (1991 - 1995)'],
  ['Q28846985', 'VII Legislatura (1995 - 1999)'],
  ['Q28846952', 'VIII Legislatura (1999 -	2002)'],
  ['Q25438238', 'IX Legislatura (2002 - 2005)'],
  ['Q25431190', 'X Legislatura (2005 - 2009)'],
  ['Q25431189', 'XI Legislatura (2009 - 2011)'],
  ['Q3570377', 'XII Legislatura (2011 - 2015)'],
  ['Q25379987', 'XIII Legislatura (2015 - 2019)'],
  ['Q72073997', 'XIV Legislatura (2019 - 2022'],
  ['Q110768513', 'XV Legislatura (2022 -	)'],
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
const governments = [
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
  ['Q110819776', 'XXIII Governo (2022 - )'],
]

/* const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
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
})) */

function NewResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null)
  const [anchorElUser, setAnchorElUser] = React.useState(null)
  const [anchorElUserAss, setAnchorElUserAss] = React.useState(null)
  const [personalities, setPersonalities] = React.useState(null)

  // read the persons.json to fill the select
  function loadPersonalities() {
    fetch('http://127.0.0.1:8000/persons_and_parties/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setPersonalities(data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    loadPersonalities()
  }, [])

  function handleChange(e, selected) {
    window.open(`/personalidade/${selected.value}`, '_self')
  }

  function ComboBox() {
    return (
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        onChange={handleChange}
        options={personalities}
        sx={{ width: 300 }}
        // eslint-disable-next-line react/jsx-props-no-spreading
        renderInput={(params) => (
          <TextField
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...params}
            InputLabelProps={{ style: { color: 'white', fontSize: 15 } }}
            label="Personalidade.."
          />
        )}
      />
    )
  }

  // Governos
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }
  const handleOpenUserMenuGov = (event) => {
    setAnchorElUser(event.currentTarget)
  }
  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
    setAnchorElUserAss(null)
  }
  const handleNavClick = (value) => {
    // navigate(`/${pageName}`)
    window.open(`/government/${value}`, '_self')
    setAnchorElUser(null)
  }

  // Assembleias
  const handleOpenUserMenuAss = (event) => {
    setAnchorElUserAss(event.currentTarget)
  }

  const handleNavClickAss = (value) => {
    // navigate(`/${pageName}`)
    window.open(`/assembly/${value}`, '_self')
    setAnchorElUserAss(null)
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page[0]} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page[0]}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Link key={page} style={{ textDecoration: 'none' }} to={`/${page[1]}`}>
                <Button key={page[0]} onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
                  {page[0]}
                </Button>
              </Link>
            ))}
          </Box>
          {/* Pesquisa */}
          <ComboBox />
          {/* Governos */}
          <Button onClick={handleOpenUserMenuGov} sx={{ my: 2, color: 'white', display: 'block' }}>
            Governos
          </Button>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {governments.map((government) => (
              <MenuItem key={government[0]} onClick={() => handleNavClick(government[0])}>
                <Typography textAlign="center">{government[1]}</Typography>
              </MenuItem>
            ))}
          </Menu>
          {/* Assembleias */}
          <Button onClick={handleOpenUserMenuAss} sx={{ my: 2, color: 'white', display: 'block' }}>
            Assembleias
          </Button>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUserAss}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUserAss)}
            onClose={handleCloseUserMenu}
          >
            {assembleias.map((assembleia) => (
              <MenuItem key={assembleia[0]} onClick={() => handleNavClickAss(assembleia[0])}>
                <Typography textAlign="center">{assembleia[1]}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default NewResponsiveAppBar
