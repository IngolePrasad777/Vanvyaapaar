import { Box, Typography, Button } from '@mui/material'
import { Star } from '@mui/icons-material'
import AnimatedBackground from './AnimatedBackground'
import FloatingElements from './FloatingElements'
import EnhancedCard from './EnhancedCard'
import LoadingAnimation from './LoadingAnimation'

const TestEnhancements = () => {
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', p: 4 }}>
      <AnimatedBackground variant="bubbles" intensity="medium" color="#D4A574" />
      
      <FloatingElements 
        showScrollTop={true}
        showQuickActions={true}
        quickActions={[
          {
            icon: <Star />,
            label: 'Test Action',
            onClick: () => console.log('Test clicked'),
            color: '#D4A574'
          }
        ]}
      />

      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h2" sx={{ mb: 4, textAlign: 'center', color: '#1F2937' }}>
          UI Enhancements Test
        </Typography>

        <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <EnhancedCard hoverEffect="lift" glowColor="#D4A574">
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>Lift Effect</Typography>
              <Typography>Hover to see the lift animation</Typography>
            </Box>
          </EnhancedCard>

          <EnhancedCard hoverEffect="glow" glowColor="#C9A86A">
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>Glow Effect</Typography>
              <Typography>Hover to see the glow animation</Typography>
            </Box>
          </EnhancedCard>

          <EnhancedCard hoverEffect="scale" glowColor="#A0826D">
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>Scale Effect</Typography>
              <Typography>Hover to see the scale animation</Typography>
            </Box>
          </EnhancedCard>

          <EnhancedCard hoverEffect="shine" glowColor="#8B7355">
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>Shine Effect</Typography>
              <Typography>Hover to see the shine animation</Typography>
            </Box>
          </EnhancedCard>
        </Box>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 3 }}>Loading Animations</Typography>
          <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Tribal</Typography>
              <LoadingAnimation variant="tribal" size="medium" />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Dots</Typography>
              <LoadingAnimation variant="dots" size="medium" />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Wave</Typography>
              <LoadingAnimation variant="wave" size="medium" />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Pulse</Typography>
              <LoadingAnimation variant="pulse" size="medium" />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default TestEnhancements