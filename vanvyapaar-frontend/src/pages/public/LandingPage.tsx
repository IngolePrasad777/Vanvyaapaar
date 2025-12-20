import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Users, Award, Truck, Shield, Heart, Play, ChevronLeft, ChevronRight, MapPin, Sparkles, Globe, TrendingUp, Eye, ShoppingBag, Zap, Gift } from 'lucide-react'
import { Product } from '../../types'
import productService from '../../services/productService'
import { formatPrice } from '../../lib/utils'

const LandingPage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const products = await productService.getAllProducts()
        // Get featured products or first 8 products
        const featured = products.filter(p => p.featured).slice(0, 8) || products.slice(0, 8)
        setFeaturedProducts(featured)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  // Auto-rotate hero slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const heroSlides = [
    {
      title: "Authentic Tribal Crafts & Art",
      subtitle: "Discover handcrafted treasures from India's tribal communities",
      image: "https://www.re-thinkingthefuture.com/wp-content/uploads/2021/05/A4086-Handicrafts-from-Northeast-India-Image11.jpg",
      cta: "Explore Collection"
    },
    {
      title: "Empower Artisan Communities",
      subtitle: "Every purchase supports traditional craftspeople and preserves heritage",
      image: "https://exclusivelane.com/cdn/shop/files/EL-005-1686_A_580x.jpg?v=1740476654",
      cta: "Support Artisans"
    },
    {
      title: "Heritage in Every Thread",
      subtitle: "Handwoven textiles carrying centuries of tradition and skill",
      image: "https://rukminim2.flixcart.com/image/832/832/xif0q/sari/i/b/g/free-s814-melisha-red-gugaliya-unstitched-original-imagupqmdmsqtzyc.jpeg?q=70&crop=false",
      cta: "Shop Textiles"
    }
  ]

  const categories = [
    {
      name: 'Pottery',
      image: 'https://imgs.search.brave.com/ZCTodq8c7JDap4xxa1WzseaCLkOnMt-clgLirM-PW2Q/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcmV2/aWV3LnJlZGQuaXQv/bXktZmlyc3QtY29t/cGxldGUtZGlubmVy/d2FyZS1zZXQtdjAt/NXplMzZlcWlzNnhm/MS5qcGc_d2lkdGg9/NjQwJmNyb3A9c21h/cnQmYXV0bz13ZWJw/JnM9MWU2MjQxZGFl/MjA2YWRkNjllZTFk/YWU2YzAxNDg1YTkx/ZGFhZDY0NA',
      description: 'Handcrafted clay pottery with traditional tribal designs and earthy textures',
      count: '150+ items',
      featured: true
    },
    {
      name: 'Textiles',
      image: 'https://imgs.search.brave.com/wIZ9d9piVYucSdkM2FWYufxNe_DtP8wWBi6uS85wOek/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc3F1YXJlc3Bh/Y2UtY2RuLmNvbS9j/b250ZW50L3YxLzU1/NWY4MjNhZTRiMDdm/MGM5NTQ1ZmI0OC8x/NDM1Mjc4NjAzNjU3/LTM0N1hZV081UFcw/Rlc2S0FMUzM4L3Zp/ZXRuYW0xMjA2Mzhf/NTJtYjhiaXQuanBn',
      description: 'Vibrant handwoven fabrics with intricate tribal patterns and natural dyes',
      count: '200+ items',
      featured: true
    },
    {
      name: 'Handicrafts',
      image: 'https://imgs.search.brave.com/MSgmx4SSowsIoK6BrN9R0UMq-h4e_V3XMD5ETtwD9aI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9vbGQtY3JhZnRz/LWhhbmRpY3JhZnRz/XzQzMzkwNS0yOTI2/MS5qcGc_c2VtdD1h/aXNfaHlicmlkJnc9/NzQw',
      description: 'Unique handmade crafts showcasing traditional tribal artistry and heritage',
      count: '300+ items',
      featured: false
    },
    {
      name: 'Jewelry',
      image: 'https://3.bp.blogspot.com/-kwWfEcnYrm8/VgaqTUMNdSI/AAAAAAAABcQ/m9YH36TSwcc/s1600/Tribal%2BTurtle%2BPendant%2BN1.jpg',
      description: 'Traditional tribal jewelry with cultural significance and natural materials',
      count: '120+ items',
      featured: true
    },
    {
      name: 'Wood Crafts',
      image: 'https://3.bp.blogspot.com/-o81RCx1BOjU/VCGSgH_uOZI/AAAAAAAAe5s/TGYLHTajc9E/s1600/cane%2Bbamboo%2Bcrafts%2Bwest%2Bbengal%2Bindia.jpg',
      description: 'Intricately carved wooden artifacts and sculptures by tribal craftsmen',
      count: '80+ items',
      featured: false
    },
    {
      name: 'Metal Crafts',
      image: 'https://ibgnews.com/wp-content/uploads/2020/10/Dokra-Metal-art-work-Tribal-Art-of-India.jpg',
      description: 'Exquisite metalwork including brass, copper, and silver tribal art pieces',
      count: '90+ items',
      featured: false
    },
    {
      name: 'Paintings',
      image: 'https://1.bp.blogspot.com/-sRPIhDDYOZM/XoRt4kfIKPI/AAAAAAAACrQ/pELRowS2rgQW2fC7pbuI0DRfAz9Xn3yfQCK4BGAsYHg/warli_painting-750x410.jpg',
      description: 'Traditional tribal paintings including Warli, Madhubani, and Gond art',
      count: '75+ items',
      featured: false
    },
    {
      name: 'Baskets',
      image: 'https://genequintanafineart.com/images/catalog/full/full_hupahats_1.jpg',
      description: 'Handwoven baskets and containers made from natural fibers and bamboo',
      count: '65+ items',
      featured: false
    },
    {
      name: 'Masks & Dolls',
      image: 'https://bongoniketan.in/cdn/shop/files/IMG_4926_1024x1024.jpg?v=1696157947',
      description: 'Traditional tribal masks and dolls representing cultural stories and rituals',
      count: '45+ items',
      featured: false
    }
  ]

  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Mumbai',
      text: 'The quality of craftsmanship is exceptional. Each piece tells a story of our rich heritage. I\'ve decorated my entire home with these beautiful tribal artifacts.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      purchase: 'Handwoven Textile Set'
    },
    {
      name: 'Rajesh Kumar',
      location: 'Delhi',
      text: 'Supporting tribal artisans while getting authentic products feels amazing. The direct connection to the craftspeople makes each purchase meaningful.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      purchase: 'Traditional Pottery Collection'
    },
    {
      name: 'Anita Patel',
      location: 'Bangalore',
      text: 'Fast delivery and beautiful packaging. The pottery I ordered exceeded my expectations. The attention to detail is remarkable.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      purchase: 'Tribal Jewelry Set'
    },
    {
      name: 'Vikram Singh',
      location: 'Jaipur',
      text: 'As someone who appreciates traditional art, VanVyaapaar has become my go-to platform. The authenticity is unmatched.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      purchase: 'Metal Craft Sculptures'
    }
  ]

  const stats = [
    { number: '500+', label: 'Artisans', icon: Users },
    { number: '50+', label: 'Tribal Communities', icon: MapPin },
    { number: '10,000+', label: 'Happy Customers', icon: Heart },
    { number: '25+', label: 'States Covered', icon: Globe }
  ]

  const artisanStories = [
    {
      name: 'Kamala Devi',
      tribe: 'Warli Tribe',
      craft: 'Traditional Warli Paintings',
      story: 'Creating art that tells the stories of my ancestors for over 30 years.',
      image: 'https://exclusivelane.com/cdn/shop/collections/v1_480x.jpg?v=1727692806',
      location: 'Maharashtra'
    },
    {
      name: 'Ravi Meena',
      tribe: 'Meena Tribe',
      craft: 'Blue Pottery',
      story: 'Preserving the ancient art of blue pottery with modern designs.',
      image: 'https://exclusivelane.com/cdn/shop/collections/v4_1_480x.jpg?v=1727937243',
      location: 'Rajasthan'
    },
    {
      name: 'Sunita Bhil',
      tribe: 'Bhil Tribe',
      craft: 'Handwoven Textiles',
      story: 'Weaving dreams and traditions into every thread since childhood.',
      image: 'https://exclusivelane.com/cdn/shop/collections/v2_1_480x.jpg?v=1727937764',
      location: 'Gujarat'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden min-h-screen">
        {/* Background with Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50"></div>
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 5L60 35L90 35L68 55L78 85L50 70L22 85L32 55L10 35L40 35Z' fill='%23f59532' fill-opacity='0.1'/%3E%3C/svg%3E")`,
              backgroundSize: '100px 100px'
            }}></div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="container mx-auto px-4 py-12 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[90vh]">
                  {/* Left Content */}
                  <div className="space-y-8 text-center lg:text-left">
                    <div className="space-y-6">
                      {/* Badge */}
                      <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-semibold">
                        <Sparkles className="w-4 h-4" />
                        <span>Authentic Tribal Heritage</span>
                      </div>
                      
                      {/* Main Heading */}
                      <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight text-gray-900">
                        <span className="block">{slide.title.split(' ').slice(0, 2).join(' ')}</span>
                        <span className="block text-primary-600 mt-2">
                          {slide.title.split(' ').slice(2).join(' ')}
                        </span>
                      </h1>
                      
                      {/* Subtitle */}
                      <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                        {slide.subtitle}
                      </p>
                    </div>
                    
                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                      <Link 
                        to="/products" 
                        className="group bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        <ShoppingBag className="mr-2 w-5 h-5" />
                        {slide.cta}
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <button className="group bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center shadow-lg">
                        <Play className="mr-2 w-5 h-5" />
                        Watch Our Story
                      </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                      {stats.map((stat, i) => (
                        <div key={i} className="text-center">
                          <div className="text-2xl lg:text-3xl font-bold text-primary-600 mb-1">{stat.number}</div>
                          <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Right Content - Image */}
                  <div className="relative">
                    <div className="relative z-10">
                      {/* Main Image */}
                      <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-[500px] lg:h-[600px] object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                      
                      {/* Floating Elements */}
                      <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-xs">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Award className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">100% Authentic</p>
                            <p className="text-gray-600 text-sm">Certified Crafts</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
                        <div className="text-center">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <TrendingUp className="w-5 h-5 text-primary-600" />
                          </div>
                          <p className="font-bold text-gray-800 text-sm">₹2.5L+</p>
                          <p className="text-gray-600 text-xs">Artisan Earnings</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Background Decorations */}
                    <div className="absolute -top-8 -left-8 w-32 h-32 bg-primary-200 rounded-full opacity-20 blur-xl"></div>
                    <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-amber-200 rounded-full opacity-20 blur-xl"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-primary-600 w-8' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 relative">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59532' fill-opacity='0.1'%3E%3Ccircle cx='40' cy='40' r='4'/%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3Ccircle cx='60' cy='20' r='2'/%3E%3Ccircle cx='20' cy='60' r='2'/%3E%3Ccircle cx='60' cy='60' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-800 px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-sm">
              <Zap className="w-4 h-4" />
              <span>Why Choose VanVyaapaar</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-6">
              More Than Just
              <span className="block text-primary-600">Shopping</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Every purchase creates a positive impact on tribal communities while bringing 
              authentic, handcrafted treasures to your home
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                icon: Award,
                title: "100% Authentic",
                description: "Genuine tribal crafts directly sourced from artisan communities with authenticity certificates",
                color: "from-amber-500 to-orange-600"
              },
              {
                icon: Truck,
                title: "Free Shipping",
                description: "Complimentary delivery on orders above ₹999 with careful packaging to preserve crafts",
                color: "from-green-500 to-emerald-600"
              },
              {
                icon: Shield,
                title: "Secure Payments",
                description: "Bank-grade security with multiple payment options and buyer protection guarantee",
                color: "from-blue-500 to-indigo-600"
              },
              {
                icon: Heart,
                title: "Impact Driven",
                description: "Direct support to tribal families with fair pricing and sustainable livelihood programs",
                color: "from-rose-500 to-pink-600"
              }
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="group">
                  <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 h-full">
                    <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900 text-center">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-center">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Enhanced Impact Stats */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-8 lg:p-12 shadow-2xl">
            <div className="text-center mb-8">
              <h3 className="text-2xl lg:text-3xl font-display font-bold text-white mb-4">
                Our Impact So Far
              </h3>
              <p className="text-primary-100 text-lg">
                Together, we're making a difference in tribal communities across India
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.number}</div>
                    <div className="text-primary-100 font-medium">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Tribal Art Gallery Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-tribal-50 via-amber-50/30 to-orange-50/20"></div>
        <div className="absolute inset-0 opacity-5 mandala-pattern"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Gallery Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-800 px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-sm">
              <Eye className="w-4 h-4" />
              <span>Art Gallery</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-6">
              Authentic Tribal
              <span className="block text-primary-600">Art Collection</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Explore the rich tapestry of Indian tribal art - from intricate Warli paintings to vibrant textiles, 
              each piece tells a story of ancient traditions and cultural heritage.
            </p>
          </div>

          {/* Art Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
            {[
              {
                image: 'https://www.re-thinkingthefuture.com/wp-content/uploads/2021/05/A4086-Handicrafts-from-Northeast-India-Image11.jpg',
                title: 'Northeast Handicrafts'
              },
              {
                image: 'https://exclusivelane.com/cdn/shop/files/EL-005-1686_A_580x.jpg?v=1740476654',
                title: 'Traditional Pottery'
              },
              {
                image: 'https://exclusivelane.com/cdn/shop/products/el-003-061-_a_580x.jpg?v=1740474777',
                title: 'Artisan Crafts'
              },
              {
                image: 'https://rukminim2.flixcart.com/image/832/832/xif0q/bag/n/c/x/37-lord-krishn-bag-29-wunax-17-12-original-imahezd2ffr4pfhj.jpeg?q=70&crop=false',
                title: 'Traditional Bags'
              },
              {
                image: 'https://rukminim2.flixcart.com/image/832/832/xif0q/sari/i/b/g/free-s814-melisha-red-gugaliya-unstitched-original-imagupqmdmsqtzyc.jpeg?q=70&crop=false',
                title: 'Tribal Textiles'
              },
              {
                image: 'https://rukminim2.flixcart.com/image/832/832/xif0q/sticker/a/j/7/large-tribal-activities-warli-art-1-40-rpc2935t50-rawpockets-original-imaheyheucrqucg7.jpeg?q=70&crop=false',
                title: 'Warli Art'
              },
              {
                image: 'https://tribesindia.com/public/uploads/all/NKAkvcXvD1t3TcmW0K96yQXvKepOmV9e7Lxd3Tr6.webp',
                title: 'Tribal Artifacts'
              },
              {
                image: 'https://tribesindia.com/public/uploads/all/sgBIZoprOAywyGFUyAHBGF1QyPFRouZsDHiuEZAn.webp',
                title: 'Cultural Items'
              },
              {
                image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/jewellery-set/c/5/n/na-na-morbali-pink-beadup-original-imaghxh8qzvhsajn.jpeg?q=70',
                title: 'Tribal Jewelry'
              }
            ].map((item, index) => (
              <div key={index} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 lg:h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm font-bold">{item.title}</p>
                  <p className="text-xs opacity-90">Authentic Tribal Art</p>
                </div>
                
                {/* Quick View Icon */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section className="py-20 relative">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-amber-50/20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-tribal-100 text-tribal-800 px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-sm">
              <Globe className="w-4 h-4" />
              <span>Craft Categories</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-6">
              Discover Authentic
              <span className="block text-primary-600">Tribal Crafts</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Each category represents centuries of cultural heritage, passed down through generations 
              of skilled artisans who pour their heart and soul into every creation.
            </p>
          </div>
          
          {/* Featured Categories - Large Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {categories.filter(cat => cat.featured).slice(0, 2).map((category, index) => (
              <Link
                key={category.name}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="relative h-80 lg:h-96">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-white">
                        {category.count}
                      </span>
                      <span className="bg-primary-600 px-4 py-2 rounded-full text-sm font-bold text-white">
                        Popular Choice
                      </span>
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-display font-bold mb-3 text-white group-hover:text-amber-200 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-lg text-gray-200 max-w-md leading-relaxed mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center text-amber-200 font-bold group-hover:translate-x-2 transition-transform">
                      <span>Explore Collection</span>
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* All Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Category Badge */}
                  {category.featured && (
                    <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      Popular
                    </div>
                  )}
                  
                  {/* Quick View Button */}
                  <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {category.name}
                    </h3>
                    <span className="text-sm text-primary-600 font-bold bg-primary-50 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-primary-600 font-bold group-hover:translate-x-1 transition-transform">
                      <span>Browse Now</span>
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                      <ArrowRight className="w-4 h-4 text-primary-600 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Featured Products */}
      <section className="py-20 relative">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-800 px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-sm">
              <Gift className="w-4 h-4" />
              <span>Featured Collection</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-6">
              Handpicked
              <span className="block text-primary-600">Treasures</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Discover exceptional pieces carefully selected from our talented artisan community, 
              each telling a unique story of tradition and craftsmanship
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-6 shadow-lg animate-pulse">
                  <div className="bg-gray-300 h-56 rounded-2xl mb-4"></div>
                  <div className="bg-gray-300 h-4 rounded mb-3"></div>
                  <div className="bg-gray-300 h-4 rounded w-2/3 mb-3"></div>
                  <div className="bg-gray-300 h-6 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={product.imageUrl || 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=center'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Badges */}
                    {product.featured && (
                      <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        Featured
                      </div>
                    )}
                    
                    {/* Quick Actions */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex flex-col space-y-2">
                        <button className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors">
                          <Heart className="w-4 h-4 text-white" />
                        </button>
                        <button className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors">
                          <Eye className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors text-lg">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm">{product.category}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-primary-600">
                        {formatPrice(product.price)}
                      </span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        by {product.seller?.name}
                      </span>
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                        <ArrowRight className="w-4 h-4 text-primary-600 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* CTA Button */}
          <div className="text-center mt-16">
            <Link 
              to="/products" 
              className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <ShoppingBag className="mr-2 w-5 h-5" />
              View All Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Artisan Stories Section */}
      <section className="py-20 bg-tribal-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-tribal-200 text-tribal-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              <span>Meet Our Artisans</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-800 mb-6">
              Stories Behind
              <span className="block text-tribal-600">Every Craft</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get to know the talented artisans who create these beautiful pieces, 
              each with their own unique story and cultural heritage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {artisanStories.map((artisan, index) => (
              <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative">
                  <img
                    src={artisan.image}
                    alt={artisan.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-tribal-800">
                    {artisan.location}
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">{artisan.name}</h3>
                    <p className="text-tribal-600 font-medium">{artisan.tribe}</p>
                    <p className="text-gray-600 text-sm">{artisan.craft}</p>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-6 italic">
                    "{artisan.story}"
                  </p>
                  
                  <button className="w-full bg-tribal-100 hover:bg-tribal-200 text-tribal-800 font-medium py-3 px-4 rounded-xl transition-colors duration-200">
                    View {artisan.name}'s Crafts
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              <span>Customer Reviews</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-800 mb-6">
              Loved by Customers
              <span className="block text-primary-600">Across India</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from satisfied customers who have experienced the magic of authentic tribal crafts
            </p>
          </div>

          {/* Testimonial Carousel */}
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="bg-gray-50 rounded-3xl p-8 lg:p-12 text-center">
                      <div className="flex justify-center mb-6">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      
                      <blockquote className="text-xl lg:text-2xl text-gray-700 leading-relaxed mb-8 italic">
                        "{testimonial.text}"
                      </blockquote>
                      
                      <div className="flex items-center justify-center space-x-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="text-left">
                          <p className="font-bold text-gray-800 text-lg">{testimonial.name}</p>
                          <p className="text-gray-600">{testimonial.location}</p>
                          <p className="text-primary-600 text-sm font-medium">Purchased: {testimonial.purchase}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial Navigation */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentTestimonial ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-tribal-800 via-tribal-700 to-tribal-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 tribal-pattern opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Join Our Community</span>
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-display font-bold mb-6 leading-tight">
              Become Part of the
              <span className="block text-yellow-200">VanVyaapaar Family</span>
            </h2>
            
            <p className="text-xl lg:text-2xl text-tribal-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              Whether you're an artisan looking to showcase your crafts or a customer seeking authentic tribal art, 
              VanVyaapaar is your gateway to India's rich cultural heritage.
            </p>

            {/* Dual CTA */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* For Artisans */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">For Artisans</h3>
                <p className="text-tribal-200 mb-6 leading-relaxed">
                  Showcase your traditional crafts to a global audience. We handle the platform, 
                  payments, and logistics while you focus on creating beautiful art.
                </p>
                <Link 
                  to="/register?type=seller" 
                  className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  Become a Seller
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <div className="mt-4 text-sm text-tribal-300">
                  ✓ Zero listing fees  ✓ Fair pricing  ✓ Marketing support
                </div>
              </div>

              {/* For Customers */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">For Art Lovers</h3>
                <p className="text-tribal-200 mb-6 leading-relaxed">
                  Discover authentic tribal crafts and support artisan communities. 
                  Every purchase helps preserve cultural heritage and provides sustainable livelihoods.
                </p>
                <Link 
                  to="/products" 
                  className="inline-flex items-center bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  Start Shopping
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <div className="mt-4 text-sm text-tribal-300">
                  ✓ Authentic crafts  ✓ Free shipping  ✓ Secure payments
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold mb-4">Stay Connected</h3>
              <p className="text-tribal-200 mb-6">
                Get updates on new artisan stories, exclusive collections, and special offers
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary-400 rounded-full opacity-10 blur-3xl"></div>
      </section>
    </div>
  )
}

export default LandingPage