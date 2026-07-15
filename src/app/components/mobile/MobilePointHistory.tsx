import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, ChevronRight, TrendingUp, TrendingDown, 
  Gift, AlertCircle, Clock, Trash2, Flag, Coins,
  Calendar, CheckCircle, XCircle, Timer
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { useAppContext } from './MobileAppContainerEnhanced';
import { toast } from 'sonner@2.0.3';
import { MobileScreen } from './MobileBottomNav';

interface MobilePointHistoryProps {
  onNavigate: (screen: MobileScreen, data?: any) => void;
  userData: any;
}

type TabType = 'earned' | 'redeemed' | 'received' | 'expiring';

interface Transaction {
  id: string;
  type: 'earned' | 'redeemed' | 'received' | 'expiring';
  title: string;
  description: string;
  points: number;
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'expired';
  referenceCode?: string;
  source?: string;
  expiryDate?: string;
}

const sampleTransactions: Transaction[] = [
  // Earned
  {
    id: 'E001',
    type: 'earned',
    title: 'Earned from Lucky Spin',
    description: 'Campaign participation bonus',
    points: 200,
    date: '2025-11-03',
    time: '14:30',
    status: 'completed',
    referenceCode: 'LS-2025-1103',
    source: 'Lucky Spin Campaign'
  },
  {
    id: 'E002',
    type: 'earned',
    title: 'Daily Check-in Bonus',
    description: 'Streak day 15',
    points: 50,
    date: '2025-11-04',
    time: '08:15',
    status: 'completed',
    referenceCode: 'DC-2025-1104',
    source: 'Daily Check-in'
  },
  {
    id: 'E003',
    type: 'earned',
    title: 'Purchase Bonus',
    description: 'Buy at partner store',
    points: 300,
    date: '2025-11-02',
    time: '16:45',
    status: 'completed',
    referenceCode: 'PB-2025-1102',
    source: 'Partner Store Purchase'
  },
  {
    id: 'E004',
    type: 'earned',
    title: 'Event Participation',
    description: 'Summer Festival 2025',
    points: 150,
    date: '2025-11-01',
    time: '10:20',
    status: 'pending',
    referenceCode: 'EV-2025-1101',
    source: 'Summer Festival'
  },
  // Redeemed
  {
    id: 'R001',
    type: 'redeemed',
    title: 'Redeemed: Starbucks Voucher',
    description: '$10 Coffee voucher',
    points: -500,
    date: '2025-11-03',
    time: '12:00',
    status: 'completed',
    referenceCode: 'RD-2025-1103',
    source: 'Reward Redemption'
  },
  {
    id: 'R002',
    type: 'redeemed',
    title: 'Redeemed: 7-Eleven Coupon',
    description: 'FREE Slurpee',
    points: -300,
    date: '2025-11-01',
    time: '15:30',
    status: 'completed',
    referenceCode: 'RD-2025-1101',
    source: 'Reward Redemption'
  },
  {
    id: 'R003',
    type: 'redeemed',
    title: 'Redeemed: Wellness Package',
    description: 'Spa & Massage',
    points: -800,
    date: '2025-10-30',
    time: '11:00',
    status: 'completed',
    referenceCode: 'RD-2025-1030',
    source: 'Reward Redemption'
  },
  // Received
  {
    id: 'RC001',
    type: 'received',
    title: 'Received from Friend',
    description: 'Referral bonus - John Doe',
    points: 100,
    date: '2025-11-02',
    time: '09:15',
    status: 'completed',
    referenceCode: 'RF-2025-1102',
    source: 'Referral Program'
  },
  {
    id: 'RC002',
    type: 'received',
    title: 'Welcome Bonus',
    description: 'New member gift',
    points: 500,
    date: '2025-10-15',
    time: '14:00',
    status: 'completed',
    referenceCode: 'WB-2025-1015',
    source: 'Registration Bonus'
  },
  {
    id: 'RC003',
    type: 'received',
    title: 'Birthday Gift',
    description: 'Happy birthday from us!',
    points: 200,
    date: '2025-10-28',
    time: '00:01',
    status: 'completed',
    referenceCode: 'BG-2025-1028',
    source: 'Birthday Bonus'
  },
  // Expiring
  {
    id: 'EX001',
    type: 'expiring',
    title: 'Points from Lucky Spin',
    description: 'Campaign participation',
    points: 150,
    date: '2025-08-01',
    time: '14:30',
    status: 'completed',
    expiryDate: '2025-11-30',
    referenceCode: 'LS-2025-0801',
    source: 'Lucky Spin Campaign'
  },
  {
    id: 'EX002',
    type: 'expiring',
    title: 'Purchase Bonus',
    description: 'Store purchase reward',
    points: 200,
    date: '2025-08-15',
    time: '10:20',
    status: 'completed',
    expiryDate: '2025-12-15',
    referenceCode: 'PB-2025-0815',
    source: 'Partner Store'
  },
];

