import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Box, Container, Typography, Grid, Card, CardContent, CardMedia,
  Chip, Button, alpha, Paper, Avatar, Divider
} from '@mui/material'
import {
  AutoAwesome, Favorite, Share, Visibility, AccessTime,
  Star, Palette
} from '@mui/icons-material'
import AnimatedBackground from '../../components/common/AnimatedBackground'
import FloatingElements from '../../components/common/FloatingElements'
import EnhancedCard from '../../components/common/EnhancedCard'

const StoriesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const storyCategories = [
    { id: 'all', name: 'All Stories', count: 24 },
    { id: 'artisan', name: 'Artisan Journeys', count: 8 },
    { id: 'craft', name: 'Craft Heritage', count: 6 },
    { id: 'community', name: 'Community Impact', count: 5 },
    { id: 'innovation', name: 'Innovation', count: 3 },
    { id: 'success', name: 'Success Stories', count: 2 }
  ]

  const featuredStories = [
    {
      id: 1,
      title: 'The Revival of Warli Art: Kamala\'s Journey from Village to Global Recognition',
      excerpt: 'How a traditional Warli artist transformed her community through art, bringing ancient stories to modern canvases and empowering women artisans.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
      author: {
        name: 'Priya Sharma',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&q=80',
        role: 'Cultural Researcher'
      },
      category: 'artisan',
      readTime: '8 min read',
      publishDate: '2025-01-10',
      views: 2847,
      likes: 156,
      tags: ['Warli Art', 'Women Empowerment', 'Cultural Preservation', 'Maharashtra']
    },
    {
      id: 2,
      title: 'From Forest to Fashion: The Sustainable Journey of Bamboo Crafts',
      excerpt: 'Discover how traditional bamboo craftsmen are creating eco-friendly products that are revolutionizing sustainable fashion and home decor.',
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80',
      author: {
        name: 'Rajesh Kumar',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
        role: 'Sustainability Expert'
      },
      category: 'innovation',
      readTime: '10 min read',
      publishDate: '2025-01-08',
      views: 3241,
      likes: 203,
      tags: ['Bamboo Crafts', 'Sustainability', 'Eco-Fashion', 'Chhattisgarh']
    },
    {
      id: 3,
      title: 'The Golden Thread: How Tribal Jewelry Connects Past and Present',
      excerpt: 'Explore the intricate world of tribal jewelry making, where each piece carries centuries of cultural significance and artistic mastery.',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
      author: {
        name: 'Meera Patel',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
        role: 'Jewelry Design Expert'
      },
      category: 'craft',
      readTime: '12 min read',
      publishDate: '2025-01-05',
      views: 4156,
      likes: 287,
      tags: ['Tribal Jewelry', 'Silver Craft', 'Cultural Heritage', 'West Bengal']
    }
  ]

  const filteredStories = selectedCategory === 'all' 
    ? featuredStories 
    : featuredStories.filter(story => story.category === selectedCategory)

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: '#FAFAF9' }}>
      <AnimatedBackground variant="particles" intensity="light" color="#D4A574" />
      <FloatingElements 
        showScrollTop={true}
        showQuickActions={true}
        quickActions={[
          {
            icon: <AutoAwesome />,
            label: 'Featured Stories',
            onClick: () => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' }),
            color: '#D4A574'
          },
          {
            icon: <Share />,
            label: 'Share Stories',
            onClick: () => console.log('Share clicked'),
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
                INSPIRING STORIES
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
                Crafted with
                <br />
                <span style={{ color: '#D4A574' }}>Heart & Heritage</span>
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
                Discover the remarkable journeys of master artisans, the revival of ancient crafts, 
                and the communities transformed through the power of traditional art.
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Category Filter */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', color: '#1F2937', fontWeight: 'bold' }}>
            Browse Stories by Category
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            {storyCategories.map((category) => (
              <motion.div
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Chip
                  label={`${category.name} (${category.count})`}
                  onClick={() => setSelectedCategory(category.id)}
                  sx={{
                    px: 3,
                    py: 1,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    bgcolor: selectedCategory === category.id ? '#D4A574' : 'white',
                    color: selectedCategory === category.id ? 'white' : '#6B7280',
                    border: `2px solid ${selectedCategory === category.id ? '#D4A574' : alpha('#D4A574', 0.3)}`,
                    '&:hover': {
                      bgcolor: selectedCategory === category.id ? '#C9A86A' : alpha('#D4A574', 0.1),
                      borderColor: '#D4A574'
                    },
                    transition: 'all 0.3s ease'
                  }}
                />
              </motion.div>
            ))}
          </Box>
        </Box>

        {/* Stories Grid */}
        <Box id="featured" sx={{ mb: 8 }}>
          <Grid container spacing={4}>
            {filteredStories.map((story, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={story.id}>
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <EnhancedCard
                    hoverEffect="lift"
                    glowColor="#D4A574"
                    intensity="medium"
                    sx={{
                      height: '100%',
                      overflow: 'hidden',
                      borderRadius: 4,
                      border: `1px solid ${alpha('#D4A574', 0.2)}`
                    }}
                  >
                    {/* Story Image */}
                    <Box sx={{ position: 'relative', height: 250, overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        image={story.image}
                        alt={story.title}
                        sx={{
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease',
                          '&:hover': { transform: 'scale(1.05)' }
                        }}
                      />
                      
                      {/* Category Badge */}
                      <Chip
                        label={storyCategories.find(cat => cat.id === story.category)?.name}
                        sx={{
                          position: 'absolute',
                          top: 16,
                          left: 16,
                          bgcolor: 'rgba(212, 165, 116, 0.9)',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      />
                    </Box>

                    <CardContent sx={{ p: 3 }}>
                      {/* Story Meta */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar
                          src={story.author.avatar}
                          alt={story.author.name}
                          sx={{ width: 32, height: 32 }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1F2937' }}>
                            {story.author.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#6B7280' }}>
                            {story.author.role}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTime sx={{ fontSize: 14, color: '#6B7280' }} />
                          <Typography variant="caption" sx={{ color: '#6B7280' }}>
                            {story.readTime}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Story Title */}
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 'bold', 
                          color: '#1F2937', 
                          mb: 2,
                          lineHeight: 1.4
                        }}
                      >
                        {story.title}
                      </Typography>

                      {/* Story Excerpt */}
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#6B7280', 
                          mb: 3, 
                          lineHeight: 1.6
                        }}
                      >
                        {story.excerpt}
                      </Typography>

                      <Divider sx={{ mb: 2 }} />

                      {/* Story Stats & Action */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Visibility sx={{ fontSize: 16, color: '#6B7280' }} />
                            <Typography variant="caption" sx={{ color: '#6B7280' }}>
                              {story.views.toLocaleString()}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Favorite sx={{ fontSize: 16, color: '#EF4444' }} />
                            <Typography variant="caption" sx={{ color: '#6B7280' }}>
                              {story.likes}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            borderColor: '#D4A574',
                            color: '#D4A574',
                            fontWeight: 600,
                            '&:hover': {
                              bgcolor: '#D4A574',
                              color: 'white'
                            }
                          }}
                        >
                          Read Story
                        </Button>
                      </Box>
                    </CardContent>
                  </EnhancedCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
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
              <Star sx={{ fontSize: 48, color: '#D4A574', mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 2 }}>
                Share Your Story
              </Typography>
              <Typography variant="body1" sx={{ color: '#6B7280', mb: 4, maxWidth: 600, mx: 'auto' }}>
                Are you an artisan with an inspiring journey? We'd love to share your story and celebrate 
                the impact of authentic tribal art.
              </Typography>
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
              >
                Submit Your Story
              </Button>
            </Paper>
          </motion.div>
        </Box>
      </Container>
    </Box>
  )
}

export default StoriesPage