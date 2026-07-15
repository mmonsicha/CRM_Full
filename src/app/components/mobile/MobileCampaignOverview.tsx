import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Calendar, Users, Gift, Sparkles, Tag, Crown,
  Clock, TrendingUp, Target, ChevronRight, Coins, Zap
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import MobileBottomNav, { MobileScreen } from './MobileBottomNav';
import { toast } from 'sonner@2.0.3';
import MobileEvents from './MobileEvents';

interface MobileCampaignOverviewProps {
  onNavigate: (screen: MobileScreen, data?: any) => void;
  onBack: () => void;
}

type TabType = 'events' | 'gamification' | 'promotions';

// Mock Data - Gamification
const gamificationData = [
  {
    id: 'game-1',
    title: 'Lucky Spin Challenge',
    description: 'Spin the wheel daily and win instant rewards',
    type: 'Lucky Wheel',
    icon: '🎡',
    color: '#FF6B6B',
    bgColor: '#FFE5E5',
    reward: 'Up to 1,000 Points',
    spinsLeft: 3,
    available: true,
  },
  {
    id: 'game-2',
    title: 'Daily Quest Mission',
    description: 'Complete daily tasks and earn bonus points',
    type: 'Mission',
    icon: '🎯',
    color: '#4ECDC4',
    bgColor: '#E3F9F7',
    reward: '500 Points Daily',
    tasksCompleted: '4/10',
    available: true,
  },
  {
    id: 'game-3',
    title: 'Streak Bonus Reward',
    description: 'Login 7 days in a row for mega rewards',
    type: 'Streak',
    icon: '🔥',
    color: '#FFB84D',
    bgColor: '#FFF4E5',
    reward: '2,000 Points',
    currentStreak: 4,
    available: true,
  },
  {
    id: 'game-4',
    title: 'Scratch & Win',
    description: 'Scratch cards for instant surprise rewards',
    type: 'Scratch Card',
    icon: '🎫',
    color: '#A78BFA',
    bgColor: '#F3F0FF',
    reward: 'Mystery Prize',
    cardsLeft: 2,
    available: true,
  },
];

// Mock Data - Promotions
const promotionsData = [
  {
    id: 'promo-1',
    title: 'Flash Sale - 50% OFF',
    description: 'Limited time offer on selected items',
    discount: '50% OFF',
    validUntil: '2025-11-15',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    code: 'FLASH50',
    type: 'Flash Sale',
    status: 'Active',
  },
  {
    id: 'promo-2',
    title: 'Triple Points Weekend',
    description: 'Earn 3x points on all purchases this weekend',
    discount: '3x Points',
    validUntil: '2025-11-10',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    code: 'TRIPLE3X',
    type: 'Points Boost',
    status: 'Active',
  },
  {
    id: 'promo-3',
    title: 'New Member Exclusive',
    description: 'Special welcome bonus for new members',
    discount: '1,000 Points',
    validUntil: '2025-12-31',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    code: 'WELCOME1K',
    type: 'Welcome Bonus',
    status: 'Active',
  },
];

