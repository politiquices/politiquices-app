/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-unstable-nested-components */
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
// import AdbIcon from '@mui/icons-material/Adb'
import { Link } from 'react-router-dom'
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


function NewResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null)
  const [anchorElUser, setAnchorElUser] = React.useState(null)
  const [anchorElUserAss, setAnchorElUserAss] = React.useState(null)
  const [personalities, setPersonalities] = React.useState(null)
  const [parties, setParties] = React.useState(null)
  const [personsWithNews, setPersonsWithNews] = React.useState([])

  // read the persons.json to fill the select
  function loadPersonalities() {
    getPersonsAndParties()
      .then((data) => {
        setPersonalities(data)
      })
      .catch(() => {})
  }

  function loadParties() {
    getParties()
      .then((data) => {
        const partiesWikis = new Set(data.map((item) => item.wiki_id));
        setParties(partiesWikis)
      })
      .catch(() => {})
  }

  useEffect(() => {
    loadPersonalities()
    loadParties()
    getPersons().then(setPersonsWithNews).catch(() => {})
  }, [])

  function isParty(selected) {
    // check if the selected value is in partiesWikis
    return parties.has(selected.value)
  }

  function handleChange(e, selected) {
    if (isParty(selected)) {
      window.open(`/party/${selected.value}`, '_self')
    }
    else {
      window.open(`/personalidade/${selected.value}`, '_self')
      }
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

  const handleRandomPersonality = () => {
    if (personsWithNews.length > 0) {
      const randomIndex = Math.floor(Math.random() * personsWithNews.length);
      const randomPerson = personsWithNews[randomIndex];
      window.open(`/personalidade/${randomPerson.value}`, '_self');
    }
  };

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logotipo
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 200,
              letterSpacing: '.05rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Politiquices
          </Typography>
          */}
          
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

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Link 
                key={page[0]} 
                style={{ textDecoration: 'none' }} 
                to={page[1] === 'random' ? '#' : `/${page[1]}`}
                onClick={page[1] === 'random' ? handleRandomPersonality : undefined}
              >
                <Button 
                  key={page[0]} 
                  onClick={handleCloseNavMenu} 
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
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
