import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  Container, Box, Typography, Button, TextField, Card, CardContent,
  Stack, MenuItem, alpha, CardMedia
} from '@mui/material'
import { ArrowBack, Save, CloudUpload } from '@mui/icons-material'
import { useAuthStore } from '../../store/authStore'
import sellerService from '../../services/sellerService'
import toast from 'react-hot-toast'

interface ProductForm {
  name: string
  description: string
  category: string
  price: number
  stock: number
  imageUrl: string
  featured: boolean
}

const AddProduct = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ProductForm>()

  const imageUrl = watch('imageUrl')

  const categories = [
    'Pottery',
    'Textiles',
    'Handicrafts',
    'Jewelry',
    'Wood Crafts',
    'Metal Crafts',
    'Paintings',
    'Basketry',
    'Leather Goods',
    'Stone Crafts'
  ]

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }

      setImageFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        setValue('imageUrl', result) // Store base64 in form
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: ProductForm) => {
    if (!user) return

    try {
      setLoading(true)
      await sellerService.addProduct(user.id, data)
      toast.success('Product added successfully!')
      navigate('/seller/products')
    } catch (error: any) {
      console.error('Error adding product:', error)
      toast.error(error.response?.data || 'Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/seller/products')}
        sx={{ mb: 3, color: '#D4A574' }}
      >
        Back to Products
      </Button>

      <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: alpha('#D4A574', 0.2) }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 1 }}>
            Add New Product
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            Create a new product listing for your craft
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <TextField
                {...register('name', { required: 'Product name is required' })}
                label="Product Name *"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&.Mui-focused fieldset': { borderColor: '#D4A574' }
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#D4A574' }
                }}
              />

              <TextField
                {...register('description', { required: 'Description is required' })}
                label="Description *"
                multiline
                rows={4}
                fullWidth
                error={!!errors.description}
                helperText={errors.description?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&.Mui-focused fieldset': { borderColor: '#D4A574' }
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#D4A574' }
                }}
              />

              <TextField
                {...register('category', { required: 'Category is required' })}
                select
                label="Category *"
                fullWidth
                defaultValue=""
                error={!!errors.category}
                helperText={errors.category?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&.Mui-focused fieldset': { borderColor: '#D4A574' }
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#D4A574' }
                }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>

              <Stack direction="row" spacing={2}>
                <TextField
                  {...register('price', {
                    required: 'Price is required',
                    min: { value: 1, message: 'Price must be at least 1' }
                  })}
                  label="Price (₹) *"
                  type="number"
                  fullWidth
                  error={!!errors.price}
                  helperText={errors.price?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-focused fieldset': { borderColor: '#D4A574' }
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#D4A574' }
                  }}
                />

                <TextField
                  {...register('stock', {
                    required: 'Stock is required',
                    min: { value: 0, message: 'Stock cannot be negative' }
                  })}
                  label="Stock Quantity *"
                  type="number"
                  fullWidth
                  error={!!errors.stock}
                  helperText={errors.stock?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-focused fieldset': { borderColor: '#D4A574' }
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#D4A574' }
                  }}
                />
              </Stack>

              {/* Image Upload Section */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', color: '#1F2937' }}>
                  Product Image
                </Typography>

                {/* Image Preview */}
                {(imagePreview || imageUrl) && (
                  <Card sx={{ mb: 2, maxWidth: 400, mx: 'auto' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={imagePreview || imageUrl}
                      alt="Product preview"
                      sx={{ objectFit: 'cover' }}
                    />
                  </Card>
                )}

                {/* Upload Button */}
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  fullWidth
                  sx={{
                    borderColor: '#D4A574',
                    color: '#D4A574',
                    py: 2,
                    mb: 2,
                    borderStyle: 'dashed',
                    borderWidth: 2,
                    '&:hover': {
                      borderColor: '#C9A86A',
                      bgcolor: alpha('#D4A574', 0.05)
                    }
                  }}
                >
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imageFile ? imageFile.name : 'Upload Product Image'}
                </Button>

                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: 'text.secondary', mb: 2 }}>
                  Or enter image URL below (Max 5MB, JPG/PNG)
                </Typography>

                {/* Image URL Input */}
                <TextField
                  {...register('imageUrl')}
                  label="Image URL (Optional)"
                  fullWidth
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl || ''}
                  onChange={(e) => {
                    setValue('imageUrl', e.target.value)
                    setImagePreview(e.target.value)
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-focused fieldset': { borderColor: '#D4A574' }
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#D4A574' }
                  }}
                />
              </Box>

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => navigate('/seller/products')}
                  sx={{
                    borderColor: '#D4A574',
                    color: '#D4A574',
                    '&:hover': {
                      borderColor: '#C9A86A',
                      bgcolor: alpha('#D4A574', 0.05)
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={<Save />}
                  sx={{
                    bgcolor: '#D4A574',
                    color: 'white',
                    px: 4,
                    '&:hover': { bgcolor: '#C9A86A' },
                    '&:disabled': { bgcolor: alpha('#D4A574', 0.5) }
                  }}
                >
                  {loading ? 'Adding...' : 'Add Product'}
                </Button>
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Container>
  )
}

export default AddProduct
