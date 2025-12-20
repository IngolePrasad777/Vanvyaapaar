import { motion } from 'framer-motion'
import { Box, alpha } from '@mui/material'

interface AnimatedBackgroundProps {
    variant?: 'bubbles' | 'particles' | 'waves' | 'geometric'
    intensity?: 'light' | 'medium' | 'heavy'
    color?: string
    className?: string
}

const AnimatedBackground = ({
    variant = 'bubbles',
    intensity = 'medium',
    color = '#D4A574',
    className
}: AnimatedBackgroundProps) => {

    const getElementCount = () => {
        switch (intensity) {
            case 'light': return 8
            case 'medium': return 15
            case 'heavy': return 25
            default: return 15
        }
    }

    const renderBubbles = () => {
        return [...Array(getElementCount())].map((_, i) => (
            <motion.div
                key={i}
                style={{
                    position: 'fixed',
                    width: Math.random() * 60 + 20,
                    height: Math.random() * 60 + 20,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${alpha(color, 0.1)}, ${alpha(color, 0.3)})`,
                    border: `1px solid ${alpha(color, 0.2)}`,
                    backdropFilter: 'blur(10px)',
                    pointerEvents: 'none',
                    zIndex: 0
                }}
                animate={{
                    y: [0, -window.innerHeight - 100],
                    x: [0, Math.random() * 200 - 100],
                    opacity: [0, 0.8, 0],
                    scale: [0.5, 1, 0.5],
                    rotate: [0, 360]
                }}
                transition={{
                    duration: Math.random() * 15 + 10,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                    ease: 'linear'
                }}
                initial={{
                    left: `${Math.random() * 100}%`,
                    bottom: -100
                }}
            />
        ))
    }

    const renderParticles = () => {
        return [...Array(getElementCount())].map((_, i) => (
            <motion.div
                key={i}
                style={{
                    position: 'fixed',
                    width: Math.random() * 4 + 2,
                    height: Math.random() * 4 + 2,
                    borderRadius: '50%',
                    background: alpha(color, Math.random() * 0.5 + 0.2),
                    pointerEvents: 'none',
                    zIndex: 0
                }}
                animate={{
                    y: [0, -window.innerHeight - 50],
                    x: [0, Math.random() * 300 - 150],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                }}
                transition={{
                    duration: Math.random() * 12 + 8,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                    ease: 'easeOut'
                }}
                initial={{
                    left: `${Math.random() * 100}%`,
                    bottom: -20
                }}
            />
        ))
    }

    const renderWaves = () => {
        return [...Array(3)].map((_, i) => (
            <motion.div
                key={i}
                style={{
                    position: 'fixed',
                    bottom: -50,
                    left: 0,
                    width: '120%',
                    height: 200,
                    background: `linear-gradient(45deg, ${alpha(color, 0.05)}, ${alpha(color, 0.15)})`,
                    borderRadius: '50% 50% 0 0',
                    pointerEvents: 'none',
                    zIndex: 0
                }}
                animate={{
                    x: ['-10%', '10%', '-10%'],
                    y: [0, -20, 0],
                    rotate: [0, 2, 0]
                }}
                transition={{
                    duration: 8 + i * 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 1
                }}
            />
        ))
    }

    const renderGeometric = () => {
        return [...Array(getElementCount())].map((_, i) => {
            const shapes = ['circle', 'square', 'triangle', 'diamond']
            const shape = shapes[Math.floor(Math.random() * shapes.length)]

            return (
                <motion.div
                    key={i}
                    style={{
                        position: 'fixed',
                        width: Math.random() * 30 + 15,
                        height: Math.random() * 30 + 15,
                        background: alpha(color, Math.random() * 0.3 + 0.1),
                        borderRadius: shape === 'circle' ? '50%' : shape === 'diamond' ? '0' : '4px',
                        transform: shape === 'triangle' ? 'rotate(45deg)' : 'none',
                        border: `1px solid ${alpha(color, 0.3)}`,
                        pointerEvents: 'none',
                        zIndex: 0
                    }}
                    animate={{
                        y: [window.innerHeight + 50, -100],
                        x: [0, Math.random() * 100 - 50],
                        opacity: [0, 0.6, 0],
                        rotate: [0, 360],
                        scale: [0.5, 1, 0.5]
                    }}
                    transition={{
                        duration: Math.random() * 20 + 15,
                        repeat: Infinity,
                        delay: Math.random() * 8,
                        ease: 'linear'
                    }}
                    initial={{
                        left: `${Math.random() * 100}%`,
                        top: window.innerHeight + 50
                    }}
                />
            )
        })
    }

    const renderVariant = () => {
        switch (variant) {
            case 'bubbles': return renderBubbles()
            case 'particles': return renderParticles()
            case 'waves': return renderWaves()
            case 'geometric': return renderGeometric()
            default: return renderBubbles()
        }
    }

    return (
        <Box
            className={className}
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                pointerEvents: 'none',
                zIndex: 0
            }}
        >
            {renderVariant()}
        </Box>
    )
}

export default AnimatedBackground