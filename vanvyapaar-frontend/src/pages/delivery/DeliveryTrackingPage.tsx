import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Paper,
  Stack
} from '@mui/material';
import { LocalShipping, ArrowBack, Home } from '@mui/icons-material';
import DeliveryTracker from '../../components/delivery/DeliveryTracker';
import AnimatedBackground from '../../components/common/AnimatedBackground';
import FloatingElements from '../../components/common/FloatingElements';
import { alpha } from '@mui/material/styles';

const DeliveryTrackingPage: React.FC = () => {
  const { trackingId } = useParams<{ trackingId: string }>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trackingId) {
      setError('No tracking ID provided');
    }
  }, [trackingId]);

  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: '#FAFAF9' }}>
      <AnimatedBackground variant="particles" intensity="light" color="#D4A574" />
      <FloatingElements
        showScrollTop={true}
        showQuickActions={true}
        quickActions={[
          {
            icon: <ArrowBack />,
            label: 'Go Back',
            onClick: handleGoBack,
            color: '#8B4513'
          },
          {
            icon: <Home />,
            label: 'Home',
            onClick: handleGoHome,
            color: '#D4A574'
          }
        ]}
      />

      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 2 }}>
            <Box sx={{
              width: 64,
              height: 64,
              bgcolor: alpha('#D4A574', 0.15),
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <LocalShipping sx={{ fontSize: 36, color: '#D4A574' }} />
            </Box>
          </Stack>
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold', 
            color: '#1F2937', 
            fontFamily: 'serif',
            mb: 1
          }}>
            Track Your Delivery
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            Real-time updates on your order delivery
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
            {error}
          </Alert>
        )}

        {/* Delivery Tracker */}
        {trackingId && !error ? (
          <DeliveryTracker 
            trackingId={trackingId} 
            showTrackingInput={false}
          />
        ) : (
          <DeliveryTracker showTrackingInput={true} />
        )}

        {/* Help Section */}
        <Card sx={{ 
          mt: 4, 
          borderRadius: 4, 
          border: `1px solid ${alpha('#D4A574', 0.2)}`,
          background: 'linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)'
        }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 2 }}>
              Need Help?
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
              If you're having trouble tracking your delivery or have questions about your order,
              our customer support team is here to help.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="outlined"
                onClick={() => window.location.href = '/contact'}
                sx={{
                  borderColor: '#D4A574',
                  color: '#D4A574',
                  '&:hover': {
                    bgcolor: alpha('#D4A574', 0.1),
                    borderColor: '#C9A86A'
                  }
                }}
              >
                Contact Support
              </Button>
              <Button
                variant="contained"
                onClick={() => window.location.href = '/buyer/orders'}
                sx={{
                  bgcolor: '#D4A574',
                  '&:hover': { bgcolor: '#C9A86A' }
                }}
              >
                View All Orders
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default DeliveryTrackingPage;