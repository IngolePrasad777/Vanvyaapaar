import { motion } from 'framer-motion'
import { Card, CardProps, alpha, useTheme } from '@mui/material'
import { ReactNode } from 'react'

interface EnhancedCardProps extends Omit<CardProps, 'children'> {
    children: ReactNode
    hoverEffect?: 'lift' | 'glow' | 'tilt' | 'scale' | 'shine'
    glowColor?: string
    intensity?: 'subtle' | 'medium' | 'strong'
    disabled?: boolean
}

const EnhancedCard = ({
    children,
    hoverEffect = 'lift',
    glowColor = '#D4A574',
    intensity = 'medium',
    disabled = false,
    sx,
    ...props
}: EnhancedCardProps) => {
    const theme = useTheme()

    const getIntensityValues = () => {
        switch (intensity) {
            case 'subtle':
                return { scale: 1.02, y: -2, glow: 0.2, rotate: 1 }
            case 'medium':
                return { scale: 1.05, y: -8, glow: 0.3, rotate: 3 }
            case 'strong':
                return { scale: 1.08, y: -12, glow: 0.4, rotate: 5 }
            default:
                return { scale: 1.05, y: -8, glow: 0.3, rotate: 3 }
        }
    }

    const values = getIntensityValues()

    const getHoverVariants = () => {
        if (disabled) return {}

        switch (hoverEffect) {
            case 'lift':
                return {
                    whileHover: {
                        y: -values.y,
                        transition: { duration: 0.3, ease: 'easeOut' }
                    }
                }
            case 'glow':
                return {
                    whileHover: {
                        boxShadow: `0 0 30px ${alpha(glowColor, values.glow)}`,
                        transition: { duration: 0.3 }
                    }
                }
            case 'tilt':
                return {
                    whileHover: {
                        rotateY: values.rotate,
                        rotateX: values.rotate / 2,
                        transition: { duration: 0.3 }
                    }
                }
            case 'scale':
                return {
                    whileHover: {
                        scale: values.scale,
                        transition: { duration: 0.3, ease: 'easeOut' }
                    }
                }
            case 'shine':
                return {
                    whileHover: {
                        background: `linear-gradient(135deg, ${alpha(glowColor, 0.1)}, transparent)`,
                        transition: { duration: 0.3 }
                    }
                }
            default:
                return {
                    whileHover: {
                        y: -values.y,
                        transition: { duration: 0.3, ease: 'easeOut' }
                    }
                }
        }
    }

    const getBaseStyles = () => {
        const baseStyles = {
            position: 'relative',
            overflow: 'hidden',
            cursor: disabled ? 'default' : 'pointer',
            transition: 'all 0.3s ease',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(glowColor, 0.1)}`,
            ...sx
        }

        if (hoverEffect === 'glow' && !disabled) {
            return {
                ...baseStyles,
                '&:hover': {
                    boxShadow: `0 0 30px ${alpha(glowColor, values.glow)}, 0 8px 32px ${alpha(glowColor, 0.2)}`
                }
            }
        }

        if (hoverEffect === 'shine' && !disabled) {
            return {
                ...baseStyles,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(90deg, transparent, ${alpha(glowColor, 0.3)}, transparent)`,
                    transition: 'left 0.6s ease',
                    zIndex: 1,
                    pointerEvents: 'none'
                },
                '&:hover::before': {
                    left: '100%'
                },
                '& > *': {
                    position: 'relative',
                    zIndex: 2
                }
            }
        }

        return baseStyles
    }

    return (
        <motion.div
            {...getHoverVariants()}
            whileTap={disabled ? {} : { scale: 0.98 }}
            style={{ 
                transformStyle: 'preserve-3d',
                perspective: '1000px'
            }}
        >
            <Card
                {...props}
                sx={getBaseStyles()}
            >
                {children}
                
                {/* Floating particles on hover */}
                {!disabled && (
                    <>
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                style={{
                                    position: 'absolute',
                                    width: 4,
                                    height: 4,
                                    borderRadius: '50%',
                                    background: alpha(glowColor, 0.6),
                                    pointerEvents: 'none',
                                    zIndex: 10
                                }}
                                initial={{ opacity: 0, scale: 0 }}
                                whileHover={{
                                    opacity: [0, 1, 0],
                                    scale: [0, 1, 0],
                                    x: [0, Math.random() * 100 - 50],
                                    y: [0, Math.random() * 100 - 50]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                }}
                            />
                        ))}
                    </>
                )}
            </Card>
        </motion.div>
    )
}

export default EnhancedCard