export default function MobileCampaignOverview({ onNavigate, onBack }: MobileCampaignOverviewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('events');

  const handleEventClick = (event: any) => {
    toast.success('Opening event details...');
    onNavigate('event-detail', event);
  };

  const handleGamificationClick = (game: any) => {
    if (game.type === 'Lucky Wheel') {
      toast.success('Opening Lucky Spin...');
      onNavigate('gamification', { type: 'spin' });
    } else if (game.type === 'Mission') {
      toast.success('Opening Mission Center...');
      onNavigate('missions');
    } else {
      toast.info(`${game.title} - Coming Soon!`);
    }
  };

  const handlePromotionClick = (promo: any) => {
    toast.success(`Promotion code: ${promo.code} copied!`, {
      description: 'Use this code at checkout',
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header - Hide when showing Events Tab (uses Events' own header) */}
      {activeTab !== 'events' && (
        <div className="bg-gradient-to-r from-[#007AFF] to-[#0051D5] text-white px-4 pt-12 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-white text-2xl">Campaign Center</h1>
              <p className="text-white/80 text-sm mt-0.5">Explore events, games & promotions</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 bg-white/10 backdrop-blur-sm rounded-2xl p-1">
            {[
              { id: 'events', label: 'Events', icon: Calendar },
              { id: 'gamification', label: 'Games', icon: Sparkles },
              { id: 'promotions', label: 'Promotions', icon: Tag },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all relative ${
                    activeTab === tab.id
                      ? 'text-[#007AFF]'
                      : 'text-white/70'
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabBg"
                      className="absolute inset-0 bg-white rounded-xl shadow-lg"
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-1.5">
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Navigation for Events Tab */}
      {activeTab === 'events' && (
        <div className="bg-gradient-to-r from-[#007AFF] to-[#0051D5] text-white px-4 pt-12 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-white text-2xl">Campaign Center</h1>
              <p className="text-white/80 text-sm mt-0.5">Explore events, games & promotions</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 bg-white/10 backdrop-blur-sm rounded-2xl p-1">
            {[
              { id: 'events', label: 'Events', icon: Calendar },
              { id: 'gamification', label: 'Games', icon: Sparkles },
              { id: 'promotions', label: 'Promotions', icon: Tag },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all relative ${
                    activeTab === tab.id
                      ? 'text-[#007AFF]'
                      : 'text-white/70'
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabBg"
                      className="absolute inset-0 bg-white rounded-xl shadow-lg"
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-1.5">
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        <AnimatePresence mode="wait">
          {/* Events Tab */}
          {activeTab === 'events' && (
            <motion.div
              key="events"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <MobileEvents
                onNavigate={onNavigate}
                embedded={true}
                onBack={onBack}
                hideBottomNav={true}
              />
            </motion.div>
          )}

          {/* Gamification Tab */}
          {activeTab === 'gamification' && (
            <motion.div
              key="gamification"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="p-4 space-y-4"
            >
              {gamificationData.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="p-4 cursor-pointer hover:shadow-xl transition-all"
                    onClick={() => handleGamificationClick(game)}
                    style={{ borderLeft: `4px solid ${game.color}` }}
                  >
                    <div className="flex gap-4">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                        style={{ backgroundColor: game.bgColor }}
                      >
                        {game.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-gray-900 mb-1">{game.title}</h3>
                            <p className="text-sm text-gray-600">{game.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1.5" style={{ color: game.color }}>
                            <Gift className="w-4 h-4" />
                            <span className="text-sm font-medium">{game.reward}</span>
                          </div>
                          {game.spinsLeft !== undefined && (
                            <Badge variant="outline" style={{ borderColor: game.color, color: game.color }}>
                              {game.spinsLeft} spins left
                            </Badge>
                          )}
                          {game.tasksCompleted && (
                            <Badge variant="outline" style={{ borderColor: game.color, color: game.color }}>
                              {game.tasksCompleted} tasks
                            </Badge>
                          )}
                          {game.currentStreak !== undefined && (
                            <Badge variant="outline" style={{ borderColor: game.color, color: game.color }}>
                              {game.currentStreak} day streak
                            </Badge>
                          )}
                          {game.cardsLeft !== undefined && (
                            <Badge variant="outline" style={{ borderColor: game.color, color: game.color }}>
                              {game.cardsLeft} cards left
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Promotions Tab */}
          {activeTab === 'promotions' && (
            <motion.div
              key="promotions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="p-4 space-y-4"
            >
              {promotionsData.map((promo, index) => (
                <motion.div
                  key={promo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                    onClick={() => handlePromotionClick(promo)}
                  >
                    <div className="flex">
                      <div className="relative w-32 h-32 flex-shrink-0">
                        <img
                          src={promo.image}
                          alt={promo.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <Badge className="bg-red-500 text-white border-0 mb-2">
                              {promo.type}
                            </Badge>
                            <h3 className="text-gray-900 text-sm mb-1">{promo.title}</h3>
                            <p className="text-xs text-gray-600">{promo.description}</p>
                          </div>
                        </div>
                        <div className="space-y-2 mt-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Valid Until:</span>
                            <span className="text-gray-900">{promo.validUntil}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[#007AFF]">
                              <Tag className="w-4 h-4" />
                              <code className="text-xs font-mono bg-blue-50 px-2 py-1 rounded">
                                {promo.code}
                              </code>
                            </div>
                            <Badge className="bg-[#007AFF] text-white border-0">
                              {promo.discount}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav
        currentScreen="campaign"
        onNavigate={onNavigate}
        primaryColor="#007AFF"
      />
    </div>
  );
}