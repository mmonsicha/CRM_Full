import { useState } from 'react';
import { 
  User, ChevronRight, Settings, Bell, Globe, 
  Package, MessageSquare, ShoppingBag, LogOut, Camera, 
  Coins, Calendar, Award, TrendingUp, Crown, Truck, Ticket, MapPin
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import MobileBottomNav, { MobileScreen } from './MobileBottomNav';
import { useAppContext } from './MobileAppContainerEnhanced';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';

interface MobileProfileEnhancedProps {
  userData: any;
  onNavigate: (screen: MobileScreen, data?: any) => void;
  onLogout: () => void;
}

const menuSections = [
  {
    title: 'Activity',
    items: [
      { id: 'my-rewards', icon: Package, label: 'My Rewards', screen: 'my-rewards', badge: '5' },
      { id: 'coupon-wallet', icon: Ticket, label: 'Coupon Wallet', screen: 'coupon-wallet', badge: '2' },
      { id: 'my-events', icon: Calendar, label: 'My Events', screen: 'my-events', badge: null },
      { id: 'point-history', icon: Coins, label: 'Point History', screen: 'point-history', badge: null },
      { id: 'order-tracking', icon: Truck, label: 'My Order Tracking', screen: 'order-tracking', badge: '6' },
      { id: 'address', icon: MapPin, label: 'My Addresses', screen: 'address-management', badge: null },
      { id: 'reviews', icon: MessageSquare, label: 'My Reviews', screen: 'reviews', badge: null },
      { id: 'purchase', icon: ShoppingBag, label: 'Purchase History', screen: 'purchase-history', badge: null },
    ]
  },
  {
    title: 'Settings',
    items: [
      { id: 'settings', icon: Settings, label: 'Privacy & Security', screen: 'settings', badge: null },
      { id: 'language', icon: Globe, label: 'Language', screen: null, badge: null },
      { id: 'notifications', icon: Bell, label: 'Notifications', screen: null, badge: null },
    ]
  }
];

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

export default function MobileProfileEnhanced({ userData, onNavigate, onLogout }: MobileProfileEnhancedProps) {
  const { theme } = useAppContext();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [editName, setEditName] = useState(userData?.name || 'Simson');

  // User data with Gold tier as default
  const currentPoints = userData?.points || 1650;
  const lifetimePoints = userData?.lifetimePoints || 1650;
  
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

  const handleSaveProfile = () => {
    setShowEditDialog(false);
    toast.success('Profile updated successfully');
  };

  const handleMenuClick = (item: any) => {
    if (item.screen) {
      onNavigate(item.screen as MobileScreen);
    } else if (item.id === 'language') {
      toast.info('Language settings will be available soon');
    } else if (item.id === 'notifications') {
      toast.info('Notification settings updated');
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ backgroundColor: '#F8FAFD' }}>
      {/* Header with Profile */}
      <div 
        className="text-white px-6 pt-6 pb-4"
        style={{ background: 'linear-gradient(135deg, #2E5BFF, #5B7FFF)' }}
      >
        {/* Profile Info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <Avatar className="w-20 h-20 border-4 border-white/30">
              <AvatarFallback 
                className="text-2xl"
                style={{ backgroundColor: '#FFB800' }}
              >
                {editName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => setShowEditDialog(true)}
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-lg"
              style={{ color: theme.primary }}
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1">
            <h2 className="text-white text-xl mb-1">{editName}</h2>
            <p className="text-sm text-white/80 mb-2">ID: M{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</p>
          </div>

          <Button
            onClick={() => setShowEditDialog(true)}
            size="sm"
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            Edit
          </Button>
        </div>
      </div>

      {/* Unified Tier + Points Card */}
      <div className="px-4 -mt-8 mb-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            className="overflow-hidden relative"
            style={{
              background: `linear-gradient(135deg, ${currentTier.gradient.split(' ').join(', ')})`,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            }}
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />

            <div className="relative z-10 p-6">
              {/* Tier Badge - Clickable */}
              <button
                onClick={() => onNavigate('tier-details')}
                className="w-full text-left mb-4 group hover:opacity-90 transition-opacity active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
                      className="text-5xl"
                    >
                      {currentTier.icon}
                    </motion.div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl text-gray-900 mb-0.5">{currentTier.name} Member</h3>
                      </div>
                      <p className="text-sm text-gray-700">+{currentTier.bonus}% Points Bonus • Tap for details</p>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-700 group-hover:text-gray-900 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>

              {/* Total Points */}
              <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm text-gray-700 mb-1">Total Points Balance</p>
                <motion.div
                  key={currentPoints}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2"
                >
                  <Coins className="w-6 h-6 text-yellow-600" />
                  <span className="text-3xl text-gray-900">{currentPoints.toLocaleString()}</span>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {menuSections.map((section, idx) => (
          <div key={idx} className="mb-6">
            <div className="px-6 py-3">
              <h3 className="text-gray-600 text-sm">{section.title}</h3>
            </div>
            <div className="bg-white">
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item)}
                    className={`w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors ${
                      itemIdx < section.items.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${theme.primary}15` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: theme.primary }} />
                      </div>
                      <span className="text-gray-900">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <Badge 
                          className="border-0"
                          style={{ backgroundColor: theme.primary, color: 'white' }}
                        >
                          {item.badge}
                        </Badge>
                      )}
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <div className="px-6 mb-6">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-white border border-gray-200 text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your profile information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <Button 
              onClick={handleSaveProfile}
              className="w-full"
              style={{ backgroundColor: theme.primary }}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Manage your account preferences</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-900">Push Notifications</p>
                <p className="text-xs text-gray-500">Receive updates and alerts</p>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-900">Email Notifications</p>
                <p className="text-xs text-gray-500">Get news via email</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation */}
      <MobileBottomNav
        currentScreen="profile"
        onNavigate={onNavigate}
        primaryColor={theme.primary}
      />
    </div>
  );
}
