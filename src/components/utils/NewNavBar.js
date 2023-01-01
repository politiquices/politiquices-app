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
import AdbIcon from '@mui/icons-material/Adb'
import { Link } from 'react-router-dom'

const pages = [
  ['Grafo', 'grafo'],
  ['Relações', 'relacoes'],
  ['Personalidades', 'personalidades'],
  ['Topicos', 'topicos'],
]

const pagesEnd = [
  ['Estatística', 'estatistica'],
  ['Sobre', 'sobre'],
]

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

function NewResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null)
  const [anchorElUser, setAnchorElUser] = React.useState(null)

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleNavClick = (value) => {
    console.log(value)
    // navigate(`/${pageName}`)
    window.open(`/government/${value}`, '_self')
    setAnchorElUser(null)
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

            <Button onClick={handleOpenUserMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
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

            {pagesEnd.map((page) => (
              <Link key={page} style={{ textDecoration: 'none' }} to={`/${page[1]}`}>
                <Button key={page[0]} onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
                  {page[0]}
                </Button>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default NewResponsiveAppBar
