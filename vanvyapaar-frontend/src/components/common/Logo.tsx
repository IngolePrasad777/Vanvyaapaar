import { Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { alpha } from '@mui/material/styles'

interface LogoProps {
  variant?: 'light' | 'dark'
  size?: 'small' | 'medium' | 'large'
  showText?: boolean
  to?: string
}

const Logo = ({ 
  variant = 'dark', 
  size = 'medium', 
  showText = true,
  to = '/'
}: LogoProps) => {
  const sizes = {
    small: { box: 40, text: 'h6' },
    medium: { box: 48, text: 'h5' },
    large: { box: 64, text: 'h4' }
  }

  const colors = {
    light: {
      bg: alpha('#fff', 0.2),
      text: 'white',
      icon: 'white'
    },
    dark: {
      bg: '#D4A574',
      text: '#1F2937',
      icon: 'white'
    }
  }

  const currentSize = sizes[size]
  const currentColors = colors[variant]

  return (
    <Box
      component={Link}
      to={to}
      sx={{
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        '&:hover': {
          opacity: 0.9
        },
        transition: 'opacity 0.3s'
      }}
    >
      <Box
        sx={{
          width: currentSize.box,
          height: currentSize.box,
          bgcolor: currentColors.bg,
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: variant === 'light' ? 'blur(10px)' : 'none',
          boxShadow: variant === 'dark' ? '0 10px 40px rgba(212, 165, 116, 0.3)' : 'none',
          mr: showText ? 2 : 0
        }}
      >
        <Typography
          variant={currentSize.text as any}
          sx={{
            color: currentColors.icon,
            fontWeight: 'bold',
            fontFamily: 'serif'
          }}
        >
          V
        </Typography>
      </Box>
      
      {showText && (
        <Typography
          variant={currentSize.text as any}
          sx={{
            color: currentColors.text,
            fontWeight: 'bold',
            fontFamily: 'serif'
          }}
        >
          VanVyaapaar
        </Typography>
      )}
    </Box>
  )
}

export default Logo
