import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Fab, SpeedDial, SpeedDialAction, SpeedDialIcon,
    Tooltip, alpha, useTheme
} from '@mui/material'
import {
    KeyboardArrowUp, Add, ShoppingCart, Favorite,
    Share, Search, FilterList, Sort
} from '@mui/icons-material'

interface FloatingElementsProps {
    showScrollTop?: boolean
    showQuickActions?: boolean
    quickActions?: Array<{
        icon: React.ReactNode
        label: string
        onClick: () => void
        color?: string
    }>
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

const FloatingElements = ({
    showScrollTop = true,
    showQuickActions = false,
    quickActions = [],
    position = 'bottom-right'
}: FloatingElementsProps) => {
    const [showScroll, setShowScroll] = useState(false)
    const [speedDialOpen, setSpeedDialOpen] = useState(false)
    const theme = useTheme()

    useEffect(() => {
        const checkScrollTop = () => {
            if (!showScroll && window.pageYOffset > 400) {
                setShowScroll(true)
            } else if (showScroll && window.pageYOffset <= 400) {
                setShowScroll(false)
            }
        }

        window.addEventListener('scroll', checkScrollTop)
        return () => window.removeEventListener('scroll', checkScrollTop)
    }, [showScroll])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    const getPositionStyles = () => {
        const base = { position: 'fixed', zIndex: 1000 }
        switch (position) {
            case 'bottom-right':
                return { ...base, bottom: 96, right: 24 }
            case 'bottom-left':
                return { ...base, bottom: 20, left: 20 }
            case 'top-right':
                return { ...base, top: 20, right: 20 }
            case 'top-left':
                return { ...base, top: 20, left: 20 }
            default:
                return { ...base, bottom: 20, right: 20 }
        }
    }

    const defaultActions = [
        {
            icon: <ShoppingCart />,
            label: 'View Cart',
            onClick: () => console.log('Cart clicked'),
            color: '#D4A574'
        },
        {
            icon: <Favorite />,
            label: 'Wishlist',
            onClick: () => console.log('Wishlist clicked'),
            color: '#C9A86A'
        },
        {
            icon: <Search />,
            label: 'Search',
            onClick: () => console.log('Search clicked'),
            color: '#A0826D'
        },
        {
            icon: <FilterList />,
            label: 'Filter',
            onClick: () => console.log('Filter clicked'),
            color: '#8B7355'
        }
    ]

    const actionsToShow = quickActions.length > 0 ? quickActions : defaultActions

    return (
        <>
            {/* Scroll to Top Button */}
            <AnimatePresence>
                {showScrollTop && showScroll && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        style={{
                            ...getPositionStyles(),
                            ...(showQuickActions && { bottom: 100 })
                        }}
                    >
                        <Tooltip title="Scroll to top" placement="left">
                            <Fab
                                size="medium"
                                onClick={scrollToTop}
                                sx={{
                                    background: `linear-gradient(135deg, ${alpha('#D4A574', 0.9)}, ${alpha('#C9A86A', 0.9)})`,
                                    color: 'white',
                                    backdropFilter: 'blur(10px)',
                                    border: `1px solid ${alpha('#D4A574', 0.3)}`,
                                    boxShadow: `0 8px 32px ${alpha('#D4A574', 0.3)}`,
                                    '&:hover': {
                                        background: `linear-gradient(135deg, ${alpha('#D4A574', 1)}, ${alpha('#C9A86A', 1)})`,
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 12px 40px ${alpha('#D4A574', 0.4)}`
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <KeyboardArrowUp />
                            </Fab>
                        </Tooltip>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Quick Actions Speed Dial */}
            <AnimatePresence>
                {showQuickActions && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        style={getPositionStyles()}
                    >
                        <SpeedDial
                            ariaLabel="Quick Actions"
                            icon={<SpeedDialIcon />}
                            onClose={() => setSpeedDialOpen(false)}
                            onOpen={() => setSpeedDialOpen(true)}
                            open={speedDialOpen}
                            direction="up"
                            sx={{
                                '& .MuiFab-primary': {
                                    background: `linear-gradient(135deg, ${alpha('#D4A574', 0.9)}, ${alpha('#C9A86A', 0.9)})`,
                                    backdropFilter: 'blur(10px)',
                                    border: `1px solid ${alpha('#D4A574', 0.3)}`,
                                    boxShadow: `0 8px 32px ${alpha('#D4A574', 0.3)}`,
                                    '&:hover': {
                                        background: `linear-gradient(135deg, ${alpha('#D4A574', 1)}, ${alpha('#C9A86A', 1)})`,
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 12px 40px ${alpha('#D4A574', 0.4)}`
                                    }
                                }
                            }}
                        >
                            {actionsToShow.map((action, index) => (
                                <SpeedDialAction
                                    key={index}
                                    icon={action.icon}
                                    tooltipTitle={action.label}
                                    onClick={action.onClick}
                                    sx={{
                                        '& .MuiFab-primary': {
                                            background: `linear-gradient(135deg, ${alpha(action.color || '#D4A574', 0.9)}, ${alpha(action.color || '#C9A86A', 0.9)})`,
                                            color: 'white',
                                            backdropFilter: 'blur(10px)',
                                            border: `1px solid ${alpha(action.color || '#D4A574', 0.3)}`,
                                            boxShadow: `0 4px 20px ${alpha(action.color || '#D4A574', 0.3)}`,
                                            '&:hover': {
                                                background: `linear-gradient(135deg, ${alpha(action.color || '#D4A574', 1)}, ${alpha(action.color || '#C9A86A', 1)})`,
                                                transform: 'scale(1.1)',
                                                boxShadow: `0 6px 25px ${alpha(action.color || '#D4A574', 0.4)}`
                                            }
                                        }
                                    }}
                                />
                            ))}
                        </SpeedDial>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Particles for Extra Effect */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    style={{
                        position: 'fixed',
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        background: alpha('#D4A574', 0.3),
                        pointerEvents: 'none',
                        zIndex: 999
                    }}
                    animate={{
                        y: [window.innerHeight, -20],
                        x: [0, Math.random() * 100 - 50],
                        opacity: [0, 0.8, 0],
                        scale: [0, 1, 0]
                    }}
                    transition={{
                        duration: Math.random() * 8 + 6,
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
        </>
    )
}

export default FloatingElements