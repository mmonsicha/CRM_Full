import { ArrowLeft, Coins, TrendingUp, Gift, Users, ShoppingBag, ChevronRight, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import MobileBottomNav, { MobileScreen } from './MobileBottomNav';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner@2.0.3';

interface MobileMyPointsProps {
  onNavigate: (screen: MobileScreen, data?: any) => void;
  userData?: any;
}

interface TierConfig {
  name: string;
  min: number;
  max: number;
  color: string;
  gradient: string;
  icon: string;
  bonus: number;
}

const tiers: TierConfig[] = [
  { name: 'Bronze', min: 0, max: 499, color: '#CD7F32', gradient: 'from-[#D89B5C] to-[#CD7F32]', icon: '🥉', bonus: 0 },
  { name: 'Silver', min: 500, max: 999, color: '#C0C0C0', gradient: 'from-[#D7D7D7] to-[#C0C0C0]', icon: '🥈', bonus: 5 },
  { name: 'Gold', min: 1000, max: 2499, color: '#FFD700', gradient: 'from-[#FFE45C] to-[#FFD700]', icon: '🥇', bonus: 10 },
  { name: 'Platinum', min: 2500, max: 999999, color: '#E5E4E2', gradient: 'from-[#E8E8E8] to-[#C4C4C4]', icon: '💎', bonus: 20 },
];

export default function MobileMyPoints({ onNavigate, userData }: MobileMyPointsProps) {
  const [currentPoints, setCurrentPoints] = useState(userData?.points || 1650);
  const [lifetimePoints, setLifetimePoints] = useState(userData?.lifetimePoints || 1650);
  const [showEarnModal, setShowEarnModal] = useState(false);
  const [showExpiryAlert, setShowExpiryAlert] = useState(false);
  const [expiringPoints, setExpiringPoints] = useState(320);

  // Calculate current tier
  const getCurrentTier = (points: number) => {
    return tiers.find(tier => points >= tier.min && points <= tier.max) || tiers[0];
  };

  const getNextTier = (currentTier: TierConfig) => {
    const currentIndex = tiers.findIndex(t => t.name === currentTier.name);
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
  };

  const currentTier = getCurrentTier(lifetimePoints);
  const nextTier = getNextTier(currentTier);
  const tierProgress = nextTier 
    ? ((lifetimePoints - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100;

  // Simulate point expiry after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowExpiryAlert(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleExpirePoints = () => {
    setCurrentPoints(prev => prev - expiringPoints);
    setShowExpiryAlert(false);
    toast.error(`${expiringPoints} points have expired due to inactivity`);
  };

  const earnWays = [
    {
      id: 'events',
      title: 'Join Events',
      description: 'Earn up to 100 points per event',
      icon: Sparkles,
      points: '+50-100',
      color: '#2E5BFF',
      bgColor: '#2E5BFF15',
      action: () => onNavigate('events'),
    },
    {
      id: 'purchase',
      title: 'Make Purchases',
      description: '1 point per ฿10 spent',
      icon: ShoppingBag,
      points: '+Variable',
      color: '#16C47F',
      bgColor: '#16C47F15',
      action: () => onNavigate('promotions'),
    },
    {
      id: 'invite',
      title: 'Invite Friends',
      description: 'Get bonus points for referrals',
      icon: Users,
      points: '+200',
      color: '#FFB800',
      bgColor: '#FFB80015',
      action: () => {
        setShowEarnModal(true);
        setTimeout(() => {
          setCurrentPoints(prev => prev + 200);
          setLifetimePoints(prev => prev + 200);
          toast.success('🎉 You earned +200 points!');
          setShowEarnModal(false);
        }, 2000);
      },
    },
  ];

  const redeemOptions = [
    {
      id: '1',
      title: 'Coffee Voucher',
      points: 200,
      image: 'https://images.unsplash.com/photo-1686266339981-83a4b2855001?w=400',
      discount: '50% OFF',
    },
    {
      id: '2',
      title: 'Free Dessert',
      points: 150,
      image: 'https://images.unsplash.com/photo-1674620213535-9b2a2553ef40?w=400',
      discount: 'FREE',
    },
    {
      id: '3',
      title: 'Shopping Voucher',
      points: 500,
      image: 'https://images.unsplash.com/photo-1644370644949-b175294cbceb?w=400',
      discount: '฿100',
    },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ backgroundColor: '#F8FAFD' }}>
      {/* Header */}
      <div
        className="text-white px-6 py-6"
        style={{ background: 'linear-gradient(135deg, #2E5BFF, #5B7FFF)' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-white text-xl flex-1">My Points</h2>
        </div>

        {/* Points Summary Card */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm mb-1">Total Points</p>
              <motion.div
                key={currentPoints}
                initial={{ scale: 1.2, color: '#FFB800' }}
                animate={{ scale: 1, color: '#FFFFFF' }}
                className="flex items-center gap-2"
              >
                <Coins className="w-8 h-8 text-yellow-300" />
                <span className="text-4xl">{currentPoints.toLocaleString()}</span>
              </motion.div>
            </div>
            <div className="text-right">
              <Badge
                className="px-3 py-1.5 mb-2"
                style={{
                  background: `linear-gradient(135deg, ${currentTier.gradient.split(' ').join(', ')})`,
                  border: 'none',
                  color: '#1A1A1A',
                }}
              >
                {currentTier.icon} {currentTier.name}
              </Badge>
              <p className="text-white/80 text-xs">+{currentTier.bonus}% Bonus</p>
            </div>
          </div>

          {/* Tier Progress */}
          {nextTier && (
            <div>
              <div className="flex items-center justify-between text-xs text-white/80 mb-2">
                <span>Progress to {nextTier.name}</span>
                <span>{lifetimePoints} / {nextTier.min} pts</span>
              </div>
              <Progress value={tierProgress} className="h-2 bg-white/20" />
              <button
                onClick={() => onNavigate('tier-details' as MobileScreen)}
                className="w-full mt-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors text-white text-sm"
              >
                View Tier Details
              </button>
            </div>
          )}
        </Card>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20 p-4">
        {/* Expiry Alert */}
        <AnimatePresence>
          {showExpiryAlert && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4"
            >
              <Card className="p-4 border-2" style={{ borderColor: '#E63946', backgroundColor: '#E6394615' }}>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#E63946' }} />
                  <div className="flex-1">
                    <h4 className="text-sm mb-1" style={{ color: '#E63946' }}>
                      ⚠️ Points Expiring Soon!
                    </h4>
                    <p className="text-xs text-gray-600 mb-3">
                      You have {expiringPoints} points expiring on Nov 30, 2025
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="h-8"
                        style={{ backgroundColor: '#E63946' }}
                        onClick={handleExpirePoints}
                      >
                        Simulate Expire
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8"
                        onClick={() => onNavigate('my-rewards' as MobileScreen)}
                      >
                        Use Now
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Earn Points Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900">Earn Points</h3>
            <button
              onClick={() => onNavigate('points-history' as MobileScreen)}
              className="flex items-center gap-1 text-sm"
              style={{ color: '#2E5BFF' }}
            >
              View History
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-3">Ways to earn more points</p>
          <div className="space-y-3">
            {earnWays.map((way, index) => {
              const Icon = way.icon;
              return (
                <motion.div
                  key={way.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={way.action}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: way.bgColor }}
                      >
                        <Icon className="w-6 h-6" style={{ color: way.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm text-gray-900 mb-0.5">{way.title}</h4>
                        <p className="text-xs text-gray-500">{way.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm mb-1" style={{ color: way.color }}>
                          {way.points}
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Redeem Points Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900">Redeem Points</h3>
            <button
              onClick={() => onNavigate('my-rewards' as MobileScreen)}
              className="flex items-center gap-1 text-sm"
              style={{ color: '#2E5BFF' }}
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-3">Redeem your points for rewards</p>
          <div className="grid grid-cols-3 gap-3">
            {redeemOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="p-0 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => {
                    if (currentPoints >= option.points) {
                      setCurrentPoints(prev => prev - option.points);
                      toast.success(`🎉 Redeemed ${option.title} for ${option.points} points!`);
                      setTimeout(() => {
                        onNavigate('coupon-wallet' as MobileScreen);
                      }, 1500);
                    } else {
                      toast.error('Not enough points!');
                    }
                  }}
                >
                  <div className="relative">
                    <img src={option.image} alt={option.title} className="w-full h-20 object-cover" />
                    <Badge
                      className="absolute top-1 left-1 text-xs px-1.5 py-0.5"
                      style={{ backgroundColor: '#E63946', color: 'white', border: 'none' }}
                    >
                      {option.discount}
                    </Badge>
                  </div>
                  <div className="p-2">
                    <h5 className="text-xs text-gray-900 mb-1 line-clamp-1">{option.title}</h5>
                    <div className="flex items-center gap-1 text-xs" style={{ color: '#2E5BFF' }}>
                      <Coins className="w-3 h-3" />
                      <span>{option.points}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4" style={{ color: '#16C47F' }} />
              <span className="text-xs text-gray-600">Lifetime Earned</span>
            </div>
            <div className="text-2xl text-gray-900">{lifetimePoints.toLocaleString()}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-4 h-4" style={{ color: '#FFB800' }} />
              <span className="text-xs text-gray-600">Rewards Claimed</span>
            </div>
            <div className="text-2xl text-gray-900">12</div>
          </Card>
        </div>
      </div>

      {/* Earn Points Animation Modal */}
      <AnimatePresence>
        {showEarnModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5, rotate: 10 }}
              className="bg-white rounded-3xl p-8 text-center max-w-sm mx-4"
            >
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#FFB80015' }}
              >
                <Coins className="w-12 h-12" style={{ color: '#FFB800' }} />
              </motion.div>
              <h3 className="text-xl text-gray-900 mb-2">Earning Points...</h3>
              <p className="text-sm text-gray-600">Processing your referral bonus</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <MobileBottomNav
        currentScreen="profile"
        onNavigate={onNavigate}
        primaryColor="#2E5BFF"
      />
    </div>
  );
}
