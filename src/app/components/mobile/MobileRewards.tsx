import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  ArrowLeft, Gift, Coins, Star, Home, User, Gamepad2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { toast } from 'sonner@2.0.3';
import { useAppContext } from './MobileAppContainerEnhanced';
import MobileBottomNav, { MobileScreen } from './MobileBottomNav';

interface MobileRewardsProps {
  userData: any;
  onNavigate: (screen: MobileScreen, data?: any) => void;
}

const rewards = [
  {
    id: 1,
    name: 'Starbucks Coffee',
    points: 500,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop',
    category: 'Food & Beverage',
    stock: 25
  },
  {
    id: 2,
    name: '$10 Voucher',
    points: 1000,
    image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=200&h=200&fit=crop',
    category: 'Voucher',
    stock: 100
  },
  {
    id: 3,
    name: 'Movie Tickets (2x)',
    points: 1500,
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&h=200&fit=crop',
    category: 'Entertainment',
    stock: 15
  },
  {
    id: 4,
    name: 'Wireless Earbuds',
    points: 3000,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop',
    category: 'Electronics',
    stock: 5
  },
  {
    id: 5,
    name: 'Spa Voucher',
    points: 2000,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200&h=200&fit=crop',
    category: 'Wellness',
    stock: 10
  },
  {
    id: 6,
    name: 'Premium Coffee Beans',
    points: 800,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&h=200&fit=crop',
    category: 'Food & Beverage',
    stock: 30
  },
];

export default function MobileRewards({ userData, onNavigate }: MobileRewardsProps) {
  const { theme } = useAppContext();
  const [selectedReward, setSelectedReward] = useState<typeof rewards[0] | null>(null);
  const [showRedeemDialog, setShowRedeemDialog] = useState(false);

  const handleRedeemClick = (reward: typeof rewards[0]) => {
    setSelectedReward(reward);
    setShowRedeemDialog(true);
  };

  const handleConfirmRedeem = () => {
    if (!selectedReward) return;
    
    if (userData.points < selectedReward.points) {
      toast.error('Insufficient points!');
      return;
    }

    toast.success('Reward redeemed successfully!', {
      description: `You've redeemed ${selectedReward.name}`
    });
    setShowRedeemDialog(false);
    setSelectedReward(null);
  };

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
          <h2 className="text-white flex-1">Rewards</h2>
        </div>

        {/* Points Balance */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
          <p className="text-white/80 text-sm mb-1">Available Points</p>
          <div className="flex items-baseline gap-2">
            <h1 className="text-white">{userData?.points?.toLocaleString() || 0}</h1>
            <span className="text-white/60">pts</span>
          </div>
        </div>
      </div>

      {/* Rewards List */}
      <div className="flex-1 overflow-y-auto pb-20 px-6 pt-6">
        <div className="grid grid-cols-2 gap-4">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="aspect-square bg-gray-100">
                <img
                  src={reward.image}
                  alt={reward.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-500 mb-1">{reward.category}</p>
                <h4 className="text-sm text-gray-900 mb-2 line-clamp-2">{reward.name}</h4>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-[#007AFF]">
                    <Coins className="w-4 h-4" />
                    <span className="text-sm">{reward.points}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {reward.stock} left
                  </Badge>
                </div>
                <Button
                  onClick={() => handleRedeemClick(reward)}
                  size="sm"
                  className="w-full h-8 bg-[#007AFF] hover:bg-[#0051D5] text-white"
                  disabled={userData.points < reward.points}
                >
                  Redeem
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav
        currentScreen="rewards"
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
            className="flex flex-col items-center gap-1"
            style={{ color: theme.primary }}
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

      {/* Redeem Confirmation Dialog */}
      <Dialog open={showRedeemDialog} onOpenChange={setShowRedeemDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Redemption</DialogTitle>
            <DialogDescription>
              Are you sure you want to redeem this reward?
            </DialogDescription>
          </DialogHeader>
          {selectedReward && (
            <div className="py-4">
              <div className="flex gap-4 mb-4">
                <img
                  src={selectedReward.image}
                  alt={selectedReward.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-gray-900 mb-1">{selectedReward.name}</h4>
                  <p className="text-sm text-gray-500 mb-2">{selectedReward.category}</p>
                  <div className="flex items-center gap-1 text-[#007AFF]">
                    <Coins className="w-4 h-4" />
                    <span className="text-sm">{selectedReward.points} points</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Current Points:</span>
                  <span className="text-gray-900">{userData.points} pts</span>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Redeem Cost:</span>
                  <span className="text-red-600">-{selectedReward.points} pts</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">Remaining:</span>
                    <span className="text-gray-900">{userData.points - selectedReward.points} pts</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRedeemDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmRedeem} className="bg-[#007AFF] hover:bg-[#0051D5]">
              Confirm Redeem
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
