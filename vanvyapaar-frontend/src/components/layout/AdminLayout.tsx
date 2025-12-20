import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import AdminHeader from './AdminHeader'

const AdminLayout = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAF9' }}>
      <AdminHeader />
      <Box component="main">
        <Outlet />
      </Box>
    </Box>
  )
}

export default AdminLayout