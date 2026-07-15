import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Home, Gift, Coins, User, MessageCircle, Bell,
  ChevronRight, ChevronLeft, Gamepad2, Store, TrendingUp
} from 'lucide-react';
import { useAppContext } from './MobileAppContainer';

interface MobileHomeProps {
  userData: any;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

const banners = [
  {
    id: 1,
    title: 'Summer Sale 2024',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=300&fit=crop',
    gradient: 'from-purple-400 to-pink-400'
  },
  {
    id: 2,
    title: 'Welcome Bonus',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=300&fit=crop',
    gradient: 'from-blue-400 to-cyan-400'
  },
  {
    id: 3,
    title: 'Point Booster',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=300&fit=crop',
    gradient: 'from-orange-400 to-red-400'
  },
];

const menuActions = [
  { id: 'rewards', icon: Gift, label: 'Rewards', color: 'bg-purple-100 text-purple-600' },
  { id: 'redeem', icon: Coins, label: 'Redeem', color: 'bg-yellow-100 text-yellow-600' },
  { id: 'gamification', icon: Gamepad2, label: 'Games', color: 'bg-pink-100 text-pink-600' },
  { id: 'store', icon: Store, label: 'Store', color: 'bg-green-100 text-green-600' },
  { id: 'profile', icon: User, label: 'Profile', color: 'bg-blue-100 text-blue-600' },
  { id: 'chat', icon: MessageCircle, label: 'Chat', color: 'bg-indigo-100 text-indigo-600' },
];

const rankColors: Record<string, string> = {
  'Platinum': 'bg-slate-100 text-slate-700 border-slate-300',
  'Gold': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'Silver': 'bg-gray-100 text-gray-700 border-gray-300',
  'Bronze': 'bg-orange-100 text-orange-700 border-orange-300',
};

export default function MobileHome({ userData, onNavigate, onLogout }: MobileHomeProps) {
  const { theme } = useAppContext();
  const [currentBanner, setCurrentBanner] = useState(0);

  // Auto-play banner slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div 
        className="text-white px-6 pt-6 pb-6"
        style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Welcome back,</p>
              <h2 className="text-white">{userData?.name || 'Member'}</h2>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('notifications')}
            className="relative w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
          >
            <Bell className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
              3
            </span>
          </button>
        </div>

        {/* Points Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Your Points</p>
              <div className="flex items-baseline gap-2">
                <h1 className="text-white">{userData?.points?.toLocaleString() || 0}</h1>
                <span className="text-white/60 text-sm">pts</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm mb-1">Rank</p>
              <Badge 
                variant="outline" 
                className={`${rankColors[userData?.rank || 'Bronze']} border-2`}
              >
                {userData?.rank || 'Bronze'}
              </Badge>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Button 
              size="sm" 
              className="flex-1 bg-white/20 hover:bg-white/30 border-0 text-white"
              onClick={() => onNavigate('rewards')}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Earn More
            </Button>
            <Button 
              size="sm" 
              className="flex-1 bg-white hover:bg-white/90 text-gray-900"
              onClick={() => onNavigate('rewards')}
            >
              <Coins className="w-4 h-4 mr-2" />
              Redeem
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Banner Slider */}
        <div className="px-6 -mt-4 mb-6">
          <div className="relative h-44 rounded-2xl overflow-hidden shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBanner}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <div className={`h-full bg-gradient-to-r ${banners[currentBanner].gradient} flex items-center justify-center`}>
                  <img
                    src={banners[currentBanner].image}
                    alt={banners[currentBanner].title}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                    <h3 className="text-white">{banners[currentBanner].title}</h3>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {banners.length > 1 && (
              <>
                <button
                  onClick={prevBanner}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextBanner}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBanner(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentBanner 
                      ? 'w-6 bg-white' 
                      : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 mb-2">
          <h3 className="text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-3">
            {menuActions.map((action) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.id}
                  onClick={() => onNavigate(action.id)}
                  whileTap={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                  style={{
                    width: '90px',
                    height: '68px',
                    padding: '8px 6px'
                  }}
                >
                  <div className={`rounded-xl flex items-center justify-center mb-1 ${action.color}`}
                    style={{
                      width: '28px',
                      height: '28px'
                    }}
                  >
                    <Icon style={{ width: '16px', height: '16px' }} />
                  </div>
                  <span className="text-xs text-gray-700 text-center leading-tight">{action.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Campaign Section */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Active Campaigns</h3>
            <button className="text-sm text-[#007AFF]">View All</button>
          </div>
          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex gap-3">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-900 mb-1">Double Points Week</h4>
                  <p className="text-sm text-gray-500 mb-2">Earn 2x points on all purchases</p>
                  <Badge className="bg-green-100 text-green-700 border-0">Active</Badge>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex gap-3">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                  <Gamepad2 className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-900 mb-1">Spin & Win Daily</h4>
                  <p className="text-sm text-gray-500 mb-2">Try your luck every day!</p>
                  <Badge className="bg-blue-100 text-blue-700 border-0">New</Badge>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 safe-bottom">
        <div className="flex justify-around">
          <button 
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center gap-1"
            style={{ color: theme.primary }}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button 
            onClick={() => onNavigate('rewards')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <Gift className="w-6 h-6" />
            <span className="text-xs">Rewards</span>
          </button>
          <button 
            onClick={() => onNavigate('gamification')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <Gamepad2 className="w-6 h-6" />
            <span className="text-xs">Games</span>
          </button>
          <button 
            onClick={() => onNavigate('profile')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
