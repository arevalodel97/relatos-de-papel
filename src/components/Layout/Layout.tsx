import React from 'react'
import Container from '@mui/material/Container'
import { Header } from '../Header/Header'
import './Layout.css'

interface Props {
  children: React.ReactNode
  onSearchChange?: (v: string) => void
  searchValue?: string
}

export const Layout: React.FC<Props> = ({ children, onSearchChange, searchValue }) => {
  return (
    <div className="layout">
      <Header onSearchChange={onSearchChange} searchValue={searchValue} />
      <Container className="layout__content" maxWidth={false} disableGutters>
        {children}
      </Container>
    </div>
  )
}

export default Layout
