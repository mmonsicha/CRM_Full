import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  ArrowLeft, Gamepad2, Gift, Coins, Ticket, Home, User
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from './MobileAppContainerEnhanced';
import MobileBottomNav, { MobileScreen } from './MobileBottomNav';

interface MobileGamificationProps {
  userData: any;
  onNavigate: (screen: MobileScreen, data?: any) => void;
}

const games = [
  {
    id: 1,
    name: 'Lucky Spin Wheel',
    type: 'Wheel',
    icon: '🎡',
    description: 'Spin daily for amazing prizes!',
    playsLeft: 3,
    rewards: [
      { id: 1, label: '100 Points', type: 'Points', color: '#FF6B6B', probability: 30 },
      { id: 2, label: '50 Points', type: 'Points', color: '#4ECDC4', probability: 35 },
      { id: 3, label: '$10 Voucher', type: 'Coupon', color: '#45B7D1', probability: 20 },
      { id: 4, label: 'Try Again', type: 'None', color: '#96CEB4', probability: 15 },
    ]
  },
  {
    id: 2,
    name: 'Prize Draw',
    type: 'Random',
    icon: '🎰',
    description: 'Draw cards for mystery rewards',
    playsLeft: 1,
    rewards: [
      { id: 1, label: 'iPhone 15', type: 'Product', color: '#FFB6B9', probability: 5 },
      { id: 2, label: 'AirPods', type: 'Product', color: '#FEE715', probability: 15 },
      { id: 3, label: 'Gift Card', type: 'Coupon', color: '#BAE1FF', probability: 30 },
      { id: 4, label: '10 Points', type: 'Points', color: '#C7CEEA', probability: 50 },
    ]
  },
];

