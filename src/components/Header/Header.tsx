import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import './Header.css'
import { useCart } from '../../hooks/useCart'
import SearchBar from '../SearchBar/SearchBar'

interface Props {
  onSearchChange?: (v: string) => void
  searchValue?: string
}

export const Header: React.FC<Props> = ({ onSearchChange, searchValue }) => {
  const { items } = useCart()
  const navigate = useNavigate()

  return (
    <AppBar position="static" className="header">
      <Toolbar className="header__toolbar">
        <Typography variant="h6" component={Link} to="/home" className="header__brand">
          Relatos de Papel
        </Typography>
        <div className="header__search">
          <SearchBar
            value={searchValue ?? ''}
            onChange={(v) => {
              if (onSearchChange) onSearchChange(v)
              // always navigate to home when user types a search
              navigate('/home')
            }}
          />
        </div>
        <div className="header__spacer" />
        <IconButton
          color="inherit"
          onClick={() => {
            if (onSearchChange) onSearchChange('')
            navigate('/cart')
          }}
        >
          <Badge badgeContent={items.length} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default Header
