import { useState } from 'react';
import { ArrowLeft, Bell, Calendar, Gift, Tag, Settings as SettingsIcon, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '../ui/sheet';
import MobileBottomNav, { MobileScreen } from './MobileBottomNav';
import { useAppContext } from './MobileAppContainerEnhanced';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';

interface MobileNotificationCenterProps {
  onNavigate: (screen: MobileScreen, data?: any) => void;
}

const notificationsData = [
  {
    id: 1,
    type: 'event',
    icon: Calendar,
    iconColor: '#2E5BFF',
    iconBg: '#2E5BFF15',
    title: 'New Event Available',
    message: 'Summer Shopping Festival is now live! Join now to earn double points.',
    timestamp: '2h ago',
    isRead: false,
    detail: 'The Summer Shopping Festival has started! This is your chance to earn 2x points on all purchases. Event runs until August 31st. Don\'t miss out!',
    actionLabel: 'View Event',
    actionScreen: 'events'
  },
  {
    id: 2,
    type: 'reward',
    icon: Gift,
    iconColor: '#FF6B6B',
    iconBg: '#FF6B6B15',
    title: 'Congratulations!',
    message: 'You\'ve earned a reward from completing the Refer & Earn event.',
    timestamp: '5h ago',
    isRead: false,
    detail: 'Great job! You\'ve successfully completed the Refer & Earn event and earned 500 bonus points. Your points have been credited to your account.',
    actionLabel: 'View Rewards',
    actionScreen: 'rewards'
  },
  {
    id: 3,
    type: 'event',
    icon: Calendar,
    iconColor: '#FF9800',
    iconBg: '#FF980015',
    title: 'Event Ending Soon',
    message: 'Fashion Week Special ends in 2 days. Complete your participation now!',
    timestamp: '1d ago',
    isRead: true,
    detail: 'This is a reminder that the Fashion Week Special event will end in 2 days. Make sure to complete your participation to claim your rewards before it expires.',
    actionLabel: 'View Event',
    actionScreen: 'events'
  },
  {
    id: 4,
    type: 'promotion',
    icon: Tag,
    iconColor: '#9C27B0',
    iconBg: '#9C27B015',
    title: 'Exclusive Promotion',
    message: 'Get 30% off on selected items this weekend only.',
    timestamp: '2d ago',
    isRead: true,
    detail: 'Weekend flash sale! Enjoy 30% off on selected fashion and electronics items. Valid from Friday to Sunday. Shop now while stocks last!',
    actionLabel: 'View Promotions',
    actionScreen: 'promotions'
  },
  {
    id: 5,
    type: 'system',
    icon: SettingsIcon,
    iconColor: '#607D8B',
    iconBg: '#607D8B15',
    title: 'System Update',
    message: 'We\'ve updated our app with new features and improvements.',
    timestamp: '3d ago',
    isRead: true,
    detail: 'We\'ve made several improvements to enhance your experience including faster loading times, improved navigation, and bug fixes. Update now to enjoy the latest features!',
    actionLabel: 'Close',
    actionScreen: 'home'
  },
];

export default function MobileNotificationCenter({ onNavigate }: MobileNotificationCenterProps) {
  const { theme, notifications, markNotificationAsRead, clearAllNotifications } = useAppContext();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleNotificationClick = (notification: any) => {
    setSelectedNotification(notification);
    setShowDetailModal(true);
    if (markNotificationAsRead && !notification.isRead) {
      markNotificationAsRead(notification.id);
    }
  };

  const handleActionClick = () => {
    setShowDetailModal(false);
    setTimeout(() => {
      if (selectedNotification?.actionScreen) {
        onNavigate(selectedNotification.actionScreen as MobileScreen);
      }
    }, 200);
  };

  const handleClearAll = () => {
    if (clearAllNotifications) {
      clearAllNotifications();
    }
    toast.success('All notifications cleared');
  };

  const filterNotifications = (type: string) => {
    const allNotifications = notifications || notificationsData;
    if (type === 'all') return allNotifications;
    return allNotifications.filter((n: any) => n.type === type);
  };

  const unreadCount = (notifications || notificationsData).filter((n: any) => !n.isRead).length;

  const formatTimestamp = (timestamp: string) => {
    return timestamp;
  };

  const groupNotificationsByDate = (notifications: any[]) => {
    const today: any[] = [];
    const yesterday: any[] = [];
    const older: any[] = [];

    notifications.forEach((notification) => {
      if (notification.timestamp.includes('h ago') || notification.timestamp.includes('m ago')) {
        today.push(notification);
      } else if (notification.timestamp === '1d ago') {
        yesterday.push(notification);
      } else {
        older.push(notification);
      }
    });

    return { today, yesterday, older };
  };

  const renderNotificationList = (notifications: any[]) => {
    const { today, yesterday, older } = groupNotificationsByDate(notifications);

    return (
      <div className="space-y-6">
        {today.length > 0 && (
          <div>
            <h3 className="text-xs text-gray-500 px-4 mb-2">Today</h3>
            <div className="space-y-2">
              {today.map((notification) => renderNotificationCard(notification))}
            </div>
          </div>
        )}

        {yesterday.length > 0 && (
          <div>
            <h3 className="text-xs text-gray-500 px-4 mb-2">Yesterday</h3>
            <div className="space-y-2">
              {yesterday.map((notification) => renderNotificationCard(notification))}
            </div>
          </div>
        )}

        {older.length > 0 && (
          <div>
            <h3 className="text-xs text-gray-500 px-4 mb-2">Older</h3>
            <div className="space-y-2">
              {older.map((notification) => renderNotificationCard(notification))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderNotificationCard = (notification: any) => {
    const Icon = notification.icon;

    return (
      <motion.div
        key={notification.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          className={`mx-4 cursor-pointer transition-all hover:shadow-md ${
            !notification.isRead ? 'bg-blue-50/50' : ''
          }`}
          onClick={() => handleNotificationClick(notification)}
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
        >
          <div className="flex gap-3 p-4">
            {/* Icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: notification.iconBg }}
            >
              <Icon className="w-6 h-6" style={{ color: notification.iconColor }} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h4 className="text-sm text-gray-900 pr-2">
                  {notification.title}
                </h4>
                {!notification.isRead && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                )}
              </div>
              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                {notification.message}
              </p>
              <span className="text-xs text-gray-400">
                {formatTimestamp(notification.timestamp)}
              </span>
            </div>

            {/* Arrow */}
            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 self-center" />
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div
        className="text-white px-6 pt-6 pb-4"
        style={{ background: 'linear-gradient(135deg, #2E5BFF, #5B7FFF)' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => onNavigate('home')}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-white text-xl flex-1">Notifications</h2>
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white border-0">
              {unreadCount} new
            </Badge>
          )}
        </div>

        {/* Clear All Button */}
        {(notifications || notificationsData).length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-white/90 hover:bg-white/20 h-8"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-200">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-5 bg-transparent border-0 h-12 px-4">
            {['all', 'event', 'reward', 'promotion', 'system'].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="data-[state=active]:border-b-2 rounded-none capitalize text-xs"
                style={{
                  borderColor: activeTab === tab ? '#2E5BFF' : 'transparent',
                  color: activeTab === tab ? '#2E5BFF' : '#6B7280'
                }}
              >
                {tab === 'all' ? 'All' : tab + 's'}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        <Tabs value={activeTab} className="h-full">
          {['all', 'event', 'reward', 'promotion', 'system'].map((tab) => (
            <TabsContent key={tab} value={tab} className="m-0 py-4">
              {filterNotifications(tab).length > 0 ? (
                renderNotificationList(filterNotifications(tab))
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-gray-900 mb-2">No Notifications</h3>
                  <p className="text-gray-600 text-sm">
                    You're all caught up!
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Detail Modal */}
      <Sheet open={showDetailModal} onOpenChange={setShowDetailModal}>
        <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl">
          {selectedNotification && (
            <>
              <SheetHeader className="text-left mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: selectedNotification.iconBg }}
                  >
                    <selectedNotification.icon
                      className="w-6 h-6"
                      style={{ color: selectedNotification.iconColor }}
                    />
                  </div>
                  <div className="flex-1">
                    <SheetTitle>{selectedNotification.title}</SheetTitle>
                    <p className="text-xs text-gray-400 mt-1">
                      {selectedNotification.timestamp}
                    </p>
                  </div>
                </div>
              </SheetHeader>

              <div className="py-4">
                <p className="text-gray-700 leading-relaxed">
                  {selectedNotification.detail}
                </p>
              </div>

              <SheetFooter className="mt-6">
                <Button
                  onClick={handleActionClick}
                  className="w-full h-12"
                  style={{ backgroundColor: '#2E5BFF' }}
                >
                  {selectedNotification.actionLabel}
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Bottom Navigation */}
      <MobileBottomNav
        currentScreen="home"
        onNavigate={onNavigate}
        primaryColor="#2E5BFF"
      />
    </div>
  );
}
