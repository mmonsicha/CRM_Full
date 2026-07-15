import { ArrowLeft, TrendingUp, TrendingDown, Clock, Calendar, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import MobileBottomNav, { MobileScreen } from './MobileBottomNav';
import { motion } from 'motion/react';
import { useState } from 'react';

interface MobilePointsHistoryProps {
  onNavigate: (screen: MobileScreen, data?: any) => void;
}

interface Transaction {
  id: string;
  date: string;
  type: 'Earned' | 'Redeemed' | 'Expired';
  points: number;
  description: string;
  icon?: string;
}

export default function MobilePointsHistory({ onNavigate }: MobilePointsHistoryProps) {
  const [activeTab, setActiveTab] = useState('all');

  const transactions: Transaction[] = [
    {
      id: '1',
      date: '2025-11-04',
      type: 'Earned',
      points: 100,
      description: 'Joined Event "Halloween Hunt"',
      icon: '🎃',
    },
    {
      id: '2',
      date: '2025-11-03',
      type: 'Redeemed',
      points: -200,
      description: 'Reward "Coffee Voucher"',
      icon: '☕',
    },
    {
      id: '3',
      date: '2025-11-02',
      type: 'Earned',
      points: 50,
      description: 'Completed Purchase',
      icon: '🛍️',
    },
    {
      id: '4',
      date: '2025-11-01',
      type: 'Earned',
      points: 200,
      description: 'Friend Referral Bonus',
      icon: '👥',
    },
    {
      id: '5',
      date: '2025-10-31',
      type: 'Expired',
      points: -50,
      description: 'Unused points expired',
      icon: '⏰',
    },
    {
      id: '6',
      date: '2025-10-30',
      type: 'Redeemed',
      points: -150,
      description: 'Reward "Free Dessert"',
      icon: '🍰',
    },
    {
      id: '7',
      date: '2025-10-29',
      type: 'Earned',
      points: 75,
      description: 'Birthday Bonus',
      icon: '🎂',
    },
    {
      id: '8',
      date: '2025-10-28',
      type: 'Earned',
      points: 100,
      description: 'Joined Event "Summer Festival"',
      icon: '☀️',
    },
    {
      id: '9',
      date: '2025-10-27',
      type: 'Redeemed',
      points: -300,
      description: 'Reward "Wireless Headphones"',
      icon: '🎧',
    },
    {
      id: '10',
      date: '2025-10-26',
      type: 'Earned',
      points: 150,
      description: 'Tier Upgrade Bonus',
      icon: '🥇',
    },
  ];

  const filterTransactions = (type?: string) => {
    if (!type || type === 'all') return transactions;
    return transactions.filter(t => t.type.toLowerCase() === type);
  };

  const getTypeConfig = (type: Transaction['type']) => {
    switch (type) {
      case 'Earned':
        return { color: '#16C47F', bgColor: '#16C47F15', icon: TrendingUp, prefix: '+' };
      case 'Redeemed':
        return { color: '#2E5BFF', bgColor: '#2E5BFF15', icon: TrendingDown, prefix: '' };
      case 'Expired':
        return { color: '#E63946', bgColor: '#E6394615', icon: Clock, prefix: '' };
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTotalByType = (type: string) => {
    return filterTransactions(type).reduce((sum, t) => sum + Math.abs(t.points), 0);
  };

  const TransactionCard = ({ transaction, index }: { transaction: Transaction; index: number }) => {
    const config = getTypeConfig(transaction.type);
    const Icon = config.icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card className="p-4 mb-3" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: config.bgColor }}
            >
              {transaction.icon ? (
                <span className="text-2xl">{transaction.icon}</span>
              ) : (
                <Icon className="w-6 h-6" style={{ color: config.color }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h4 className="text-sm text-gray-900 line-clamp-1 pr-2">{transaction.description}</h4>
                <div
                  className="text-sm flex-shrink-0"
                  style={{ color: config.color }}
                >
                  {config.prefix}{transaction.points}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">{formatDate(transaction.date)}</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  const EmptyState = () => (
    <div className="text-center py-16">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ backgroundColor: '#2E5BFF15' }}
      >
        <Clock className="w-10 h-10" style={{ color: '#2E5BFF' }} />
      </div>
      <h3 className="text-gray-900 mb-2">No Transactions Yet</h3>
      <p className="text-gray-600 text-sm mb-6">Start earning points by joining events</p>
      <Button onClick={() => onNavigate('events')} style={{ backgroundColor: '#2E5BFF' }}>
        Explore Events
      </Button>
    </div>
  );

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ backgroundColor: '#F8FAFD' }}>
      {/* Header */}
      <div
        className="text-white px-6 py-6"
        style={{ background: 'linear-gradient(135deg, #2E5BFF, #5B7FFF)' }}
      >
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => onNavigate('point-history' as MobileScreen)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-white text-xl flex-1">Points History</h2>
          <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Download className="w-5 h-5" />
          </button>
        </div>
        <p className="text-white/80 text-sm ml-13">{transactions.length} total transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="px-4 py-4 bg-white border-b">
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 border-2" style={{ borderColor: '#16C47F15', backgroundColor: '#16C47F08' }}>
            <div className="text-xs text-gray-600 mb-1">Total Earned</div>
            <div className="flex items-center gap-1" style={{ color: '#16C47F' }}>
              <TrendingUp className="w-4 h-4" />
              <span className="text-lg">+{getTotalByType('earned')}</span>
            </div>
          </Card>
          <Card className="p-3 border-2" style={{ borderColor: '#2E5BFF15', backgroundColor: '#2E5BFF08' }}>
            <div className="text-xs text-gray-600 mb-1">Redeemed</div>
            <div className="flex items-center gap-1" style={{ color: '#2E5BFF' }}>
              <TrendingDown className="w-4 h-4" />
              <span className="text-lg">{getTotalByType('redeemed')}</span>
            </div>
          </Card>
          <Card className="p-3 border-2" style={{ borderColor: '#E6394615', backgroundColor: '#E6394608' }}>
            <div className="text-xs text-gray-600 mb-1">Expired</div>
            <div className="flex items-center gap-1" style={{ color: '#E63946' }}>
              <Clock className="w-4 h-4" />
              <span className="text-lg">{getTotalByType('expired')}</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="bg-white border-b">
          <TabsList className="w-full justify-start overflow-x-auto h-12 bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="flex-shrink-0 px-6 data-[state=active]:border-b-2 rounded-none"
              style={{
                borderColor: activeTab === 'all' ? '#2E5BFF' : 'transparent',
                color: activeTab === 'all' ? '#2E5BFF' : '#6B7280',
              }}
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="earned"
              className="flex-shrink-0 px-6 data-[state=active]:border-b-2 rounded-none"
              style={{
                borderColor: activeTab === 'earned' ? '#2E5BFF' : 'transparent',
                color: activeTab === 'earned' ? '#2E5BFF' : '#6B7280',
              }}
            >
              Earned
            </TabsTrigger>
            <TabsTrigger
              value="redeemed"
              className="flex-shrink-0 px-6 data-[state=active]:border-b-2 rounded-none"
              style={{
                borderColor: activeTab === 'redeemed' ? '#2E5BFF' : 'transparent',
                color: activeTab === 'redeemed' ? '#2E5BFF' : '#6B7280',
              }}
            >
              Redeemed
            </TabsTrigger>
            <TabsTrigger
              value="expired"
              className="flex-shrink-0 px-6 data-[state=active]:border-b-2 rounded-none"
              style={{
                borderColor: activeTab === 'expired' ? '#2E5BFF' : 'transparent',
                color: activeTab === 'expired' ? '#2E5BFF' : '#6B7280',
              }}
            >
              Expired
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pb-20">
          <TabsContent value="all" className="m-0 p-4">
            {filterTransactions('all').map((transaction, index) => (
              <TransactionCard key={transaction.id} transaction={transaction} index={index} />
            ))}
          </TabsContent>

          <TabsContent value="earned" className="m-0 p-4">
            {filterTransactions('earned').length > 0 ? (
              filterTransactions('earned').map((transaction, index) => (
                <TransactionCard key={transaction.id} transaction={transaction} index={index} />
              ))
            ) : (
              <EmptyState />
            )}
          </TabsContent>

          <TabsContent value="redeemed" className="m-0 p-4">
            {filterTransactions('redeemed').length > 0 ? (
              filterTransactions('redeemed').map((transaction, index) => (
                <TransactionCard key={transaction.id} transaction={transaction} index={index} />
              ))
            ) : (
              <EmptyState />
            )}
          </TabsContent>

          <TabsContent value="expired" className="m-0 p-4">
            {filterTransactions('expired').length > 0 ? (
              filterTransactions('expired').map((transaction, index) => (
                <TransactionCard key={transaction.id} transaction={transaction} index={index} />
              ))
            ) : (
              <EmptyState />
            )}
          </TabsContent>
        </div>
      </Tabs>

      {/* Bottom Navigation */}
      <MobileBottomNav
        currentScreen="profile"
        onNavigate={onNavigate}
        primaryColor="#2E5BFF"
      />
    </div>
  );
}
