import React, { useCallback, useEffect, useRef, useState } from 'react'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import SearchIcon from '@mui/icons-material/Search'
import './SearchBar.css'
import { bookSearchService } from '../../services/bookSearch.service'
import type { Book } from '../../types/book.types'

interface Props {
  onSearch: (v: string) => void
}

export const SearchBar: React.FC<Props> = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState<Book[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const skipSuggestionsRef = useRef(false)

  // Fetch suggestions when user types
  useEffect(() => {
    if (skipSuggestionsRef.current) {
      skipSuggestionsRef.current = false
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const q = inputValue.trim()
    if (!q) {
      setSuggestions([])
      setOpen(false)
      return
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await bookSearchService.searchBooks(q, 1, 5)
        setSuggestions(res.books)
        setOpen(res.books.length > 0)
      } catch {
        setSuggestions([])
        setOpen(false)
      } finally {
        setLoading(false)
      }
    }, 350)
  }, [inputValue])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const commitSearch = useCallback(
    (value: string) => {
      setOpen(false)
      onSearch(value.trim())
    },
    [onSearch],
  )

  const handleSuggestionClick = (book: Book) => {
    skipSuggestionsRef.current = true
    setInputValue(book.title)
    setOpen(false)
    commitSearch(book.title)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commitSearch(inputValue)
  }

  return (
    <div className="search-bar" ref={containerRef}>
      <div className="search-bar__field-wrap">
        <TextField
          className="search-bar__input"
          label="Buscar por título"
          variant="outlined"
          size="small"
          fullWidth
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          InputProps={{
            endAdornment: loading ? (
              <CircularProgress size={18} color="inherit" style={{ marginRight: 4 }} />
            ) : null,
          }}
        />
        <IconButton
          className="search-bar__lupa"
          aria-label="Buscar"
          onClick={() => commitSearch(inputValue)}
          size="small"
        >
          <SearchIcon />
        </IconButton>
      </div>

      {open && suggestions.length > 0 && (
        <ul className="search-bar__suggestions">
          {suggestions.map((book) => (
            <li
              key={book.id}
              className="search-bar__suggestion-item"
              onMouseDown={() => handleSuggestionClick(book)}
            >
              <span className="search-bar__suggestion-title">{book.title}</span>
              <span className="search-bar__suggestion-author">{book.author}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchBar
