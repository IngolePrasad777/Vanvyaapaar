import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Switch,
  FormControlLabel,
  Alert,
  LinearProgress,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  LocalShipping,
  Person,
  CheckCircle,
  Schedule,
  Phone,
  LocationOn,
  Star,
  Assignment,
  Refresh,
  PlayArrow,
  Pause
} from '@mui/icons-material';
import deliveryService, { Delivery, DeliveryAgent } from '../../services/deliveryService';
import { alpha } from '@mui/material/styles';

const AgentDashboard: React.FC = () => {
  const [agent, setAgent] = useState<DeliveryAgent | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [statusUpdateDialog, setStatusUpdateDialog] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');

  // Mock agent ID - in real app, this would come from auth
  const agentId = 1;

  const deliveryStatuses = [
    'ACCEPTED_BY_AGENT', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED'
  ];

  useEffect(() => {
    loadAgentData();
  }, []);

  const loadAgentData = async () => {
    setLoading(true);
    try {
      // In real implementation, these would be separate API calls
      const [deliveriesData] = await Promise.all([
        deliveryService.getAgentDeliveries(agentId)
      ]);
      
      setDeliveries(deliveriesData);
      
      // Mock agent data - in real app, this would come from API
      setAgent({
        id: agentId,
        name: 'Rajesh Kumar',
        phone: '9876543210',
        email: 'rajesh.kumar@vanvyapaar.com',
        currentPincode: '400001',
        vehicleType: 'BIKE',
        vehicleNumber: 'MH-01-AB-1234',
        serviceablePincodes: '400001,400002,400051,400067',
        status: 'FREE',
        isOnline: true,
        currentWorkload: deliveriesData.filter(d => 
          ['ASSIGNED', 'ACCEPTED_BY_AGENT', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(d.status)
        ).length,
        totalDeliveries: 45,
        rating: 4.7,
        createdAt: '2024-01-01T00:00:00',
        updatedAt: new Date().toISOString(),
        lastActiveTime: new Date().toISOString()
      });
    } catch (err: any) {
      setError('Failed to load agent data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleOnlineStatus = async () => {
    if (!agent) return;
    
    try {
      await deliveryService.toggleAgentStatus(agent.id);
      setAgent({ ...agent, isOnline: !agent.isOnline });
      setSuccess(`You are now ${!agent.isOnline ? 'online' : 'offline'}`);
    } catch (err: any) {
      setError('Failed to update online status');
    }
  };

  const handleAcceptDelivery = async (deliveryId: number) => {
    try {
      await deliveryService.acceptDelivery(deliveryId, agentId);
      setSuccess('Delivery accepted successfully');
      loadAgentData();
    } catch (err: any) {
      setError('Failed to accept delivery');
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedDelivery || !newStatus) return;

    try {
      await deliveryService.updateDeliveryStatus(selectedDelivery.id, newStatus, statusNotes);
      setSuccess('Delivery status updated successfully');
      setStatusUpdateDialog(false);
      loadAgentData();
    } catch (err: any) {
      setError('Failed to update delivery status');
    }
  };

  const openStatusDialog = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setNewStatus(delivery.status);
    setStatusNotes('');
    setStatusUpdateDialog(true);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'ASSIGNED': '#FF9800',
      'ACCEPTED_BY_AGENT': '#2196F3',
      'PICKED_UP': '#3F51B5',
      'IN_TRANSIT': '#9C27B0',
      'OUT_FOR_DELIVERY': '#FF5722',
      'DELIVERED': '#4CAF50',
      'FAILED': '#F44336'
    };
    return colors[status] || '#9E9E9E';
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!agent) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LinearProgress sx={{ width: 300 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#FAFAF9', minHeight: '100vh', p: 3 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ color: '#8B4513', fontWeight: 'bold' }}>
            Agent Dashboard
          </Typography>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={loadAgentData}
            disabled={loading}
            sx={{ bgcolor: '#D4A574', '&:hover': { bgcolor: '#8B7355' } }}
          >
            Refresh
          </Button>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {loading && <LinearProgress sx={{ mb: 2 }} />}

        {/* Agent Info Card */}
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#D4A574', width: 60, height: 60, mr: 2 }}>
                    {agent.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {agent.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {agent.vehicleType} • {agent.vehicleNumber}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Star sx={{ color: '#FFD700', fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">{agent.rating}/5</Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, md: 4 }}>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Phone sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{agent.phone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">Pincode: {agent.currentPincode}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Assignment sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      Workload: {agent.currentWorkload}/3 deliveries
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'right' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={agent.isOnline}
                        onChange={handleToggleOnlineStatus}
                        color="primary"
                      />
                    }
                    label={agent.isOnline ? 'Online' : 'Offline'}
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#D4A574' }}>
                    {agent.totalDeliveries}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Deliveries
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Deliveries */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              My Deliveries
            </Typography>
            
            {deliveries.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <LocalShipping sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No deliveries assigned
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  New deliveries will appear here when assigned to you
                </Typography>
              </Box>
            ) : (
              <List>
                {deliveries.map((delivery) => (
                  <ListItem
                    key={delivery.id}
                    sx={{
                      border: `1px solid ${alpha('#D4A574', 0.2)}`,
                      borderRadius: 2,
                      mb: 2,
                      bgcolor: alpha('#D4A574', 0.05)
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: getStatusColor(delivery.status) }}>
                        <LocalShipping />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {delivery.trackingId}
                          </Typography>
                          <Chip
                            label={deliveryService.getStatusText(delivery.status)}
                            size="small"
                            sx={{
                              bgcolor: getStatusColor(delivery.status),
                              color: 'white'
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            From: {delivery.pickupPincode} → To: {delivery.deliveryPincode}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Customer: {delivery.buyerName} • {delivery.buyerPhone}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Created: {formatDateTime(delivery.createdAt)}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {delivery.status === 'ASSIGNED' && (
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<PlayArrow />}
                          onClick={() => handleAcceptDelivery(delivery.id)}
                          sx={{ bgcolor: '#4CAF50', '&:hover': { bgcolor: '#388E3C' } }}
                        >
                          Accept
                        </Button>
                      )}
                      {['ACCEPTED_BY_AGENT', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(delivery.status) && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => openStatusDialog(delivery)}
                          sx={{ borderColor: '#D4A574', color: '#D4A574' }}
                        >
                          Update Status
                        </Button>
                      )}
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Status Update Dialog */}
      <Dialog open={statusUpdateDialog} onClose={() => setStatusUpdateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Delivery Status</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Tracking ID: {selectedDelivery?.trackingId}
            </Typography>
          </Box>
          <TextField
            select
            fullWidth
            label="Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            SelectProps={{ native: true }}
            sx={{ mb: 2 }}
          >
            {deliveryStatuses.map(status => (
              <option key={status} value={status}>
                {deliveryService.getStatusText(status)}
              </option>
            ))}
          </TextField>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Notes (Optional)"
            value={statusNotes}
            onChange={(e) => setStatusNotes(e.target.value)}
            placeholder="Add any notes about the delivery status..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusUpdateDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateStatus} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AgentDashboard;