import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Smartphone, Monitor, Maximize2, Minimize2, Settings,
  Eye, Layers, Palette, Layout as LayoutIcon, Navigation,
  Zap, Image as ImageIcon, Tag, Users, Crown, ChevronDown,
  ChevronRight, LayoutDashboard, Megaphone, Gift, Package,
  MessageSquare, Bell, FileText, User, TrendingUp, CalendarDays,
  BarChart3, Gamepad2, Truck, MessageCircle, Radio, Coins
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import InteractiveMobilePreview from './InteractiveMobilePreview';
import { useAppPreview } from './AppPreviewContext';
import CustomerAppConfigPanel from './CustomerAppConfigPanel';
import DemoControlsPanel from './DemoControlsPanel';

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  submenu?: { id: string; label: string; icon: any }[];
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    id: 'member-management',
    label: 'Member Management',
    icon: Users,
    submenu: [
      { id: 'members', label: 'Member', icon: Users },
      { id: 'member-detail', label: 'Member Detail', icon: User },
      { id: 'member-analytics', label: 'Member Analytics', icon: TrendingUp },
      { id: 'member-segments', label: 'Member Segments', icon: Tag },
    ],
  },
  {
    id: 'campaign-management',
    label: 'Campaign Management',
    icon: Megaphone,
    submenu: [
      { id: 'campaign', label: 'Campaigns', icon: Megaphone },
      { id: 'campaign-visible', label: 'Campaign Visibility', icon: Eye },
      { id: 'events', label: 'Events', icon: CalendarDays },
      { id: 'events-analytics', label: 'Events Analytics', icon: BarChart3 },
      { id: 'promotion', label: 'Promotions', icon: Tag },
      { id: 'gamification', label: 'Gamification', icon: Gamepad2 },
    ],
  },
  { id: 'broadcast', label: 'Communication', icon: Radio },
  {
    id: 'reward-redemption',
    label: 'Reward Redemption',
    icon: Gift,
    submenu: [
      { id: 'redemption', label: 'Reward Redemption', icon: Gift },
      { id: 'delivery', label: 'Delivery Tracking', icon: Truck },
    ],
  },
  {
    id: 'master-management',
    label: 'Master Management',
    icon: Package,
    submenu: [
      { id: 'points', label: 'Point', icon: Coins },
      { id: 'products', label: 'Rewards', icon: Package },
      { id: 'tier-master', label: 'Tier Master', icon: Crown },
    ],
  },
  {
    id: 'system',
    label: 'System',
    icon: Settings,
    submenu: [
      { id: 'customer-app-config', label: 'Customer App Configuration', icon: Smartphone },
      { id: 'demo-controls', label: 'Demo Controls', icon: Eye },
      { id: 'user-management', label: 'User Management', icon: Users },
      { id: 'activity-logs', label: 'Activity Logs', icon: FileText },
    ],
  },
];

interface SplitViewModeProps {
  onClose: () => void;
}

export default function SplitViewMode({ onClose }: SplitViewModeProps) {
  const [activePage, setActivePage] = useState('customer-app-config');
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['system', 'campaign-management']);
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [activeConfigTab, setActiveConfigTab] = useState('theme');

  const { previewMode, setPreviewMode } = useAppPreview();

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]
    );
  };

  const handleMenuClick = (itemId: string, hasSubmenu: boolean) => {
    if (hasSubmenu) {
      toggleMenu(itemId);
    } else {
      setActivePage(itemId);
      if (itemId === 'customer-app-config') {
        setPreviewMode(true);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Top Bar */}
      <div className="h-16 bg-gradient-to-r from-[#007AFF] to-[#0051D5] flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <span className="text-white text-lg font-bold">C</span>
            </div>
            <div>
              <h1 className="text-white font-semibold">CRM Master 2.0</h1>
              <p className="text-blue-100 text-xs">Split View Mode - Real-time Preview</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-green-500 text-white border-0 px-3 py-1">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
            Live Sync
          </Badge>

          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
            onClick={() => setIsFullWidth(!isFullWidth)}
          >
            {isFullWidth ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isExpanded = expandedMenus.includes(item.id);
              const isSubmenuActive = hasSubmenu && item.submenu?.some((sub) => activePage === sub.id);

              return (
                <div key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item.id, hasSubmenu || false)}
                    className={`w-full flex items-center gap-3 px-6 py-3 transition-all relative group rounded-lg mx-2 my-0.5 ${
                      isActive || isSubmenuActive
                        ? 'text-[#007AFF] bg-blue-50 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {(isActive || isSubmenuActive) && (
                      <motion.div
                        layoutId="activeTabSplit"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-[#007AFF] rounded-r"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    <Icon className={`w-5 h-5 ${isActive || isSubmenuActive ? 'text-[#007AFF]' : ''}`} />
                    <span className="text-sm flex-1 text-left">{item.label}</span>
                    {hasSubmenu && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    )}
                  </button>

                  {/* Submenu */}
                  <AnimatePresence>
                    {hasSubmenu && isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        {item.submenu?.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isSubActive = activePage === subItem.id;
                          return (
                            <button
                              key={subItem.id}
                              onClick={() => {
                                setActivePage(subItem.id);
                                if (subItem.id === 'customer-app-config') {
                                  setPreviewMode(true);
                                }
                              }}
                              className={`w-full flex items-center gap-3 pl-14 pr-6 py-2.5 transition-all relative group rounded-lg mx-2 my-0.5 ${
                                isSubActive
                                  ? 'text-[#007AFF] bg-blue-50'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                            >
                              <SubIcon className={`w-4 h-4 ${isSubActive ? 'text-[#007AFF]' : ''}`} />
                              <span className="text-sm">{subItem.label}</span>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Center Content Area */}
        <div className={`flex-1 bg-gray-50 overflow-hidden ${isFullWidth ? 'mr-0' : ''}`}>
          <div className="h-full overflow-y-auto">
            <AnimatePresence mode="wait">
              {activePage === 'customer-app-config' ? (
                <motion.div
                  key="config-panel"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <CustomerAppConfigPanel />
                </motion.div>
              ) : activePage === 'demo-controls' ? (
                <motion.div
                  key="demo-controls"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <DemoControlsPanel />
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex items-center justify-center"
                >
                  <div className="text-center">
                    <Monitor className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-gray-900 text-xl mb-2">Page Content</h3>
                    <p className="text-gray-500">
                      Select Customer App Configuration to see live preview
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Mobile Preview Panel */}
        {!isFullWidth && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="w-[480px] bg-gradient-to-br from-gray-800 to-gray-900 border-l border-gray-700 flex items-center justify-center p-8 flex-shrink-0"
          >
            <div className="relative">
              {/* Device Label */}
              <div className="absolute -top-12 left-0 right-0 flex items-center justify-center gap-2">
                <Smartphone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm">iPhone 16 - Live Preview</span>
              </div>

              {/* Mobile Preview */}
              <InteractiveMobilePreview />

              {/* Sync Indicator */}
              <div className="absolute -bottom-12 left-0 right-0 flex items-center justify-center">
                <Badge className="bg-green-500 text-white border-0">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                  Synced
                </Badge>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}