import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Container, Box, Typography, Card, CardContent,
  alpha, Stack, TextField, InputAdornment, IconButton,
  Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material'
import { Search, People, Delete } from '@mui/icons-material'
import adminService from '../../services/adminService'
import { Buyer } from '../../types'
import toast from 'react-hot-toast'

const AdminBuyers = () => {
  const [buyers, setBuyers] = useState<Buyer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchBuyers()
  }, [])

  const fetchBuyers = async () => {
    try {
      setLoading(true)
      const data = await adminService.getAllBuyers()
      setBuyers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching buyers:', error)
      toast.error('Failed to load buyers')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure?')) {
      try {
        await adminService.deleteBuyer(id)
        toast.success('Buyer deleted')
        fetchBuyers()
      } catch (error) {
        toast.error('Failed to delete buyer')
      }
    }
  }

  const filteredBuyers = buyers.filter(buyer =>
    buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    buyer.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h6" sx={{ color: '#C9A86A' }}>Loading...</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Box sx={{ width: 56, height: 56, bgcolor: alpha('#C9A86A', 0.15), borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <People sx={{ fontSize: 32, color: '#C9A86A' }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937', fontFamily: 'serif' }}>
              Manage Buyers
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              View and manage buyer accounts
            </Typography>
          </Box>
        </Stack>

        <TextField
          fullWidth
          placeholder="Search buyers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search sx={{ color: 'text.secondary' }} /></InputAdornment>
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' } }}
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
        {[
          { label: 'Total Buyers', value: buyers.length, color: '#C9A86A' },
          { label: 'Active', value: buyers.length, color: '#10B981' },
          { label: 'This Month', value: 0, color: '#3B82F6' }
        ].map((stat, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card sx={{ borderRadius: 3, border: '2px solid', borderColor: alpha(stat.color, 0.2) }}>
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: stat.color, mb: 1 }}>{stat.value}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{stat.label}</Typography>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>

      {filteredBuyers.length === 0 ? (
        <Card sx={{ p: 8, textAlign: 'center', borderRadius: 4 }}>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>No buyers found</Typography>
        </Card>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Table>
            <TableHead sx={{ bgcolor: alpha('#C9A86A', 0.1) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Buyer</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBuyers.map((buyer) => (
                <TableRow key={buyer.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: alpha('#C9A86A', 0.2), color: '#C9A86A' }}>{buyer.name[0]}</Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{buyer.name}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{buyer.email}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell><Typography variant="body2">{buyer.phone || 'N/A'}</Typography></TableCell>
                  <TableCell><Typography variant="body2">{buyer.address || 'N/A'}</Typography></TableCell>
                  <TableCell>
                    <IconButton size="small" sx={{ color: '#EF4444' }} onClick={() => handleDelete(buyer.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  )
}

export default AdminBuyers
