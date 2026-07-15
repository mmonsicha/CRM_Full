import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home, Calendar, Gift, User, QrCode, Coins, ChevronLeft, ChevronRight,
  Heart, MapPin, Clock, Tag, Star, Camera, Check, Copy, Plus, Edit,
  Trash2, Settings as SettingsIcon, HelpCircle, Shield, LogOut, Package,
  TrendingUp, History, CreditCard, Award, ChevronDown, X, Search, Filter,
  ScanLine, Smartphone, Mail, Phone, MapPinned, Building, AlertCircle,
  CheckCircle, Truck as TruckIcon, Store, Download, Share2, Bell
} from 'lucide-react';
import { useAppPreview } from './AppPreviewContext';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card } from './ui/card';

const iconMap: { [key: string]: any } = {
  Home, Calendar, Gift, User, QrCode, Coins, ScanLine,
};

// Mock Data
const mockEvents = [
  {
    id: 'event1',
    name: 'Summer Shopping Festival',
    description: 'Enjoy exclusive discounts and earn triple points on all purchases',
    fullDescription: 'Join our biggest shopping event of the season! Get exclusive discounts up to 70% off, earn triple points on every purchase, and unlock special rewards. Valid at all branches nationwide.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    category: 'Fashion & Accessories',
    startDate: '2025-11-15',
    endDate: '2025-11-20',
    participants: 2847,
    reward: '3x Points',
    favorite: false,
    segment: ['SEG001', 'SEG005', 'SEG006'],
  },
  {
    id: 'event2',
    name: 'VIP Member Night',
    description: 'Exclusive evening event for VIP members with special privileges',
    fullDescription: 'An exclusive evening celebration for our VIP members. Enjoy private shopping hours, complimentary refreshments, and access to limited edition products.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    category: 'Travel & Entertainment',
    startDate: '2025-11-25',
    endDate: '2025-11-25',
    participants: 156,
    reward: '500 Bonus Points',
    favorite: false,
    segment: ['SEG001'],
  },
  {
    id: 'event3',
    name: 'Flash Sale Weekend',
    description: 'Limited time flash deals every hour throughout the weekend',
    fullDescription: 'Non-stop flash sales happening every hour! Set your alarms and dont miss out on incredible deals across all product categories.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
    category: 'Electronics',
    startDate: '2025-11-22',
    endDate: '2025-11-24',
    participants: 5234,
    reward: 'Up to 70% OFF',
    favorite: true,
    segment: ['SEG001', 'SEG002', 'SEG005', 'SEG006'],
  },
  {
    id: 'event4',
    name: 'Health & Wellness Fair',
    description: 'Free health screenings and wellness consultations',
    fullDescription: 'Take care of your health with free screenings, wellness consultations, and exclusive health product discounts. Expert nutritionists and fitness trainers on-site.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    category: 'Health & Beauty',
    startDate: '2025-11-18',
    endDate: '2025-11-19',
    participants: 892,
    reward: 'Free Consultation',
    favorite: false,
    segment: ['SEG005', 'SEG006'],
  },
  {
    id: 'event5',
    name: 'Pet Adoption Day',
    description: 'Adopt a pet and receive free starter kit and consultation',
    fullDescription: 'Find your perfect furry companion! Partner with local animal shelters. Each adoption includes a free starter kit worth $150 and lifetime consultation support.',
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800',
    category: 'Pets',
    startDate: '2025-11-30',
    endDate: '2025-11-30',
    participants: 234,
    reward: 'Free Starter Kit',
    favorite: false,
    segment: ['SEG006'],
  },
  {
    id: 'event6',
    name: 'Food Festival',
    description: 'Taste delicious cuisines from around the world',
    fullDescription: 'A culinary journey featuring 50+ food vendors, cooking demonstrations by celebrity chefs, and exclusive member dining discounts.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    category: 'Food & Beverage',
    startDate: '2025-12-05',
    endDate: '2025-12-07',
    participants: 3421,
    reward: '20% Dining Discount',
    favorite: false,
    segment: ['SEG001', 'SEG005', 'SEG006'],
  },
];

