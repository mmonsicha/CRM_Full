import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { 
  Bell, Users, Megaphone, Gift, TrendingUp, AlertCircle,
  CheckCircle, Package, Star, Settings, X
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';

interface Notification {
  id: string;
  type: 'system' | 'campaign' | 'member' | 'delivery';
  icon: any;
  iconColor: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'member',
    icon: Users,
    iconColor: 'text-blue-600',
    title: 'New Member Registered',
    description: 'Sarah Chen has joined the loyalty program',
    timestamp: '2 minutes ago',
    read: false,
    link: '/members'
  },
  {
    id: '2',
    type: 'member',
    icon: Gift,
    iconColor: 'text-purple-600',
    title: 'Point Redemption Request Received',
    description: 'John Smith requested to redeem 5,000 points for iPhone 15 Pro',
    timestamp: '15 minutes ago',
    read: false,
    link: '/reward-redemption'
  },
  {
    id: '3',
    type: 'delivery',
    icon: AlertCircle,
    iconColor: 'text-red-600',
    title: 'Delivery Problem Reported',
    description: 'Customer Emily Wong reported package not received (ORD-001234)',
    timestamp: '1 hour ago',
    read: false,
    link: '/delivery-tracking'
  },
  {
    id: '4',
    type: 'campaign',
    icon: Megaphone,
    iconColor: 'text-green-600',
    title: 'Campaign Start Reminder',
    description: 'Summer Campaign 2024 will start in 2 hours',
    timestamp: '2 hours ago',
    read: true,
    link: '/campaigns'
  },
  {
    id: '5',
    type: 'system',
    icon: Settings,
    iconColor: 'text-gray-600',
    title: 'System Update: Version 2.3 Released',
    description: 'New features include enhanced analytics and courier API integration',
    timestamp: '3 hours ago',
    read: true
  },
  {
    id: '6',
    type: 'member',
    icon: TrendingUp,
    iconColor: 'text-amber-600',
    title: 'Member Tier Upgrade',
    description: 'Michael Lee has been upgraded to Gold tier',
    timestamp: '5 hours ago',
    read: true,
    link: '/members'
  },
  {
    id: '7',
    type: 'campaign',
    icon: Star,
    iconColor: 'text-yellow-600',
    title: 'Campaign Performance Alert',
    description: 'Point Booster Q4 campaign reached 80% participation rate',
    timestamp: '1 day ago',
    read: true,
    link: '/campaigns'
  },
  {
    id: '8',
    type: 'delivery',
    icon: Package,
    iconColor: 'text-green-600',
    title: 'Successful Delivery',
    description: 'Order ORD-001235 has been delivered to Lisa Anderson',
    timestamp: '1 day ago',
    read: true,
    link: '/delivery-tracking'
  },
  {
    id: '9',
    type: 'member',
    icon: Users,
    iconColor: 'text-blue-600',
    title: 'Bulk Member Import Completed',
    description: '150 new members imported successfully from CSV file',
    timestamp: '2 days ago',
    read: true,
    link: '/members'
  },
  {
    id: '10',
    type: 'system',
    icon: CheckCircle,
    iconColor: 'text-green-600',
    title: 'Database Backup Completed',
    description: 'Automated daily backup completed successfully',
    timestamp: '2 days ago',
    read: true
  },
];

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    return n.type === activeTab;
  });

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const handleNotificationClick = (notification: Notification) => {
    handleMarkAsRead(notification.id);
    if (notification.link) {
      toast.success(`Navigating to ${notification.link}`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <Bell className="w-8 h-8" />
              <h2 className="text-white">System Notifications</h2>
            </div>
            <p className="text-blue-50 mt-2">Stay updated with important system events and alerts</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <p className="text-white">{unreadCount} Unread</p>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">
                  All
                  {unreadCount > 0 && (
                    <Badge className="ml-2 bg-red-500 text-white border-0">{unreadCount}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
                <TabsTrigger value="campaign">Campaigns</TabsTrigger>
                <TabsTrigger value="member">Members</TabsTrigger>
                <TabsTrigger value="delivery">Delivery</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark All as Read
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center ${notification.iconColor}`}>
                      <notification.icon className="w-6 h-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-gray-900">{notification.title}</h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full" />
                            )}
                          </div>
                          <p className="text-gray-600 mt-1">{notification.description}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-gray-500">{notification.timestamp}</span>
                            <Badge variant="outline" className="capitalize">
                              {notification.type}
                            </Badge>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => handleDeleteNotification(notification.id, e)}
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredNotifications.length === 0 && (
          <Card>
            <CardContent className="pt-20 pb-20 text-center">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-900">No notifications</p>
              <p className="text-gray-500 mt-1">You're all caught up!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
