import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Box, Container, Typography, Grid, CardContent, CardMedia,
    Avatar, Chip, Button, alpha, Paper
} from '@mui/material'
import {
    LocationOn, Star, EmojiEvents,
    Palette, Handshake, AutoAwesome
} from '@mui/icons-material'
import AnimatedBackground from '../../components/common/AnimatedBackground'
import FloatingElements from '../../components/common/FloatingElements'
import EnhancedCard from '../../components/common/EnhancedCard'

const ArtisansPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('all')

    const artisanCategories = [
        { id: 'all', name: 'All Artisans', count: 150 },
        { id: 'pottery', name: 'Pottery & Ceramics', count: 35 },
        { id: 'textiles', name: 'Textiles & Weaving', count: 42 },
        { id: 'woodcraft', name: 'Wood Crafts', count: 28 },
        { id: 'jewelry', name: 'Tribal Jewelry', count: 25 },
        { id: 'metalwork', name: 'Metal Works', count: 20 }
    ]

    const featuredArtisans = [
        {
            id: 1,
            name: 'Kamala Devi',
            tribe: 'Warli Tribe',
            location: 'Maharashtra, India',
            specialization: 'Traditional Warli Paintings',
            experience: '25+ Years',
            rating: 4.9,
            totalProducts: 45,
            image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&q=80',
            coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
            story: 'Master artisan preserving ancient Warli art traditions through contemporary expressions.',
            achievements: ['UNESCO Recognition', 'National Award Winner', 'Master Craftsperson'],
            category: 'pottery'
        },
        {
            id: 2,
            name: 'Ravi Shankar',
            tribe: 'Gond Tribe',
            location: 'Madhya Pradesh, India',
            specialization: 'Gond Art & Sculptures',
            experience: '30+ Years',
            rating: 4.8,
            totalProducts: 38,
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
            coverImage: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80',
            story: 'Renowned Gond artist bringing tribal stories to life through intricate artwork.',
            achievements: ['Padma Shri Recipient', 'International Exhibitions', 'Cultural Ambassador'],
            category: 'woodcraft'
        },
        {
            id: 3,
            name: 'Meera Bai',
            tribe: 'Bhil Tribe',
            location: 'Rajasthan, India',
            specialization: 'Traditional Textiles',
            experience: '20+ Years',
            rating: 4.9,
            totalProducts: 52,
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
            coverImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
            story: 'Expert weaver creating stunning textiles using traditional Bhil techniques.',
            achievements: ['Master Weaver', 'Export Excellence', 'Women Empowerment Leader'],
            category: 'textiles'
        },
        {
            id: 4,
            name: 'Arjun Singh',
            tribe: 'Santhal Tribe',
            location: 'West Bengal, India',
            specialization: 'Tribal Jewelry',
            experience: '18+ Years',
            rating: 4.7,
            totalProducts: 29,
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
            coverImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
            story: 'Skilled jeweler crafting authentic tribal ornaments with cultural significance.',
            achievements: ['Heritage Craftsman', 'Design Innovation', 'Cultural Preservation'],
            category: 'jewelry'
        },
        {
            id: 5,
            name: 'Lakshmi Nair',
            tribe: 'Toda Tribe',
            location: 'Tamil Nadu, India',
            specialization: 'Metal Crafts',
            experience: '22+ Years',
            rating: 4.8,
            totalProducts: 33,
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80',
            coverImage: 'https://images.unsplash.com/photo-1582747652673-603191169c49?w=800&q=80',
            story: 'Master metalsmith creating exquisite tribal artifacts and ceremonial items.',
            achievements: ['Traditional Excellence', 'Craft Innovation', 'Community Leader'],
            category: 'metalwork'
        },
        {
            id: 6,
            name: 'Suresh Kumar',
            tribe: 'Baiga Tribe',
            location: 'Chhattisgarh, India',
            specialization: 'Bamboo Crafts',
            experience: '15+ Years',
            rating: 4.6,
            totalProducts: 41,
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
            coverImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80',
            story: 'Innovative bamboo craftsman blending traditional techniques with modern designs.',
            achievements: ['Eco-Craft Pioneer', 'Sustainable Design', 'Youth Mentor'],
            category: 'woodcraft'
        }
    ]

    const filteredArtisans = selectedCategory === 'all'
        ? featuredArtisans
        : featuredArtisans.filter(artisan => artisan.category === selectedCategory)

    return (
        <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: '#FAFAF9' }}>
            <AnimatedBackground variant="geometric" intensity="light" color="#D4A574" />
            <FloatingElements
                showScrollTop={true}
                showQuickActions={true}
                quickActions={[
                    {
                        icon: <Palette />,
                        label: 'Browse Crafts',
                        onClick: () => window.location.href = '/products',
                        color: '#D4A574'
                    },
                    {
                        icon: <Handshake />,
                        label: 'Become Seller',
                        onClick: () => window.location.href = '/register',
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
                                MEET OUR ARTISANS
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
                                Master Craftspeople
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
                                Discover the talented artisans behind every masterpiece. Each craftsperson brings
                                generations of knowledge, cultural heritage, and artistic excellence to create
                                authentic tribal art that tells a story.
                            </Typography>
                        </Box>
                    </motion.div>
                </Container>
            </Box>

            {/* Category Filter */}
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', color: '#1F2937', fontWeight: 'bold' }}>
                        Browse by Specialization
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                        {artisanCategories.map((category) => (
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

                {/* Artisans Grid */}
                <Grid container spacing={4} sx={{ mb: 8 }}>
                    {filteredArtisans.map((artisan, index) => (
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={artisan.id}>
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
                                    {/* Cover Image */}
                                    <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                                        <CardMedia
                                            component="img"
                                            image={artisan.coverImage}
                                            alt={artisan.specialization}
                                            sx={{
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.3s ease',
                                                '&:hover': { transform: 'scale(1.05)' }
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: `linear-gradient(to bottom, transparent 0%, ${alpha('#000', 0.7)} 100%)`
                                            }}
                                        />

                                        {/* Rating Badge */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 16,
                                                right: 16,
                                                bgcolor: 'rgba(255, 255, 255, 0.95)',
                                                borderRadius: 3,
                                                px: 2,
                                                py: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5
                                            }}
                                        >
                                            <Star sx={{ fontSize: 16, color: '#FFB400' }} />
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1F2937' }}>
                                                {artisan.rating}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <CardContent sx={{ p: 3 }}>
                                        {/* Profile Section */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <Avatar
                                                src={artisan.image}
                                                alt={artisan.name}
                                                sx={{
                                                    width: 60,
                                                    height: 60,
                                                    border: `3px solid ${alpha('#D4A574', 0.3)}`,
                                                    mr: 2
                                                }}
                                            />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 0.5 }}>
                                                    {artisan.name}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#D4A574', fontWeight: 600, mb: 0.5 }}>
                                                    {artisan.tribe}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <LocationOn sx={{ fontSize: 14, color: '#6B7280' }} />
                                                    <Typography variant="caption" sx={{ color: '#6B7280' }}>
                                                        {artisan.location}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>

                                        {/* Specialization */}
                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#1F2937', mb: 1 }}>
                                            {artisan.specialization}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#6B7280', mb: 3, lineHeight: 1.6 }}>
                                            {artisan.story}
                                        </Typography>

                                        {/* Stats */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#D4A574' }}>
                                                    {artisan.experience}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#6B7280' }}>
                                                    Experience
                                                </Typography>
                                            </Box>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#D4A574' }}>
                                                    {artisan.totalProducts}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#6B7280' }}>
                                                    Products
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Achievements */}
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1F2937', mb: 1 }}>
                                                Achievements:
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {artisan.achievements.map((achievement, idx) => (
                                                    <Chip
                                                        key={idx}
                                                        label={achievement}
                                                        size="small"
                                                        icon={<EmojiEvents sx={{ fontSize: 14 }} />}
                                                        sx={{
                                                            bgcolor: alpha('#D4A574', 0.1),
                                                            color: '#D4A574',
                                                            fontSize: '0.75rem',
                                                            '& .MuiChip-icon': { color: '#D4A574' }
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>

                                        {/* Action Button */}
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            sx={{
                                                borderColor: '#D4A574',
                                                color: '#D4A574',
                                                fontWeight: 600,
                                                py: 1.5,
                                                borderRadius: 3,
                                                '&:hover': {
                                                    bgcolor: '#D4A574',
                                                    color: 'white',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: `0 8px 25px ${alpha('#D4A574', 0.3)}`
                                                },
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            View Products
                                        </Button>
                                    </CardContent>
                                </EnhancedCard>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>

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
                            <AutoAwesome sx={{ fontSize: 48, color: '#D4A574', mb: 2 }} />
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 2 }}>
                                Become a Featured Artisan
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#6B7280', mb: 4, maxWidth: 600, mx: 'auto' }}>
                                Join our community of master craftspeople and share your traditional art with the world.
                                Get featured, reach global customers, and preserve your cultural heritage.
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
                                onClick={() => window.location.href = '/register'}
                            >
                                Join as Artisan
                            </Button>
                        </Paper>
                    </motion.div>
                </Box>
            </Container>
        </Box>
    )
}

export default ArtisansPage