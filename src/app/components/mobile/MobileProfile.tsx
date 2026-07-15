import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  User, ChevronRight, Settings, LogOut, Award,
  History, Shield, HelpCircle, Home, Gift, Gamepad2
} from 'lucide-react';
import { useAppContext } from './MobileAppContainer';

interface MobileProfileProps {
  userData: any;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { icon: History, label: 'Points History', badge: null },
  { icon: Award, label: 'My Rewards', badge: '3' },
  { icon: Settings, label: 'Settings', badge: null },
  { icon: Shield, label: 'Privacy & Security', badge: null },
  { icon: HelpCircle, label: 'Help & Support', badge: null },
];

const rankColors: Record<string, string> = {
  'Platinum': 'bg-slate-100 text-slate-700',
  'Gold': 'bg-yellow-100 text-yellow-700',
  'Silver': 'bg-gray-100 text-gray-700',
  'Bronze': 'bg-orange-100 text-orange-700',
};

export default function MobileProfile({ userData, onNavigate, onLogout }: MobileProfileProps) {
  const { theme } = useAppContext();

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div 
        className="text-white px-6 pt-6 pb-20"
        style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
      >
        <div className="text-center">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border-4 border-white/30">
            <User className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-white mb-1">{userData?.name}</h2>
          <p className="text-white/80 text-sm mb-3">{userData?.email || userData?.phone}</p>
          <Badge className={`${rankColors[userData?.rank || 'Bronze']} border-0`}>
            {userData?.rank || 'Bronze'} Member
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20 -mt-12">
        {/* Stats Card */}
        <div className="px-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl text-gray-900 mb-1">{userData?.points?.toLocaleString() || 0}</p>
                <p className="text-xs text-gray-500">Points</p>
              </div>
              <div className="text-center border-x border-gray-200">
                <p className="text-2xl text-gray-900 mb-1">12</p>
                <p className="text-xs text-gray-500">Rewards</p>
              </div>
              <div className="text-center">
                <p className="text-2xl text-gray-900 mb-1">3</p>
                <p className="text-xs text-gray-500">Campaigns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="px-6 mb-6">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors ${
                    index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="flex-1 text-left text-gray-900">{item.label}</span>
                  {item.badge && (
                    <Badge className="bg-red-500 text-white border-0">{item.badge}</Badge>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Logout Button */}
        <div className="px-6 mb-6">
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full h-12 text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Version Info */}
        <p className="text-center text-xs text-gray-400 mb-6">
          App Version 2.0.0
        </p>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
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
            className="flex flex-col items-center gap-1"
            style={{ color: theme.primary }}
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
