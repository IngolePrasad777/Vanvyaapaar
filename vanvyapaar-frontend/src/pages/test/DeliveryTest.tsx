import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Alert,
  Stack
} from '@mui/material';
import api from '../../lib/api';
import deliveryService from '../../services/deliveryService';

const DeliveryTest: React.FC = () => {
  const [trackingId, setTrackingId] = useState('VV-DEL-000001');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testBasicAPI = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/test/hello');
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const testDeliveryEndpoints = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/test/delivery-endpoints');
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const testBackendConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/delivery/test');
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const testTrackDelivery = async () => {
    setLoading(true);
    setError(null);
    try {
      const delivery = await deliveryService.trackDelivery(trackingId);
      setResult(delivery);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const analytics = await deliveryService.getDeliveryAnalytics();
      setResult(analytics);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testServiceability = async () => {
    setLoading(true);
    setError(null);
    try {
      const isServiceable = await deliveryService.checkPincodeServiceability('400001');
      const charge = await deliveryService.getDeliveryCharge('400001');
      const days = await deliveryService.getEstimatedDeliveryDays('400001');
      setResult({ isServiceable, charge, days });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#8B4513' }}>
        Delivery Service Test
      </Typography>

      <Stack spacing={3}>
        {/* Basic API Test */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Test Basic API Connection
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={testBasicAPI}
                disabled={loading}
                sx={{ bgcolor: '#4CAF50' }}
              >
                Test Basic API
              </Button>
              <Button
                variant="contained"
                onClick={testDeliveryEndpoints}
                disabled={loading}
                sx={{ bgcolor: '#FF9800' }}
              >
                List Delivery Endpoints
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Backend Connection Test */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Test Backend Connection
            </Typography>
            <Button
              variant="contained"
              onClick={testBackendConnection}
              disabled={loading}
              sx={{ bgcolor: '#9C27B0' }}
            >
              Test Connection
            </Button>
          </CardContent>
        </Card>

        {/* Track Delivery Test */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Test Delivery Tracking
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <TextField
                label="Tracking ID"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                size="small"
              />
              <Button
                variant="contained"
                onClick={testTrackDelivery}
                disabled={loading}
                sx={{ bgcolor: '#D4A574' }}
              >
                Track
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Analytics Test */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Test Analytics
            </Typography>
            <Button
              variant="contained"
              onClick={testAnalytics}
              disabled={loading}
              sx={{ bgcolor: '#2196F3' }}
            >
              Get Analytics
            </Button>
          </CardContent>
        </Card>

        {/* Serviceability Test */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Test Serviceability (Pincode: 400001)
            </Typography>
            <Button
              variant="contained"
              onClick={testServiceability}
              disabled={loading}
              sx={{ bgcolor: '#4CAF50' }}
            >
              Check Serviceability
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        {result && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Result
              </Typography>
              <Box
                component="pre"
                sx={{
                  bgcolor: '#f5f5f5',
                  p: 2,
                  borderRadius: 1,
                  overflow: 'auto',
                  fontSize: '0.875rem'
                }}
              >
                {JSON.stringify(result, null, 2)}
              </Box>
            </CardContent>
          </Card>
        )}
      </Stack>
    </Container>
  );
};

export default DeliveryTest;