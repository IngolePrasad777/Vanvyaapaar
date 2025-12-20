import { Outlet } from 'react-router-dom'
import SellerHeader from './SellerHeader'
import { Box } from '@mui/material'

const SellerLayout = () => {
  return (
    <Box>
      <SellerHeader />
      <Outlet />
    </Box>
  )
}

export default SellerLayout