import { motion } from 'framer-motion'
import {
  Box, Container, Typography, Grid, Card, CardContent,
  Avatar, Stack, Button, alpha, Paper, Divider
} from '@mui/material'
import {
  EmojiEvents, Handshake, Security, LocalShipping,
  Verified, AutoAwesome, Diamond, Star,
  People, TrendingUp, Favorite, Shield
} from '@mui/icons-material'
import AnimatedBackground from '../../components/common/AnimatedBackground'
import FloatingElements from '../../components/common/FloatingElements'
import EnhancedCard from '../../components/common/EnhancedCard'

const AboutPage = () => {
  const stats = [
    { value: '500+', label: 'Master Artisans', icon: <People sx={{ fontSize: 40 }} />, color: '#D4A574' },
    { value: '50+', label: 'Tribal Communities', icon: <Handshake sx={{ fontSize: 40 }} />, color: '#C9A86A' },
    { value: '10,000+', label: 'Authentic Products', icon: <Diamond sx={{ fontSize: 40 }} />, color: '#A0826D' },
    { value: '25+', label: 'States Covered', icon: <TrendingUp sx={{ fontSize: 40 }} />, color: '#8B7355' }
  ]

  const values = [
    {
      icon: <AutoAwesome sx={{ fontSize: 48 }} />,
      title: 'Authenticity First',
      description: 'Every product is verified for authenticity and cultural significance. We work directly with artisans to ensure genuine tribal craftsmanship.',
      color: '#D4A574'
    },
    {
      icon: <Handshake sx={{ fontSize: 48 }} />,
      title: 'Fair Trade Practices',
      description: 'We ensure fair compensation for artisans, supporting their livelihoods and preserving traditional crafts for future generations.',
      color: '#C9A86A'
    },
    {
      icon: <Shield sx={{ fontSize: 48 }} />,
      title: 'Cultural Preservation',
      description: 'Our mission extends beyond commerce to actively preserve and promote tribal art forms, stories, and cultural heritage.',
      color: '#A0826D'
    },
    {
      icon: <Favorite sx={{ fontSize: 48 }} />,
      title: 'Community Impact',
      description: 'Every purchase directly supports tribal communities, funding education, healthcare, and sustainable development initiatives.',
      color: '#8B7355'
    }
  ]

  const team = [
    {
      name: 'Dr. Priya Sharma',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80',
      bio: 'Cultural anthropologist with 15+ years experience in tribal art preservation and community development.',
      expertise: 'Cultural Heritage, Community Development'
    },
    {
      name: 'Rajesh Kumar',
      role: 'Head of Artisan Relations',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
      bio: 'Former tribal welfare officer with deep connections across Indian tribal communities and craft traditions.',
      expertise: 'Tribal Relations, Craft Authentication'
    },
    {
      name: 'Meera Patel',
      role: 'Design & Quality Director',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
      bio: 'Award-winning designer specializing in traditional Indian crafts and contemporary market adaptation.',
      expertise: 'Product Design, Quality Assurance'
    },
    {
      name: 'Arjun Singh',
      role: 'Technology Lead',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      bio: 'Tech entrepreneur passionate about using technology to bridge traditional crafts with modern markets.',
      expertise: 'Platform Development, Digital Innovation'
    }
  ]

  const milestones = [
    {
      year: '2020',
      title: 'Foundation',
      description: 'VanVyapaar was founded with a vision to connect tribal artisans with global markets while preserving cultural heritage.'
    },
    {
      year: '2021',
      title: 'First 100 Artisans',
      description: 'Onboarded our first 100 master artisans from 15 different tribal communities across India.'
    },
    {
      year: '2022',
      title: 'National Recognition',
      description: 'Received the National Award for Excellence in Tribal Craft Promotion from the Ministry of Tribal Affairs.'
    },
    {
      year: '2023',
      title: 'International Expansion',
      description: 'Launched international shipping, bringing authentic Indian tribal crafts to customers worldwide.'
    },
    {
      year: '2024',
      title: 'Digital Innovation',
      description: 'Introduced AR/VR experiences and digital storytelling to enhance cultural education and product discovery.'
    },
    {
      year: '2025',
      title: 'Sustainable Future',
      description: 'Committed to carbon-neutral operations and launched the Tribal Heritage Preservation Fund.'
    }
  ]

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: '#FAFAF9' }}>
      <AnimatedBackground variant="bubbles" intensity="light" color="#D4A574" />
      <FloatingElements 
        showScrollTop={true}
        showQuickActions={true}
        quickActions={[
          {
            icon: <People />,
            label: 'Meet Artisans',
            onClick: () => window.location.href = '/artisans',
            color: '#D4A574'
          },
          {
            icon: <AutoAwesome />,
            label: 'Our Stories',
            onClick: () => window.location.href = '/stories',
            color: '#C9A86A'
          }
        ]}
      />

      {/* Hero Section */}
      <Box sx={{ position: 'relative', py: 12, overflow: 'hidden' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography
                variant="overline"
                sx={{
                  color: '#D4A574',
                  fontWeight: 700,
                  letterSpacing: '3px',
                  fontSize: '0.9rem',
                  mb: 2,
                  display: 'block'
                }}
              >
                ABOUT VANVYAPAAR
              </Typography>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 300,
                  mb: 3,
                  fontSize: { xs: '3rem', md: '5rem' },
                  color: '#1F2937',
                  letterSpacing: '-0.02em'
                }}
              >
                Preserving Heritage,
                <br />
                <span style={{ color: '#D4A574' }}>Empowering Communities</span>
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: '#6B7280',
                  maxWidth: '800px',
                  mx: 'auto',
                  fontWeight: 400,
                  lineHeight: 1.6,
                  fontSize: { xs: '1.1rem', md: '1.3rem' }
                }}
              >
                We are more than a marketplace. We are a bridge between ancient wisdom and modern appreciation, 
                connecting master artisans with conscious consumers who value authenticity, craftsmanship, and cultural heritage.
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Stats Section */}
        <Box sx={{ mb: 12 }}>
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <EnhancedCard
                    hoverEffect="glow"
                    glowColor={stat.color}
                    sx={{
                      textAlign: 'center',
                      p: 4,
                      borderRadius: 4,
                      border: `2px solid ${alpha(stat.color, 0.2)}`
                    }}
                  >
                    <Box sx={{ color: stat.color, mb: 2 }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: stat.color, mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#6B7280', fontWeight: 600 }}>
                      {stat.label}
                    </Typography>
                  </EnhancedCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Mission Section */}
        <Box sx={{ mb: 12 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Paper
              sx={{
                p: 8,
                borderRadius: 6,
                background: `linear-gradient(135deg, ${alpha('#D4A574', 0.1)} 0%, ${alpha('#C9A86A', 0.1)} 100%)`,
                border: `1px solid ${alpha('#D4A574', 0.2)}`,
                textAlign: 'center'
              }}
            >
              <EmojiEvents sx={{ fontSize: 64, color: '#D4A574', mb: 3 }} />
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 3 }}>
                Our Mission
              </Typography>
              <Typography variant="h6" sx={{ color: '#6B7280', lineHeight: 1.8, maxWidth: 800, mx: 'auto' }}>
                To create a sustainable ecosystem where traditional tribal crafts thrive in the modern world, 
                ensuring that ancient art forms are preserved, artisans are fairly compensated, and cultural 
                heritage is celebrated and passed on to future generations.
              </Typography>
            </Paper>
          </motion.div>
        </Box>

        {/* Values Section */}
        <Box sx={{ mb: 12 }}>
          <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#1F2937', mb: 6 }}>
            Our Core Values
          </Typography>
          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <EnhancedCard
                    hoverEffect="lift"
                    glowColor={value.color}
                    sx={{
                      p: 4,
                      height: '100%',
                      borderRadius: 4,
                      border: `1px solid ${alpha(value.color, 0.2)}`
                    }}
                  >
                    <Box sx={{ color: value.color, mb: 3 }}>
                      {value.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 2 }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#6B7280', lineHeight: 1.7 }}>
                      {value.description}
                    </Typography>
                  </EnhancedCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Team Section */}
        <Box sx={{ mb: 12 }}>
          <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#1F2937', mb: 6 }}>
            Meet Our Team
          </Typography>
          <Grid container spacing={4}>
            {team.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <EnhancedCard
                    hoverEffect="scale"
                    glowColor="#D4A574"
                    sx={{
                      textAlign: 'center',
                      p: 3,
                      borderRadius: 4,
                      border: `1px solid ${alpha('#D4A574', 0.2)}`
                    }}
                  >
                    <Avatar
                      src={member.image}
                      alt={member.name}
                      sx={{
                        width: 100,
                        height: 100,
                        mx: 'auto',
                        mb: 2,
                        border: `4px solid ${alpha('#D4A574', 0.3)}`
                      }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 1 }}>
                      {member.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#D4A574', fontWeight: 600, mb: 2 }}>
                      {member.role}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280', mb: 2, lineHeight: 1.6 }}>
                      {member.bio}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#A0826D', fontWeight: 600 }}>
                      {member.expertise}
                    </Typography>
                  </EnhancedCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Timeline Section */}
        <Box sx={{ mb: 12 }}>
          <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#1F2937', mb: 6 }}>
            Our Journey
          </Typography>
          <Box sx={{ position: 'relative' }}>
            {/* Timeline Line */}
            <Box
              sx={{
                position: 'absolute',
                left: { xs: 20, md: '50%' },
                top: 0,
                bottom: 0,
                width: 2,
                bgcolor: alpha('#D4A574', 0.3),
                transform: { md: 'translateX(-50%)' }
              }}
            />
            
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 6,
                    flexDirection: { xs: 'row', md: index % 2 === 0 ? 'row-reverse' : 'row' }
                  }}
                >
                  {/* Timeline Dot */}
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: '#D4A574',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: { xs: 'absolute', md: 'relative' },
                      left: { xs: 0, md: 'auto' },
                      zIndex: 2,
                      border: '4px solid white',
                      boxShadow: `0 4px 20px ${alpha('#D4A574', 0.3)}`
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.75rem' }}>
                      {milestone.year.slice(-2)}
                    </Typography>
                  </Box>

                  {/* Content */}
                  <Box
                    sx={{
                      flex: 1,
                      ml: { xs: 8, md: index % 2 === 0 ? 0 : 4 },
                      mr: { xs: 0, md: index % 2 === 0 ? 4 : 0 }
                    }}
                  >
                    <Paper
                      sx={{
                        p: 4,
                        borderRadius: 4,
                        border: `1px solid ${alpha('#D4A574', 0.2)}`,
                        bgcolor: 'white'
                      }}
                    >
                      <Typography variant="h4" sx={{ color: '#D4A574', fontWeight: 'bold', mb: 1 }}>
                        {milestone.year}
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#1F2937', fontWeight: 'bold', mb: 2 }}>
                        {milestone.title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#6B7280', lineHeight: 1.6 }}>
                        {milestone.description}
                      </Typography>
                    </Paper>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Box>

        {/* Call to Action */}
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Paper
              sx={{
                p: 6,
                borderRadius: 6,
                background: `linear-gradient(135deg, ${alpha('#D4A574', 0.1)} 0%, ${alpha('#C9A86A', 0.1)} 100%)`,
                border: `1px solid ${alpha('#D4A574', 0.2)}`
              }}
            >
              <Handshake sx={{ fontSize: 48, color: '#D4A574', mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 2 }}>
                Join Our Mission
              </Typography>
              <Typography variant="body1" sx={{ color: '#6B7280', mb: 4, maxWidth: 600, mx: 'auto' }}>
                Whether you're an artisan looking to share your craft, a customer seeking authentic products, 
                or a partner wanting to support cultural preservation, we invite you to be part of our journey.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: '#D4A574',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: '#C9A86A',
                      transform: 'translateY(-2px)',
                      boxShadow: `0 12px 35px ${alpha('#D4A574', 0.4)}`
                    },
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => window.location.href = '/products'}
                >
                  Explore Products
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: '#D4A574',
                    color: '#D4A574',
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: alpha('#D4A574', 0.1),
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => window.location.href = '/register'}
                >
                  Become a Partner
                </Button>
              </Stack>
            </Paper>
          </motion.div>
        </Box>
      </Container>
    </Box>
  )
}

export default AboutPage