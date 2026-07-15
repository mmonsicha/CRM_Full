import { useState, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Sun, Moon, Battery, Signal, Wifi } from 'lucide-react';
import CustomerAuth from './CustomerAuth';
import MobileHome from './MobileHome';
import MobileProfile from './MobileProfile';
import MobileRewards from './MobileRewards';
import MobileGamification from './MobileGamification';
import MobileNotifications from './MobileNotifications';
import { Toaster } from '../ui/sonner';

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
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within MobileAppContainer');
  return context;
};

type Screen = 'auth' | 'home' | 'profile' | 'rewards' | 'gamification' | 'notifications' | 'chat';

export default function MobileAppContainer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [userData, setUserData] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  
  // Theme state - can be updated from admin
  const [theme, setTheme] = useState({
    type: 'preset' as 'preset' | 'festival',
    primary: '#007AFF',
    secondary: '#FBBF24',
    background: '#F9FAFB'
  });

  const handleLoginSuccess = (data: any) => {
    setUserData(data);
    setShowLoading(false);
    // Small delay for smooth transition
    setTimeout(() => {
      setIsAuthenticated(true);
      setCurrentScreen('home');
      setShowWelcome(true);
      
      // Hide welcome message after 3 seconds
      setTimeout(() => {
        setShowWelcome(false);
      }, 3000);
    }, 100);
  };

  const handleLogout = () => {
    setUserData(null);
    setIsAuthenticated(false);
    setCurrentScreen('auth');
  };

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const updateTheme = (newTheme: any) => {
    setTheme(newTheme);
  };

  const contextValue: AppContextType = {
    theme,
    userData,
    updateTheme,
    isDarkMode
  };

  // Get current time
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: false 
  });

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
                <p className="text-sm text-gray-500">iPhone 16 Pro • 390 × 844 px</p>
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
          
          {/* iPhone 16 Pro Frame */}
          <div 
            className={`relative rounded-[56px] p-3 shadow-2xl transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-900' : 'bg-black'
            }`}
            style={{
              width: '416px', // 390px + 26px padding (13px each side)
              height: '870px' // 844px + 26px padding
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
              className={`relative w-[390px] h-[844px] rounded-[48px] overflow-hidden transition-colors duration-300 ${
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

              {/* Welcome Message (shown after auto-login) */}
              <AnimatePresence>
                {showWelcome && isAuthenticated && userData && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-[54px] left-0 right-0 z-10 px-4 py-2"
                  >
                    <div className="bg-gradient-to-r from-amber-400 to-yellow-400 text-gray-900 px-4 py-2 rounded-xl text-center shadow-lg">
                      <p className="text-sm">
                        Welcome back, {userData.rank} Member ✨
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* App Content with Safe Area */}
              <div className="absolute inset-0 top-[54px] bottom-[34px] overflow-hidden">
                <AnimatePresence mode="wait">
                  {showLoading ? (
                    <motion.div
                      key="auth"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -100 }}
                      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                      className="h-full"
                    >
                      <CustomerAuth onLoginSuccess={handleLoginSuccess} />
                    </motion.div>
                  ) : isAuthenticated ? (
                    <motion.div
                      key={currentScreen}
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                      className="h-full"
                    >
                      {currentScreen === 'home' && (
                        <MobileHome 
                          userData={userData} 
                          onNavigate={navigate}
                          onLogout={handleLogout}
                        />
                      )}
                      {currentScreen === 'profile' && (
                        <MobileProfile 
                          userData={userData} 
                          onNavigate={navigate}
                          onLogout={handleLogout}
                        />
                      )}
                      {currentScreen === 'rewards' && (
                        <MobileRewards 
                          userData={userData} 
                          onNavigate={navigate}
                        />
                      )}
                      {currentScreen === 'gamification' && (
                        <MobileGamification 
                          userData={userData} 
                          onNavigate={navigate}
                        />
                      )}
                      {currentScreen === 'notifications' && (
                        <MobileNotifications 
                          userData={userData} 
                          onNavigate={navigate}
                        />
                      )}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              {/* Home Indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[140px] h-[5px] bg-gray-900/20 dark:bg-white/30 rounded-full" />
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
            Apple iPhone 16 Pro • iOS 18 • 390×844 pt
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
               currentScreen === 'profile' ? '👤 Profile' :
               currentScreen === 'rewards' ? '🎁 Rewards' :
               currentScreen === 'gamification' ? '🎮 Games' :
               currentScreen === 'notifications' ? '🔔 Notifications' : currentScreen}
            </Badge>
          </div>
        )}
      </div>
    </AppContext.Provider>
  );
}
