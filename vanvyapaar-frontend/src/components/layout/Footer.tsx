import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-tribal-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">V</span>
              </div>
              <h3 className="text-xl font-display font-bold">VanVyaapaar</h3>
            </div>
            <p className="text-tribal-200 mb-4">
              Connecting authentic tribal artisans with the world. Preserving heritage, 
              empowering communities, one craft at a time.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-tribal-300 hover:text-white">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-tribal-300 hover:text-white">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-tribal-300 hover:text-white">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-tribal-200 hover:text-white">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=Pottery" className="text-tribal-200 hover:text-white">
                  Pottery
                </Link>
              </li>
              <li>
                <Link to="/products?category=Textiles" className="text-tribal-200 hover:text-white">
                  Textiles
                </Link>
              </li>
              <li>
                <Link to="/products?category=Handicrafts" className="text-tribal-200 hover:text-white">
                  Handicrafts
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-tribal-200 hover:text-white">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-tribal-200 hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-tribal-200 hover:text-white">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-tribal-200 hover:text-white">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-tribal-200 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-tribal-200 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-tribal-300" />
                <span className="text-tribal-200">
                  123 Tribal Heritage Street<br />
                  New Delhi, India 110001
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-tribal-300" />
                <span className="text-tribal-200">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-tribal-300" />
                <span className="text-tribal-200">support@vanvyaapaar.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-tribal-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-tribal-300 text-sm">
            © 2024 VanVyaapaar. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/terms" className="text-tribal-300 hover:text-white text-sm">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-tribal-300 hover:text-white text-sm">
              Privacy Policy
            </Link>
            <Link to="/cookies" className="text-tribal-300 hover:text-white text-sm">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer