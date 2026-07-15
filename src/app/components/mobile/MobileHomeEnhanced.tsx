import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, ChevronRight, Calendar, Package, Tag, 
  TrendingUp, Gift, Sparkles, Clock, ArrowRight,
  Coins, Users, ShoppingBag, Check, X, Zap, Crown,
  CalendarCheck, Target, Store, ExternalLink
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import MobileBottomNav, { MobileScreen } from './MobileBottomNav';
import { useAppContext } from './MobileAppContainerEnhanced';
import { toast } from 'sonner@2.0.3';

interface MobileHomeEnhancedProps {
  userData: any;
  onNavigate: (screen: MobileScreen, data?: any) => void;
}

const banners = [
  {
    id: 1,
    title: 'Summer Shopping Festival',
    subtitle: 'Up to 50% off on selected items',
    tag: 'Featured Event',
    tagColor: 'bg-green-500',
    gradient: 'from-orange-400 to-pink-500',
    cta: 'View Details'
  },
  {
    id: 2,
    title: 'New Member Bonus',
    subtitle: 'Get 1000 points when you join',
    tag: 'Featured Event',
    tagColor: 'bg-blue-500',
    gradient: 'from-blue-400 to-purple-500',
    cta: 'Join Now'
  },
  {
    id: 3,
    title: 'Flash Event',
    subtitle: 'Double points on all purchases',
    tag: 'Ends Soon',
    tagColor: 'bg-red-500',
    gradient: 'from-purple-400 to-pink-500',
    cta: 'Join Now'
  },
];

// Featured Event Banners for event detail linking
const eventBanners = [
  {
    id: 'event-1',
    title: 'Summer Fashion Show 2025',
    description: 'Join our exclusive fashion event',
    duration: '3 Days',
    participants: '2.4K',
    prize: '10,000 Points',
    image: 'https://images.unsplash.com/photo-1605289355680-75fb41239154?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc2hvdyUyMGV2ZW50fGVufDF8fHx8MTc2MjMzMjU4NHww&ixlib=rb-4.1.0&q=80&w=1080',
    gradient: 'from-pink-500 via-rose-500 to-orange-500'
  },
  {
    id: 'event-2',
    title: 'Tech Innovation Summit',
    description: 'Discover the latest in technology',
    duration: '2 Days',
    participants: '1.8K',
    prize: '5,000 Points',
    image: 'https://images.unsplash.com/photo-1761223976241-e9068813774b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwY29uZmVyZW5jZSUyMGlubm92YXRpb258ZW58MXx8fHwxNzYyMzMyNTg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    gradient: 'from-blue-500 via-cyan-500 to-teal-500'
  },
  {
    id: 'event-3',
    title: 'Wellness & Fitness Challenge',
    description: 'Get fit and win amazing prizes',
    duration: '7 Days',
    participants: '3.1K',
    prize: '15,000 Points',
    image: 'https://images.unsplash.com/photo-1546817372-628669db4655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwd2VsbG5lc3MlMjBneW18ZW58MXx8fHwxNzYyMzMyNTg1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    gradient: 'from-green-500 via-emerald-500 to-teal-500'
  },
];

const quickActions = [
  // Row 1
  { id: 'campaign', icon: Calendar, label: 'Campaign', color: 'from-blue-500 to-blue-600' },
  { id: 'order-tracking', icon: Package, label: 'Tracking', color: 'from-green-500 to-green-600' },
  { id: 'missions', icon: Target, label: 'Mission', color: 'from-indigo-500 to-indigo-600' },
  // Row 2
  { id: 'shopee', icon: ExternalLink, label: 'Shopee', color: 'from-orange-500 to-orange-600', external: true, url: 'https://shopee.co.th/demo-store' },
  { id: 'lazada', icon: ExternalLink, label: 'Lazada', color: 'from-blue-400 to-blue-500', external: true, url: 'https://www.lazada.co.th/demo-store' },
  { id: 'shop', icon: Store, label: 'Shop', color: 'from-purple-500 to-purple-600' },
];

const earnPointsOptions = [
  {
    id: 'daily-checkin',
    title: 'Daily Check-in',
    description: 'Log in every day',
    icon: '📅',
    points: 10,
    color: '#2E5BFF',
    bgColor: '#2E5BFF15',
    available: true,
  },
  {
    id: 'invite-friend',
    title: 'Invite a Friend',
    description: 'Share your referral code',
    icon: '👥',
    points: 100,
    color: '#16C47F',
    bgColor: '#16C47F15',
    available: true,
  },
  {
    id: 'partner-store',
    title: 'Buy at Partner Store',
    description: 'Make a purchase',
    icon: '🛍️',
    points: 200,
    color: '#FFB800',
    bgColor: '#FFB80015',
    available: true,
  },
  {
    id: 'social-share',
    title: 'Share on Social',
    description: 'Post about us',
    icon: '📱',
    points: 25,
    color: '#E63946',
    bgColor: '#E6394615',
    available: true,
  },
];

const redeemRewards = [
  {
    id: 'coffee-voucher',
    title: 'Coffee Voucher',
    description: 'Premium coffee set',
    image: 'https://images.unsplash.com/photo-1686266339981-83a4b2855001?w=400',
    points: 500,
    discount: '30% OFF',
    tier: 'Gold',
  },
  {
    id: 'wellness-package',
    title: 'Wellness Package',
    description: 'Spa & massage package',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400',
    points: 800,
    discount: '25% OFF',
    tier: 'Gold',
  },
  {
    id: 'tech-gadget',
    title: 'Wireless Headphones',
    description: 'Premium audio quality',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    points: 1200,
    discount: '40% OFF',
    tier: 'Platinum',
  },
  {
    id: 'restaurant-voucher',
    title: 'Restaurant Voucher',
    description: 'Fine dining experience',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    points: 600,
    discount: 'FREE',
    tier: 'Gold',
  },
];

export default function MobileHomeEnhanced({ userData, onNavigate }: MobileHomeEnhancedProps) {
  const { theme, unreadCount } = useAppContext();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [currentPoints, setCurrentPoints] = useState(userData?.points || 1650);
  const [showEarnModal, setShowEarnModal] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedEarnOption, setSelectedEarnOption] = useState<any>(null);
  const [selectedReward, setSelectedReward] = useState<any>(null);

  // Auto-slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleEarnPoints = (option: any) => {
    setSelectedEarnOption(option);
    setShowEarnModal(true);
  };

  const confirmEarnPoints = () => {
    if (selectedEarnOption) {
      setCurrentPoints(prev => prev + selectedEarnOption.points);
      setShowEarnModal(false);
      
      // Show success animation
      toast.success(`🎉 You earned +${selectedEarnOption.points} points!`, {
        duration: 3000,
      });

      setTimeout(() => {
        setSelectedEarnOption(null);
      }, 300);
    }
  };

  const handleRedeemReward = (reward: any) => {
    setSelectedReward(reward);
    setShowRedeemModal(true);
  };

  const confirmRedeemReward = () => {
    if (selectedReward) {
      if (currentPoints >= selectedReward.points) {
        setCurrentPoints(prev => prev - selectedReward.points);
        setShowRedeemModal(false);
        
        toast.success(`🎉 Reward redeemed successfully!`, {
          duration: 3000,
        });

        setTimeout(() => {
          onNavigate('coupon-wallet');
        }, 1500);
      } else {
        toast.error('Not enough points to redeem this reward!');
        setShowRedeemModal(false);
      }
      setSelectedReward(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div 
        className="text-white px-6 pt-6 pb-4"
        style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white text-2xl mb-1">Hi, {userData?.name || 'Broccoli'} 👋</h2>
            <p className="text-white/80 text-sm">Let's see what's new today!</p>
          </div>
          <button
            onClick={() => onNavigate('notification-center')}
            className="relative w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Points Summary */}
        <motion.div
          key={currentPoints}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">Your Points</p>
              <div className="flex items-center gap-2">
                <Coins className="w-6 h-6 text-yellow-300" />
                <span className="text-3xl text-white">{currentPoints.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('point-history')}
              className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors text-white text-sm flex items-center gap-1"
            >
              Details
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Banner Carousel */}
        <div className="px-4 py-4">
          <div className="relative h-36 rounded-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBannerIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className={`absolute inset-0 bg-gradient-to-r ${banners[currentBannerIndex].gradient} p-6 flex flex-col justify-between`}
              >
                <div>
                  <Badge className={`${banners[currentBannerIndex].tagColor} text-white border-0 mb-2`}>
                    {banners[currentBannerIndex].tag}
                  </Badge>
                  <h3 className="text-white text-xl mb-1">{banners[currentBannerIndex].title}</h3>
                  <p className="text-white/90 text-sm">{banners[currentBannerIndex].subtitle}</p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onNavigate('events')}
                  className="self-start"
                >
                  {banners[currentBannerIndex].cta}
                </Button>
              </motion.div>
            </AnimatePresence>

            {/* Carousel Indicators */}
            <div className="absolute bottom-4 right-4 flex gap-1">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentBannerIndex ? 'bg-white w-6' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="px-4 mb-6" style={{ padding: '12px 16px' }}>
          <h3 
            className="text-gray-900 mb-2" 
            style={{ fontSize: '15px', fontWeight: '600' }}
          >
            Quick Actions
          </h3>
          <div 
            className="grid grid-cols-3 gap-x-8 gap-y-4"
            style={{ 
              gap: 'auto',
              display: 'grid',
              justifyContent: 'space-between'
            }}
          >
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.id}
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  onClick={() => {
                    if (action.external) {
                      window.open(action.url, '_blank');
                    } else {
                      onNavigate(action.id as MobileScreen);
                    }
                  }}
                  className="flex flex-col items-center justify-center rounded-2xl"
                  style={{
                    width: '80px',
                    height: '80px',
                    padding: '8px',
                    backgroundColor: 'var(--surface-color)',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                    borderRadius: '16px'
                  }}
                >
                  <Icon 
                    className="mb-1.5"
                    style={{ 
                      width: '20px', 
                      height: '20px',
                      color: 'var(--primary-color)',
                      strokeWidth: 2
                    }} 
                  />
                  <span 
                    className="text-center leading-tight"
                    style={{ 
                      fontSize: '11px',
                      fontWeight: '500',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {action.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Featured Event Banners */}
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900">Event</h3>
            <button
              onClick={() => onNavigate('events')}
              className="text-sm flex items-center gap-1"
              style={{ color: theme.primary }}
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {eventBanners.map((event, index) => (
              <motion.button
                key={event.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onNavigate('event-detail', event)}
                className="flex-shrink-0 w-72 rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow text-left"
              >
                <div className="relative h-40">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${event.gradient} opacity-60`} />
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <h4 className="text-white text-lg mb-1">{event.title}</h4>
                    <p className="text-white/90 text-sm">{event.description}</p>
                  </div>
                </div>
                <div className="p-3 bg-white">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{event.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{event.participants}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Crown className="w-3.5 h-3.5 text-yellow-500" />
                      <span className="text-yellow-600">{event.prize}</span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>


        
           
        
          
      



        {/* Earn Point Section */}
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900">Earn Point</h3>
            <button
              onClick={() => onNavigate('missions')}
              className="text-sm flex items-center gap-1"
              style={{ color: theme.primary }}
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>


          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {earnPointsOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-44"
              >
                <Card
                  className="p-4 cursor-pointer hover:shadow-lg transition-all h-full"
                  onClick={() => handleEarnPoints(option)}
                  style={{ borderColor: option.color, borderWidth: 2 }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 text-2xl"
                    style={{ backgroundColor: option.bgColor }}
                  >
                    {option.icon}
                  </div>
                  <h4 className="text-sm text-gray-900 mb-1">{option.title}</h4>
                  <p className="text-xs text-gray-500 mb-3">{option.description}</p>
                  <div className="flex items-center gap-1" style={{ color: option.color }}>
                    <Zap className="w-4 h-4" />
                    <span className="text-sm">+{option.points} pts</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Redeem Points Section */}
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900">Recommend for You</h3>
            <button
              onClick={() => onNavigate('rewards')}
              className="text-sm flex items-center gap-1"
              style={{ color: theme.primary }}
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {redeemRewards.slice(0, 4).map((reward, index) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="p-0 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleRedeemReward(reward)}
                >
                  <div className="relative">
                    <img src={reward.image} alt={reward.title} className="w-full h-32 object-cover" />
                    <Badge
                      className="absolute top-2 left-2 text-xs px-2 py-0.5"
                      style={{ backgroundColor: '#E63946', color: 'white', border: 'none' }}
                    >
                      {reward.discount}
                    </Badge>
                    {reward.tier === 'Platinum' && (
                      <Badge
                        className="absolute top-2 right-2 text-xs px-2 py-0.5"
                        style={{ backgroundColor: '#FFD700', color: '#1A1A1A', border: 'none' }}
                      >
                        <Crown className="w-3 h-3" />
                      </Badge>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm text-gray-900 mb-1 line-clamp-1">{reward.title}</h4>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-1">{reward.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm" style={{ color: '#2E5BFF' }}>
                        <Coins className="w-4 h-4" />
                        <span>{reward.points}</span>
                      </div>
                      <Button
                        size="sm"
                        className="h-7 text-xs"
                        style={{ backgroundColor: '#2E5BFF' }}
                      >
                        Redeem
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Earn Points Modal */}
      <AnimatePresence>
        {showEarnModal && selectedEarnOption && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEarnModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4"
                  style={{ backgroundColor: selectedEarnOption.bgColor }}
                >
                  {selectedEarnOption.icon}
                </div>
                <h3 className="text-xl text-gray-900 mb-2">{selectedEarnOption.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{selectedEarnOption.description}</p>
                <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 text-2xl" style={{ color: selectedEarnOption.color }}>
                    <Zap className="w-6 h-6" />
                    <span>+{selectedEarnOption.points} Points</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowEarnModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    style={{ backgroundColor: selectedEarnOption.color }}
                    onClick={confirmEarnPoints}
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Redeem Reward Modal */}
      <AnimatePresence>
        {showRedeemModal && selectedReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowRedeemModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl overflow-hidden max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selectedReward.image} alt={selectedReward.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl text-gray-900 mb-2">{selectedReward.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{selectedReward.description}</p>
                <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Points Required</span>
                    <div className="flex items-center gap-1 text-lg" style={{ color: '#2E5BFF' }}>
                      <Coins className="w-5 h-5" />
                      <span>{selectedReward.points}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Your Points</span>
                    <span className="text-lg text-gray-900">{currentPoints.toLocaleString()}</span>
                  </div>
                </div>
                {currentPoints < selectedReward.points && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                    <p className="text-xs text-red-600">
                      You need {selectedReward.points - currentPoints} more points to redeem this reward
                    </p>
                  </div>
                )}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowRedeemModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    style={{ backgroundColor: '#2E5BFF' }}
                    onClick={confirmRedeemReward}
                    disabled={currentPoints < selectedReward.points}
                  >
                    Redeem
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <MobileBottomNav
        currentScreen="home"
        onNavigate={onNavigate}
        primaryColor={theme.primary}
      />
    </div>
  );
}