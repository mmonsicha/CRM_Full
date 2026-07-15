import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft, Search, Filter, ShoppingCart, Heart, Star,
  ChevronRight, Plus, Minus, Check
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { MobileScreen } from './MobileBottomNav';
import { toast } from 'sonner@2.0.3';

interface MobileShopProps {
  onNavigate: (screen: MobileScreen, data?: any) => void;
  onBack: () => void;
}

const categories = ['All', 'Fashion', 'Electronics', 'Beauty', 'Home', 'Sports'];

const products = [
  {
    id: 'prod-1',
    name: 'Premium Wireless Headphones',
    price: 2499,
    originalPrice: 3999,
    discount: 38,
    rating: 4.8,
    reviews: 328,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    category: 'Electronics',
    inStock: true,
    favorite: false,
  },
  {
    id: 'prod-2',
    name: 'Designer Sunglasses',
    price: 1299,
    originalPrice: 1999,
    discount: 35,
    rating: 4.6,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
    category: 'Fashion',
    inStock: true,
    favorite: true,
  },
  {
    id: 'prod-3',
    name: 'Luxury Skincare Set',
    price: 899,
    originalPrice: 1499,
    discount: 40,
    rating: 4.9,
    reviews: 542,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
    category: 'Beauty',
    inStock: true,
    favorite: false,
  },
  {
    id: 'prod-4',
    name: 'Smart Watch Pro',
    price: 3999,
    originalPrice: 5999,
    discount: 33,
    rating: 4.7,
    reviews: 891,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    category: 'Electronics',
    inStock: true,
    favorite: false,
  },
  {
    id: 'prod-5',
    name: 'Running Shoes',
    price: 1899,
    originalPrice: 2999,
    discount: 37,
    rating: 4.5,
    reviews: 267,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    category: 'Sports',
    inStock: true,
    favorite: true,
  },
  {
    id: 'prod-6',
    name: 'Modern Table Lamp',
    price: 699,
    originalPrice: 999,
    discount: 30,
    rating: 4.4,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
    category: 'Home',
    inStock: true,
    favorite: false,
  },
];

export default function MobileShop({ onNavigate, onBack }: MobileShopProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(
    products.filter(p => p.favorite).map(p => p.id)
  );
  const [cartItems, setCartItems] = useState<{[key: string]: number}>({});
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
    toast.success(
      favorites.includes(productId) ? 'Removed from favorites' : 'Added to favorites'
    );
  };

  const addToCart = (product: any) => {
    setCartItems(prev => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1
    }));
    toast.success(`Added ${product.name} to cart!`);
  };

  const cartCount = Object.values(cartItems).reduce((sum, count) => sum + count, 0);

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 pt-12 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-gray-900 text-xl">Shop</h1>
              <p className="text-gray-500 text-sm">Discover amazing products</p>
            </div>
          </div>
          <button
            onClick={() => toast.info(`You have ${cartCount} items in cart`)}
            className="relative w-10 h-10 rounded-full bg-[#007AFF] flex items-center justify-center"
          >
            <ShoppingCart className="w-5 h-5 text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-12 h-11 bg-gray-50 border-gray-200"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[#007AFF] flex items-center justify-center">
            <Filter className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-[#007AFF] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4 pb-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div
                  className="relative cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        favorites.includes(product.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>
                  {product.discount > 0 && (
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white border-0">
                      -{product.discount}%
                    </Badge>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-[#007AFF] font-semibold">
                      ฿{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ฿{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="w-full h-8 bg-[#007AFF] hover:bg-[#0051D5] text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    <ShoppingCart className="w-3.5 h-3.5 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
          onClick={() => setSelectedProduct(null)}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', damping: 30 }}
            className="bg-white rounded-t-3xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
              <h2 className="text-gray-900">Product Details</h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5 rotate-90" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-64 object-cover rounded-2xl mb-4"
              />
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-gray-900 text-lg mb-2">{selectedProduct.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">
                        {selectedProduct.rating} ({selectedProduct.reviews} reviews)
                      </span>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      In Stock
                    </Badge>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(selectedProduct.id)}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites.includes(selectedProduct.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-[#007AFF] text-2xl">
                  ฿{selectedProduct.price.toLocaleString()}
                </span>
                {selectedProduct.originalPrice && (
                  <>
                    <span className="text-gray-400 line-through">
                      ฿{selectedProduct.originalPrice.toLocaleString()}
                    </span>
                    <Badge className="bg-red-500 text-white border-0">
                      Save {selectedProduct.discount}%
                    </Badge>
                  </>
                )}
              </div>
              <div className="space-y-3 mb-6">
                <h4 className="text-gray-900">Description</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Premium quality product with excellent features and design. 
                  Perfect for everyday use with outstanding durability and performance. 
                  Get yours now and enjoy the best shopping experience!
                </p>
              </div>
              <Button
                className="w-full h-12 bg-[#007AFF] hover:bg-[#0051D5]"
                onClick={() => {
                  addToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart - ฿{selectedProduct.price.toLocaleString()}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
