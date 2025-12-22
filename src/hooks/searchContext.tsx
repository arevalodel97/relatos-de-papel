import { createContext, useContext } from 'react'

type SearchContextValue = {
  search: string
  setSearch: (v: string) => void
}

export const SearchContext = createContext<SearchContextValue | undefined>(undefined)

export function useSearch() {
  const ctx = useContext(SearchContext)
  if (!ctx) throw new Error('useSearch must be used within SearchContext.Provider')
  return ctx
}
