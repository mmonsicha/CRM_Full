import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Users, Megaphone, Tag, Radio, 
  Coins, Package, MessageSquare, Settings, Newspaper,
  Bell, ChevronRight, ChevronDown, Menu, X, Gift, Truck, MessageCircle,
  User, TrendingUp, Search, Smartphone, Image as ImageIcon, Layout, Gamepad2,
  FileText, Palette, CalendarDays, BarChart3, Eye, Crown, Send, FileText as TemplateIcon,
  Monitor
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Toaster } from './components/ui/sonner';
import Dashboard from './components/Dashboard';
import MemberManagement from './components/MemberManagement';
import MemberDetailPage from './components/MemberDetailPage';
import MemberAnalyticsDashboard from './components/MemberAnalyticsDashboard';
import MemberSegments from './components/MemberSegments';
import CampaignManagement from './components/CampaignManagement';
import BroadcastManagement from './components/BroadcastManagement';
import PromotionManagement from './components/PromotionManagement';
import PointManagement from './components/PointManagement';
import ProductManagement from './components/ProductManagement';
import FeedbackCenter from './components/FeedbackCenter';
import SettingsPage from './components/SettingsPage';
import SystemNews from './components/SystemNews';
import RewardRedemptionManagement from './components/RewardRedemptionManagement';
import DeliveryTrackingCenter from './components/DeliveryTrackingCenter';
import NotificationCenter from './components/NotificationCenter';
import ChatCenter from './components/ChatCenter';
import BannerThumbnailManagement from './components/BannerThumbnailManagement';
import LandingPageConfiguration from './components/LandingPageConfiguration';
import GamificationManagement from './components/GamificationManagement';
import RegisterMaster from './components/RegisterMaster';
import SettingsTheme from './components/SettingsTheme';
import AdminLogin from './components/mobile/AdminLogin';
import MobilePreviewMode from './components/mobile/MobilePreviewMode';
import EventsManagement from './components/EventsManagement';
import EventsAnalytics from './components/EventsAnalytics';
import CampaignVisible from './components/CampaignVisible';
import TierMaster from './components/TierMaster';
import { AppPreviewProvider } from './components/AppPreviewContext';
import SplitViewMode from './components/SplitViewMode';

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
    ]
  },
  { 
    id: 'campaign-management', 
    label: 'Campaign Management', 
    icon: Megaphone,
    submenu: [
      { id: 'campaign', label: 'Campaigns', icon: Megaphone },
      { id: 'campaign-visible', label: 'Campaign Visible', icon: Eye },
      { id: 'events', label: 'Events', icon: CalendarDays },
      { id: 'events-analytics', label: 'Events Analytics', icon: BarChart3 },
      { id: 'promotion', label: 'Promotions', icon: Tag },
      { id: 'gamification', label: 'Gamification', icon: Gamepad2 },
    ]
  },
  { id: 'broadcast', label: 'Broadcast', icon: Radio },
  { 
    id: 'reward-redemption', 
    label: 'Reward Redemption', 
    icon: Gift,
    submenu: [
      { id: 'redemption', label: 'Reward Redemption', icon: Gift },
      { id: 'delivery', label: 'Delivery Tracking', icon: Truck },
    ]
  },
  { 
    id: 'master-management', 
    label: 'Master Management', 
    icon: Package,
    submenu: [
      { id: 'points', label: 'Point', icon: Coins },
      { id: 'products', label: 'Rewards', icon: Package },
      { id: 'tier-master', label: 'Tier Master', icon: Crown },
    ]
  },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare },
  { id: 'chat', label: 'Chat Center', icon: MessageCircle },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { 
    id: 'customer-app-config', 
    label: 'Customer App Configuration', 
    icon: Smartphone,
    submenu: [
      { id: 'register-master', label: 'Register Master', icon: FileText },
      { id: 'settings-theme', label: 'Settings Theme', icon: Palette },
      { id: 'banner-thumbnail', label: 'Banner & Thumbnail', icon: ImageIcon },
      { id: 'landing-page', label: 'Landing Page', icon: Layout },
    ]
  },
  { id: 'settings', label: 'System Administration', icon: Settings },
];

