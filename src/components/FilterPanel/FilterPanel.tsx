import React, { useEffect, useRef, useState } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Switch from '@mui/material/Switch'
import Slider from '@mui/material/Slider'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import './FilterPanel.css'
import type { BookFilters, Facets } from '../../types/book.types'

interface Props {
  facets: Facets | null
  filters: BookFilters
  onChange: (filters: BookFilters) => void
}

function renderStars(rating: number): string {
  const full = Math.floor(rating)
  const stars = '★'.repeat(full) + '☆'.repeat(5 - full)
  return stars
}

export const FilterPanel: React.FC<Props> = ({ facets, filters, onChange }) => {
  const [bounds, setBounds] = useState<[number, number]>([0, 100])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  // When true, ignore facets priceRange updates (user has set a price filter)
  const boundsLockedRef = useRef(false)

  useEffect(() => {
    if (!facets) return
    // If the user has an active price filter, do NOT change the bounds
    if (boundsLockedRef.current) return
    const newMin = facets.priceRange.min
    const newMax = facets.priceRange.max
    setBounds((prev) => {
      if (prev[0] === newMin && prev[1] === newMax) return prev
      setPriceRange([newMin, newMax])
      return [newMin, newMax]
    })
  }, [facets?.priceRange?.min, facets?.priceRange?.max])

  if (!facets) return null

  const hasActiveFilters =
    !!filters.category ||
    !!filters.rating ||
    !!filters.inStock ||
    !!filters.minPrice ||
    !!filters.maxPrice

  const handleCategory = (key: string) => {
    onChange({
      ...filters,
      category: filters.category === key ? undefined : key,
    })
  }

  const handleRating = (value: string) => {
    onChange({
      ...filters,
      rating: value === 'all' ? undefined : value,
    })
  }

  const handlePriceCommit = (_: Event | React.SyntheticEvent, value: number | number[]) => {
    const [lo, hi] = value as number[]
    const newFilters: BookFilters = { ...filters }
    if (lo === bounds[0] && hi === bounds[1]) {
      delete newFilters.minPrice
      delete newFilters.maxPrice
      boundsLockedRef.current = false
    } else {
      newFilters.minPrice = lo.toFixed(2)
      newFilters.maxPrice = hi.toFixed(2)
      boundsLockedRef.current = true
    }
    onChange(newFilters)
  }

  const handleStock = (checked: boolean) => {
    const newFilters: BookFilters = { ...filters }
    if (checked) {
      newFilters.inStock = 'true'
    } else {
      delete newFilters.inStock
    }
    onChange(newFilters)
  }

  const handleClear = () => {
    boundsLockedRef.current = false
    setPriceRange([bounds[0], bounds[1]])
    onChange({})
  }

  return (
    <div className="filter-panel">
      {/* CATEGORIES */}
      {facets.categories.length > 0 && (
        <div className="filter-panel__group">
          <Typography variant="caption" className="filter-panel__label">Categoría</Typography>
          <div className="filter-panel__categories">
            {facets.categories.map((cat) => (
              <FormControlLabel
                key={cat.key}
                className={`filter-panel__cat-item${filters.category === cat.key ? ' filter-panel__active' : ''}`}
                control={
                  <Checkbox
                    size="small"
                    checked={filters.category === cat.key}
                    onChange={() => handleCategory(cat.key)}
                  />
                }
                label={`${cat.key} (${cat.count})`}
              />
            ))}
          </div>
        </div>
      )}

      <Divider orientation="vertical" flexItem className="filter-panel__divider" />

      {/* RATING */}
      {facets.ratings.length > 0 && (
        <div className="filter-panel__group">
          <Typography variant="caption" className="filter-panel__label">Rating</Typography>
          <RadioGroup
            row
            value={filters.rating ?? 'all'}
            onChange={(e) => handleRating(e.target.value)}
            className="filter-panel__ratings"
          >
            <FormControlLabel
              value="all"
              control={<Radio size="small" />}
              label="Todos"
              className={!filters.rating ? 'filter-panel__active' : ''}
            />
            {facets.ratings
              .slice()
              .sort((a, b) => Number(b.key) - Number(a.key))
              .map((r) => (
                <FormControlLabel
                  key={r.key}
                  value={r.key}
                  control={<Radio size="small" />}
                  label={`${renderStars(Number(r.key))} (${r.count})`}
                  className={`filter-panel__stars${filters.rating === r.key ? ' filter-panel__active' : ''}`}
                />
              ))}
          </RadioGroup>
        </div>
      )}

      <Divider orientation="vertical" flexItem className="filter-panel__divider" />

      {/* PRICE RANGE */}
      <div className="filter-panel__group filter-panel__group--price">
        <Typography variant="caption" className="filter-panel__label">
          Precio: ${priceRange[0].toFixed(0)} – ${priceRange[1].toFixed(0)}
        </Typography>
        <Slider
          value={priceRange}
          min={bounds[0]}
          max={bounds[1]}
          step={0.5}
          onChange={(_, v) => setPriceRange(v as [number, number])}
          onChangeCommitted={handlePriceCommit}
          size="small"
          className={`filter-panel__slider${filters.minPrice || filters.maxPrice ? ' filter-panel__active' : ''}`}
        />
      </div>

      <Divider orientation="vertical" flexItem className="filter-panel__divider" />

      {/* STOCK */}
      <div className="filter-panel__group filter-panel__group--stock">
        <Typography variant="caption" className="filter-panel__label">Stock</Typography>
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={filters.inStock === 'true'}
              onChange={(e) => handleStock(e.target.checked)}
            />
          }
          label={`Solo con stock (${facets.booksWithStock})`}
          className={filters.inStock ? 'filter-panel__active' : ''}
        />
      </div>

      {/* CLEAR */}
      {hasActiveFilters && (
        <>
          <Divider orientation="vertical" flexItem className="filter-panel__divider" />
          <div className="filter-panel__group filter-panel__group--clear">
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={handleClear}
              className="filter-panel__clear-btn"
            >
              Limpiar filtros
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default FilterPanel
