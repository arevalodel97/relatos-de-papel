import { CartProvider } from './hooks/useCart'
import AppRouter from './router/AppRouter'
import Layout from './components/Layout/Layout'
import { BrowserRouter } from 'react-router-dom'
import { useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'
import { SearchContext } from './hooks/searchContext'

function App() {
  const [search, setSearch] = useState('')

  return (
    <ThemeProvider theme={theme}>
      <CartProvider>
        <SearchContext.Provider value={{ search, setSearch }}>
          <BrowserRouter>
            <Layout onSearchChange={setSearch} searchValue={search}>
              <AppRouter search={search} />
            </Layout>
          </BrowserRouter>
        </SearchContext.Provider>
      </CartProvider>
    </ThemeProvider>
  )
}

export default App
