import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Box, Container, Typography, Button, Grid, CardContent,
  Chip, IconButton, alpha, Stack, Paper
} from '@mui/material'
import {
  ArrowForward, Star, LocalShipping, Security,
  PlayArrow, ChevronLeft, ChevronRight,
  Verified, EmojiEvents, AutoAwesome, Handshake,
  Palette, Diamond, Brush, Category
} from '@mui/icons-material'
import AnimatedBackground from '../../components/common/AnimatedBackground'
import FloatingElements from '../../components/common/FloatingElements'
import EnhancedCard from '../../components/common/EnhancedCard'

const LandingPageNew = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  const heroSlides = [
    {
      title: "Timeless Tribal Artistry",
      subtitle: "Where Heritage Meets Contemporary Elegance",
      description: "Curated collection of authentic handcrafted masterpieces from India's finest tribal artisans",
      image: "https://www.re-thinkingthefuture.com/wp-content/uploads/2021/05/A4086-Handicrafts-from-Northeast-India-Image11.jpg",
      gradient: "linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(55, 65, 81, 0.9) 100%)"
    },
    {
      title: "Empowering Artisan Communities",
      subtitle: "Preserving Traditions, Creating Futures",
      description: "Every purchase directly supports traditional craftspeople and their families",
      image: "https://exclusivelane.com/cdn/shop/files/EL-005-1686_A_580x.jpg?v=1740476654",
      gradient: "linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(71, 85, 105, 0.9) 100%)"
    },
    {
      title: "Heritage Woven in Gold",
      subtitle: "Centuries of Craftsmanship in Every Thread",
      description: "Handwoven textiles that tell stories of tradition, skill, and cultural pride",
      image: "https://rukminim2.flixcart.com/image/832/832/xif0q/sari/i/b/g/free-s814-melisha-red-gugaliya-unstitched-original-imagupqmdmsqtzyc.jpeg?q=70&crop=false",
      gradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(51, 65, 85, 0.9) 100%)"
    }
  ]

  const categories = [
    {
      name: 'Pottery & Ceramics',
      icon: <Palette sx={{ fontSize: 48 }} />,
      image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&q=80',
      count: '150+ Pieces',
      color: '#D4A574',
      description: 'Handcrafted earthenware with ancient techniques'
    },
    {
      name: 'Premium Textiles',
      icon: <Brush sx={{ fontSize: 48 }} />,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80',
      count: '200+ Designs',
      color: '#8B7355',
      description: 'Handwoven fabrics with intricate patterns'
    },
    {
      name: 'Artisan Crafts',
      icon: <AutoAwesome sx={{ fontSize: 48 }} />,
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80',
      count: '300+ Items',
      color: '#A0826D',
      description: 'Unique handmade artifacts and decor'
    },
    {
      name: 'Tribal Jewelry',
      icon: <Diamond sx={{ fontSize: 48 }} />,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80',
      count: '120+ Pieces',
      color: '#C9A86A',
      description: 'Traditional ornaments with cultural significance'
    },
    {
      name: 'Wood Artistry',
      icon: <Category sx={{ fontSize: 48 }} />,
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&q=80',
      count: '180+ Crafts',
      color: '#8B6F47',
      description: 'Intricately carved wooden masterpieces'
    },
    {
      name: 'Metal Works',
      icon: <Star sx={{ fontSize: 48 }} />,
      image: 'https://images.unsplash.com/photo-1582747652673-603191169c49?w=400&q=80',
      count: '90+ Items',
      color: '#B8956A',
      description: 'Handforged metal art and sculptures'
    }
  ]

  const stats = [
    { value: 'Since 2025', label: 'Preserving Heritage', icon: <EmojiEvents sx={{ fontSize: 40 }} />, color: '#D4A574' },
    { value: '100%', label: 'Handcrafted', icon: <AutoAwesome sx={{ fontSize: 40 }} />, color: '#C9A86A' },
    { value: 'Fair Trade', label: 'Certified', icon: <Handshake sx={{ fontSize: 40 }} />, color: '#A0826D' },
    { value: 'Direct', label: 'From Artisans', icon: <Verified sx={{ fontSize: 40 }} />, color: '#8B7355' }
  ]

  const features = [
    { icon: <Security />, title: 'Authenticity Guaranteed', desc: 'Every piece verified by experts' },
    { icon: <LocalShipping />, title: 'Secure Delivery', desc: 'Safe packaging & tracking' },
    { icon: <Handshake />, title: 'Fair Trade', desc: 'Direct support to artisans' },
    { icon: <Verified />, title: 'Quality Assured', desc: 'Premium craftsmanship only' }
  ]

  return (
    <Box sx={{ overflow: 'hidden', bgcolor: '#FAFAF9', position: 'relative' }}>
      <AnimatedBackground variant="waves" intensity="light" color="#D4A574" />
      <FloatingElements 
        showScrollTop={true}
        showQuickActions={true}
        quickActions={[
          {
            icon: <Verified />,
            label: 'Browse Products',
            onClick: () => window.location.href = '/buyer/products',
            color: '#D4A574'
          },
          {
            icon: <Star />,
            label: 'Featured Items',
            onClick: () => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' }),
            color: '#C9A86A'
          }
        ]}
      />
      {/* Floating Particles Background */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'fixed',
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            borderRadius: '50%',
            background: alpha('#D4A574', Math.random() * 0.3 + 0.1),
            pointerEvents: 'none',
            zIndex: 0
          }}
          animate={{
            y: [0, -1000],
            x: [0, Math.random() * 200 - 100],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'linear'
          }}
          initial={{
            left: `${Math.random() * 100}%`,
            bottom: -20
          }}
        />
      ))}

      {/* Elegant Line Art Woman Weaving Patterns - Full Page */}
      <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
        <motion.div
          style={{
            position: 'fixed',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1000,
            pointerEvents: 'none',
            width: '100%',
            height: '100vh'
          }}
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.5, delay: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          {/* Elegant Line Art Woman SVG - Expanded */}
          <motion.svg
            width="100%"
            height="100%"
            viewBox="0 0 1200 800"
            preserveAspectRatio="xMinYMid meet"
            style={{ filter: 'drop-shadow(0 5px 30px rgba(212, 165, 116, 0.4))' }}
          >
            {/* Beautiful Enhanced Tribal Woman - FULL HEIGHT */}
            <motion.g
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5, delay: 1.5, ease: [0.43, 0.13, 0.23, 0.96] }}
              transform="scale(5.5) translate(50, 5)"
            >
              {/* ===== BEAUTIFUL FEMININE FACE - REDESIGNED ===== */}

              {/* Forehead - Smooth & Rounded */}
              <motion.path
                d="M 75 65 Q 80 50, 88 40 Q 93 35, 98 33"
                fill="none"
                stroke="#D4A574"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />

              {/* Eyebrow - Graceful Arch */}
              <motion.path
                d="M 85 52 Q 90 50, 95 51"
                fill="none"
                stroke="#8B7355"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.9 }}
              />

              {/* Eye - Large Almond Shape */}
              <motion.path
                d="M 83 57 Q 88 55, 93 56 Q 95 57, 96 58"
                fill="none"
                stroke="#8B7355"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
              />

              {/* Lower Eye Line */}
              <motion.path
                d="M 83 57 Q 88 58, 93 57"
                fill="none"
                stroke="#8B7355"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 1.05 }}
              />

              {/* Eyelashes - More Feminine */}
              {[...Array(5)].map((_, i) => (
                <motion.line
                  key={`lash-${i}`}
                  x1={84 + i * 2.5}
                  y1={56}
                  x2={83 + i * 2.5}
                  y2={52}
                  stroke="#8B7355"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 1.1 + i * 0.04 }}
                />
              ))}

              {/* Nose Bridge - Elegant */}
              <motion.path
                d="M 98 33 Q 100 42, 101 50 Q 102 56, 103 61"
                fill="none"
                stroke="#D4A574"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              />

              {/* Nose Tip - Delicate */}
              <motion.path
                d="M 103 61 Q 105 63, 107 64"
                fill="none"
                stroke="#D4A574"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 1.2 }}
              />

              {/* Nostril - Subtle */}
              <motion.path
                d="M 106 63 Q 107 64, 108 64"
                fill="none"
                stroke="#D4A574"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.2, delay: 1.3 }}
              />

              {/* Nose Ring - Traditional Nath */}
              <motion.circle
                cx="107"
                cy="64"
                r="3.5"
                fill="none"
                stroke="#D4A574"
                strokeWidth="1.8"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5, delay: 2.9 }}
              />
              <motion.circle
                cx="107"
                cy="64"
                r="2.5"
                fill="#D4A574"
                opacity="0.2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 3 }}
              />

              {/* Upper Lip - Soft Cupid's Bow */}
              <motion.path
                d="M 108 67 Q 111 66, 113 66 Q 115 66, 117 67"
                fill="none"
                stroke="#D4A574"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              />

              {/* Lower Lip - Full & Feminine */}
              <motion.path
                d="M 108 67 Q 112.5 70, 117 67"
                fill="none"
                stroke="#D4A574"
                strokeWidth="3.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 1.15 }}
              />

              {/* Chin - Soft & Rounded */}
              <motion.path
                d="M 117 67 Q 115 74, 110 78 Q 105 81, 100 82"
                fill="none"
                stroke="#D4A574"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 1.4 }}
              />

              {/* Jawline - Gentle Curve */}
              <motion.path
                d="M 100 82 Q 95 84, 90 85"
                fill="none"
                stroke="#D4A574"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 1.6 }}
              />

              {/* Neck - Graceful & Slender */}
              <motion.path
                d="M 90 85 Q 88 92, 86 100"
                fill="none"
                stroke="#D4A574"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 1.7 }}
              />

              {/* Back of Head - Rounded & Feminine */}
              <motion.path
                d="M 75 65 Q 68 58, 63 52 Q 58 46, 56 40 Q 55 34, 57 28 Q 60 22, 66 18 Q 74 14, 84 13 Q 94 13, 98 33"
                fill="none"
                stroke="#D4A574"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.3 }}
              />

              {/* ===== BEAUTIFUL FLOWING HAIR ===== */}

              {/* Main Hair Flow - Voluminous */}
              <motion.path
                d="M 63 20 Q 53 24, 48 32 Q 45 40, 46 50 Q 48 60, 54 68"
                fill="none"
                stroke="#8B7355"
                strokeWidth="5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 2 }}
              />

              {/* Second Hair Strand */}
              <motion.path
                d="M 66 24 Q 56 28, 52 36 Q 50 44, 52 54 Q 54 62, 58 68"
                fill="none"
                stroke="#8B7355"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, delay: 2.1 }}
              />

              {/* Third Hair Strand - Adds Volume */}
              <motion.path
                d="M 60 18 Q 50 22, 46 30 Q 44 38, 46 48"
                fill="none"
                stroke="#8B7355"
                strokeWidth="3.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 2.15 }}
              />

              {/* Hair Bun - Large & Elegant */}
              <motion.circle
                cx="58"
                cy="20"
                r="12"
                fill="none"
                stroke="#8B7355"
                strokeWidth="3.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 2.3 }}
              />

              {/* Hair Bun Inner Detail */}
              <motion.circle
                cx="58"
                cy="20"
                r="7"
                fill="none"
                stroke="#8B7355"
                strokeWidth="2.5"
                strokeDasharray="4 2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 2.4 }}
              />

              {/* ===== FOREHEAD ORNAMENT (TIKKA/BINDI) ===== */}

              {/* Maang Tikka Chain - Delicate */}
              <motion.path
                d="M 58 20 Q 68 28, 82 44"
                fill="none"
                stroke="#D4A574"
                strokeWidth="1.8"
                strokeDasharray="2 1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 2.6 }}
              />

              {/* Bindi - Center Forehead */}
              <motion.circle
                cx="82"
                cy="44"
                r="3"
                fill="#D4A574"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ duration: 0.5, delay: 2.7 }}
              />

              {/* Bindi Glow */}
              <motion.circle
                cx="82"
                cy="44"
                r="5"
                fill="none"
                stroke="#D4A574"
                strokeWidth="1.2"
                opacity="0.4"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.6, delay: 2.75 }}
              />

              {/* Hair Ornament - Decorative Pins */}
              {[...Array(8)].map((_, i) => (
                <motion.line
                  key={`hair-pin-${i}`}
                  x1="58"
                  y1="20"
                  x2={58 + Math.cos((i * 45) * Math.PI / 180) * 16}
                  y2={20 + Math.sin((i * 45) * Math.PI / 180) * 16}
                  stroke="#D4A574"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 2.5 + i * 0.06 }}
                />
              ))}

              {/* Ornament Tips - Pearls */}
              {[...Array(8)].map((_, i) => (
                <motion.circle
                  key={`ornament-tip-${i}`}
                  cx={58 + Math.cos((i * 45) * Math.PI / 180) * 16}
                  cy={20 + Math.sin((i * 45) * Math.PI / 180) * 16}
                  r="2"
                  fill="#D4A574"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ duration: 0.3, delay: 2.7 + i * 0.06 }}
                />
              ))}

              {/* ===== EARRINGS - ELABORATE JHUMKA ===== */}

              {/* Main Earring Circle */}
              <motion.circle
                cx="82"
                cy="75"
                r="6"
                fill="none"
                stroke="#D4A574"
                strokeWidth="2.8"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5, delay: 2.8 }}
              />

              {/* Inner Earring Detail */}
              <motion.circle
                cx="82"
                cy="75"
                r="3.5"
                fill="#D4A574"
                opacity="0.25"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 2.85 }}
              />

              {/* Dangling Chain */}
              <motion.line
                x1="82"
                y1="81"
                x2="82"
                y2="90"
                stroke="#D4A574"
                strokeWidth="2.2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 3 }}
              />

              {/* Jhumka Bell Shape */}
              <motion.path
                d="M 78 90 Q 82 94, 86 90"
                fill="none"
                stroke="#D4A574"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 3.1 }}
              />

              {/* Jhumka Beads */}
              {[...Array(3)].map((_, i) => (
                <motion.circle
                  key={`jhumka-bead-${i}`}
                  cx={79 + i * 3}
                  cy={93}
                  r="1"
                  fill="#D4A574"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.2, delay: 3.2 + i * 0.05 }}
                />
              ))}

              {/* ===== NECKLACES - LAYERED ===== */}

              {/* First Necklace - Choker */}
              <motion.path
                d="M 86 100 Q 92 104, 100 106 Q 108 104, 114 100"
                fill="none"
                stroke="#C9A86A"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 3.2 }}
              />

              {/* Choker Beads */}
              {[...Array(7)].map((_, i) => (
                <motion.circle
                  key={`choker-bead-${i}`}
                  cx={90 + i * 4}
                  cy={102 + Math.sin(i * 0.5) * 2}
                  r="1.8"
                  fill="#C9A86A"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.3, delay: 3.3 + i * 0.04 }}
                />
              ))}

              {/* Second Necklace - Longer */}
              <motion.path
                d="M 84 106 Q 94 112, 104 114 Q 114 112, 120 106"
                fill="none"
                stroke="#D4A574"
                strokeWidth="2.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, delay: 3.4 }}
              />

              {/* Pendant - Ornate */}
              <motion.path
                d="M 104 114 L 104 122 L 100 126 L 104 130 L 108 126 Z"
                fill="none"
                stroke="#D4A574"
                strokeWidth="2.2"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 3.6 }}
              />

              {/* Pendant Center Gem */}
              <motion.circle
                cx="104"
                cy="124"
                r="2"
                fill="#D4A574"
                opacity="0.6"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.3, delay: 3.7 }}
              />

              {/* ===== BODY & ARMS ===== */}

              {/* Right Shoulder - Graceful Slope */}
              <motion.path
                d="M 86 100 Q 84 115, 82 135"
                fill="none"
                stroke="#D4A574"
                strokeWidth="3.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 3.7 }}
              />

              {/* Torso - Flowing Feminine Curve - FULL HEIGHT */}
              <motion.path
                d="M 82 135 Q 80 170, 78 210 Q 76 260, 74 320 Q 72 420, 70 520 Q 68 620, 66 720 Q 64 820, 62 900"
                fill="none"
                stroke="#D4A574"
                strokeWidth="3.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 3.9 }}
              />

              {/* Left Shoulder - Elegant */}
              <motion.path
                d="M 114 100 Q 122 115, 127 135"
                fill="none"
                stroke="#D4A574"
                strokeWidth="3.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 3.8 }}
              />

              {/* Right Arm - Extended Forward (Weaving Position) */}
              <motion.path
                d="M 82 135 Q 88 152, 94 170 Q 100 188, 106 205"
                fill="none"
                stroke="#D4A574"
                strokeWidth="3.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 4.2 }}
              />

              {/* Right Hand - Graceful Palm */}
              <motion.ellipse
                cx="106"
                cy="210"
                rx="9"
                ry="13"
                fill="none"
                stroke="#D4A574"
                strokeWidth="2.8"
                transform="rotate(-20 106 210)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 4.5 }}
              />

              {/* Right Hand Fingers - Delicate */}
              {[...Array(4)].map((_, i) => (
                <motion.path
                  key={`finger-r-${i}`}
                  d={`M ${103 + i * 2.2} 202 Q ${104 + i * 2.2} 196, ${105 + i * 2.2} 190`}
                  fill="none"
                  stroke="#D4A574"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: 4.6 + i * 0.05 }}
                />
              ))}

              {/* Left Arm - Bent (Holding Position) */}
              <motion.path
                d="M 127 135 Q 134 155, 132 176 Q 129 192, 124 208"
                fill="none"
                stroke="#D4A574"
                strokeWidth="3.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 4.3 }}
              />

              {/* Left Hand - Graceful Palm */}
              <motion.ellipse
                cx="124"
                cy="214"
                rx="8"
                ry="12"
                fill="none"
                stroke="#D4A574"
                strokeWidth="2.8"
                transform="rotate(15 124 214)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 4.6 }}
              />

              {/* Left Hand Fingers - Delicate */}
              {[...Array(4)].map((_, i) => (
                <motion.path
                  key={`finger-l-${i}`}
                  d={`M ${122 + i * 2.2} 206 Q ${123 + i * 2.2} 200, ${124 + i * 2.2} 194`}
                  fill="none"
                  stroke="#D4A574"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: 4.7 + i * 0.05 }}
                />
              ))}

              {/* ===== BANGLES - MULTIPLE ON BOTH ARMS ===== */}

              {/* Right Arm Bangles - Elegant Stack */}
              {[...Array(8)].map((_, i) => (
                <motion.ellipse
                  key={`bangle-r-${i}`}
                  cx={100 + i * 2}
                  cy={180 + i * 4}
                  rx="7"
                  ry="4.5"
                  fill="none"
                  stroke="#C9A86A"
                  strokeWidth="2.2"
                  transform={`rotate(-15 ${100 + i * 2} ${180 + i * 4})`}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 4.8 + i * 0.04 }}
                />
              ))}

              {/* Left Arm Bangles - Elegant Stack */}
              {[...Array(8)].map((_, i) => (
                <motion.ellipse
                  key={`bangle-l-${i}`}
                  cx={130 - i * 2}
                  cy={175 + i * 4}
                  rx="7"
                  ry="4.5"
                  fill="none"
                  stroke="#C9A86A"
                  strokeWidth="2.2"
                  transform={`rotate(10 ${130 - i * 2} ${175 + i * 4})`}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 4.9 + i * 0.04 }}
                />
              ))}

              {/* ===== SAREE/DRESS - DETAILED DRAPING ===== */}

              {/* Saree Border - Ornate */}
              <motion.path
                d="M 82 135 Q 86 142, 90 150 Q 94 158, 98 165"
                fill="none"
                stroke="#C9A86A"
                strokeWidth="3.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 5.2 }}
              />

              {/* Saree Pleats - EXTENDED DOWN FULL LENGTH */}
              {[...Array(35)].map((_, i) => (
                <motion.path
                  key={`pleat-${i}`}
                  d={`M ${82 - i * 0.3} ${135 + i * 22} Q ${86} ${140 + i * 22}, ${90 - i * 0.2} ${135 + i * 22}`}
                  fill="none"
                  stroke="#C9A86A"
                  strokeWidth="2.2"
                  strokeDasharray="6 2"
                  opacity="0.75"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: 5.3 + i * 0.02 }}
                />
              ))}

              {/* Saree Pattern - Decorative Motifs - EXTENDED */}
              {[...Array(30)].map((_, i) => (
                <motion.circle
                  key={`motif-${i}`}
                  cx={75 + (i % 2) * 5}
                  cy={160 + i * 25}
                  r="2.5"
                  fill="#D4A574"
                  opacity="0.65"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.3, delay: 5.5 + i * 0.03 }}
                />
              ))}

              {/* Pallu (Saree End) - Flowing */}
              <motion.path
                d="M 127 135 Q 124 152, 120 170 Q 117 188, 114 205"
                fill="none"
                stroke="#C9A86A"
                strokeWidth="3"
                strokeDasharray="10 4"
                opacity="0.8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 5.6 }}
              />
            </motion.g>

            {/* Weaving Thread/Pattern Being Created */}
            <motion.g>
              {[...Array(8)].map((_, i) => (
                <motion.path
                  key={i}
                  d={`M 120 ${140 + i * 15} Q 140 ${145 + i * 15}, 160 ${140 + i * 15}`}
                  fill="none"
                  stroke="#D4A574"
                  strokeWidth="2"
                  strokeDasharray="5 3"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: [0, 1, 1],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.3,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                />
              ))}
            </motion.g>

            {/* Magical Sparkles Around Hands */}
            {[...Array(6)].map((_, i) => (
              <motion.circle
                key={`sparkle-${i}`}
                cx={120 + Math.cos((i * 60 * Math.PI) / 180) * 20}
                cy={140 + Math.sin((i * 60 * Math.PI) / 180) * 20}
                r="2"
                fill="#D4A574"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              />
            ))}


          </motion.svg>


        </motion.div>
      </Box>

      {/* Premium Hero Section */}
      <Box sx={{ position: 'relative', height: { xs: '100vh', md: '100vh' }, overflow: 'hidden' }}>
        {/* Animated Gradient Overlay */}
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(212, 165, 116, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(212, 165, 116, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(212, 165, 116, 0.1) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96] }}
            style={{ height: '100%', width: '100%', position: 'absolute' }}
          >
            <Box
              sx={{
                height: '100%',
                width: '100%',
                backgroundImage: `url(${heroSlides[currentSlide].image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background: heroSlides[currentSlide].gradient,
                  backdropFilter: 'blur(2px)'
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(circle at 30% 50%, rgba(212, 165, 116, 0.15) 0%, transparent 50%)'
                }
              }}
            >
              <Container
                maxWidth="lg"
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
                >
                  <Box sx={{ maxWidth: '800px' }}>
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                    >
                      <motion.div
                        animate={{
                          boxShadow: [
                            `0 0 20px ${alpha('#D4A574', 0.3)}`,
                            `0 0 40px ${alpha('#D4A574', 0.5)}`,
                            `0 0 20px ${alpha('#D4A574', 0.3)}`
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Chip
                          label="HANDCRAFTED EXCELLENCE"
                          sx={{
                            mb: 4,
                            bgcolor: alpha('#D4A574', 0.15),
                            color: '#D4A574',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid',
                            borderColor: alpha('#D4A574', 0.3),
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            letterSpacing: '2px',
                            px: 2,
                            py: 2.5,
                            height: 'auto'
                          }}
                        />
                      </motion.div>
                    </motion.div>

                    <Typography
                      variant="h1"
                      sx={{
                        color: 'white',
                        fontWeight: 300,
                        fontSize: { xs: '2.5rem', md: '5rem' },
                        mb: 2,
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                        textShadow: '0 2px 40px rgba(0,0,0,0.5)'
                      }}
                    >
                      {heroSlides[currentSlide].title}
                    </Typography>

                    <Typography
                      variant="h4"
                      sx={{
                        color: alpha('#fff', 0.95),
                        mb: 3,
                        fontWeight: 400,
                        fontSize: { xs: '1.2rem', md: '1.8rem' },
                        letterSpacing: '0.01em',
                        textShadow: '0 2px 20px rgba(0,0,0,0.4)'
                      }}
                    >
                      {heroSlides[currentSlide].subtitle}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        color: alpha('#fff', 0.85),
                        mb: 5,
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        maxWidth: '600px',
                        lineHeight: 1.8,
                        textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                      }}
                    >
                      {heroSlides[currentSlide].description}
                    </Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.8, duration: 0.6 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          component={Link}
                          to="/products"
                          variant="contained"
                          size="large"
                          endIcon={<motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }}><ArrowForward /></motion.div>}
                          sx={{
                            bgcolor: '#D4A574',
                            color: '#1F2937',
                            px: 5,
                            py: 2,
                            fontSize: '1rem',
                            fontWeight: 600,
                            borderRadius: 0,
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            boxShadow: '0 10px 40px rgba(212, 165, 116, 0.4)',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: '-100%',
                              width: '100%',
                              height: '100%',
                              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                              transition: 'left 0.5s'
                            },
                            '&:hover': {
                              bgcolor: '#C9A86A',
                              transform: 'translateY(-3px)',
                              boxShadow: '0 15px 50px rgba(212, 165, 116, 0.5)',
                              '&::before': {
                                left: '100%'
                              }
                            },
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                        >
                          Explore Collection
                        </Button>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 2, duration: 0.6 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outlined"
                          size="large"
                          startIcon={<motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}><PlayArrow /></motion.div>}
                          sx={{
                            color: 'white',
                            borderColor: alpha('#fff', 0.5),
                            px: 5,
                            py: 2,
                            fontSize: '1rem',
                            fontWeight: 600,
                            borderRadius: 0,
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            borderWidth: 2,
                            backdropFilter: 'blur(10px)',
                            '&:hover': {
                              borderWidth: 2,
                              bgcolor: alpha('#fff', 0.1),
                              borderColor: 'white',
                              transform: 'translateY(-3px)'
                            },
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                        >
                          Our Story
                        </Button>
                      </motion.div>
                    </Stack>
                  </Box>
                </motion.div>
              </Container>
            </Box>
          </motion.div>
        </AnimatePresence>

        {/* Elegant Carousel Controls */}
        <Box sx={{ position: 'absolute', bottom: 60, left: 0, right: 0, zIndex: 2 }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                {heroSlides.map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    sx={{
                      width: currentSlide === index ? 50 : 8,
                      height: 2,
                      bgcolor: currentSlide === index ? '#D4A574' : alpha('#fff', 0.3),
                      cursor: 'pointer',
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        bgcolor: currentSlide === index ? '#D4A574' : alpha('#fff', 0.6)
                      }
                    }}
                  />
                ))}
              </Stack>
              <Stack direction="row" spacing={1}>
                <IconButton
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                  sx={{
                    bgcolor: alpha('#fff', 0.1),
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: alpha('#fff', 0.2),
                    '&:hover': {
                      bgcolor: alpha('#fff', 0.2),
                      borderColor: alpha('#fff', 0.4)
                    }
                  }}
                >
                  <ChevronLeft />
                </IconButton>
                <IconButton
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
                  sx={{
                    bgcolor: alpha('#fff', 0.1),
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: alpha('#fff', 0.2),
                    '&:hover': {
                      bgcolor: alpha('#fff', 0.2),
                      borderColor: alpha('#fff', 0.4)
                    }
                  }}
                >
                  <ChevronRight />
                </IconButton>
              </Stack>
            </Box>
          </Container>
        </Box>

        {/* Animated Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 15, 0] }}
          transition={{ opacity: { delay: 2.5, duration: 1 }, y: { repeat: Infinity, duration: 2, ease: 'easeInOut' } }}
          style={{
            position: 'absolute',
            bottom: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: alpha('#fff', 0.7),
              letterSpacing: '2px',
              fontSize: '0.7rem',
              textTransform: 'uppercase'
            }}
          >
            Scroll
          </Typography>
          <Box
            sx={{
              width: 24,
              height: 40,
              border: '2px solid',
              borderColor: alpha('#fff', 0.5),
              borderRadius: 12,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 4,
                height: 8,
                bgcolor: alpha('#D4A574', 0.8),
                borderRadius: 2,
                animation: 'scroll 2s infinite'
              },
              '@keyframes scroll': {
                '0%': { top: 8, opacity: 1 },
                '100%': { top: 24, opacity: 0 }
              }
            }}
          />
        </motion.div>
      </Box>

      {/* Premium Stats Section with Stunning Animations */}
      <Box sx={{ py: 12, bgcolor: '#1F2937', position: 'relative', overflow: 'hidden' }}>
        {/* Animated Background Gradients */}
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(212, 165, 116, 0.05) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(212, 165, 116, 0.08) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(212, 165, 116, 0.05) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: 0
          }}
        />

        {/* Floating Lines */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: '100%',
              height: 1,
              background: `linear-gradient(90deg, transparent, ${alpha('#D4A574', 0.3)}, transparent)`,
              top: `${30 + i * 20}%`
            }}
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'linear'
            }}
          />
        ))}

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6}>
            {stats.map((stat, index) => (
              <Grid size={{ xs: 6, md: 3 }} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 50 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    delay: index * 0.15,
                    duration: 0.8,
                    type: 'spring',
                    stiffness: 100
                  }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -10 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      textAlign: 'center',
                      bgcolor: 'transparent',
                      border: '1px solid',
                      borderColor: alpha('#D4A574', 0.2),
                      p: 4,
                      height: '100%',
                      minHeight: { xs: '200px', md: '220px' },
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background: `linear-gradient(135deg, ${alpha(stat.color, 0.05)}, transparent)`,
                        opacity: 0,
                        transition: 'opacity 0.4s'
                      },
                      '&:hover': {
                        borderColor: '#D4A574',
                        boxShadow: `0 20px 60px ${alpha('#D4A574', 0.15)}`,
                        '&::before': {
                          opacity: 1
                        }
                      }
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    >
                      <Box sx={{ color: stat.color, mb: 2 }}>{stat.icon}</Box>
                    </motion.div>

                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: index * 0.15 + 0.3, duration: 0.5, type: 'spring' }}
                      viewport={{ once: true }}
                    >
                      <Typography
                        variant="h2"
                        sx={{
                          fontWeight: 300,
                          mb: 1,
                          color: 'white',
                          fontSize: { xs: '2rem', md: '2.5rem' },
                          letterSpacing: '-0.02em',
                          minHeight: { xs: '48px', md: '60px' },
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {stat.value}
                      </Typography>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: index * 0.15 + 0.5, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: alpha('#fff', 0.7),
                          textTransform: 'uppercase',
                          letterSpacing: '2px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          minHeight: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </motion.div>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Sophisticated Categories Section */}
      <Box sx={{ py: 15, bgcolor: '#FAFAF9' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: 'center', mb: 10 }}>
              <Typography
                variant="overline"
                sx={{
                  color: '#D4A574',
                  fontWeight: 700,
                  letterSpacing: '3px',
                  fontSize: '0.85rem',
                  mb: 2,
                  display: 'block'
                }}
              >
                CURATED COLLECTIONS
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 300,
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  color: '#1F2937',
                  letterSpacing: '-0.02em'
                }}
              >
                Artisan Categories
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#6B7280',
                  maxWidth: '700px',
                  mx: 'auto',
                  fontWeight: 400,
                  lineHeight: 1.8,
                  fontSize: { xs: '1rem', md: '1.2rem' }
                }}
              >
                Each piece tells a story of heritage, skill, and timeless craftsmanship
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={4}>
            {categories.map((category, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 60, rotateX: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    delay: index * 0.15,
                    duration: 0.8,
                    type: 'spring',
                    stiffness: 100
                  }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -15,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Link to="/products" style={{ textDecoration: 'none' }}>
                    <EnhancedCard
                      hoverEffect="lift"
                      glowColor={category.color}
                      intensity="medium"
                      sx={{
                        height: '100%',
                        borderRadius: 0,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        boxShadow: 'none',
                        border: '1px solid',
                        borderColor: '#E5E7EB',
                        bgcolor: 'white',
                        '&:hover': {
                          borderColor: category.color,
                          '& .category-icon': {
                            transform: 'scale(1.1) rotate(5deg)',
                            color: category.color
                          },
                          '& .category-overlay': {
                            opacity: 1
                          }
                        }
                      }}
                    >
                    <Box
                      sx={{
                        height: 280,
                        position: 'relative',
                        overflow: 'hidden',
                        bgcolor: alpha(category.color, 0.05)
                      }}
                    >
                      {/* Category Image */}
                      <Box
                        component="img"
                        src={category.image}
                        alt={category.name}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.5s ease',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                      />

                      {/* Overlay */}
                      <Box
                        className="category-overlay"
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          background: `linear-gradient(135deg, ${alpha(category.color, 0.3)} 0%, ${alpha(category.color, 0.5)} 100%)`,
                          opacity: 0,
                          transition: 'opacity 0.5s ease'
                        }}
                      />

                      {/* Icon Overlay */}
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 16,
                          right: 16,
                          bgcolor: 'white',
                          borderRadius: '50%',
                          p: 2,
                          boxShadow: `0 4px 12px ${alpha(category.color, 0.3)}`,
                          zIndex: 2
                        }}
                      >
                        <Box
                          className="category-icon"
                          sx={{
                            color: category.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {category.icon}
                        </Box>
                      </Box>
                    </Box>
                    <CardContent sx={{ p: 4 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 400,
                          mb: 1.5,
                          color: '#1F2937',
                          letterSpacing: '-0.01em'
                        }}
                      >
                        {category.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#6B7280',
                          mb: 2,
                          lineHeight: 1.7,
                          fontSize: '0.95rem'
                        }}
                      >
                        {category.description}
                      </Typography>
                      <Chip
                        label={category.count}
                        size="small"
                        sx={{
                          bgcolor: alpha(category.color, 0.1),
                          color: category.color,
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          letterSpacing: '0.5px',
                          height: 28,
                          borderRadius: 0
                        }}
                      />
                    </CardContent>
                  </EnhancedCard>
                  </Link>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Premium Features Section */}
      <Box sx={{ py: 15, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', mb: 10 }}>
              <Typography
                variant="overline"
                sx={{
                  color: '#D4A574',
                  fontWeight: 700,
                  letterSpacing: '3px',
                  fontSize: '0.85rem',
                  mb: 2,
                  display: 'block'
                }}
              >
                WHY CHOOSE US
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 300,
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  color: '#1F2937',
                  letterSpacing: '-0.02em'
                }}
              >
                Excellence in Every Detail
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={6}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 4,
                      height: '100%',
                      transition: 'all 0.4s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        '& .feature-icon': {
                          transform: 'scale(1.1)',
                          color: '#D4A574'
                        }
                      }
                    }}
                  >
                    <Box
                      className="feature-icon"
                      sx={{
                        display: 'inline-flex',
                        p: 2.5,
                        borderRadius: '50%',
                        bgcolor: alpha('#D4A574', 0.1),
                        color: '#A0826D',
                        mb: 3,
                        transition: 'all 0.4s ease'
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 500,
                        mb: 1.5,
                        color: '#1F2937',
                        fontSize: '1.1rem'
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#6B7280',
                        lineHeight: 1.7
                      }}
                    >
                      {feature.desc}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Sophisticated CTA Section with Stunning Animations */}
      <Box
        sx={{
          py: 20,
          bgcolor: '#1F2937',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated Radial Gradient */}
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 50% 50%, rgba(212, 165, 116, 0.08) 0%, transparent 70%)',
              'radial-gradient(circle at 30% 50%, rgba(212, 165, 116, 0.12) 0%, transparent 70%)',
              'radial-gradient(circle at 70% 50%, rgba(212, 165, 116, 0.12) 0%, transparent 70%)',
              'radial-gradient(circle at 50% 50%, rgba(212, 165, 116, 0.08) 0%, transparent 70%)'
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: 0
          }}
        />

        {/* Orbiting Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#D4A574',
              opacity: 0.4,
              left: '50%',
              top: '50%'
            }}
            animate={{
              x: [0, Math.cos((i / 8) * Math.PI * 2) * 300],
              y: [0, Math.sin((i / 8) * Math.PI * 2) * 300],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut'
            }}
          />
        ))}

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.div
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Typography
                    variant="overline"
                    sx={{
                      color: '#D4A574',
                      fontWeight: 700,
                      letterSpacing: '3px',
                      fontSize: '0.85rem',
                      mb: 3,
                      display: 'block'
                    }}
                  >
                    BEGIN YOUR JOURNEY
                  </Typography>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    color: 'white',
                    fontWeight: 300,
                    mb: 3,
                    fontSize: { xs: '2.5rem', md: '4rem' },
                    letterSpacing: '-0.02em'
                  }}
                >
                  {['Experience', 'Authentic', 'Craftsmanship'].map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      style={{ display: 'inline-block', marginRight: '0.3em' }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: alpha('#fff', 0.7),
                    mb: 6,
                    fontWeight: 400,
                    lineHeight: 1.8,
                    maxWidth: '600px',
                    mx: 'auto'
                  }}
                >
                  Join a community of discerning patrons who value tradition, quality, and the stories behind every handcrafted piece
                </Typography>
              </motion.div>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    component={Link}
                    to="/register?type=buyer"
                    variant="contained"
                    size="large"
                    endIcon={<motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }}><ArrowForward /></motion.div>}
                    sx={{
                      bgcolor: '#D4A574',
                      color: '#1F2937',
                      px: 6,
                      py: 2.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '1.5px',
                      boxShadow: '0 10px 40px rgba(212, 165, 116, 0.3)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        transition: 'left 0.5s'
                      },
                      '&:hover': {
                        bgcolor: '#C9A86A',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 15px 50px rgba(212, 165, 116, 0.4)',
                        '&::before': {
                          left: '100%'
                        }
                      },
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    Start Shopping
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    component={Link}
                    to="/register?type=seller"
                    variant="outlined"
                    size="large"
                    sx={{
                      color: 'white',
                      borderColor: alpha('#D4A574', 0.5),
                      px: 6,
                      py: 2.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '1.5px',
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                        borderColor: '#D4A574',
                        bgcolor: alpha('#D4A574', 0.1),
                        transform: 'translateY(-3px)'
                      },
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    Become an Artisan
                  </Button>
                </motion.div>
              </Stack>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  )
}

export default LandingPageNew
