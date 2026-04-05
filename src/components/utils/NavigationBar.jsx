/* eslint-disable react/jsx-no-bind */
import React, { useEffect } from 'react'
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
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import { Link, useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { getPersonsAndParties, getParties, getPersons } from '../../api'
import { GOVERNMENTS, ASSEMBLIES } from '../../constants'

const pages = [
  ['Home', 'home'],
  ['Personalidades', 'personalidades'],
  ['Random', 'random'],
  ['Versus', 'versus'],
  ['Explorar', 'explorar'],
  ['Sobre', 'sobre'],
]

function SearchComboBox({ personalities, isLoading, onSelect }) {
  const [inputValue, setInputValue] = React.useState('')

  return (
    <Autocomplete
      disablePortal
      disableClearable
      id="personalidade-search"
      options={personalities ?? []}
      loading={isLoading}
      inputValue={inputValue}
      onInputChange={(_, value, reason) => {
        if (reason !== 'reset') setInputValue(value)
      }}
      onChange={(e, selected) => {
        if (selected) {
          onSelect(selected)
          setInputValue('')
        }
      }}
      sx={{ width: { xs: 160, sm: 220, md: 280 } }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={isLoading ? 'A carregar...' : 'Pesquisar...'}
          InputLabelProps={{ shrink: false }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiInputBase-input': { color: 'white' },
            '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.6)', opacity: 1 },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.4)' },
            '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.7)' },
          }}
        />
      )}
    />
  )
}

function NewResponsiveAppBar() {
  const navigate = useNavigate()
  const [anchorElNav, setAnchorElNav] = React.useState(null)
  const [anchorElUser, setAnchorElUser] = React.useState(null)
  const [anchorElUserAss, setAnchorElUserAss] = React.useState(null)
  const [personalities, setPersonalities] = React.useState(null)
  const [parties, setParties] = React.useState(null)
  const [personsWithNews, setPersonsWithNews] = React.useState([])

  useEffect(() => {
    getPersonsAndParties().then(setPersonalities).catch(() => {})
    getParties()
      .then((data) => setParties(new Set(data.map((item) => item.wiki_id))))
      .catch(() => {})
    getPersons().then(setPersonsWithNews).catch(() => {})
  }, [])

  const handleSelect = (selected) => {
    if (parties?.has(selected.value)) {
      navigate(`/party/${selected.value}`)
    } else {
      navigate(`/personalidade/${selected.value}`)
    }
  }

  // Governos
  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget)
  const handleCloseNavMenu = () => setAnchorElNav(null)
  const handleOpenUserMenuGov = (event) => setAnchorElUser(event.currentTarget)
  const handleCloseUserMenu = () => { setAnchorElUser(null); setAnchorElUserAss(null) }
  const handleNavClick = (value) => { navigate(`/government/${value}`); setAnchorElUser(null) }

  // Assembleias
  const handleOpenUserMenuAss = (event) => setAnchorElUserAss(event.currentTarget)
  const handleNavClickAss = (value) => { navigate(`/assembly/${value}`); setAnchorElUserAss(null) }

  const handleRandomPersonality = () => {
    if (personsWithNews.length > 0) {
      const randomIndex = Math.floor(Math.random() * personsWithNews.length)
      navigate(`/personalidade/${personsWithNews[randomIndex].value}`)
    }
  }

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
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
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page[0]}
                  onClick={() => { handleCloseNavMenu(); if (page[1] === 'random') handleRandomPersonality() }}
                >
                  <Typography textAlign="center">{page[0]}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Desktop nav */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) =>
              page[1] === 'random' ? (
                <Button
                  key={page[0]}
                  onClick={handleRandomPersonality}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page[0]}
                </Button>
              ) : (
                <Link
                  key={page[0]}
                  style={{ textDecoration: 'none' }}
                  to={`/${page[1]}`}
                >
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    {page[0]}
                  </Button>
                </Link>
              )
            )}
          </Box>

          {/* Pesquisa */}
          <SearchComboBox
            personalities={personalities}
            isLoading={personalities === null}
            onSelect={handleSelect}
          />

          {/* Governos */}
          <Button onClick={handleOpenUserMenuGov} sx={{ my: 2, color: 'white', display: 'block' }}>
            Governos
          </Button>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-governos"
            anchorEl={anchorElUser}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {GOVERNMENTS.map((government) => (
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
            id="menu-assembleias"
            anchorEl={anchorElUserAss}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorElUserAss)}
            onClose={handleCloseUserMenu}
          >
            {ASSEMBLIES.map((assembleia) => (
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
