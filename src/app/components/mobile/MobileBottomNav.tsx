import { Home, Sparkles, ScanLine, Gift, User } from 'lucide-react';
import { motion } from 'motion/react';

export type MobileScreen = 
  | 'home' 
  | 'events' 
  | 'qr-scanner' 
  | 'rewards' 
  | 'profile'
  | 'event-detail'
  | 'promotion-detail'
  | 'tracking'
  | 'tracking-detail'
  | 'promotions'
  | 'purchase-history'
  | 'reviews'
  | 'gamification'
  | 'notifications'
  | 'notification-center'
  | 'my-events'
  | 'my-rewards'
  | 'reward-claim'
  | 'reward-tracking'
  | 'coupon-wallet'
  | 'my-points'
  | 'points-history'
  | 'point-history'
  | 'tier-details'
  | 'order-tracking'
  | 'settings'
  | 'address-management'
  | 'missions'
  | 'campaign'
  | 'campaign-overview'
  | 'shop'
  | 'shopee'
  | 'lazada';

interface MobileBottomNavProps {
  currentScreen: MobileScreen;
  onNavigate: (screen: MobileScreen) => void;
  primaryColor: string;
}

export default function MobileBottomNav({ currentScreen, onNavigate, primaryColor }: MobileBottomNavProps) {
  const navItems = [
    { id: 'home' as MobileScreen, icon: Home, label: 'Home' },
    { id: 'campaign' as MobileScreen, icon: Sparkles, label: 'Campaign' },
    { id: 'qr-scanner' as MobileScreen, icon: ScanLine, label: 'Scan' },
    { id: 'rewards' as MobileScreen, icon: Gift, label: 'Rewards' },
    { id: 'profile' as MobileScreen, icon: User, label: 'Profile' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom">
      <div className="flex justify-around items-center px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center gap-1 py-2 px-4 flex-1 relative"
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              
              <Icon 
                className="w-6 h-6 transition-colors duration-200"
                style={{ color: isActive ? primaryColor : '#9CA3AF' }}
              />
              <span 
                className="text-xs transition-colors duration-200"
                style={{ color: isActive ? primaryColor : '#9CA3AF' }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}