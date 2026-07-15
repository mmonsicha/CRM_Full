import { useState, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Sun, Moon, Battery, Signal, Wifi } from 'lucide-react';
import CustomerAuth from './CustomerAuth';
import MobileHomeEnhanced from './MobileHomeEnhanced';
import MobileEvents from './MobileEvents';
import MobileEventDetail from './MobileEventDetail';
import MobileMyEvents from './MobileMyEvents';
import MobileTracking from './MobileTracking';
import MobilePromotions from './MobilePromotions';
import MobileProfileEnhanced from './MobileProfileEnhanced';
import MobileQRScanner from './MobileQRScanner';
import MobilePurchaseHistory from './MobilePurchaseHistory';
import MobileRewards from './MobileRewards';
import MobileGamification from './MobileGamification';
import MobileNotifications from './MobileNotifications';
import MobileNotificationCenter from './MobileNotificationCenter';
import MobileRewardCelebration from './MobileRewardCelebration';
import MobileMyRewards from './MobileMyRewards';
import MobileRewardClaim from './MobileRewardClaim';
import MobileRewardTracking from './MobileRewardTracking';
import MobileCouponWallet from './MobileCouponWallet';
import MobileMyPoints from './MobileMyPoints';
import MobilePointsHistory from './MobilePointsHistory';
import MobileTierDetails from './MobileTierDetails';
import MobilePointHistory from './MobilePointHistory';
import MobileOrderTracking from './MobileOrderTracking';
import MobileSettings from './MobileSettings';
import MobileAddressManagement from './MobileAddressManagement';
import MobileMissions from './MobileMissions';
import MobileCampaignOverview from './MobileCampaignOverview';
import MobileShop from './MobileShop';
import { Toaster } from '../ui/sonner';
import type { MobileScreen } from './MobileBottomNav';

// App Context for theme and data
interface AppContextType {
  theme: {
    type: 'preset' | 'festival';
    primary: string;
    secondary: string;
    background: string;
  };
  userData: any;
  updateTheme: (theme: any) => void;
  isDarkMode: boolean;
  joinedEvents?: any[];
  joinEvent?: (event: any) => void;
  notifications?: any[];
  unreadCount?: number;
  markNotificationAsRead?: (id: number) => void;
  clearAllNotifications?: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within MobileAppContainer');
  return context;
};

