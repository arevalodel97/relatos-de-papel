import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import './LandingView.css'

export const LandingView: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // const t = setTimeout(() => navigate('/home'), 5000)
    // return () => clearTimeout(t)
  }, [navigate])

  return (
    <div className="landing view-full">
      <Typography variant="h3">Bienvenido a Relatos de Papel</Typography>
      <Typography variant="body1">La mejor selección de relatos y libros cortos.</Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/home')}>Ir al catálogo</Button>
    </div>
  )
}

export default LandingView
