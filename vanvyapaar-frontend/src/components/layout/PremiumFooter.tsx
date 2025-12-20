import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    Box, Container, Grid, Typography, Stack, IconButton,
    TextField, Button, alpha, Chip
} from '@mui/material'
import {
    Facebook, Twitter, Instagram, LinkedIn, YouTube,
    Email, Phone, LocationOn, ArrowForward,
    Diamond, Verified, Security, LocalShipping, EmojiEvents
} from '@mui/icons-material'

const PremiumFooter = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    }
    const footerLinks = {
        shop: [
            { label: 'All Collections', path: '/products' },
            { label: 'Pottery & Ceramics', path: '/products?category=pottery' },
            { label: 'Textiles', path: '/products?category=textiles' },
            { label: 'Jewelry', path: '/products?category=jewelry' },
            { label: 'Wood Crafts', path: '/products?category=wood' },
            { label: 'New Arrivals', path: '/products?sort=new' }
        ],
        company: [
            { label: 'About Us', path: '/about' },
            { label: 'Our Artisans', path: '/artisans' },
            { label: 'Sustainability', path: '/sustainability' },
            { label: 'Press & Media', path: '/press' },
            { label: 'Careers', path: '/careers' },
            { label: 'Contact', path: '/contact' }
        ],
        support: [
            { label: 'Help Center', path: '/help' },
            { label: 'Shipping Info', path: '/shipping' },
            { label: 'Returns', path: '/returns' },
            { label: 'Track Order', path: '/track' },
            { label: 'Size Guide', path: '/size-guide' },
            { label: 'FAQs', path: '/faq' }
        ],
        legal: [
            { label: 'Privacy Policy', path: '/privacy' },
            { label: 'Terms of Service', path: '/terms' },
            { label: 'Cookie Policy', path: '/cookies' },
            { label: 'Accessibility', path: '/accessibility' }
        ]
    }

    const socialLinks = [
        { icon: <Facebook />, url: '#', label: 'Facebook' },
        { icon: <Instagram />, url: '#', label: 'Instagram' },
        { icon: <Twitter />, url: '#', label: 'Twitter' },
        { icon: <LinkedIn />, url: '#', label: 'LinkedIn' },
        { icon: <YouTube />, url: '#', label: 'YouTube' }
    ]

    const features = [
        { icon: <Security />, text: 'Secure Payment' },
        { icon: <LocalShipping />, text: 'Free Shipping' },
        { icon: <Verified />, text: 'Authentic Crafts' },
        { icon: <EmojiEvents />, text: 'Award Winning' }
    ]

    return (
        <Box component="footer" sx={{ bgcolor: '#1F2937', color: 'white', pt: 8, position: 'relative', overflow: 'hidden' }}>
            {/* Animated Background */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at 20% 50%, rgba(212, 165, 116, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(212, 165, 116, 0.03) 0%, transparent 50%)',
                    animation: 'pulse 4s ease-in-out infinite',
                    '@keyframes pulse': {
                        '0%, 100%': { opacity: 0.5 },
                        '50%': { opacity: 1 }
                    }
                }}
            />

            {/* Floating Particles */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        background: '#D4A574',
                        opacity: 0.3
                    }}
                    animate={{
                        y: [0, -100, 0],
                        x: [0, Math.random() * 100 - 50, 0],
                        opacity: [0, 0.5, 0]
                    }}
                    transition={{
                        duration: 3 + i,
                        repeat: Infinity,
                        delay: i * 0.5
                    }}
                    initial={{
                        left: `${20 + i * 15}%`,
                        bottom: 0
                    }}
                />
            ))}

            {/* Features Bar with Animation */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
            >
                <Box
                    sx={{
                        borderTop: '1px solid',
                        borderBottom: '1px solid',
                        borderColor: alpha('#D4A574', 0.2),
                        py: 4,
                        mb: 8,
                        position: 'relative'
                    }}
                >
                    <Container maxWidth="lg">
                        <Grid container spacing={4}>
                            {features.map((feature, index) => (
                                <Grid size={{ xs: 6, md: 3 }} key={index}>
                                    <motion.div variants={itemVariants}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <motion.div
                                                whileHover={{ scale: 1.2, rotate: 360 }}
                                                transition={{ duration: 0.6 }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 48,
                                                        height: 48,
                                                        borderRadius: '50%',
                                                        bgcolor: alpha('#D4A574', 0.1),
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#D4A574',
                                                        position: 'relative',
                                                        '&::before': {
                                                            content: '""',
                                                            position: 'absolute',
                                                            inset: -2,
                                                            borderRadius: '50%',
                                                            padding: '2px',
                                                            background: `linear-gradient(45deg, #D4A574, #C9A86A)`,
                                                            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                                            WebkitMaskComposite: 'xor',
                                                            maskComposite: 'exclude',
                                                            opacity: 0,
                                                            transition: 'opacity 0.3s'
                                                        },
                                                        '&:hover::before': {
                                                            opacity: 1
                                                        }
                                                    }}
                                                >
                                                    {feature.icon}
                                                </Box>
                                            </motion.div>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 500,
                                                    letterSpacing: '0.5px',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                {feature.text}
                                            </Typography>
                                        </Stack>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>
            </motion.div>

            <Container maxWidth="lg">
                <Grid container spacing={6}>
                    {/* Brand Section */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={3}>
                            <Box>
                                <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                                    <Box
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            bgcolor: alpha('#D4A574', 0.15),
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Diamond sx={{ color: '#D4A574', fontSize: 28 }} />
                                    </Box>
                                    <Box>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 300,
                                                fontSize: '1.5rem',
                                                letterSpacing: '1px',
                                                lineHeight: 1
                                            }}
                                        >
                                            VanVyaapaar
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: '#D4A574',
                                                fontSize: '0.65rem',
                                                letterSpacing: '2px',
                                                textTransform: 'uppercase',
                                                fontWeight: 600
                                            }}
                                        >
                                            Tribal Crafts
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: alpha('#fff', 0.7),
                                        lineHeight: 1.8,
                                        mb: 3
                                    }}
                                >
                                    Connecting you with India's finest tribal artisans. Every purchase preserves heritage and empowers communities.
                                </Typography>
                                <Chip
                                    icon={<Verified sx={{ fontSize: 16 }} />}
                                    label="Certified Authentic"
                                    sx={{
                                        bgcolor: alpha('#D4A574', 0.15),
                                        color: '#D4A574',
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        letterSpacing: '0.5px',
                                        height: 32,
                                        borderRadius: 0
                                    }}
                                />
                            </Box>

                            {/* Newsletter */}
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 600,
                                        mb: 2,
                                        letterSpacing: '1px',
                                        textTransform: 'uppercase',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    Stay Connected
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                    <TextField
                                        placeholder="Your email"
                                        size="small"
                                        sx={{
                                            flex: 1,
                                            '& .MuiOutlinedInput-root': {
                                                bgcolor: alpha('#fff', 0.05),
                                                borderRadius: 0,
                                                color: 'white',
                                                '& fieldset': {
                                                    borderColor: alpha('#D4A574', 0.2)
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: alpha('#D4A574', 0.4)
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#D4A574'
                                                }
                                            },
                                            '& input::placeholder': {
                                                color: alpha('#fff', 0.5),
                                                opacity: 1
                                            }
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        sx={{
                                            bgcolor: '#D4A574',
                                            color: '#1F2937',
                                            minWidth: 'auto',
                                            px: 2,
                                            borderRadius: 0,
                                            '&:hover': {
                                                bgcolor: '#C9A86A'
                                            }
                                        }}
                                    >
                                        <ArrowForward />
                                    </Button>
                                </Stack>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: alpha('#fff', 0.5),
                                        display: 'block',
                                        mt: 1,
                                        fontSize: '0.7rem'
                                    }}
                                >
                                    Subscribe for exclusive offers and updates
                                </Typography>
                            </Box>
                        </Stack>
                    </Grid>

                    {/* Links Sections */}
                    <Grid size={{ xs: 6, sm: 6, md: 2 }}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 600,
                                mb: 3,
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                fontSize: '0.85rem'
                            }}
                        >
                            Shop
                        </Typography>
                        <Stack spacing={1.5}>
                            {footerLinks.shop.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    style={{
                                        textDecoration: 'none',
                                        color: alpha('#fff', 0.7),
                                        fontSize: '0.9rem',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = '#D4A574'
                                        e.currentTarget.style.paddingLeft = '8px'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = alpha('#fff', 0.7)
                                        e.currentTarget.style.paddingLeft = '0'
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 6, sm: 6, md: 2 }}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 600,
                                mb: 3,
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                fontSize: '0.85rem'
                            }}
                        >
                            Company
                        </Typography>
                        <Stack spacing={1.5}>
                            {footerLinks.company.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    style={{
                                        textDecoration: 'none',
                                        color: alpha('#fff', 0.7),
                                        fontSize: '0.9rem',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = '#D4A574'
                                        e.currentTarget.style.paddingLeft = '8px'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = alpha('#fff', 0.7)
                                        e.currentTarget.style.paddingLeft = '0'
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 6, sm: 6, md: 2 }}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 600,
                                mb: 3,
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                fontSize: '0.85rem'
                            }}
                        >
                            Support
                        </Typography>
                        <Stack spacing={1.5}>
                            {footerLinks.support.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    style={{
                                        textDecoration: 'none',
                                        color: alpha('#fff', 0.7),
                                        fontSize: '0.9rem',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = '#D4A574'
                                        e.currentTarget.style.paddingLeft = '8px'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = alpha('#fff', 0.7)
                                        e.currentTarget.style.paddingLeft = '0'
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 6, sm: 6, md: 2 }}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 600,
                                mb: 3,
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                fontSize: '0.85rem'
                            }}
                        >
                            Contact
                        </Typography>
                        <Stack spacing={2}>
                            <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                <Email sx={{ fontSize: 18, color: '#D4A574', mt: 0.3 }} />
                                <Typography variant="body2" sx={{ color: alpha('#fff', 0.7), fontSize: '0.9rem' }}>
                                    support@vanvyaapaar.com
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                <Phone sx={{ fontSize: 18, color: '#D4A574', mt: 0.3 }} />
                                <Typography variant="body2" sx={{ color: alpha('#fff', 0.7), fontSize: '0.9rem' }}>
                                    +91 95299636241
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                <LocationOn sx={{ fontSize: 18, color: '#D4A574', mt: 0.3 }} />
                                <Typography variant="body2" sx={{ color: alpha('#fff', 0.7), fontSize: '0.9rem', lineHeight: 1.6 }}>
                                    Mumbai, Maharashtra
                                    <br />
                                    India
                                </Typography>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>

                {/* Bottom Bar */}
                <Box sx={{ mt: 8, pt: 4, pb: 4, borderTop: '1px solid', borderColor: alpha('#D4A574', 0.2) }}>
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={3}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                color: alpha('#fff', 0.5),
                                fontSize: '0.85rem',
                                textAlign: { xs: 'center', md: 'left' }
                            }}
                        >
                            © {new Date().getFullYear()} VanVyaapaar. All rights reserved. Crafted with ❤️ for artisans.
                        </Typography>

                        <Stack direction="row" spacing={1}>
                            {socialLinks.map((social, index) => (
                                <motion.div
                                    key={social.label}
                                    initial={{ opacity: 0, scale: 0 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -8, rotate: 360 }}
                                >
                                    <IconButton
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            color: alpha('#fff', 0.5),
                                            border: '1px solid',
                                            borderColor: alpha('#D4A574', 0.2),
                                            width: 36,
                                            height: 36,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                inset: 0,
                                                background: `linear-gradient(135deg, #D4A574, #C9A86A)`,
                                                opacity: 0,
                                                transition: 'opacity 0.3s'
                                            },
                                            '&:hover': {
                                                color: '#1F2937',
                                                borderColor: '#D4A574',
                                                '&::before': {
                                                    opacity: 1
                                                },
                                                '& svg': {
                                                    position: 'relative',
                                                    zIndex: 1
                                                }
                                            }
                                        }}
                                    >
                                        {social.icon}
                                    </IconButton>
                                </motion.div>
                            ))}
                        </Stack>

                        <Stack direction="row" spacing={2}>
                            {footerLinks.legal.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    style={{
                                        textDecoration: 'none',
                                        color: alpha('#fff', 0.5),
                                        fontSize: '0.85rem',
                                        transition: 'color 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = '#D4A574'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = alpha('#fff', 0.5)
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </Stack>
                    </Stack>
                </Box>
            </Container>
        </Box>
    )
}

export default PremiumFooter