export default function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showSplitView, setShowSplitView] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications] = useState(5);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleMenuClick = (itemId: string, hasSubmenu: boolean) => {
    if (hasSubmenu) {
      toggleMenu(itemId);
    } else {
      setActivePage(itemId);
      if (itemId !== 'member-detail') {
        setSelectedMemberId(null);
      }
    }
  };

  const handleViewMemberDetail = (memberId: string) => {
    setSelectedMemberId(memberId);
    setActivePage('member-detail');
  };

  const handleBackToMembers = () => {
    setSelectedMemberId(null);
    setActivePage('members');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'members':
        return <MemberManagement onViewDetail={handleViewMemberDetail} />;
      case 'member-detail':
        return <MemberDetailPage memberId={selectedMemberId} onBack={handleBackToMembers} />;
      case 'member-analytics':
        return <MemberAnalyticsDashboard />;
      case 'member-segments':
        return <MemberSegments />;
      case 'campaign':
        return <CampaignManagement />;
      case 'campaign-visible':
        return <CampaignVisible />;
      case 'events':
        return <EventsManagement />;
      case 'events-analytics':
        return <EventsAnalytics />;
      case 'broadcast':
        return <BroadcastManagement />;
      case 'promotion':
        return <PromotionManagement />;
      case 'points':
        return <PointManagement />;
      case 'products':
        return <ProductManagement />;
      case 'tier-master':
        return <TierMaster />;
      case 'redemption':
        return <RewardRedemptionManagement />;
      case 'delivery':
        return <DeliveryTrackingCenter />;
      case 'feedback':
        return <FeedbackCenter />;
      case 'chat':
        return <ChatCenter />;
      case 'notifications':
        return <NotificationCenter />;
      case 'register-master':
        return <RegisterMaster />;
      case 'settings-theme':
        return <SettingsTheme />;
      case 'banner-thumbnail':
        return <BannerThumbnailManagement />;
      case 'landing-page':
        return <LandingPageConfiguration />;
      case 'gamification':
        return <GamificationManagement />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  // Show admin login if not authenticated
  if (!isAdminAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAdminAuthenticated(true)} />
  }

  // Show split view mode
  if (showSplitView) {
    return (
      <AppPreviewProvider>
        <SplitViewMode onClose={() => setShowSplitView(false)} />
      </AppPreviewProvider>
    );
  }

  // Show mobile preview if selected
  if (showMobilePreview) {
    return <MobilePreviewMode onBack={() => setShowMobilePreview(false)} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Toaster />
      
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 256 : 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white border-r border-gray-200 overflow-hidden flex-shrink-0 shadow-sm"
      >
        <div className="w-64 h-full flex flex-col">
          {/* Logo with Gradient */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 bg-gradient-to-r from-[#007AFF] to-[#0051D5]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-bold">C</span>
              </div>
              <div>
                <span className="text-white font-semibold block">CRM Master</span>
                <span className="text-blue-100 text-xs">Version 2.0</span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isExpanded = expandedMenus.includes(item.id);
              const isSubmenuActive = hasSubmenu && item.submenu?.some(sub => activePage === sub.id);
              
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
                        layoutId="activeTab"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-[#007AFF] rounded-r"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    <Icon className={`w-5 h-5 ${isActive || isSubmenuActive ? 'text-[#007AFF]' : ''}`} />
                    <span className="text-sm flex-1 text-left">{item.label}</span>
                    {hasSubmenu ? (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    ) : (
                      <ChevronRight
                        className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                          isActive ? 'opacity-100' : ''
                        }`}
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
                              onClick={() => setActivePage(subItem.id)}
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

          {/* User Profile Section */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <Avatar className="w-10 h-10">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-br from-[#007AFF] to-[#0051D5] text-white">
                  AU
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-gray-900 text-sm truncate">Admin User</div>
                <div className="text-gray-500 text-xs truncate">admin@crm.com</div>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation with Gradient */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-gray-100"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <h1 className="text-gray-900 capitalize font-semibold">
              {(() => {
                // First check if activePage is a top-level menu item
                const topLevel = menuItems.find(item => item.id === activePage);
                if (topLevel) return topLevel.label;
                
                // Then check if it's in a submenu
                for (const item of menuItems) {
                  if (item.submenu) {
                    const subItem = item.submenu.find(sub => sub.id === activePage);
                    if (subItem) return subItem.label;
                  }
                }
                return 'Dashboard';
              })()}
            </h1>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md ml-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search members, campaigns, rewards..."
                  className="pl-10 bg-gray-50 border-gray-200"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Split View Mode Button */}
            <Button
              onClick={() => setShowSplitView(true)}
              className="hidden lg:flex bg-[#007AFF] hover:bg-[#0051D5]"
              size="sm"
            >
              <Monitor className="w-4 h-4 mr-2" />
              Split View Mode
            </Button>

            {/* Mobile Preview Button */}
            <Button
              onClick={() => setShowMobilePreview(true)}
              variant="outline"
              size="sm"
              className="hidden md:flex"
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Mobile Preview
            </Button>

            {/* Notifications */}
            <button 
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setActivePage('notifications')}
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 text-white border-0">
                  {notifications}
                </Badge>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <Avatar className="w-9 h-9 cursor-pointer hover:ring-2 hover:ring-[#007AFF] transition-all">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-br from-[#007AFF] to-[#0051D5] text-white">
                  AU
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="h-full"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}