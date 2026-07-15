import { useState } from 'react';
import { ArrowLeft, Tag, Clock, Star, Filter, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import MobileBottomNav, { MobileScreen } from './MobileBottomNav';
import { useAppContext } from './MobileAppContainerEnhanced';

interface MobilePromotionsProps {
  onNavigate: (screen: MobileScreen, data?: any) => void;
}

const promotions = [
  {
    id: 1,
    title: 'Premium Coffee Set',
    discount: '30% OFF',
    category: 'Food & Beverage',
    rank: 'Gold',
    points: 500,
    validUntil: '2025-12-31',
    image: 'from-amber-400 to-orange-500',
    description: 'Enjoy premium coffee beans from around the world',
    termsAndConditions: 'Valid for one-time use only',
  },
  {
    id: 2,
    title: 'Wellness Spa Package',
    discount: '25% OFF',
    category: 'Health & Wellness',
    rank: 'Silver',
    points: 300,
    validUntil: '2025-11-30',
    image: 'from-green-400 to-teal-500',
    description: 'Relax and rejuvenate with our spa services',
    termsAndConditions: 'Booking required 48 hours in advance',
  },
  {
    id: 3,
    title: 'Tech Gadget Bundle',
    discount: '40% OFF',
    category: 'Electronics',
    rank: 'Platinum',
    points: 800,
    validUntil: '2025-10-31',
    image: 'from-blue-400 to-purple-500',
    description: 'Latest tech gadgets at unbeatable prices',
    termsAndConditions: 'While stocks last',
  },
  {
    id: 4,
    title: 'Fashion Boutique Voucher',
    discount: '20% OFF',
    category: 'Fashion',
    rank: 'Bronze',
    points: 200,
    validUntil: '2025-09-30',
    image: 'from-pink-400 to-rose-500',
    description: 'Upgrade your wardrobe with trendy fashion',
    termsAndConditions: 'Cannot be combined with other offers',
  },
  {
    id: 5,
    title: 'Restaurant Dining',
    discount: '15% OFF',
    category: 'Food & Beverage',
    rank: 'Silver',
    points: 250,
    validUntil: '2025-12-15',
    image: 'from-red-400 to-orange-500',
    description: 'Dine at the finest restaurants',
    termsAndConditions: 'Dine-in only',
  },
  {
    id: 6,
    title: 'Fitness Membership',
    discount: '50% OFF',
    category: 'Health & Wellness',
    rank: 'Gold',
    points: 600,
    validUntil: '2025-08-31',
    image: 'from-purple-400 to-indigo-500',
    description: 'Get fit with our premium gym facilities',
    termsAndConditions: '3-month minimum commitment',
  },
];

export default function MobilePromotions({ onNavigate }: MobilePromotionsProps) {
  const { theme } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRank, setSelectedRank] = useState('all');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const filteredPromotions = promotions.filter((promo) => {
    const matchesSearch = promo.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || promo.category === selectedCategory;
    const matchesRank = selectedRank === 'all' || promo.rank === selectedRank;
    return matchesSearch && matchesCategory && matchesRank;
  });

  const handleViewDetail = (promotion: any) => {
    onNavigate('promotion-detail', promotion);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div 
        className="text-white px-6 pt-6 pb-4"
        style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-white text-xl">Promotions</h2>
          </div>
          
          {/* Icon Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Input - Expandable */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="relative mt-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search promotions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filter Panel - Slide-in from right */}
      <AnimatePresence>
        {showFilter && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowFilter(false)}
            />
            
            {/* Filter Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 shadow-xl overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg text-gray-900">Filters</h3>
                  <button
                    onClick={() => setShowFilter(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Category Filter */}
                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                        <SelectItem value="Health & Wellness">Health & Wellness</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Fashion">Fashion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Rank Filter */}
                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">Member Rank</label>
                    <Select value={selectedRank} onValueChange={setSelectedRank}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ranks</SelectItem>
                        <SelectItem value="Bronze">Bronze</SelectItem>
                        <SelectItem value="Silver">Silver</SelectItem>
                        <SelectItem value="Gold">Gold</SelectItem>
                        <SelectItem value="Platinum">Platinum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">Status</label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedRank('all');
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    className="flex-1"
                    style={{ backgroundColor: theme.primary }}
                    onClick={() => setShowFilter(false)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 pb-20">
        <div className="grid grid-cols-2 gap-4">
          {filteredPromotions.map((promo) => (
            <Card 
              key={promo.id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleViewDetail(promo)}
            >
              {/* Image */}
              <div className={`h-32 bg-gradient-to-br ${promo.image} relative`}>
                <Badge className="absolute top-2 left-2 bg-red-500 text-white border-0">
                  {promo.discount}
                </Badge>
                <Badge className="absolute top-2 right-2 bg-yellow-500 text-white border-0 text-xs">
                  {promo.rank}
                </Badge>
              </div>

              {/* Info */}
              <div className="p-3">
                <h4 className="text-sm text-gray-900 mb-2 line-clamp-2 min-h-[40px]">
                  {promo.title}
                </h4>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-600">{promo.category}</span>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                  <Clock className="w-3 h-3" />
                  <span>Until {promo.validUntil}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span 
                    className="text-sm"
                    style={{ color: theme.primary }}
                  >
                    {promo.points} pts
                  </span>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetail(promo);
                    }}
                    style={{ backgroundColor: theme.primary }}
                    className="h-7 text-xs"
                  >
                    Claim
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredPromotions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Tag className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">No Promotions Found</h3>
            <p className="text-gray-600 text-sm">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav
        currentScreen="home"
        onNavigate={onNavigate}
        primaryColor={theme.primary}
      />
    </div>
  );
}
