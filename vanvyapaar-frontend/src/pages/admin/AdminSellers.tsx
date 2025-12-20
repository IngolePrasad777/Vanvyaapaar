import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Container, Box, Typography, Button, Card, CardContent,
  Chip, alpha, Stack, TextField, InputAdornment, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material'
import {
  Search, Store, CheckCircle, Cancel, Delete, Visibility,
  Email, Phone, LocationOn, AccountBalance
} from '@mui/icons-material'
import adminService from '../../services/adminService'
import { Seller } from '../../types'
import toast from 'react-hot-toast'

const AdminSellers = () => {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null)
  const [viewDialog, setViewDialog] = useState(false)

  useEffect(() => {
    fetchSellers()
  }, [])

  const fetchSellers = async () => {
    try {
      setLoading(true)
      const data = await adminService.getAllSellers()
      setSellers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching sellers:', error)
      toast.error('Failed to load sellers')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: number) => {
    try {
      await adminService.approveSeller(id)
      toast.success('Seller approved successfully')
      fetchSellers()
    } catch (error) {
      toast.error('Failed to approve seller')
    }
  }

  const handleSuspend = async (id: number) => {
    try {
      await adminService.suspendSeller(id)
      toast.success('Seller suspended')
      fetchSellers()
    } catch (error) {
      toast.error('Failed to suspend seller')
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this seller?')) {
      try {
        await adminService.deleteSeller(id)
        toast.success('Seller deleted')
        fetchSellers()
      } catch (error) {
        toast.error('Failed to delete seller')
      }
    }
  }

  const filteredSellers = sellers.filter(seller => {
    const matchesSearch = seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (seller.tribeName && seller.tribeName.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = filterStatus === 'ALL' || seller.adminApprovalStatus === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return '#10B981'
      case 'PENDING': return '#F59E0B'
      case 'REJECTED': return '#EF4444'
      case 'SUSPENDED': return '#6B7280'
      default: return '#6B7280'
    }
  }

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" sx={{ color: '#D4A574' }}>Loading sellers...</Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              bgcolor: alpha('#D4A574', 0.15),
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Store sx={{ fontSize: 32, color: '#D4A574' }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937', fontFamily: 'serif' }}>
              Manage Sellers
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Approve and manage seller accounts
            </Typography>
          </Box>
        </Stack>

        {/* Search and Filters */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            fullWidth
            placeholder="Search sellers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: 'white'
              }
            }}
          />
          <Stack direction="row" spacing={1}>
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'].map((status) => (
              <Button
                key={status}
                onClick={() => setFilterStatus(status)}
                variant={filterStatus === status ? 'contained' : 'outlined'}
                sx={{
                  borderRadius: 3,
                  ...(filterStatus === status ? {
                    bgcolor: '#D4A574',
                    '&:hover': { bgcolor: '#C9A86A' }
                  } : {
                    borderColor: '#D4A574',
                    color: '#D4A574',
                    '&:hover': { bgcolor: alpha('#D4A574', 0.1) }
                  })
                }}
              >
                {status}
              </Button>
            ))}
          </Stack>
        </Stack>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        {[
          { label: 'Total Sellers', value: sellers.length, color: '#D4A574' },
          { label: 'Pending', value: sellers.filter(s => s.adminApprovalStatus === 'PENDING').length, color: '#F59E0B' },
          { label: 'Approved', value: sellers.filter(s => s.adminApprovalStatus === 'APPROVED').length, color: '#10B981' },
          { label: 'Rejected', value: sellers.filter(s => s.adminApprovalStatus === 'REJECTED').length, color: '#EF4444' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card sx={{ borderRadius: 3, border: '2px solid', borderColor: alpha(stat.color, 0.2) }}>
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: stat.color, mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>

      {/* Sellers Table */}
      {filteredSellers.length === 0 ? (
        <Card sx={{ p: 8, textAlign: 'center', borderRadius: 4 }}>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            No sellers found
          </Typography>
        </Card>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Table>
            <TableHead sx={{ bgcolor: alpha('#D4A574', 0.1) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Seller</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Tribe</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSellers.map((seller) => (
                <TableRow key={seller.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: alpha('#D4A574', 0.2), color: '#D4A574' }}>
                        {seller.name[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {seller.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {seller.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{seller.tribeName || 'N/A'}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {seller.region || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{seller.phone || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={seller.adminApprovalStatus}
                      size="small"
                      sx={{
                        bgcolor: alpha(getStatusColor(seller.adminApprovalStatus), 0.1),
                        color: getStatusColor(seller.adminApprovalStatus),
                        fontWeight: 'bold'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={() => { setSelectedSeller(seller); setViewDialog(true) }}
                        sx={{ color: '#3B82F6' }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                      {seller.adminApprovalStatus === 'PENDING' && (
                        <IconButton
                          size="small"
                          onClick={() => handleApprove(seller.id)}
                          sx={{ color: '#10B981' }}
                        >
                          <CheckCircle fontSize="small" />
                        </IconButton>
                      )}
                      {seller.adminApprovalStatus === 'APPROVED' && (
                        <IconButton
                          size="small"
                          onClick={() => handleSuspend(seller.id)}
                          sx={{ color: '#F59E0B' }}
                        >
                          <Cancel fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(seller.id)}
                        sx={{ color: '#EF4444' }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* View Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Seller Details</DialogTitle>
        <DialogContent>
          {selectedSeller && (
            <Stack spacing={3} sx={{ mt: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: alpha('#D4A574', 0.2), color: '#D4A574', mx: 'auto', mb: 2 }}>
                  {selectedSeller.name[0]}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{selectedSeller.name}</Typography>
                <Chip
                  label={selectedSeller.adminApprovalStatus}
                  sx={{
                    mt: 1,
                    bgcolor: alpha(getStatusColor(selectedSeller.adminApprovalStatus), 0.1),
                    color: getStatusColor(selectedSeller.adminApprovalStatus)
                  }}
                />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Email sx={{ fontSize: 20, color: '#D4A574' }} />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Email</Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>{selectedSeller.email}</Typography>
                </Box>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Phone sx={{ fontSize: 20, color: '#D4A574' }} />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Phone</Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>{selectedSeller.phone || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Store sx={{ fontSize: 20, color: '#D4A574' }} />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Tribe</Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>{selectedSeller.tribeName || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <LocationOn sx={{ fontSize: 20, color: '#D4A574' }} />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Region</Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>{selectedSeller.region || 'N/A'}</Typography>
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <AccountBalance sx={{ fontSize: 20, color: '#D4A574' }} />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Bank Details</Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Account: {selectedSeller.bankAccountNumber || 'N/A'}<br />
                    IFSC: {selectedSeller.ifscCode || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default AdminSellers
