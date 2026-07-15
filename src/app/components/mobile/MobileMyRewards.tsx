import { ArrowLeft, Gift, Package, CheckCircle, Store, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import MobileBottomNav, { MobileScreen } from './MobileBottomNav';
import { motion } from 'motion/react';
import { useState } from 'react';

interface MobileMyRewardsProps {
  onNavigate: (screen: MobileScreen, data?: any) => void;
}

interface Reward {
  id: string;
  name: string;
  type: 'Coupon' | 'Product' | 'Points' | 'Service';
  status: 'Redeemed' | 'Received' | 'Available';
  image: string;
  description: string;
  redeemedDate?: string;
  receivedDate?: string;
  points?: number;
}

export default function MobileMyRewards({ onNavigate }: MobileMyRewardsProps) {
  const [activeTab, setActiveTab] = useState('all');

  // Mock rewards data - Only Redeemed and Received
  const rewards: Reward[] = [
    {
      id: '1',
      name: 'Starbucks Gift Card $20',
      type: 'Coupon',
      status: 'Redeemed',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
      description: 'Digital gift card for Starbucks',
      redeemedDate: '2025-11-03',
      points: 2000,
    },
    {
      id: '2',
      name: 'Haircut & Styling Service',
      type: 'Service',
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1759134198561-e2041049419c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyY3V0JTIwc2Fsb24lMjBiYXJiZXIlMjBzZXJ2aWNlfGVufDF8fHx8MTc2MjUwMDUyMXww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Professional haircut service from HairCut Studio - All branches',
      receivedDate: '2025-11-05',
      points: 3500,
    },
    {
      id: '3',
      name: 'Apple AirPods Pro',
      type: 'Product',
      status: 'Redeemed',
      image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400',
      description: 'Premium wireless earbuds with active noise cancellation',
      redeemedDate: '2025-11-02',
      points: 15000,
    },
    {
      id: '4',
      name: 'Premium Spa Treatment',
      type: 'Service',
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400',
      description: '90-minute luxury spa massage and aromatherapy session',
      receivedDate: '2025-11-01',
      points: 8000,
    },
    {
      id: '5',
      name: 'Nike Running Shoes',
      type: 'Product',
      status: 'Redeemed',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      description: 'Air Max 2024 - Size 42',
      redeemedDate: '2025-10-30',
      points: 12000,
    },
    {
      id: '6',
      name: 'Amazon Gift Card $50',
      type: 'Coupon',
      status: 'Received',
      image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400',
      description: 'Digital Amazon shopping voucher',
      receivedDate: '2025-10-28',
      points: 5000,
    },
    {
      id: '7',
      name: 'Fitness Tracker Watch',
      type: 'Product',
      status: 'Received',
      image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400',
      description: 'Smart fitness tracking watch with heart rate monitor',
      receivedDate: '2025-10-25',
      points: 10000,
    },
  ];

  const getStatusConfig = (status: Reward['status']) => {
    switch (status) {
      case 'Redeemed':
        return { color: '#FFB800', bgColor: '#FFB80015', icon: Package };
      case 'Received':
        return { color: '#16C47F', bgColor: '#16C47F15', icon: CheckCircle };
      case 'Available':
        return { color: '#2E5BFF', bgColor: '#2E5BFF15', icon: Gift };
      default:
        return { color: '#6B7280', bgColor: '#6B728015', icon: Gift };
    }
  };

  const filterRewardsByStatus = (status: string) => {
    if (status === 'all') return rewards;
    if (status === 'available') return rewards.filter(r => r.status === 'Available');
    if (status === 'redeemed') return rewards.filter(r => r.status === 'Redeemed');
    if (status === 'received') return rewards.filter(r => r.status === 'Received');
    return rewards;
  };

  const RewardCard = ({ reward, index }: { reward: Reward; index: number }) => {
    const statusConfig = getStatusConfig(reward.status);
    const StatusIcon = statusConfig.icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card
          className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}
          onClick={() => onNavigate('reward-claim', reward)}
        >
          <div className="flex gap-3 p-4">
            {/* Reward Image */}
            <div className="relative flex-shrink-0">
              <img
                src={reward.image}
                alt={reward.name}
                className="w-24 h-24 rounded-xl object-cover"
              />
              {/* Service Type Indicator */}
              {reward.type === 'Service' && (
                <div
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  style={{ backgroundColor: '#9B59B6' }}
                >
                  💆
                </div>
              )}
            </div>

            {/* Reward Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0 pr-2">
                  <h4 className="text-sm text-gray-900 line-clamp-2 mb-1">
                    {reward.name}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {reward.description}
                  </p>
                </div>
              </div>

              {/* Type Badge */}
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className="text-xs px-2 py-0.5"
                  style={{
                    borderColor: reward.type === 'Service' ? '#9B59B6' : '#2E5BFF',
                    color: reward.type === 'Service' ? '#9B59B6' : '#2E5BFF',
                    backgroundColor: reward.type === 'Service' ? '#9B59B615' : '#2E5BFF05',
                  }}
                >
                  {reward.type} {reward.type === 'Service' && 'Reward'}
                </Badge>
                <Badge
                  className="text-xs px-2 py-0.5"
                  style={{
                    backgroundColor: statusConfig.bgColor,
                    color: statusConfig.color,
                    border: 'none',
                  }}
                >
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {reward.status}
                </Badge>
              </div>

              {/* Date */}
              {reward.redeemedDate && (
                <p className="text-xs text-gray-500 mb-2">
                  📦 Redeemed on {new Date(reward.redeemedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              )}
              {reward.receivedDate && reward.status !== 'Available' && (
                <p className="text-xs text-gray-500 mb-2">
                  ✅ Received on {new Date(reward.receivedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              )}
              {reward.points && (
                <p className="text-xs" style={{ color: '#FFB800' }}>
                  💰 {reward.points.toLocaleString()} points
                </p>
              )}

              {/* Claim Now Button for Available Service Rewards */}
              {reward.status === 'Available' && reward.type === 'Service' && (
                <div className="mt-3">
                  <Button
                    size="sm"
                    className="w-full h-8 text-xs"
                    style={{ backgroundColor: '#9B59B6' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate('reward-claim', reward);
                    }}
                  >
                    Choose Claim Method →
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-16">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ backgroundColor: '#2E5BFF15' }}
      >
        <Gift className="w-10 h-10" style={{ color: '#2E5BFF' }} />
      </div>
      <h3 className="text-gray-900 mb-2">No Rewards Yet</h3>
      <p className="text-gray-600 text-sm mb-6">{message}</p>
      <Button
        onClick={() => onNavigate('events')}
        style={{ backgroundColor: '#2E5BFF' }}
      >
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
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-white text-xl flex-1">My Rewards</h2>
        </div>
        <p className="text-white/80 text-sm ml-13">{rewards.length} total rewards</p>
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
              value="available"
              className="flex-shrink-0 px-6 data-[state=active]:border-b-2 rounded-none"
              style={{
                borderColor: activeTab === 'available' ? '#2E5BFF' : 'transparent',
                color: activeTab === 'available' ? '#2E5BFF' : '#6B7280',
              }}
            >
              Available
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
              value="received"
              className="flex-shrink-0 px-6 data-[state=active]:border-b-2 rounded-none"
              style={{
                borderColor: activeTab === 'received' ? '#2E5BFF' : 'transparent',
                color: activeTab === 'received' ? '#2E5BFF' : '#6B7280',
              }}
            >
              Received
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
            <div className="space-y-3">
              {filterRewardsByStatus('all').length > 0 ? (
                filterRewardsByStatus('all').map((reward, index) => (
                  <RewardCard key={reward.id} reward={reward} index={index} />
                ))
              ) : (
                <EmptyState message="Redeem rewards from the rewards catalog" />
              )}
            </div>
          </TabsContent>

          <TabsContent value="available" className="m-0 p-4">
            <div className="space-y-3">
              {filterRewardsByStatus('available').length > 0 ? (
                filterRewardsByStatus('available').map((reward, index) => (
                  <RewardCard key={reward.id} reward={reward} index={index} />
                ))
              ) : (
                <EmptyState message="No available rewards yet" />
              )}
            </div>
          </TabsContent>

          <TabsContent value="redeemed" className="m-0 p-4">
            <div className="space-y-3">
              {filterRewardsByStatus('redeemed').length > 0 ? (
                filterRewardsByStatus('redeemed').map((reward, index) => (
                  <RewardCard key={reward.id} reward={reward} index={index} />
                ))
              ) : (
                <EmptyState message="No redeemed rewards yet" />
              )}
            </div>
          </TabsContent>

          <TabsContent value="received" className="m-0 p-4">
            <div className="space-y-3">
              {filterRewardsByStatus('received').length > 0 ? (
                filterRewardsByStatus('received').map((reward, index) => (
                  <RewardCard key={reward.id} reward={reward} index={index} />
                ))
              ) : (
                <EmptyState message="No received rewards yet" />
              )}
            </div>
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