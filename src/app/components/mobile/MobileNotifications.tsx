import { useState } from 'react';
import { Badge } from '../ui/badge';
import { 
  ArrowLeft, Bell, Gift, Coins, Megaphone, Award,
  Home, User, Gamepad2
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAppContext } from './MobileAppContainerEnhanced';
import MobileBottomNav, { MobileScreen } from './MobileBottomNav';

interface MobileNotificationsProps {
  userData: any;
  onNavigate: (screen: MobileScreen, data?: any) => void;
}

const notifications = [
  {
    id: 1,
    type: 'reward',
    icon: Gift,
    color: 'bg-purple-100 text-purple-600',
    title: 'New Reward Available!',
    message: 'Check out the new Starbucks coffee reward',
    time: '2 minutes ago',
    read: false
  },
  {
    id: 2,
    type: 'points',
    icon: Coins,
    color: 'bg-yellow-100 text-yellow-600',
    title: 'Points Earned',
    message: 'You earned 100 points from your recent purchase',
    time: '1 hour ago',
    read: false
  },
  {
    id: 3,
    type: 'campaign',
    icon: Megaphone,
    color: 'bg-blue-100 text-blue-600',
    title: 'Double Points Week!',
    message: 'Earn 2x points on all purchases this week',
    time: '3 hours ago',
    read: false
  },
  {
    id: 4,
    type: 'achievement',
    icon: Award,
    color: 'bg-green-100 text-green-600',
    title: 'Level Up!',
    message: 'Congratulations! You are now a Gold member',
    time: '1 day ago',
    read: true
  },
  {
    id: 5,
    type: 'game',
    icon: Gamepad2,
    color: 'bg-pink-100 text-pink-600',
    title: 'Daily Spin Available',
    message: 'Your daily spin is ready. Try your luck now!',
    time: '1 day ago',
    read: true
  },
  {
    id: 6,
    type: 'points',
    icon: Coins,
    color: 'bg-yellow-100 text-yellow-600',
    title: 'Points Expiring Soon',
    message: '500 points will expire in 7 days',
    time: '2 days ago',
    read: true
  },
];

export default function MobileNotifications({ userData, onNavigate }: MobileNotificationsProps) {
  const { theme } = useAppContext();
  const [notifs, setNotifs] = useState(notifications);

  const markAsRead = (id: number) => {
    setNotifs(notifs.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div 
        className="text-white px-6 pt-6 pb-6"
        style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
      >
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={() => onNavigate('home')}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h2 className="text-white">Notifications</h2>
            <p className="text-white/80 text-sm">
              {unreadCount} unread {unreadCount === 1 ? 'message' : 'messages'}
            </p>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto pb-20">
        {notifs.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {notifs.map((notif) => {
              const Icon = notif.icon;
              return (
                <motion.button
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                    !notif.read ? 'bg-blue-50' : 'bg-white'
                  }`}
                  whileHover={{ x: 4 }}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${notif.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-gray-900">{notif.title}</h4>
                      {!notif.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{notif.message}</p>
                    <p className="text-xs text-gray-400">{notif.time}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">No Notifications</h3>
            <p className="text-gray-500 text-sm">
              You're all caught up! Check back later for updates.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav
        currentScreen="notifications"
        onNavigate={onNavigate}
        primaryColor={theme.primary}
      />
      {/* <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex justify-around">
          <button 
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center gap-1 text-gray-400"
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
      </div> */}
    </div>
  );
}
