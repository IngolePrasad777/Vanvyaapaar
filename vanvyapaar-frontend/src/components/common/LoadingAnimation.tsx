import { motion } from 'framer-motion'
import { Box, Typography, alpha } from '@mui/material'

interface LoadingAnimationProps {
    variant?: 'spinner' | 'dots' | 'pulse' | 'tribal' | 'wave'
    size?: 'small' | 'medium' | 'large'
    color?: string
    text?: string
    fullScreen?: boolean
}

const LoadingAnimation = ({
    variant = 'tribal',
    size = 'medium',
    color = '#D4A574',
    text = 'Loading...',
    fullScreen = false
}: LoadingAnimationProps) => {

    const getSizeValues = () => {
        switch (size) {
            case 'small': return { container: 60, element: 8, text: 14 }
            case 'medium': return { container: 80, element: 12, text: 16 }
            case 'large': return { container: 120, element: 16, text: 18 }
            default: return { container: 80, element: 12, text: 16 }
        }
    }

    const sizes = getSizeValues()

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        ...(fullScreen && {
            position: 'fixed' as const,
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: alpha('#000', 0.5),
            backdropFilter: 'blur(10px)',
            zIndex: 9999
        })
    }

    const renderSpinner = () => (
        <motion.div
            style={{
                width: sizes.container,
                height: sizes.container,
                border: `3px solid ${alpha(color, 0.2)}`,
                borderTop: `3px solid ${color}`,
                borderRadius: '50%'
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
    )

    const renderDots = () => (
        <Box sx={{ display: 'flex', gap: 1 }}>
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    style={{
                        width: sizes.element,
                        height: sizes.element,
                        borderRadius: '50%',
                        background: color
                    }}
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.2
                    }}
                />
            ))}
        </Box>
    )

    const renderPulse = () => (
        <motion.div
            style={{
                width: sizes.container,
                height: sizes.container,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(color, 0.8)}, ${alpha(color, 0.2)})`
            }}
            animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
            }}
        />
    )

    const renderTribal = () => (
        <Box sx={{ position: 'relative', width: sizes.container, height: sizes.container }}>
            {/* Central circle */}
            <motion.div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: sizes.element * 2,
                    height: sizes.element * 2,
                    borderRadius: '50%',
                    background: color
                }}
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.8, 1, 0.8]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            />
            
            {/* Orbiting elements */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: sizes.element,
                        height: sizes.element,
                        borderRadius: '50%',
                        background: `linear-gradient(45deg, ${color}, ${alpha(color, 0.6)})`,
                        transformOrigin: `0 ${sizes.container / 2}px`
                    }}
                    animate={{
                        rotate: 360,
                        scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{
                        rotate: {
                            duration: 3,
                            repeat: Infinity,
                            ease: 'linear'
                        },
                        scale: {
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.2
                        }
                    }}
                    initial={{
                        rotate: i * 60,
                        x: -sizes.element / 2,
                        y: -sizes.container / 2
                    }}
                />
            ))}
            
            {/* Decorative patterns */}
            {[...Array(4)].map((_, i) => (
                <motion.div
                    key={`pattern-${i}`}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: 2,
                        height: sizes.container / 3,
                        background: `linear-gradient(to bottom, ${color}, transparent)`,
                        transformOrigin: `1px ${sizes.container / 6}px`
                    }}
                    animate={{
                        rotate: 360,
                        opacity: [0.3, 0.8, 0.3]
                    }}
                    transition={{
                        rotate: {
                            duration: 4,
                            repeat: Infinity,
                            ease: 'linear'
                        },
                        opacity: {
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.5
                        }
                    }}
                    initial={{
                        rotate: i * 90,
                        x: -1,
                        y: -sizes.container / 6
                    }}
                />
            ))}
        </Box>
    )

    const renderWave = () => (
        <Box sx={{ display: 'flex', alignItems: 'end', gap: 0.5 }}>
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    style={{
                        width: sizes.element / 2,
                        background: color,
                        borderRadius: '2px 2px 0 0'
                    }}
                    animate={{
                        height: [sizes.element, sizes.element * 3, sizes.element]
                    }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: 'easeInOut'
                    }}
                />
            ))}
        </Box>
    )

    const renderVariant = () => {
        switch (variant) {
            case 'spinner': return renderSpinner()
            case 'dots': return renderDots()
            case 'pulse': return renderPulse()
            case 'tribal': return renderTribal()
            case 'wave': return renderWave()
            default: return renderTribal()
        }
    }

    return (
        <Box sx={containerStyle}>
            {renderVariant()}
            {text && (
                <motion.div
                    animate={{
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: fullScreen ? 'white' : color,
                            fontSize: sizes.text,
                            fontWeight: 500,
                            textAlign: 'center'
                        }}
                    >
                        {text}
                    </Typography>
                </motion.div>
            )}
        </Box>
    )
}

export default LoadingAnimation