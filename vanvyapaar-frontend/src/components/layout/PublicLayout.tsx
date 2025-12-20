import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import PremiumNavbar from './PremiumNavbar'
import PremiumFooter from './PremiumFooter'

const PublicLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PremiumNavbar />
      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <PremiumFooter />
    </Box>
  )
}

export default PublicLayout