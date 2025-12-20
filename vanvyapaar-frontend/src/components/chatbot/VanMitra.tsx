import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import {
  Box, Paper, Typography, TextField, IconButton, Avatar,
  Chip, Card, CardContent, Fab, Drawer, AppBar, Toolbar
} from '@mui/material'
import {
  Chat, Send, Close, SmartToy, Person, ShoppingBag,
  LocalShipping, Help, Phone
} from '@mui/icons-material'
import { useAuthStore } from '../../store/authStore'
import { api } from '../../lib/api'

interface ChatMessage {
  id: string
  message: string
  type: 'user' | 'bot'
  timestamp: Date
  data?: any[]
  suggestions?: string[]
  responseType?: string // Add this to store the backend response type
}

interface ChatbotRequest {
  message: string
  userRole: string
  userId?: number
}

interface ChatbotResponse {
  message: string
  type: string
  data?: any[]
  suggestions?: string[]
}

const VanMitra = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuthStore()
  const location = useLocation()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    console.log('Messages updated:', messages); // Debug messages array
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Send welcome message when chatbot opens
      handleSendMessage('hello', true)
    }
  }, [isOpen])

  const handleSendMessage = async (message: string, isWelcome = false) => {
    if (!message.trim() && !isWelcome) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: message,
      type: 'user',
      timestamp: new Date()
    }

    if (!isWelcome) {
      setMessages(prev => [...prev, userMessage])
    }
    setInputMessage('')
    setIsTyping(true)

    try {
      const request: ChatbotRequest = {
        message: message,
        userRole: user?.role || 'GUEST',
        userId: user?.id
      }

      console.log('Sending chatbot request:', request) // Debug log
      const response = await api.post<ChatbotResponse>('/api/chatbot/message', request)
      console.log('Chatbot response:', response.data) // Debug log
      console.log('Response data array:', response.data.data) // Debug the data array specifically

      setTimeout(() => {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          message: response.data.message,
          type: 'bot',
          timestamp: new Date(),
          data: response.data.data,
          suggestions: response.data.suggestions,
          responseType: response.data.type // Store the backend response type
        }

        console.log('Created bot message:', botMessage); // Debug the final message object
        setMessages(prev => isWelcome ? [botMessage] : [...prev, botMessage])
        setIsTyping(false)
      }, 1000) // Simulate typing delay

    } catch (error) {
      console.error('Chatbot error:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: '🤖 Sorry, I\'m having trouble right now. Please try again later.',
        type: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      setIsTyping(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const renderMessage = (message: ChatMessage) => (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
          mb: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', maxWidth: '80%' }}>
          {message.type === 'bot' && (
            <Avatar
              sx={{
                bgcolor: '#D4A574',
                color: 'white',
                width: 32,
                height: 32,
                mr: 1,
                mt: 0.5
              }}
            >
              <SmartToy sx={{ fontSize: 18 }} />
            </Avatar>
          )}

          <Paper
            elevation={message.type === 'user' ? 8 : 4}
            sx={{
              p: 2.5,
              background: message.type === 'user'
                ? 'linear-gradient(135deg, #8B4513 0%, #A0826D 100%)'
                : 'linear-gradient(135deg, #FFFFFF 0%, #FFF8F0 100%)',
              color: message.type === 'user' ? 'white' : '#2D1810',
              borderRadius: message.type === 'user' ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
              border: message.type === 'bot' ? '1px solid rgba(212, 165, 116, 0.2)' : 'none',
              boxShadow: message.type === 'user'
                ? '0 8px 25px rgba(139, 69, 19, 0.3)'
                : '0 4px 20px rgba(212, 165, 116, 0.15)',
              position: 'relative'
            }}
          >
            <Typography
              variant="body1"
              sx={{
                whiteSpace: 'pre-line',
                lineHeight: 1.6,
                fontSize: '0.95rem',
                fontWeight: message.type === 'bot' ? 500 : 400
              }}
            >
              {message.message}
            </Typography>

            {/* Enhanced product/order data display */}
            {message.data && message.data.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{
                  mb: 2,
                  color: '#8B4513',
                  fontWeight: 'bold',
                  fontSize: '0.85rem'
                }}>
                  {message.responseType === 'ORDER_LIST' ? '📋 Your Orders:' : '🎨 Featured Products:'}
                </Typography>
                {message.data.slice(0, 5).map((item: any, index: number) => {
                  console.log(`Rendering item ${index}:`, item); // Debug each item
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card sx={{
                        mb: 2,
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,248,248,0.9) 100%)',
                        border: '1px solid rgba(212, 165, 116, 0.2)',
                        borderRadius: 3,
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(212, 165, 116, 0.2)'
                        },
                        transition: 'all 0.3s ease'
                      }}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: message.responseType === 'ORDER_LIST' ? '#4CAF50' : '#D4A574',
                                mr: 1.5,
                                boxShadow: `0 0 8px ${message.responseType === 'ORDER_LIST' ? 'rgba(76, 175, 80, 0.5)' : 'rgba(212, 165, 116, 0.5)'}`
                              }}
                            />
                            <Typography variant="subtitle2" sx={{
                              fontWeight: 'bold',
                              color: '#8B4513',
                              fontSize: '0.9rem'
                            }}>
                              {message.responseType === 'ORDER_LIST'
                                ? `Order #${item.id || 'N/A'}`
                                : (item.name || 'Product Name')}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{
                            color: '#666',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}>
                            {message.responseType === 'ORDER_LIST' ? (
                              <>
                                <span style={{ fontWeight: 'bold', color: '#8B4513' }}>
                                  ₹{item.totalAmount || '0'}
                                </span>
                                <span>•</span>
                                <span>{item.status || 'Pending'}</span>
                              </>
                            ) : (
                              <>
                                <span style={{ fontWeight: 'bold', color: '#8B4513' }}>
                                  ₹{item.price || '0'}
                                </span>
                                <span>•</span>
                                <span>{item.category || 'Handicraft'}</span>
                              </>
                            )}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </Box>
            )}

            {/* Enhanced suggestions */}
            {message.suggestions && (
              <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {message.suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Chip
                      label={suggestion}
                      size="small"
                      onClick={() => handleSuggestionClick(suggestion)}
                      sx={{
                        background: 'linear-gradient(135deg, rgba(212, 165, 116, 0.1) 0%, rgba(212, 165, 116, 0.2) 100%)',
                        color: '#8B4513',
                        border: '1px solid rgba(212, 165, 116, 0.3)',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        '&:hover': {
                          background: 'linear-gradient(135deg, rgba(212, 165, 116, 0.2) 0%, rgba(212, 165, 116, 0.3) 100%)',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(212, 165, 116, 0.3)'
                        },
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </motion.div>
                ))}
              </Box>
            )}
          </Paper>

          {message.type === 'user' && (
            <Avatar
              sx={{
                bgcolor: '#8B4513',
                color: 'white',
                width: 32,
                height: 32,
                ml: 1,
                mt: 0.5
              }}
            >
              <Person sx={{ fontSize: 18 }} />
            </Avatar>
          )}
        </Box>
      </Box>
    </motion.div>
  )

  const TypingIndicator = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring" }}
      >
        <Avatar
          sx={{
            background: 'linear-gradient(135deg, #8B4513 0%, #D4A574 100%)',
            color: 'white',
            width: 40,
            height: 40,
            mr: 2,
            border: '2px solid rgba(212, 165, 116, 0.3)',
            boxShadow: '0 4px 12px rgba(139, 69, 19, 0.2)'
          }}
        >
          <SmartToy sx={{ fontSize: 20 }} />
        </Avatar>
      </motion.div>
      <Paper
        elevation={4}
        sx={{
          p: 2.5,
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF8F0 100%)',
          borderRadius: '20px 20px 20px 6px',
          border: '1px solid rgba(212, 165, 116, 0.2)',
          boxShadow: '0 4px 20px rgba(212, 165, 116, 0.15)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: '#8B4513', fontStyle: 'italic' }}>
            VanMitra is thinking
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #D4A574 0%, #8B4513 100%)',
                    boxShadow: '0 2px 4px rgba(212, 165, 116, 0.3)'
                  }}
                />
              </motion.div>
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  )

  return (
    <>
      {/* Floating Chat Button - Only show when chat is closed */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <Fab
            color="primary"
            onClick={() => setIsOpen(true)}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: location.pathname.includes('/seller') || location.pathname.includes('/buyer') ? 96 : 24,
              background: 'linear-gradient(135deg, #8B4513 0%, #D4A574 50%, #A0826D 100%)',
              color: 'white',
              width: 64,
              height: 64,
              '&:hover': {
                background: 'linear-gradient(135deg, #A0826D 0%, #C9A86A 50%, #D4A574 100%)',
                transform: 'scale(1.1)',
                boxShadow: '0 12px 30px rgba(139, 69, 19, 0.4)'
              },
              zIndex: 999,
              boxShadow: '0 8px 25px rgba(139, 69, 19, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              border: '3px solid rgba(255, 255, 255, 0.2)',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: -2,
                borderRadius: 'inherit',
                background: 'linear-gradient(45deg, rgba(212, 165, 116, 0.3), rgba(139, 69, 19, 0.3))',
                zIndex: -1
              }
            }}
          >
            <Chat sx={{ fontSize: 28 }} />
          </Fab>


          {/* Enhanced VanMitra label */}
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1, type: "spring" }}
          >
            {/* <Paper
              elevation={4}
              sx={{
                position: 'fixed',
                bottom: 96,
                right: location.pathname.includes('/seller') || location.pathname.includes('/buyer') ? 88 : 16,
                px: 2,
                py: 1,
                background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.9) 0%, rgba(212, 165, 116, 0.9) 100%)',
                color: 'white',
                borderRadius: 3,
                fontSize: '0.8rem',
                fontWeight: 600,
                pointerEvents: 'none',
                zIndex: 998,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 15px rgba(139, 69, 19, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
            >
              🌳 VanMitra
            </Paper> */}
          </motion.div>

        </motion.div>
      )}

      {/* Chat Drawer */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: { xs: '100%', sm: 400 },
              height: '100%'
            }
          }
        }}
      >
        {/* Header */}
        <AppBar position="static" sx={{
          background: 'linear-gradient(135deg, #8B4513 0%, #D4A574 50%, #A0826D 100%)',
          boxShadow: '0 4px 20px rgba(139, 69, 19, 0.3)'
        }}>
          <Toolbar sx={{ py: 1 }}>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Avatar sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                mr: 2,
                width: 48,
                height: 48,
                border: '2px solid rgba(255,255,255,0.3)'
              }}>
                <SmartToy sx={{ fontSize: 28, color: '#FFF' }} />
              </Avatar>
            </motion.div>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" sx={{
                fontWeight: 'bold',
                color: '#FFF',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                fontFamily: 'serif'
              }}>
                VanMitra
              </Typography>
              <Typography variant="caption" sx={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: '0.85rem',
                fontStyle: 'italic'
              }}>
                🌳 Your Forest Friend & Guide
              </Typography>
            </Box>
            <IconButton color="inherit" onClick={() => setIsOpen(false)}>
              <Close />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Messages Area */}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            overflow: 'auto',
            background: 'linear-gradient(145deg, #FFF8F0 0%, #F5F5DC 50%, #FFF8F0 100%)',
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(212, 165, 116, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(139, 69, 19, 0.05) 0%, transparent 50%),
              linear-gradient(45deg, rgba(212, 165, 116, 0.03) 25%, transparent 25%), 
              linear-gradient(-45deg, rgba(212, 165, 116, 0.03) 25%, transparent 25%)
            `,
            backgroundSize: '60px 60px, 80px 80px, 20px 20px, 20px 20px',
            position: 'relative'
          }}
        >
          {/* Decorative tribal pattern overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.03,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4A574' fill-opacity='1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm-20-15c8.284 0 15 6.716 15 15s-6.716 15-15 15-15-6.716-15-15 6.716-15 15-15z'/%3E%3C/g%3E%3C/svg%3E")`,
              pointerEvents: 'none'
            }}
          />

          <AnimatePresence>
            {messages.map(renderMessage)}
            {isTyping && <TypingIndicator />}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </Box>

        {/* Enhanced Input Area */}
        <Paper
          elevation={8}
          sx={{
            p: 3,
            borderRadius: 0,
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF8F0 100%)',
            borderTop: '2px solid rgba(212, 165, 116, 0.2)',
            boxShadow: '0 -4px 20px rgba(212, 165, 116, 0.1)'
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask VanMitra anything... 🌳"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage(inputMessage)
                }
              }}
              size="medium"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #FEFEFE 100%)',
                  border: '2px solid rgba(212, 165, 116, 0.2)',
                  '&:hover': {
                    borderColor: 'rgba(212, 165, 116, 0.4)'
                  },
                  '&.Mui-focused': {
                    borderColor: '#D4A574',
                    boxShadow: '0 0 0 3px rgba(212, 165, 116, 0.1)'
                  }
                },
                '& .MuiInputBase-input': {
                  fontSize: '0.95rem',
                  color: '#2D1810'
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#8B7355',
                  opacity: 0.8
                }
              }}
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconButton
                color="primary"
                onClick={() => handleSendMessage(inputMessage)}
                disabled={!inputMessage.trim()}
                sx={{
                  background: 'linear-gradient(135deg, #8B4513 0%, #D4A574 100%)',
                  color: 'white',
                  width: 56,
                  height: 56,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #A0826D 0%, #C9A86A 100%)',
                    transform: 'scale(1.05)'
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #E0E0E0 0%, #F5F5F5 100%)',
                    color: '#999'
                  },
                  boxShadow: '0 4px 15px rgba(139, 69, 19, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                <Send />
              </IconButton>
            </motion.div>
          </Box>

          {/* Enhanced Quick Actions */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {[
              { icon: <ShoppingBag />, label: 'Products', query: 'show products', color: '#8B4513' },
              { icon: <LocalShipping />, label: 'Track Order', query: 'track my orders', color: '#D4A574' },
              { icon: <Help />, label: 'Help', query: 'help', color: '#A0826D' },
              { icon: <Phone />, label: 'Contact', query: 'contact us', color: '#C9A86A' }
            ].map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Chip
                  icon={action.icon}
                  label={action.label}
                  size="medium"
                  onClick={() => handleSendMessage(action.query)}
                  sx={{
                    background: `linear-gradient(135deg, ${action.color}15 0%, ${action.color}25 100%)`,
                    color: action.color,
                    border: `1px solid ${action.color}40`,
                    fontWeight: 500,
                    fontSize: '0.8rem',
                    px: 1,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${action.color}25 0%, ${action.color}35 100%)`,
                      transform: 'translateY(-1px)',
                      boxShadow: `0 4px 12px ${action.color}30`
                    },
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '& .MuiChip-icon': {
                      color: action.color
                    }
                  }}
                />
              </motion.div>
            ))}
          </Box>
        </Paper>
      </Drawer>
    </>
  )
}

export default VanMitra