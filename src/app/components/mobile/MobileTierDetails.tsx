import { ArrowLeft, Award, Gift, Truck, Headphones, Star, Zap, Check, Crown } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import MobileBottomNav, { MobileScreen } from './MobileBottomNav';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface MobileTierDetailsProps {
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
  benefits: string[];
}

const tiers: TierConfig[] = [
  {
    name: 'Bronze',
    min: 0,
    max: 499,
    color: '#CD7F32',
    gradient: 'from-[#D89B5C] to-[#CD7F32]',
    icon: '🥉',
    bonus: 0,
    benefits: [
      'Basic access to events and points',
      'Standard customer support',
      'Monthly newsletter',
    ],
  },
  {
    name: 'Silver',
    min: 500,
    max: 999,
    color: '#C0C0C0',
    gradient: 'from-[#D7D7D7] to-[#C0C0C0]',
    icon: '🥈',
    bonus: 5,
    benefits: [
      '+5% point bonus on all activities',
      'Birthday reward voucher',
      'Priority event registration',
      'Extended point expiry (12 months)',
    ],
  },
  {
    name: 'Gold',
    min: 1000,
    max: 2499,
    color: '#FFD700',
    gradient: 'from-[#FFE45C] to-[#FFD700]',
    icon: '🥇',
    bonus: 10,
    benefits: [
      '+10% point bonus on all activities',
      'Free shipping on reward redemption',
      'Exclusive Gold-tier events',
      'Priority customer support',
      'Quarterly bonus rewards',
    ],
  },
  {
    name: 'Platinum',
    min: 2500,
    max: 999999,
    color: '#E5E4E2',
    gradient: 'from-[#E8E8E8] to-[#C4C4C4]',
    icon: '💎',
    bonus: 20,
    benefits: [
      '+20% point bonus on all activities',
      'VIP concierge support 24/7',
      'Early access to all new rewards',
      'Exclusive Platinum events and experiences',
      'Personal account manager',
      'Annual luxury gift package',
    ],
  },
];