const mockRewards = [
  {
    id: 'reward1',
    name: 'Starbucks Coffee Voucher',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
    points: 500,
    status: 'delivered',
    redeemedDate: '2025-11-01',
    type: 'E-Voucher',
  },
  {
    id: 'reward2',
    name: 'Amazon Gift Card $50',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
    points: 2500,
    status: 'pending',
    redeemedDate: '2025-11-08',
    type: 'Digital',
  },
  {
    id: 'reward3',
    name: 'Premium Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    points: 5000,
    status: 'redeemed',
    redeemedDate: '2025-11-10',
    type: 'Physical',
  },
];

const categories = [
  'All',
  'Points Collection',
  'Fashion & Accessories',
  'Electronics',
  'Food & Beverage',
  'Pets',
  'Health & Beauty',
  'Travel & Entertainment',
  'Others',
];

export default function MobileCustomerApp() {
  const {
    theme,
    landingSections,
    bottomNav,
    activeBottomTab,
    setActiveBottomTab,
    quickActions,
    banners,
    currentBannerIndex,
    setCurrentBannerIndex,
    currentUserTier,
    currentUserSegment,
    currentMobileScreen,
    pushMobileScreen,
    popMobileScreen,
    mobileScreenStack,
  } = useAppPreview();

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [favorites, setFavorites] = useState<string[]>(['event3']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [scanTab, setScanTab] = useState('scan');
  const [codesToEnter, setCodeToEnter] = useState(['']);
  const [selectedAddress, setSelectedAddress] = useState('addr1');
  const [showAddressModal, setShowAddressModal] = useState(false);

  const enabledBottomNav = bottomNav.filter(item => item.enabled && !item.hidden).sort((a, b) => a.order - b.order);
  const enabledSections = landingSections.filter(s => s.enabled).sort((a, b) => a.order - b.order);
  const enabledQuickActions = quickActions.filter(a => a.enabled).sort((a, b) => a.order - b.order);
  const enabledBanners = banners.filter(b => b.enabled).sort((a, b) => a.order - b.order);

  // Auto-slide banners
  useEffect(() => {
    const interval = setInterval(() => {
      if (enabledBanners.length > 1) {
        setCurrentBannerIndex((prev) => (prev + 1) % enabledBanners.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [enabledBanners.length, setCurrentBannerIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      setCurrentBannerIndex((prev) => (prev + 1) % enabledBanners.length);
    }
    if (touchStart - touchEnd < -75) {
      setCurrentBannerIndex((prev) => (prev - 1 + enabledBanners.length) % enabledBanners.length);
    }
  };

  const toggleFavorite = (eventId: string) => {
    setFavorites(prev =>
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
    );
  };

  const getFilteredEvents = () => {
    return mockEvents.filter(event => {
      // Check segment visibility
      if (!event.segment.includes(currentUserSegment)) return false;
      
      // Check category filter
      if (selectedCategory !== 'All' && event.category !== selectedCategory) return false;
      
      // Check search query
      if (searchQuery && !event.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      return true;
    });
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'PLATINUM': return 'from-gray-700 to-gray-900';
      case 'GOLD': return 'from-yellow-500 to-yellow-600';
      case 'SILVER': return 'from-gray-400 to-gray-500';
      default: return 'from-orange-400 to-orange-500';
    }
  };

  const getTierProgress = (tier: string) => {
    switch (tier) {
      case 'PLATINUM': return 100;
      case 'GOLD': return 75;
      case 'SILVER': return 50;
      default: return 25;
    }
  };

  // Render Home Screen
  const renderHomeScreen = () => (
    <div className="flex-1 overflow-y-auto pb-20">
      {enabledSections.map((section) => {
        switch (section.type) {
          case 'banner':
            return (
              <div
                key={section.id}
                className="relative"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className="relative h-48 overflow-hidden">
                  <AnimatePresence mode="wait">
                    {enabledBanners.length > 0 && (
                      <motion.img
                        key={currentBannerIndex}
                        src={enabledBanners[currentBannerIndex]?.image}
                        alt="Banner"
                        className="w-full h-full object-cover cursor-pointer"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => {
                          const banner = enabledBanners[currentBannerIndex];
                          if (banner.linkType === 'event') {
                            pushMobileScreen('event-detail');
                          } else if (banner.linkType === 'promotion') {
                            pushMobileScreen('promotion-detail');
                          }
                        }}
                      />
                    )}
                  </AnimatePresence>
                  
                  {enabledBanners.length > 1 && (
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                      {enabledBanners.map((_, index) => (
                        <div
                          key={index}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            index === currentBannerIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                          }`}
                          onClick={() => setCurrentBannerIndex(index)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );

          case 'quickActions':
            return (
              <div key={section.id} className="px-4 py-4">
                <div className="grid grid-cols-4 gap-3">
                  {enabledQuickActions.map((action) => {
                    const Icon = iconMap[action.icon] || QrCode;
                    return (
                      <button
                        key={action.id}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                        onClick={() => {
                          if (action.id === 'qr') pushMobileScreen('qr-code');
                          else if (action.id === 'points') pushMobileScreen('points');
                          else if (action.id === 'rewards') setActiveBottomTab('redeem');
                          else if (action.id === 'events') setActiveBottomTab('events');
                        }}
                      >
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                          }}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs" style={{ color: theme.textColor }}>
                          {action.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );

          case 'promotions':
            return (
              <div key={section.id} className="px-4 py-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium" style={{ color: theme.textColor }}>
                    Recommended Promotions
                  </h3>
                  <button
                    className="text-xs"
                    style={{ color: theme.primaryColor }}
                    onClick={() => pushMobileScreen('promotions')}
                  >
                    See All
                  </button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 w-64 rounded-xl overflow-hidden shadow-sm cursor-pointer"
                      style={{ backgroundColor: theme.cardBackground }}
                      onClick={() => pushMobileScreen('promotion-detail')}
                    >
                      <img
                        src={`https://images.unsplash.com/photo-${
                          i === 1 ? '1607082349566-187342175e2f' : i === 2 ? '1607082348824-0a96f2a4b9da' : '1530103862676-de8c9debad1d'
                        }?w=400`}
                        alt="Promotion"
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-3">
                        <Badge className="mb-2 text-xs" style={{ backgroundColor: theme.accentColor }}>
                          Limited Time
                        </Badge>
                        <h4 className="font-medium text-sm mb-1" style={{ color: theme.textColor }}>
                          {i === 1 ? 'Flash Sale 50% OFF' : i === 2 ? 'Buy 1 Get 1 Free' : 'Special Bundle Deal'}
                        </h4>
                        <p className="text-xs text-gray-500">Valid until Nov 30</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );

          case 'featuredEvents':
            return (
              <div key={section.id} className="px-4 py-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium" style={{ color: theme.textColor }}>
                    Featured Campaigns
                  </h3>
                  <button
                    className="text-xs"
                    style={{ color: theme.primaryColor }}
                    onClick={() => setActiveBottomTab('events')}
                  >
                    See All
                  </button>
                </div>
                <div className="space-y-3">
                  {getFilteredEvents().slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className="rounded-xl overflow-hidden shadow-sm cursor-pointer"
                      style={{ backgroundColor: theme.cardBackground }}
                      onClick={() => {
                        pushMobileScreen(`event-detail-${event.id}`);
                      }}
                    >
                      <div className="flex gap-3 p-3">
                        <img
                          src={event.image}
                          alt="Event"
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm mb-1" style={{ color: theme.textColor }}>
                            {event.name}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(event.startDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })} -{' '}
                              {new Date(event.endDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <Badge
                            className="text-xs"
                            style={{
                              backgroundColor: `${theme.primaryColor}20`,
                              color: theme.primaryColor,
                            }}
                          >
                            {event.reward}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );

          case 'buttons':
            return (
              <div key={section.id} className="px-4 py-3">
                <button
                  className="w-full py-4 rounded-xl text-white font-medium shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                  }}
                  onClick={() => setActiveBottomTab('redeem')}
                >
                  Claim Your Rewards
                </button>
              </div>
            );

          case 'cardContent':
            return (
              <div key={section.id} className="px-4 py-3 pb-6">
                <div
                  className="rounded-xl p-4 shadow-sm cursor-pointer"
                  style={{ backgroundColor: theme.cardBackground }}
                  onClick={() => pushMobileScreen('tier-detail')}
                >
                  <h4 className="font-medium mb-3" style={{ color: theme.textColor }}>
                    Your Loyalty Status
                  </h4>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5" style={{ color: theme.accentColor }} />
                      <span className="font-medium" style={{ color: theme.textColor }}>
                        {currentUserTier} Member
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Total Points</p>
                      <p className="font-medium text-lg" style={{ color: theme.primaryColor }}>
                        12,450
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${getTierProgress(currentUserTier)}%`,
                        background: `linear-gradient(90deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {getTierProgress(currentUserTier)}% to next tier
                  </p>
                </div>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );

  // Render Events Screen
  const renderEventsScreen = () => {
    const filteredEvents = getFilteredEvents();

    return (
      <div className="flex-1 flex flex-col overflow-hidden pb-20">
        {/* Search Bar */}
        <div className="p-4 border-b" style={{ backgroundColor: theme.cardBackground }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search events..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="px-4 py-3 border-b overflow-x-auto" style={{ backgroundColor: theme.cardBackground }}>
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'text-white shadow-md'
                    : 'bg-gray-100 text-gray-700'
                }`}
                style={{
                  backgroundColor: selectedCategory === cat ? theme.primaryColor : undefined,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Events List */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {filteredEvents.length > 0 ? (
            <div className="space-y-3">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl overflow-hidden shadow-sm cursor-pointer"
                  style={{ backgroundColor: theme.cardBackground }}
                  onClick={() => pushMobileScreen(`event-detail-${event.id}`)}
                >
                  <div className="relative">
                    <img src={event.image} alt={event.name} className="w-full h-40 object-cover" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(event.id);
                      }}
                      className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          favorites.includes(event.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                        }`}
                      />
                    </button>
                    <div className="absolute bottom-3 left-3">
                      <Badge
                        className="text-xs"
                        style={{
                          backgroundColor: `${theme.accentColor}`,
                          color: 'white',
                        }}
                      >
                        {event.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1" style={{ color: theme.textColor }}>
                      {event.name}
                    </h3>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(event.startDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })} -{' '}
                          {new Date(event.endDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{event.participants.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        style={{
                          borderColor: theme.primaryColor,
                          color: theme.primaryColor,
                        }}
                      >
                        {event.reward}
                      </Badge>
                      <span className="text-xs" style={{ color: theme.primaryColor }}>
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No events found</p>
              <p className="text-gray-400 text-sm">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render Event Detail Screen
  const renderEventDetailScreen = (eventId: string) => {
    const event = mockEvents.find(e => `event-detail-${e.id}` === eventId);
    if (!event) return null;

    return (
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="relative">
          <img src={event.image} alt={event.name} className="w-full h-64 object-cover" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(event.id);
            }}
            className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
          >
            <Heart
              className={`w-6 h-6 ${
                favorites.includes(event.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Badge style={{ backgroundColor: theme.accentColor, color: 'white' }}>
              {event.category}
            </Badge>
            <Badge
              variant="outline"
              style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
            >
              {event.reward}
            </Badge>
          </div>

          <h2 className="text-xl font-semibold mb-2" style={{ color: theme.textColor }}>
            {event.name}
          </h2>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(event.startDate).toLocaleDateString('en-GB')} -{' '}
                {new Date(event.endDate).toLocaleDateString('en-GB')}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{event.participants.toLocaleString()} joined</span>
            </div>
          </div>

          <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: `${theme.primaryColor}10` }}>
            <h3 className="font-medium mb-2" style={{ color: theme.textColor }}>
              Event Description
            </h3>
            <p className="text-sm text-gray-600">{event.fullDescription}</p>
          </div>

          <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: theme.cardBackground }}>
            <h3 className="font-medium mb-3" style={{ color: theme.textColor }}>
              Eligibility & Conditions
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Open to all active members</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Minimum purchase of $50 required</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Rewards will be credited within 3 business days</span>
              </li>
            </ul>
          </div>

          <button
            className="w-full py-4 rounded-xl text-white font-medium shadow-lg mb-3"
            style={{
              background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
            }}
          >
            Join Event Now
          </button>

          <button
            className="w-full py-4 rounded-xl font-medium border-2"
            style={{
              borderColor: theme.primaryColor,
              color: theme.primaryColor,
            }}
          >
            <Share2 className="w-4 h-4 inline mr-2" />
            Share with Friends
          </button>
        </div>
      </div>
    );
  };

  // Continue in next part...
  const renderRedeemScreen = () => (
    <div className="flex-1 overflow-y-auto pb-20">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4" style={{ color: theme.textColor }}>
          My Rewards
        </h2>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="redeemed">Redeemed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {mockRewards.map((reward) => (
              <div
                key={reward.id}
                className="rounded-xl overflow-hidden shadow-sm cursor-pointer"
                style={{ backgroundColor: theme.cardBackground }}
                onClick={() => pushMobileScreen(`reward-detail-${reward.id}`)}
              >
                <div className="flex gap-3 p-3">
                  <img
                    src={reward.image}
                    alt={reward.name}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm mb-1" style={{ color: theme.textColor }}>
                      {reward.name}
                    </h4>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        className={`text-xs ${
                          reward.status === 'delivered'
                            ? 'bg-green-100 text-green-700'
                            : reward.status === 'pending'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {reward.status.charAt(0).toUpperCase() + reward.status.slice(1)}
                      </Badge>
                      <span className="text-xs text-gray-500">{reward.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Coins className="w-4 h-4" style={{ color: theme.accentColor }} />
                        <span className="text-sm font-medium" style={{ color: theme.accentColor }}>
                          {reward.points.toLocaleString()} pts
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{reward.redeemedDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          {['pending', 'delivered', 'redeemed'].map((status) => (
            <TabsContent key={status} value={status} className="space-y-3">
              {mockRewards
                .filter((r) => r.status === status)
                .map((reward) => (
                  <div
                    key={reward.id}
                    className="rounded-xl overflow-hidden shadow-sm"
                    style={{ backgroundColor: theme.cardBackground }}
                  >
                    <div className="flex gap-3 p-3">
                      <img
                        src={reward.image}
                        alt={reward.name}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1" style={{ color: theme.textColor }}>
                          {reward.name}
                        </h4>
                        <p className="text-xs text-gray-500 mb-2">{reward.type}</p>
                        <div className="flex items-center gap-1">
                          <Coins className="w-4 h-4" style={{ color: theme.accentColor }} />
                          <span className="text-sm font-medium" style={{ color: theme.accentColor }}>
                            {reward.points.toLocaleString()} pts
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {mockRewards.filter((r) => r.status === status).length === 0 && (
                <div className="text-center py-12">
                  <Gift className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No {status} rewards</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );

  // Render Quick Scan Screen - will continue in next message due to length
  
  const renderScanScreen = () => (
    <div className="flex-1 flex flex-col pb-20">
      <Tabs value={scanTab} onValueChange={setScanTab} className="flex-1 flex flex-col">
        <div className="px-4 pt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scan">Scan QR</TabsTrigger>
            <TabsTrigger value="myqr">My QR</TabsTrigger>
            <TabsTrigger value="enter">Enter Code</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="scan" className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="w-64 h-64 border-4 rounded-2xl relative mx-auto mb-6" style={{ borderColor: theme.primaryColor }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="w-16 h-16" style={{ color: theme.primaryColor }} />
              </div>
              <motion.div
                className="absolute left-0 right-0 h-1"
                style={{ backgroundColor: theme.primaryColor }}
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            <p className="text-gray-900 mb-2">Position QR code within frame</p>
            <p className="text-sm text-gray-500">Scanning will start automatically</p>
          </div>
        </TabsContent>

        <TabsContent value="myqr" className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <div
              className="w-64 h-64 rounded-2xl mx-auto mb-6 flex items-center justify-center"
              style={{ backgroundColor: `${theme.primaryColor}10` }}
            >
              <QrCode className="w-32 h-32" style={{ color: theme.primaryColor }} />
            </div>
            <p className="text-gray-900 font-medium mb-1">Member ID: M12450</p>
            <p className="text-sm text-gray-500 mb-4">Show this QR code to earn points</p>
            
            <div
              className="h-16 rounded-xl mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: `${theme.primaryColor}10` }}
            >
              <div className="text-sm font-mono">||||| |||| ||||| |||| |||||</div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="enter" className="flex-1 p-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1" style={{ color: theme.textColor }}>
                Enter Promotion Codes
              </h3>
              <p className="text-sm text-gray-500 mb-4">You can enter up to 10 codes at once</p>
            </div>

            {codesToEnter.map((code, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Code ${index + 1}`}
                  value={code}
                  onChange={(e) => {
                    const newCodes = [...codesToEnter];
                    newCodes[index] = e.target.value;
                    setCodeToEnter(newCodes);
                  }}
                  className="flex-1"
                />
                {codesToEnter.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setCodeToEnter(codesToEnter.filter((_, i) => i !== index));
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}

            {codesToEnter.length < 10 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setCodeToEnter([...codesToEnter, ''])}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Code
              </Button>
            )}

            <Button
              className="w-full text-white"
              style={{
                background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
              }}
            >
              Submit Codes
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Profile screen rendering continues...
  const renderProfileScreen = () => (
    <div className="flex-1 overflow-y-auto pb-20">
      {/* Profile Header */}
      <div
        className="p-6 text-white"
        style={{
          background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
        }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl cursor-pointer"
            onClick={() => pushMobileScreen('edit-profile')}
          >
            👤
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-1">John Doe</h2>
            <p className="text-sm opacity-90">member@email.com</p>
            <p className="text-xs opacity-75">ID: M12450</p>
          </div>
          <button onClick={() => pushMobileScreen('edit-profile')}>
            <Edit className="w-5 h-5" />
          </button>
        </div>
        
        <div
          className="bg-white/10 backdrop-blur-sm rounded-xl p-3 cursor-pointer"
          onClick={() => pushMobileScreen('tier-detail')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <div>
                <p className="text-xs opacity-75">Current Tier</p>
                <p className="font-medium">{currentUserTier} Member</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Points Summary */}
      <div className="px-4 py-4 grid grid-cols-2 gap-3">
        <div
          className="rounded-xl p-4 shadow-sm cursor-pointer"
          style={{ backgroundColor: theme.cardBackground }}
          onClick={() => pushMobileScreen('point-history')}
        >
          <Coins className="w-6 h-6 mb-2" style={{ color: theme.accentColor }} />
          <p className="text-xs text-gray-500 mb-1">Total Points</p>
          <p className="text-xl font-semibold" style={{ color: theme.textColor }}>
            12,450
          </p>
          <p className="text-xs" style={{ color: theme.primaryColor }}>
            View History →
          </p>
        </div>
        <div
          className="rounded-xl p-4 shadow-sm cursor-pointer"
          style={{ backgroundColor: theme.cardBackground }}
          onClick={() => setActiveBottomTab('redeem')}
        >
          <Gift className="w-6 h-6 mb-2" style={{ color: theme.primaryColor }} />
          <p className="text-xs text-gray-500 mb-1">My Rewards</p>
          <p className="text-xl font-semibold" style={{ color: theme.textColor }}>
            8
          </p>
          <p className="text-xs" style={{ color: theme.primaryColor }}>
            View All →
          </p>
        </div>
      </div>

      {/* Activity Section */}
      <div className="px-4 py-2">
        <h3 className="font-medium mb-3" style={{ color: theme.textColor }}>
          Activity
        </h3>
        <div
          className="rounded-xl overflow-hidden shadow-sm divide-y"
          style={{ backgroundColor: theme.cardBackground, borderColor: theme.backgroundColor }}
        >
          {[
            { icon: History, label: 'Point History', screen: 'point-history', badge: null },
            { icon: Package, label: 'My Order Tracking', screen: 'order-tracking', badge: '3' },
            { icon: Tag, label: 'Coupon Wallet', screen: 'coupon-wallet', badge: '12' },
            { icon: MapPinned, label: 'My Addresses', screen: 'addresses', badge: null },
          ].map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              onClick={() => pushMobileScreen(item.screen)}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" style={{ color: theme.primaryColor }} />
                <span style={{ color: theme.textColor }}>{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <Badge className="bg-red-500 text-white">{item.badge}</Badge>
                )}
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Settings Section */}
      <div className="px-4 py-4">
        <h3 className="font-medium mb-3" style={{ color: theme.textColor }}>
          Settings
        </h3>
        <div
          className="rounded-xl overflow-hidden shadow-sm divide-y"
          style={{ backgroundColor: theme.cardBackground }}
        >
          {[
            { icon: User, label: 'Account Settings', screen: 'edit-profile' },
            { icon: Shield, label: 'Privacy & Security', screen: 'privacy' },
            { icon: Bell, label: 'Notifications', screen: 'notifications' },
            { icon: HelpCircle, label: 'Help & Support', screen: 'help' },
          ].map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
              onClick={() => pushMobileScreen(item.screen)}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" style={{ color: theme.primaryColor }} />
                <span style={{ color: theme.textColor }}>{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="px-4 py-4">
        <button
          className="w-full py-3 rounded-xl border-2 flex items-center justify-center gap-2 font-medium"
          style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );

  // Additional detail screens will be in the next part due to length constraints
  
  const renderScreen = () => {
    // Check if it's an event detail screen
    if (currentMobileScreen.startsWith('event-detail-')) {
      return renderEventDetailScreen(currentMobileScreen);
    }

    switch (currentMobileScreen) {
      case 'home':
        return renderHomeScreen();
      case 'events':
        return renderEventsScreen();
      case 'redeem':
        return renderRedeemScreen();
      case 'scan':
        return renderScanScreen();
      case 'profile':
        return renderProfileScreen();
      default:
        // Handle other screens with placeholder
        return (
          <div className="flex-1 flex items-center justify-center pb-20">
            <div className="text-center">
              <Smartphone className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{currentMobileScreen.replace('-', ' ')}</p>
              <p className="text-gray-400 text-sm">Screen content coming soon</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className="w-[390px] h-[844px] bg-white rounded-[40px] shadow-2xl overflow-hidden border-8 border-gray-900 relative flex flex-col"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Status Bar */}
      <div className="h-11 bg-gray-900 flex items-center justify-between px-8 text-white text-xs flex-shrink-0">
        <span>9:41</span>
        <div className="w-24 h-6 bg-gray-900 rounded-full" />
        <div className="flex items-center gap-1">
          <span>100%</span>
          <div className="w-6 h-3 border border-white rounded-sm" />
        </div>
      </div>

      {/* Top Navigation Bar (if not home) */}
      {mobileScreenStack.length > 1 && (
        <div
          className="h-14 flex items-center px-4 border-b flex-shrink-0"
          style={{
            borderColor: theme.backgroundColor,
            background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
          }}
        >
          <button onClick={popMobileScreen} className="p-2 -ml-2">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="flex-1 text-center font-medium text-white mr-8 capitalize">
            {currentMobileScreen.replace(/-/g, ' ').replace('event detail', 'Event')}
          </h1>
        </div>
      )}

      {/* Screen Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMobileScreen}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="flex-1 flex flex-col overflow-hidden"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Navigation */}
      <div
        className="h-20 border-t flex items-center justify-around px-2 flex-shrink-0"
        style={{
          borderColor: theme.backgroundColor,
          backgroundColor: theme.cardBackground,
        }}
      >
        {enabledBottomNav.map((item) => {
          const Icon = iconMap[item.icon] || Home;
          const isActive =
            (item.id === 'home' && mobileScreenStack.length === 1 && activeBottomTab === 'home') ||
            (item.id !== 'home' && activeBottomTab === item.id);

          return (
            <button
              key={item.id}
              className="flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-all"
              style={{
                backgroundColor: isActive ? `${theme.primaryColor}10` : 'transparent',
              }}
              onClick={() => {
                setActiveBottomTab(item.id);
                if (item.id === 'home') {
                  while (mobileScreenStack.length > 1) {
                    popMobileScreen();
                  }
                }
              }}
            >
              <Icon
                className="w-6 h-6"
                style={{
                  color: isActive ? theme.primaryColor : '#9CA3AF',
                }}
              />
              <span
                className="text-xs"
                style={{
                  color: isActive ? theme.primaryColor : '#9CA3AF',
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Home Indicator */}
      <div className="h-8 flex items-center justify-center flex-shrink-0">
        <div className="w-32 h-1 bg-gray-900 rounded-full" />
      </div>
    </div>
  );
}