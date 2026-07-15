import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Star } from 'lucide-react';

interface CustomerAuthProps {
  onLoginSuccess: (userData: any) => void;
}

export default function CustomerAuth({ onLoginSuccess }: CustomerAuthProps) {
  const [loadingStage, setLoadingStage] = useState<'loading' | 'success' | 'complete'>('loading');
  const [dots, setDots] = useState('');

  // Animated dots for loading text
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Auto login flow
  useEffect(() => {
    // Stage 1: Loading animation (2.0 seconds)
    const loadingTimer = setTimeout(() => {
      setLoadingStage('success');
    }, 2000);

    // Stage 2: Success message (0.5 seconds)
    const successTimer = setTimeout(() => {
      setLoadingStage('complete');
      
      // Call login success with Gold Member data
      onLoginSuccess({
        name: 'Gold Member',
        phone: '0812345678',
        points: 12400,
        rank: 'Gold',
        tier: 'Gold',
        email: 'goldmember@example.com',
        avatar: null,
        pointBalance: 12400
      });
    }, 2500);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(successTimer);
    };
  }, [onLoginSuccess]);

  return (
    <div 
      className="h-full flex items-center justify-center overflow-hidden"
      style={{ background: '#FFF8E7' }}
    >
      <AnimatePresence mode="wait">
        {loadingStage === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col items-center justify-center px-8"
          >
            {/* Floating Sparkles Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{ 
                    x: Math.random() * 400,
                    y: Math.random() * 800,
                    opacity: 0 
                  }}
                  animate={{ 
                    y: [null, -100],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                >
                  <Star 
                    className="text-amber-400" 
                    size={12 + Math.random() * 12}
                    fill="currentColor"
                  />
                </motion.div>
              ))}
            </div>

            {/* Main Logo with Pulse Animation */}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10 mb-8"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 rounded-[32px] flex items-center justify-center shadow-2xl">
                <motion.div
                  animate={{ 
                    rotate: [0, 360]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Sparkles className="w-12 h-12 text-white" strokeWidth={2.5} />
                </motion.div>
              </div>
              
              {/* Glow effect */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-[32px] blur-2xl -z-10"
              />
            </motion.div>

            {/* Loading Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center space-y-3 relative z-10"
            >
              <h2 className="text-gray-900 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                Welcome Back!
              </h2>
              <p className="text-gray-600 bg-white/40 backdrop-blur-sm px-4 py-1.5 rounded-full inline-block">
                Preparing your experience{dots}
              </p>
            </motion.div>

            {/* Animated Loader Bars */}
            <motion.div 
              className="flex gap-2 mt-8 relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 bg-gradient-to-t from-amber-400 to-yellow-400 rounded-full"
                  animate={{ 
                    height: ['20px', '40px', '20px']
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>

            {/* Cute Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-center relative z-10"
            >
              <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                <motion.span
                  animate={{ rotate: [0, 20, 0, -20, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl"
                >
                  ✨
                </motion.span>
                <span className="text-sm text-gray-600">Loading your rewards</span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {loadingStage === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col items-center justify-center px-8"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              className="relative"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              </div>

              {/* Success Glow */}
              <motion.div
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity
                }}
                className="absolute inset-0 bg-green-400 rounded-full blur-2xl -z-10"
              />
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center"
            >
              <h2 className="text-gray-900 mb-2 bg-white/60 backdrop-blur-sm px-6 py-2 rounded-full inline-block">
                Welcome back, Gold Member! ✨
              </h2>
              <p className="text-gray-600 text-sm bg-white/40 backdrop-blur-sm px-4 py-1.5 rounded-full inline-block">
                12,400 points available
              </p>
            </motion.div>

            {/* Celebration Confetti */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: ['#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#8B5CF6'][i % 5],
                    left: `${20 + Math.random() * 60}%`,
                    top: '40%'
                  }}
                  initial={{ opacity: 1, y: 0, x: 0 }}
                  animate={{ 
                    opacity: [1, 1, 0],
                    y: [0, -200 - Math.random() * 100],
                    x: [(Math.random() - 0.5) * 200],
                    rotate: Math.random() * 360
                  }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.02,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