export default function MobileAppContainerEnhanced() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<MobileScreen>('home');
  const [screenData, setScreenData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  
  // Theme state - can be updated from admin
  const [theme, setTheme] = useState({
    type: 'preset' as 'preset' | 'festival',
    primary: '#2E5BFF',
    secondary: '#5B7FFF',
    background: '#F6F8FF'
  });

  // Joined events tracking
  const [joinedEvents, setJoinedEvents] = useState<any[]>([]);

  // Notifications state - Initialize with 2 unread notifications
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(2);

  const handleLoginSuccess = (data: any) => {
    // Set default Gold tier user data
    const defaultUserData = {
      name: 'Simson',
      email: data.email || 'simson@example.com',
      memberId: 'M' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
      points: 1650,
      lifetimePoints: 1650,
      tier: 'Gold',
      tierIcon: '🥇',
      ...data,
    };
    setUserData(defaultUserData);
    setIsAuthenticated(true);
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    setUserData(null);
    setIsAuthenticated(false);
    setCurrentScreen('home');
  };

  const navigate = (screen: MobileScreen, data?: any) => {
    // Determine slide direction based on navigation
    // Back to profile from tier-details should slide right
    if (currentScreen === 'tier-details' && screen === 'profile') {
      setSlideDirection('right');
    } else if (currentScreen === 'profile' && screen === 'tier-details') {
      setSlideDirection('left');
    } else if (currentScreen === 'profile' && screen === 'point-history') {
      setSlideDirection('left');
    } else if (currentScreen === 'point-history' && screen === 'profile') {
      setSlideDirection('right');
    } else {
      // Default slide left for forward navigation
      setSlideDirection('left');
    }
    
    setCurrentScreen(screen);
    setScreenData(data);
  };

  const updateTheme = (newTheme: any) => {
    setTheme(newTheme);
  };

  const joinEvent = (event: any) => {
    const joinedEvent = {
      ...event,
      joinDate: new Date().toISOString(),
      isJoined: true
    };
    setJoinedEvents(prev => [...prev, joinedEvent]);
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const contextValue: AppContextType = {
    theme,
    userData,
    updateTheme,
    isDarkMode,
    joinedEvents,
    joinEvent,
    notifications,
    unreadCount,
    markNotificationAsRead,
    clearAllNotifications
  };

  // Get current time
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: false 
  });

  const renderScreen = () => {
    if (!isAuthenticated) {
      return <CustomerAuth onLoginSuccess={handleLoginSuccess} />;
    }

    switch (currentScreen) {
      case 'home':
        return <MobileHomeEnhanced userData={userData} onNavigate={navigate} />;
      case 'events':
        return <MobileEvents onNavigate={navigate} />;
      case 'event-detail':
        return <MobileEventDetail eventData={screenData} onNavigate={navigate} />;
      case 'tracking':
        return <MobileTracking onNavigate={navigate} />;
      case 'promotions':
        return <MobilePromotions onNavigate={navigate} />;
      case 'rewards':
        return <MobileRewards userData={userData} onNavigate={navigate} />;
      case 'profile':
        return <MobileProfileEnhanced userData={userData} onNavigate={navigate} onLogout={handleLogout} />;
      case 'qr-scanner':
        return <MobileQRScanner onNavigate={navigate} />;
      case 'purchase-history':
        return <MobilePurchaseHistory onNavigate={navigate} />;
      case 'gamification':
        return <MobileGamification userData={userData} onNavigate={navigate} />;
      case 'notifications':
        return <MobileNotifications userData={userData} onNavigate={navigate} />;
      case 'notification-center':
        return <MobileNotificationCenter onNavigate={navigate} />;
      case 'my-events':
        return <MobileMyEvents onNavigate={navigate} />;
      case 'my-rewards':
        return <MobileMyRewards onNavigate={navigate} />;
      case 'reward-claim':
        return <MobileRewardClaim onNavigate={navigate} rewardData={screenData} />;
      case 'reward-tracking':
        return <MobileRewardTracking onNavigate={navigate} rewardData={screenData} />;
      case 'coupon-wallet':
        return <MobileCouponWallet onNavigate={navigate} newCouponData={screenData?.newCoupon} />;
      case 'my-points':
        return <MobileMyPoints onNavigate={navigate} userData={userData} />;
      case 'points-history':
        return <MobilePointsHistory onNavigate={navigate} />;
      case 'point-history':
        return <MobilePointHistory onNavigate={navigate} userData={userData} />;
      case 'tier-details':
        return <MobileTierDetails onNavigate={navigate} userData={userData} />;
      case 'order-tracking':
        return <MobileOrderTracking onNavigate={navigate} />;
      case 'settings':
        return <MobileSettings onNavigate={navigate} />;
      case 'address-management':
        return <MobileAddressManagement onNavigate={navigate} />;
      case 'missions':
        return <MobileMissions onNavigate={navigate} />;
      case 'campaign':
        return <MobileCampaignOverview onNavigate={navigate} onBack={() => navigate('home')} />;
      case 'shop':
        return <MobileShop onNavigate={navigate} onBack={() => navigate('home')} />;
      default:
        return <MobileHomeEnhanced userData={userData} onNavigate={navigate} />;
    }
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
        <Toaster />
        
        {/* Preview Controls */}
        <div className="w-full max-w-md mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-gray-900 mb-1">Mobile App Preview</h3>
                <p className="text-sm text-gray-500">iPhone 16 Size • 430 × 932 px</p>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Live Preview
              </Badge>
            </div>
            
            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {isDarkMode ? (
                  <Moon className="w-4 h-4 text-gray-600" />
                ) : (
                  <Sun className="w-4 h-4 text-gray-600" />
                )}
                <Label className="text-sm text-gray-700">
                  {isDarkMode ? 'Dark' : 'Light'} Theme
                </Label>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
            </div>
          </div>
        </div>

        {/* Device Frame Container */}
        <div className="relative">
          {/* Drop Shadow Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/5 blur-[24px] scale-95 rounded-[60px]" />
          
          {/* iPhone 16 Frame */}
          <div 
            className={`relative rounded-[56px] p-3 shadow-2xl transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-900' : 'bg-black'
            }`}
            style={{
              width: '456px', // 430px + 26px padding (13px each side)
              height: '958px' // 932px + 26px padding
            }}
          >
            {/* Dynamic Island / Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[37px] bg-black rounded-b-[32px] z-30 flex items-center justify-center">
              <div className="w-[120px] h-[28px] bg-gradient-to-b from-gray-900 to-black rounded-[24px] flex items-center justify-between px-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <div className="w-12 h-1.5 bg-gray-800 rounded-full" />
              </div>
            </div>

            {/* Screen Container */}
            <div 
              className={`relative w-[430px] h-[932px] rounded-[48px] overflow-hidden transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-950' : 'bg-white'
              }`}
            >
              {/* Status Bar */}
              <div className={`absolute top-0 left-0 right-0 h-[54px] px-6 flex items-center justify-between z-20 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {/* Left: Time */}
                <div className="flex-1">
                  <span className="text-[15px] font-semibold">{currentTime}</span>
                </div>
                
                {/* Right: Status Icons */}
                <div className="flex items-center gap-1.5">
                  <Signal className="w-4 h-4" />
                  <Wifi className="w-4 h-4" />
                  <Battery className="w-6 h-4" />
                </div>
              </div>

              {/* App Content with Safe Area */}
              <div className="absolute inset-0 top-[54px] bottom-0 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentScreen}
                    initial={{ opacity: 0, x: slideDirection === 'left' ? 50 : -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: slideDirection === 'left' ? -50 : 50 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    className="h-full"
                  >
                    {renderScreen()}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Home Indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[140px] h-[5px] bg-gray-900/20 dark:bg-white/30 rounded-full z-30" />
            </div>

            {/* Volume Buttons (Left Side) */}
            <div className="absolute left-0 top-[180px] w-1 h-[50px] bg-gray-800 rounded-l-sm" />
            <div className="absolute left-0 top-[240px] w-1 h-[60px] bg-gray-800 rounded-l-sm" />
            <div className="absolute left-0 top-[310px] w-1 h-[60px] bg-gray-800 rounded-l-sm" />
            
            {/* Power Button (Right Side) */}
            <div className="absolute right-0 top-[220px] w-1 h-[90px] bg-gray-800 rounded-r-sm" />
          </div>
        </div>

        {/* Device Info Label */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Apple iPhone 16 • iOS 18 • 430×932 pt
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Interactive prototype with live navigation
          </p>
        </div>

        {/* Screen Indicator */}
        {isAuthenticated && (
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="outline" className="capitalize">
{currentScreen === 'home' ? '🏠 Home' : 
               currentScreen === 'events' ? '📅 Events' :
               currentScreen === 'event-detail' ? '📅 Event Detail' :
               currentScreen === 'my-events' ? '📅 My Events' :
               currentScreen === 'tracking' ? '📦 Tracking' :
               currentScreen === 'promotions' ? '🏷️ Promotions' :
               currentScreen === 'rewards' ? '🎁 Rewards' :
               currentScreen === 'profile' ? '👤 Profile' :
               currentScreen === 'qr-scanner' ? '📷 Quick Scan' :
               currentScreen === 'purchase-history' ? '🛍️ Purchase History' :
               currentScreen === 'gamification' ? '🎮 Games' :
               currentScreen === 'notifications' ? '🔔 Notifications' :
               currentScreen === 'notification-center' ? '🔔 Notification Center' :
               currentScreen === 'coupon-wallet' ? '🎟️ Coupon Wallet' :
               currentScreen === 'my-rewards' ? '🎁 My Rewards' :
               currentScreen === 'order-tracking' ? '📦 Order Tracking' :
               currentScreen === 'settings' ? '⚙️ Settings' :
               currentScreen === 'address-management' ? '📍 My Addresses' :
               currentScreen === 'point-history' ? '💰 Point History' :
               currentScreen === 'missions' ? '🎯 Mission Center' :
               currentScreen === 'campaign' ? '📢 Campaign Center' :
               currentScreen === 'shop' ? '🏬 Shop' :
               currentScreen === 'tier-details' ? '👑 Tier Details' : currentScreen}
            </Badge>
          </div>
        )}
      </div>
    </AppContext.Provider>
  );
}