export default function MobileGamification({ userData, onNavigate }: MobileGamificationProps) {
  const { theme } = useAppContext();
  const [selectedGame, setSelectedGame] = useState<typeof games[0] | null>(null);
  const [showGameDialog, setShowGameDialog] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [selectedReward, setSelectedReward] = useState<number | null>(null);

  const handlePlayGame = (game: typeof games[0]) => {
    if (game.playsLeft <= 0) {
      toast.error('No plays left today!');
      return;
    }
    setSelectedGame(game);
    setShowGameDialog(true);
    setSelectedReward(null);
  };

  const handleSpin = () => {
    if (!selectedGame) return;
    
    setSpinning(true);
    setSelectedReward(null);

    // Simulate spinning
    setTimeout(() => {
      // Calculate weighted random selection
      const random = Math.random() * 100;
      let cumulative = 0;
      let winIndex = 0;

      for (let i = 0; i < selectedGame.rewards.length; i++) {
        cumulative += selectedGame.rewards[i].probability;
        if (random <= cumulative) {
          winIndex = i;
          break;
        }
      }

      setSelectedReward(winIndex);
      setSpinning(false);

      const prize = selectedGame.rewards[winIndex];
      if (prize.type !== 'None') {
        toast.success(`🎉 Congratulations!`, {
          description: `You won: ${prize.label}!`
        });
      } else {
        toast('Better luck next time!', {
          description: 'Try again tomorrow'
        });
      }
    }, 3000);
  };

  const handleRandomDraw = (index: number) => {
    if (!selectedGame) return;

    setSelectedReward(index);
    const prize = selectedGame.rewards[index];
    
    toast.success(`🎉 You selected: ${prize.label}!`);
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
          <div className="flex-1">
            <h2 className="text-white">Gamification</h2>
            <p className="text-white/80 text-sm">Play and win rewards!</p>
          </div>
        </div>
      </div>

      {/* Games List */}
      <div className="flex-1 overflow-y-auto pb-20 px-6 pt-6">
        <div className="space-y-4">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-5xl">{game.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-gray-900">{game.name}</h3>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {game.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{game.description}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Gamepad2 className="w-4 h-4" />
                        <span>{game.playsLeft} plays left</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Gift className="w-4 h-4" />
                        <span>{game.rewards.length} prizes</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Rewards Preview */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {game.rewards.map((reward) => (
                    <div
                      key={reward.id}
                      className="aspect-square rounded-lg flex items-center justify-center text-xs text-white text-center p-1"
                      style={{ backgroundColor: reward.color }}
                    >
                      {reward.type === 'Points' && <Coins className="w-4 h-4" />}
                      {reward.type === 'Coupon' && <Ticket className="w-4 h-4" />}
                      {reward.type === 'Product' && <Gift className="w-4 h-4" />}
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handlePlayGame(game)}
                  disabled={game.playsLeft <= 0}
                  className="w-full bg-[#007AFF] hover:bg-[#0051D5]"
                >
                  {game.playsLeft > 0 ? 'Play Now' : 'No Plays Left'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav
        currentScreen="gamification"
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
            className="flex flex-col items-center gap-1"
            style={{ color: theme.primary }}
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

      {/* Game Dialog */}
      <Dialog open={showGameDialog} onOpenChange={setShowGameDialog}>
        <DialogContent className="sm:max-w-lg" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedGame?.icon}</span>
              {selectedGame?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            {selectedGame?.type === 'Wheel' ? (
              // Wheel Game
              <div className="text-center space-y-6">
                <div className="relative w-64 h-64 mx-auto">
                  <motion.div
                    animate={{ 
                      rotate: spinning 
                        ? 360 * 5 + (selectedReward !== null ? (selectedReward / selectedGame.rewards.length) * 360 : 0) 
                        : 0 
                    }}
                    transition={{ 
                      duration: 3,
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                    className="w-full h-full rounded-full relative overflow-hidden shadow-2xl border-8 border-white"
                  >
                    {selectedGame.rewards.map((reward, index) => {
                      const angle = (360 / selectedGame.rewards.length) * index;
                      const nextAngle = (360 / selectedGame.rewards.length) * (index + 1);
                      return (
                        <div
                          key={reward.id}
                          className="absolute inset-0 flex items-center justify-center"
                          style={{
                            clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((angle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((angle - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos((nextAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((nextAngle - 90) * Math.PI / 180)}%)`,
                            backgroundColor: reward.color,
                          }}
                        >
                          <div
                            className="absolute text-white text-xs p-2"
                            style={{
                              transform: `rotate(${angle + (360 / selectedGame.rewards.length) / 2}deg)`,
                              transformOrigin: 'center',
                            }}
                          >
                            {reward.label}
                          </div>
                        </div>
                      );
                    })}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl shadow-lg z-10">
                        🎯
                      </div>
                    </div>
                  </motion.div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
                    <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-red-500" />
                  </div>
                </div>

                <Button
                  onClick={handleSpin}
                  disabled={spinning}
                  size="lg"
                  className="w-full bg-[#007AFF] hover:bg-[#0051D5]"
                >
                  {spinning ? 'Spinning...' : 'Spin the Wheel!'}
                </Button>

                {selectedReward !== null && !spinning && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200"
                  >
                    <p className="text-gray-900 mb-1">🎉 You won!</p>
                    <p className="text-gray-600">{selectedGame.rewards[selectedReward].label}</p>
                  </motion.div>
                )}
              </div>
            ) : (
              // Random Draw Game
              <div className="space-y-6">
                <p className="text-center text-gray-600">Choose a card to reveal your prize!</p>
                <div className="grid grid-cols-2 gap-4">
                  {selectedGame?.rewards.map((reward, index) => (
                    <motion.button
                      key={reward.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRandomDraw(index)}
                      disabled={selectedReward !== null}
                      className="aspect-square rounded-xl text-white p-6 flex flex-col items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                      style={{ backgroundColor: reward.color }}
                    >
                      {selectedReward === index ? (
                        <>
                          {reward.type === 'Points' && <Coins className="w-8 h-8" />}
                          {reward.type === 'Coupon' && <Ticket className="w-8 h-8" />}
                          {reward.type === 'Product' && <Gift className="w-8 h-8" />}
                          <p className="text-sm text-center">{reward.label}</p>
                        </>
                      ) : (
                        <span className="text-3xl">?</span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
