import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Avatar,
  Divider,
  Alert
} from '@mui/material';
import {
  LocalShipping,
  Person,
  Phone,
  LocationOn,
  Schedule,
  CheckCircle,
  Error,
  Cancel
} from '@mui/icons-material';
import deliveryService, { Delivery } from '../../services/deliveryService';

interface DeliveryTrackerProps {
  trackingId?: string;
  deliveryId?: number;
  showTrackingInput?: boolean;
}

const DeliveryTracker: React.FC<DeliveryTrackerProps> = ({
  trackingId: initialTrackingId,
  deliveryId,
  showTrackingInput = true
}) => {
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [trackingId, setTrackingId] = useState(initialTrackingId || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);

  const deliverySteps = [
    { key: 'CREATED', label: 'Order Created', icon: <CheckCircle /> },
    { key: 'ASSIGNED', label: 'Agent Assigned', icon: <Person /> },
    { key: 'ACCEPTED_BY_AGENT', label: 'Agent Accepted', icon: <CheckCircle /> },
    { key: 'PICKED_UP', label: 'Picked Up', icon: <LocalShipping /> },
    { key: 'IN_TRANSIT', label: 'In Transit', icon: <LocalShipping /> },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: <LocalShipping /> },
    { key: 'DELIVERED', label: 'Delivered', icon: <CheckCircle /> }
  ];

  useEffect(() => {
    if (initialTrackingId) {
      handleTrackDelivery(initialTrackingId);
    }
  }, [initialTrackingId]);

  const handleTrackDelivery = async (id: string) => {
    if (!id.trim()) {
      setError('Please enter a tracking ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const deliveryData = await deliveryService.trackDelivery(id);
      setDelivery(deliveryData);
      setTrackingDialogOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Delivery not found');
      setDelivery(null);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStepIndex = () => {
    if (!delivery) return -1;
    return deliverySteps.findIndex(step => step.key === delivery.status);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
      case 'COMPLETED':
        return <CheckCircle color="success" />;
      case 'FAILED':
        return <Error color="error" />;
      case 'CANCELLED':
        return <Cancel color="disabled" />;
      default:
        return <LocalShipping color="primary" />;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      {/* Tracking Input */}
      {showTrackingInput && (
        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #D4A574 0%, #8B7355 100%)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, display: 'flex', alignItems: 'center' }}>
              <LocalShipping sx={{ mr: 1 }} />
              Track Your Delivery
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                fullWidth
                placeholder="Enter tracking ID (e.g., VV-DEL-123456)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' }
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={() => handleTrackDelivery(trackingId)}
                disabled={loading}
                sx={{
                  bgcolor: '#8B4513',
                  '&:hover': { bgcolor: '#A0522D' },
                  minWidth: 120
                }}
              >
                {loading ? 'Tracking...' : 'Track'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Delivery Information */}
      {delivery && (
        <>
          {/* Status Overview */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {getStatusIcon(delivery.status)}
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="h6">
                        {deliveryService.getStatusText(delivery.status)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tracking ID: {delivery.trackingId}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <LinearProgress
                    variant="determinate"
                    value={deliveryService.getProgressPercentage(delivery.status)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#F5F5F4',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: deliveryService.getStatusColor(delivery.status)
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                    <Typography variant="body2" color="text.secondary">
                      Estimated Delivery
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {formatDateTime(delivery.estimatedDeliveryTime)}
                    </Typography>
                    {delivery.actualDeliveryTime && (
                      <>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Actual Delivery
                        </Typography>
                        <Typography variant="body1" color="success.main">
                          {formatDateTime(delivery.actualDeliveryTime)}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Delivery Agent Info */}
          {delivery.agent && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 1 }} />
                  Delivery Agent
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ bgcolor: '#D4A574', mr: 2 }}>
                        {delivery.agent.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1">{delivery.agent.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {delivery.agent.vehicleType} • {delivery.agent.vehicleNumber}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{delivery.agent.phone}</Typography>
                    </Box>
                    <Chip
                      label={`Rating: ${delivery.agent.rating}/5`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Delivery Timeline */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Delivery Timeline
              </Typography>
              <Stepper activeStep={getCurrentStepIndex()} orientation="vertical">
                {deliverySteps.map((step, index) => (
                  <Step key={step.key}>
                    <StepLabel
                      icon={step.icon}
                      sx={{
                        '& .MuiStepLabel-iconContainer': {
                          color: index <= getCurrentStepIndex() ? '#D4A574' : 'text.disabled'
                        }
                      }}
                    >
                      {step.label}
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" color="text.secondary">
                        {index <= getCurrentStepIndex() ? 'Completed' : 'Pending'}
                      </Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Delivery Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <LocationOn sx={{ mr: 1, mt: 0.5, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Pickup Address
                      </Typography>
                      <Typography variant="body2">
                        {delivery.pickupAddress}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {delivery.pickupPincode}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <LocationOn sx={{ mr: 1, mt: 0.5, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Delivery Address
                      </Typography>
                      <Typography variant="body2">
                        {delivery.deliveryAddress}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {delivery.deliveryPincode}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              
              {delivery.agentNotes && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Agent Notes
                  </Typography>
                  <Typography variant="body2">
                    {delivery.agentNotes}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default DeliveryTracker;