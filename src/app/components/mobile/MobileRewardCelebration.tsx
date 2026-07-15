import { Gift, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent } from '../ui/dialog';
import { motion } from 'motion/react';

interface MobileRewardCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  onViewRewards: () => void;
  rewardData?: {
    title: string;
    description: string;
    points?: number;
  };
}

export default function MobileRewardCelebration({
  isOpen,
  onClose,
  onViewRewards,
  rewardData
}: MobileRewardCelebrationProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4 rounded-2xl overflow-hidden p-0">
        {/* Confetti Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: ['#FF6B6B', '#4CAF50', '#2E5BFF', '#FFD700', '#9C27B0'][i % 5],
                left: `${Math.random() * 100}%`,
                top: `-10%`
              }}
              initial={{ y: 0, opacity: 1, rotate: 0 }}
              animate={{
                y: 500,
                opacity: 0,
                rotate: 360,
                x: (Math.random() - 0.5) * 200
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: 'easeOut'
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center text-center py-12 px-6 bg-gradient-to-b from-white via-white to-purple-50">
          {/* Animated Gift Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.2
            }}
            className="relative mb-6"
          >
            {/* Sparkle effects */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute -top-4 -right-4"
            >
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </motion.div>

            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, -180, -360]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5
              }}
              className="absolute -bottom-2 -left-4"
            >
              <Sparkles className="w-6 h-6 text-blue-400" />
            </motion.div>

            {/* Gift Box */}
            <motion.div
              animate={{
                y: [0, -10, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="w-28 h-28 rounded-3xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl"
            >
              <Gift className="w-16 h-16 text-white" />
            </motion.div>
          </motion.div>

          {/* Success Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl text-gray-900 mb-2">
              🎉 Congratulations!
            </h2>
            <p className="text-gray-600 mb-6">
              {rewardData?.description || 
                "You've earned a reward from your event participation"}
            </p>
            
            {rewardData?.points && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: 'spring' }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white mb-6"
              >
                <span className="text-2xl">+{rewardData.points}</span>
                <span className="text-sm">Points</span>
              </motion.div>
            )}
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="w-full"
          >
            <Button
              onClick={onViewRewards}
              className="w-full h-12 mb-3"
              style={{ backgroundColor: '#2E5BFF' }}
            >
              View My Rewards
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full"
            >
              Close
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