const tabs: { id: TabType; label: string; icon: any }[] = [
  { id: 'earned', label: 'Earned', icon: TrendingUp },
  { id: 'redeemed', label: 'Redeemed', icon: TrendingDown },
  { id: 'received', label: 'Received', icon: Gift },
  { id: 'expiring', label: 'Expiring', icon: AlertCircle },
];

const typeConfig = {
  earned: {
    color: '#28C76F',
    bgColor: '#28C76F15',
    icon: TrendingUp,
  },
  redeemed: {
    color: '#EA5455',
    bgColor: '#EA545515',
    icon: TrendingDown,
  },
  received: {
    color: '#2E5BFF',
    bgColor: '#2E5BFF15',
    icon: Gift,
  },
  expiring: {
    color: '#FF9F43',
    bgColor: '#FF9F4315',
    icon: AlertCircle,
  },
};

export default function MobilePointHistory({ onNavigate, userData }: MobilePointHistoryProps) {
  const { theme } = useAppContext();
  const [activeTab, setActiveTab] = useState<TabType>('earned');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [swipedId, setSwipedId] = useState<string | null>(null);

  const currentPoints = userData?.points || 1650;
  const expiringPoints = sampleTransactions
    .filter(t => t.type === 'expiring')
    .reduce((sum, t) => sum + t.points, 0);

  const filteredTransactions = sampleTransactions.filter(t => t.type === activeTab);

  const handleCardTap = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  const handleDelete = (id: string) => {
    toast.success('Transaction deleted');
    setSwipedId(null);
  };

  const handleReport = (id: string) => {
    toast.info('Issue reported');
    setSwipedId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: 'Completed', color: '#28C76F', bg: '#28C76F15' };
      case 'pending':
        return { label: 'Pending', color: '#FF9F43', bg: '#FF9F4315' };
      case 'expired':
        return { label: 'Expired', color: '#EA5455', bg: '#EA545515' };
      default:
        return { label: status, color: '#6B7280', bg: '#6B728015' };
    }
  };

  const calculateDaysUntilExpiry = (expiryDate?: string) => {
    if (!expiryDate) return 0;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F8FAFD' }}>
      {/* Header */}
      <div
        className="text-white px-6 pt-6 pb-6"
        style={{ background: 'linear-gradient(135deg, #2E5BFF, #7288FF)' }}
      >
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h2 className="text-white text-xl mb-1">Point History</h2>
            <p className="text-white/80 text-sm">View your earning, redemption, and expiry details</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex-1 min-w-[80px] py-4 px-3 flex flex-col items-center gap-1 transition-colors"
              >
                <Icon
                  className="w-5 h-5"
                  style={{ color: isActive ? theme.primary : '#9CA3AF' }}
                />
                <span
                  className="text-xs whitespace-nowrap"
                  style={{ color: isActive ? theme.primary : '#9CA3AF' }}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: theme.primary }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Expiring Points Warning (only on expiring tab) */}
      <AnimatePresence>
        {activeTab === 'expiring' && expiringPoints > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-4 mt-4 overflow-hidden"
          >
            <div
              className="rounded-2xl p-4"
              style={{
                background: 'linear-gradient(135deg, #FFD93D, #FFC300)',
              }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-gray-900" />
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-900 mb-1">⚠️ Points Expiring Soon!</h4>
                  <p className="text-sm text-gray-800 mb-3">
                    You have <span className="font-semibold">{expiringPoints} points</span> expiring on Nov 30, 2025
                  </p>
                  <button
                    onClick={() => onNavigate('rewards')}
                    className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
                  >
                    Use Before Expiry
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction List */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Coins className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No transactions yet</p>
              </div>
            ) : (
              filteredTransactions.map((transaction, index) => {
                const config = typeConfig[transaction.type];
                const Icon = config.icon;
                const statusBadge = getStatusBadge(transaction.status);
                const daysLeft = calculateDaysUntilExpiry(transaction.expiryDate);
                const isSwiped = swipedId === transaction.id;

                return (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative"
                  >
                    {/* Swipe Actions Background */}
                    <AnimatePresence>
                      {isSwiped && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          exit={{ width: 0 }}
                          className="absolute inset-0 flex items-center justify-end gap-2 px-4 rounded-2xl bg-red-50"
                        >
                          <button
                            onClick={() => handleReport(transaction.id)}
                            className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white"
                          >
                            <Flag className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center text-white"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Transaction Card */}
                    <motion.div
                      animate={{ x: isSwiped ? -140 : 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      onTouchStart={(e) => {
                        const startX = e.touches[0].clientX;
                        const handleTouchMove = (e: TouchEvent) => {
                          const currentX = e.touches[0].clientX;
                          if (startX - currentX > 50) {
                            setSwipedId(transaction.id);
                          } else if (currentX - startX > 50) {
                            setSwipedId(null);
                          }
                        };
                        const handleTouchEnd = () => {
                          document.removeEventListener('touchmove', handleTouchMove);
                          document.removeEventListener('touchend', handleTouchEnd);
                        };
                        document.addEventListener('touchmove', handleTouchMove);
                        document.addEventListener('touchend', handleTouchEnd);
                      }}
                    >
                      <Card
                        className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => handleCardTap(transaction)}
                        style={{
                          borderLeft: `4px solid ${config.color}`,
                        }}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: config.bgColor }}
                          >
                            <Icon className="w-6 h-6" style={{ color: config.color }} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="text-sm text-gray-900 line-clamp-1">{transaction.title}</h4>
                              <span
                                className="text-sm flex-shrink-0"
                                style={{ 
                                  color: transaction.points > 0 ? '#28C76F' : '#EA5455'
                                }}
                              >
                                {transaction.points > 0 ? '+' : ''}{transaction.points}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mb-2 line-clamp-1">{transaction.description}</p>
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <Calendar className="w-3 h-3" />
                                <span>{transaction.date}</span>
                                <Clock className="w-3 h-3 ml-1" />
                                <span>{transaction.time}</span>
                              </div>
                              <Badge
                                className="text-xs px-2 py-0.5 border-0"
                                style={{
                                  backgroundColor: statusBadge.bg,
                                  color: statusBadge.color,
                                }}
                              >
                                {statusBadge.label}
                              </Badge>
                            </div>
                            {transaction.expiryDate && (
                              <div className="mt-2 flex items-center gap-1 text-xs" style={{ color: config.color }}>
                                <Timer className="w-3 h-3" />
                                <span>Expires in {daysLeft} days</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Summary Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4"
        style={{
          boxShadow: '0 -4px 12px rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Active Points</p>
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5" style={{ color: theme.primary }} />
              <span className="text-xl text-gray-900">{currentPoints.toLocaleString()}</span>
            </div>
          </div>
          <Button
            onClick={() => onNavigate('rewards')}
            style={{ backgroundColor: theme.primary }}
            className="px-6"
          >
            Redeem Now
          </Button>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: typeConfig[selectedTransaction.type].bgColor }}
                >
                  {(() => {
                    const Icon = typeConfig[selectedTransaction.type].icon;
                    return (
                      <Icon
                        className="w-8 h-8"
                        style={{ color: typeConfig[selectedTransaction.type].color }}
                      />
                    );
                  })()}
                </div>
                <h3 className="text-xl text-gray-900 mb-2">Transaction Details</h3>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-start py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Title</span>
                  <span className="text-sm text-gray-900 text-right">{selectedTransaction.title}</span>
                </div>
                <div className="flex justify-between items-start py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Points</span>
                  <span
                    className="text-sm"
                    style={{
                      color: selectedTransaction.points > 0 ? '#28C76F' : '#EA5455'
                    }}
                  >
                    {selectedTransaction.points > 0 ? '+' : ''}{selectedTransaction.points}
                  </span>
                </div>
                <div className="flex justify-between items-start py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Date & Time</span>
                  <span className="text-sm text-gray-900 text-right">
                    {selectedTransaction.date} {selectedTransaction.time}
                  </span>
                </div>
                <div className="flex justify-between items-start py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Source</span>
                  <span className="text-sm text-gray-900 text-right">{selectedTransaction.source}</span>
                </div>
                <div className="flex justify-between items-start py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Reference Code</span>
                  <span className="text-sm text-gray-900 text-right font-mono">
                    {selectedTransaction.referenceCode}
                  </span>
                </div>
                {selectedTransaction.expiryDate && (
                  <div className="flex justify-between items-start py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Expiry Date</span>
                    <span className="text-sm text-orange-500 text-right">
                      {selectedTransaction.expiryDate}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-start py-3">
                  <span className="text-sm text-gray-500">Status</span>
                  <Badge
                    className="text-xs px-2 py-0.5 border-0"
                    style={{
                      backgroundColor: getStatusBadge(selectedTransaction.status).bg,
                      color: getStatusBadge(selectedTransaction.status).color,
                    }}
                  >
                    {getStatusBadge(selectedTransaction.status).label}
                  </Badge>
                </div>
              </div>

              <Button
                onClick={() => setShowDetailModal(false)}
                variant="outline"
                className="w-full"
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
