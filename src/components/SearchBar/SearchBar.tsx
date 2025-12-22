import React from 'react'
import TextField from '@mui/material/TextField'
import './SearchBar.css'

interface Props {
  value: string
  onChange: (v: string) => void
}

export const SearchBar: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="search-bar">
      <TextField
        className="search-bar__input"
        label="Buscar por título"
        variant="outlined"
        size="small"
        fullWidth
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      />
    </div>
  )
}

export default SearchBar