export default function MobileTierDetails({ onNavigate, userData }: MobileTierDetailsProps) {
  const [showComparison, setShowComparison] = useState(false);
  const [selectedTier, setSelectedTier] = useState<TierConfig | null>(null);

  const lifetimePoints = userData?.lifetimePoints || 1250;

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
  const pointsToNext = nextTier ? nextTier.min - lifetimePoints : 0;

  const benefitIcons = [Gift, Truck, Headphones, Star, Zap, Crown];

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ backgroundColor: '#F8FAFD' }}>
      {/* Header */}
      <div
        className="text-white px-6 py-6"
        style={{ background: 'linear-gradient(135deg, #2E5BFF, #5B7FFF)' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('profile' as MobileScreen)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h2 className="text-white text-xl mb-0.5">Tier Details</h2>
            <p className="text-white/80 text-sm">Track your level and exclusive benefits</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20 p-4">
        {/* Current Tier Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card
            className="overflow-hidden p-6 relative"
            style={{
              background: `linear-gradient(135deg, ${currentTier.gradient.split(' ').join(', ')})`,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />

            <div className="relative z-10">
              {/* Tier Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="text-5xl"
                  >
                    {currentTier.icon}
                  </motion.div>
                  <div>
                    <h3 className="text-2xl text-gray-900 mb-1">{currentTier.name} Member</h3>
                    <p className="text-sm text-gray-700">
                      {currentTier.min.toLocaleString()} - {currentTier.max.toLocaleString()} points
                    </p>
                  </div>
                </div>
                <Badge
                  className="px-3 py-1.5 text-sm"
                  style={{ backgroundColor: '#FFFFFF', color: currentTier.color, border: 'none' }}
                >
                  +{currentTier.bonus}%
                </Badge>
              </div>

              {/* Progress Ring */}
              {nextTier && (
                <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-900">Progress to {nextTier.name}</span>
                    <span className="text-sm text-gray-900">
                      {lifetimePoints.toLocaleString()} / {nextTier.min.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={tierProgress} className="h-3 bg-white/40" />
                  <p className="text-xs text-gray-700 mt-2">
                    You need <span className="font-semibold">{pointsToNext.toLocaleString()} more points</span> to reach {nextTier.name} tier
                  </p>
                </div>
              )}

              {/* Current Tier Lifetime Points */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-800">Total Lifetime Points</span>
                  <div className="flex items-center gap-1 text-lg text-gray-900">
                    <Award className="w-5 h-5" />
                    <span>{lifetimePoints.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Exclusive Benefits */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900">Your Exclusive Benefits</h3>
            <Badge
              variant="outline"
              style={{ borderColor: currentTier.color, color: currentTier.color }}
            >
              {currentTier.name}
            </Badge>
          </div>
          <div className="space-y-3">
            {currentTier.benefits.map((benefit, index) => {
              const Icon = benefitIcons[index % benefitIcons.length];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${currentTier.color}15` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: currentTier.color }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{benefit}</p>
                      </div>
                      <Check className="w-5 h-5 flex-shrink-0" style={{ color: '#16C47F' }} />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Tier Comparison Toggle */}
        <Button
          variant="outline"
          className="w-full h-12 mb-4"
          onClick={() => setShowComparison(!showComparison)}
        >
          {showComparison ? 'Hide' : 'Show'} Tier Comparison
        </Button>

        {/* Tier Comparison Section */}
        <AnimatePresence>
          {showComparison && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <h3 className="text-gray-900 mb-3">All Tiers</h3>
              <div className="space-y-3">
                {tiers.map((tier, index) => (
                  <motion.div
                    key={tier.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`p-4 cursor-pointer transition-all ${
                        tier.name === currentTier.name ? 'ring-2' : ''
                      }`}
                      style={{
                        borderColor: tier.name === currentTier.name ? tier.color : 'transparent',
                        boxShadow: tier.name === currentTier.name ? '0 4px 16px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.06)',
                      }}
                      onClick={() => setSelectedTier(tier)}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                          style={{ background: `linear-gradient(135deg, ${tier.gradient.split(' ').join(', ')})` }}
                        >
                          {tier.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm text-gray-900">{tier.name} Tier</h4>
                            {tier.name === currentTier.name && (
                              <Badge
                                className="text-xs px-2 py-0.5"
                                style={{ backgroundColor: `${tier.color}15`, color: tier.color, border: 'none' }}
                              >
                                Current
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">
                            {tier.min.toLocaleString()} - {tier.max === 999999 ? '∞' : tier.max.toLocaleString()} points
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm mb-0.5" style={{ color: tier.color }}>
                            +{tier.bonus}%
                          </div>
                          <div className="text-xs text-gray-500">Bonus</div>
                        </div>
                      </div>
                      
                      {/* Benefits Summary */}
                      <div className="text-xs text-gray-600">
                        {tier.benefits.length} exclusive benefits
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* How to Earn More Points */}
        <Card className="p-4" style={{ backgroundColor: '#2E5BFF15', border: 'none' }}>
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#2E5BFF' }}
            >
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm mb-1" style={{ color: '#2E5BFF' }}>
                Level Up Faster
              </h4>
              <p className="text-xs text-gray-600 mb-3">
                Join more events, make purchases, and refer friends to earn points and reach the next tier faster!
              </p>
              <Button
                size="sm"
                className="h-8"
                style={{ backgroundColor: '#2E5BFF' }}
                onClick={() => onNavigate('point-history' as MobileScreen)}
              >
                View Ways to Earn
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Tier Detail Modal */}
      <AnimatePresence>
        {selectedTier && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-end z-50"
            onClick={() => setSelectedTier(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-t-3xl w-full max-h-[80%] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                      style={{ background: `linear-gradient(135deg, ${selectedTier.gradient.split(' ').join(', ')})` }}
                    >
                      {selectedTier.icon}
                    </div>
                    <div>
                      <h3 className="text-xl text-gray-900 mb-1">{selectedTier.name} Tier</h3>
                      <p className="text-sm text-gray-600">
                        {selectedTier.min.toLocaleString()} - {selectedTier.max === 999999 ? '∞' : selectedTier.max.toLocaleString()} points
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTier(null)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>

                {/* Benefits */}
                <div className="mb-4">
                  <h4 className="text-sm text-gray-700 mb-3">Tier Benefits:</h4>
                  <div className="space-y-2">
                    {selectedTier.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#16C47F' }} />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bonus Info */}
                <Card className="p-3" style={{ backgroundColor: `${selectedTier.color}15` }}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Point Bonus</span>
                    <span className="text-lg" style={{ color: selectedTier.color }}>
                      +{selectedTier.bonus}%
                    </span>
                  </div>
                </Card>
              </div>
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
