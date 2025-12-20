import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import BuyerHeader from './BuyerHeader'

const BuyerLayout = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAF9' }}>
      <BuyerHeader />
      <Box component="main">
        <Outlet />
      </Box>
    </Box>
  )
}

export default BuyerLayout