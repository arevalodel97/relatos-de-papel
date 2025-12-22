import { createTheme } from '@mui/material/styles'

// Keep these color values in sync with src/styles/theme.css
// Book-like, sober palette (keeps in sync with src/styles/theme.css)
const PRIMARY = '#6b4f3a' // slightly lighter leather brown
const PRIMARY_CONTRAST = '#ffffff'
const ACCENT = '#C78F64' // warm terracotta/gold
const BACKGROUND = '#F7F3EA'
const SURFACE = '#FFFFFF'
const TEXT_PRIMARY = '#102027'
const TEXT_SECONDARY = '#4b5563'

const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY,
      contrastText: PRIMARY_CONTRAST,
    },
    secondary: {
      main: ACCENT,
    },
    background: {
      default: BACKGROUND,
      paper: SURFACE,
    },
    text: {
      primary: TEXT_PRIMARY,
      secondary: TEXT_SECONDARY,
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: 'Inter, Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
  },
})

export default theme
