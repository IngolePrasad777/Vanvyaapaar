import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Alert,
  LinearProgress,
  Avatar,
  Tabs,
  Tab
} from '@mui/material';
import {
  LocalShipping,
  Person,
  Assignment,
  Analytics,
  Refresh,
  Edit,
  Visibility,
  Phone,
  LocationOn
} from '@mui/icons-material';
import deliveryService, { Delivery, DeliveryAgent, DeliveryAnalytics } from '../../services/deliveryService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`delivery-tabpanel-${index}`}
      aria-labelledby={`delivery-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDeliveryManagement: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [agents, setAgents] = useState<DeliveryAgent[]>([]);
  const [analytics, setAnalytics] = useState<DeliveryAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [statusUpdateDialog, setStatusUpdateDialog] = useState(false);
  const [reassignDialog, setReassignDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const deliveryStatuses = [
    'CREATED', 'ASSIGNED', 'ACCEPTED_BY_AGENT', 'PICKED_UP', 
    'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED', 'FAILED', 'CANCELLED'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [deliveriesData, analyticsData] = await Promise.all([
        deliveryService.getAllDeliveries(),
        deliveryService.getDeliveryAnalytics()
      ]);
      setDeliveries(deliveriesData);
      setAnalytics(analyticsData);
    } catch (err: any) {
      setError('Failed to load delivery data');
    } finally {
      setLoading(false);
    }
  };

  const loadAgents = async (pincode?: string) => {
    try {
      const agentsData = pincode 
        ? await deliveryService.getAvailableAgents(pincode)
        : [];
      setAgents(agentsData);
    } catch (err: any) {
      setError('Failed to load agents');
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedDelivery || !newStatus) return;

    try {
      await deliveryService.updateDeliveryStatus(selectedDelivery.id, newStatus, statusNotes);
      setSuccess('Delivery status updated successfully');
      setStatusUpdateDialog(false);
      loadData();
    } catch (err: any) {
      setError('Failed to update delivery status');
    }
  };

  const handleReassign = async () => {
    if (!selectedDelivery || !selectedAgentId) return;

    try {
      await deliveryService.reassignDelivery(selectedDelivery.id, selectedAgentId);
      setSuccess('Delivery reassigned successfully');
      setReassignDialog(false);
      loadData();
    } catch (err: any) {
      setError('Failed to reassign delivery');
    }
  };

  const openStatusDialog = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setNewStatus(delivery.status);
    setStatusNotes('');
    setStatusUpdateDialog(true);
  };

  const openReassignDialog = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setSelectedAgentId(null);
    loadAgents(delivery.deliveryPincode);
    setReassignDialog(true);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#8B4513', fontWeight: 'bold' }}>
          Delivery Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={loadData}
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

      {/* Analytics Cards */}
      {analytics && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #D4A574 0%, #8B7355 100%)' }}>
              <CardContent sx={{ color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {analytics.totalDeliveries}
                    </Typography>
                    <Typography variant="body2">Total Deliveries</Typography>
                  </Box>
                  <LocalShipping sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)' }}>
              <CardContent sx={{ color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {analytics.activeDeliveries}
                    </Typography>
                    <Typography variant="body2">Active Deliveries</Typography>
                  </Box>
                  <Assignment sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)' }}>
              <CardContent sx={{ color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {analytics.onlineAgents}
                    </Typography>
                    <Typography variant="body2">Online Agents</Typography>
                  </Box>
                  <Person sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)' }}>
              <CardContent sx={{ color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {analytics.weeklySuccessRate.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2">Success Rate</Typography>
                  </Box>
                  <Analytics sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="All Deliveries" />
            <Tab label="Active Deliveries" />
            <Tab label="Completed Deliveries" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <DeliveryTable 
            deliveries={deliveries}
            onStatusUpdate={openStatusDialog}
            onReassign={openReassignDialog}
            formatDateTime={formatDateTime}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <DeliveryTable 
            deliveries={deliveries.filter(d => 
              ['CREATED', 'ASSIGNED', 'ACCEPTED_BY_AGENT', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(d.status)
            )}
            onStatusUpdate={openStatusDialog}
            onReassign={openReassignDialog}
            formatDateTime={formatDateTime}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <DeliveryTable 
            deliveries={deliveries.filter(d => 
              ['DELIVERED', 'COMPLETED', 'FAILED', 'CANCELLED'].includes(d.status)
            )}
            onStatusUpdate={openStatusDialog}
            onReassign={openReassignDialog}
            formatDateTime={formatDateTime}
          />
        </TabPanel>
      </Card>

      {/* Status Update Dialog */}
      <Dialog open={statusUpdateDialog} onClose={() => setStatusUpdateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Delivery Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Status"
            >
              {deliveryStatuses.map(status => (
                <MenuItem key={status} value={status}>
                  {deliveryService.getStatusText(status)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Notes (Optional)"
            value={statusNotes}
            onChange={(e) => setStatusNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusUpdateDialog(false)}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Reassign Dialog */}
      <Dialog open={reassignDialog} onClose={() => setReassignDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reassign Delivery</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Select Agent</InputLabel>
            <Select
              value={selectedAgentId || ''}
              onChange={(e) => setSelectedAgentId(Number(e.target.value))}
              label="Select Agent"
            >
              {agents.map(agent => (
                <MenuItem key={agent.id} value={agent.id}>
                  {agent.name} - {agent.vehicleType} ({agent.currentWorkload}/3 deliveries)
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReassignDialog(false)}>Cancel</Button>
          <Button onClick={handleReassign} variant="contained" disabled={!selectedAgentId}>
            Reassign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Delivery Table Component
interface DeliveryTableProps {
  deliveries: Delivery[];
  onStatusUpdate: (delivery: Delivery) => void;
  onReassign: (delivery: Delivery) => void;
  formatDateTime: (date: string) => string;
}

const DeliveryTable: React.FC<DeliveryTableProps> = ({
  deliveries,
  onStatusUpdate,
  onReassign,
  formatDateTime
}) => {
  return (
    <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Tracking ID</TableCell>
            <TableCell>Order</TableCell>
            <TableCell>Agent</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Pickup</TableCell>
            <TableCell>Delivery</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deliveries.map((delivery) => (
            <TableRow key={delivery.id} hover>
              <TableCell>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  {delivery.trackingId}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  Order #{delivery.order.id}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ₹{delivery.order.totalAmount}
                </Typography>
              </TableCell>
              <TableCell>
                {delivery.agent ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: '#D4A574' }}>
                      {delivery.agent.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2">{delivery.agent.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {delivery.agent.vehicleType}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Not assigned
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                <Chip
                  label={deliveryService.getStatusText(delivery.status)}
                  size="small"
                  sx={{
                    bgcolor: deliveryService.getStatusColor(delivery.status),
                    color: 'white'
                  }}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">{delivery.pickupPincode}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{delivery.deliveryPincode}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {formatDateTime(delivery.createdAt)}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Update Status">
                    <IconButton size="small" onClick={() => onStatusUpdate(delivery)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Reassign Agent">
                    <IconButton size="small" onClick={() => onReassign(delivery)}>
                      <Assignment />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminDeliveryManagement;