import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Calendar, Trophy, Target, Zap, CheckCircle2, 
  Clock, Coins, Gift, Sparkles
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import MobileBottomNav, { MobileScreen } from './MobileBottomNav';
import { useAppContext } from './MobileAppContainerEnhanced';
import { toast } from 'sonner@2.0.3';

interface MobileMissionsProps {
  onNavigate: (screen: MobileScreen, data?: any) => void;
}

const dailyMissions = [
  {
    id: 'daily-1',
    title: 'Daily Mission',
    description: 'Spin the Lucky Wheel for 7 consecutive days to get free gift.',
    progress: 5,
    total: 7,
    reward: 'Free Collectible Item',
    points: 500,
    icon: '🎡',
    color: '#FF6B00',
    bgColor: '#FFF3E8',
    completed: false,
    type: 'daily',
  },
  {
    id: 'daily-2',
    title: 'Daily Check-in',
    description: 'Log in to the app every day this week.',
    progress: 6,
    total: 7,
    reward: '100 Bonus Points',
    points: 100,
    icon: '📅',
    color: '#2E5BFF',
    bgColor: '#E8F0FF',
    completed: false,
    type: 'daily',
  },
  {
    id: 'daily-3',
    title: 'Share & Earn',
    description: 'Share 3 promotions with friends today.',
    progress: 1,
    total: 3,
    reward: '50 Points',
    points: 50,
    icon: '📱',
    color: '#16C47F',
    bgColor: '#E6F9F3',
    completed: false,
    type: 'daily',
  },
];

const weeklyMissions = [
  {
    id: 'weekly-1',
    title: 'Weekly Shopper',
    description: 'Make 5 purchases at partner stores this week.',
    progress: 3,
    total: 5,
    reward: '1,000 Points',
    points: 1000,
    icon: '🛍️',
    color: '#FFB800',
    bgColor: '#FFF8E6',
    completed: false,
    type: 'weekly',
  },
  {
    id: 'weekly-2',
    title: 'Event Attendee',
    description: 'Participate in 3 different events.',
    progress: 1,
    total: 3,
    reward: '500 Points + Badge',
    points: 500,
    icon: '🎉',
    color: '#E63946',
    bgColor: '#FFE8E9',
    completed: false,
    type: 'weekly',
  },
  {
    id: 'weekly-3',
    title: 'Point Master',
    description: 'Earn 2,000 points through any activities.',
    progress: 1250,
    total: 2000,
    reward: 'Gold Tier Upgrade',
    points: 0,
    icon: '👑',
    color: '#8B5CF6',
    bgColor: '#F3F0FF',
    completed: false,
    type: 'weekly',
  },
];

const campaignMissions = [
  {
    id: 'campaign-1',
    title: 'Summer Challenge',
    description: 'Complete 10 activities during Summer Shopping Festival.',
    progress: 7,
    total: 10,
    reward: 'Exclusive Summer Badge',
    points: 2000,
    icon: '☀️',
    color: '#FF6B00',
    bgColor: '#FFF3E8',
    completed: false,
    type: 'campaign',
    endDate: '2025-12-31',
  },
  {
    id: 'campaign-2',
    title: 'Referral Champion',
    description: 'Invite 5 friends to join the loyalty program.',
    progress: 2,
    total: 5,
    reward: '3,000 Points',
    points: 3000,
    icon: '👥',
    color: '#16C47F',
    bgColor: '#E6F9F3',
    completed: false,
    type: 'campaign',
    endDate: '2025-11-30',
  },
];

export default function MobileMissions({ onNavigate }: MobileMissionsProps) {
  const { theme } = useAppContext();
  const [activeTab, setActiveTab] = useState('daily');
  const [missions, setMissions] = useState({
    daily: dailyMissions,
    weekly: weeklyMissions,
    campaign: campaignMissions,
  });
  const [showConfetti, setShowConfetti] = useState(false);

  const handleStartMission = (mission: any) => {
    if (mission.id === 'daily-1') {
      // Navigate to Lucky Spin Wheel
      onNavigate('gamification');
    } else if (mission.id === 'daily-2') {
      // Daily check-in logic
      toast.success('Daily check-in complete! +10 points', {
        duration: 3000,
      });
    } else {
      toast.info(`Mission "${mission.title}" started!`, {
        duration: 2000,
      });
    }
  };

  const handleCompleteMission = (missionId: string, type: 'daily' | 'weekly' | 'campaign') => {
    const mission = missions[type].find(m => m.id === missionId);
    if (!mission) return;

    if (mission.progress >= mission.total) {
      // Mark as completed
      setMissions(prev => ({
        ...prev,
        [type]: prev[type].map(m => 
          m.id === missionId ? { ...m, completed: true } : m
        )
      }));

      // Show confetti animation
      setShowConfetti(true);
      
      toast.success(`🎉 Mission Complete! You earned ${mission.reward}!`, {
        duration: 4000,
      });

      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    }
  };

  const renderMissionCard = (mission: any) => {
    const progressPercent = (mission.progress / mission.total) * 100;

    return (
      <motion.div
        key={mission.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <Card className="p-4 relative overflow-hidden">
          {mission.completed && (
            <Badge className="absolute top-3 right-3 bg-green-500 text-white border-0">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          )}

          <div className="flex gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
              style={{ backgroundColor: mission.bgColor }}
            >
              {mission.icon}
            </div>
            <div className="flex-1">
              <h4 className="text-gray-900 mb-1">{mission.title}</h4>
              <p className="text-sm text-gray-600">{mission.description}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                Progress: {mission.progress}/{mission.total}
              </span>
              <span className="text-sm" style={{ color: mission.color }}>
                {Math.round(progressPercent)}%
              </span>
            </div>
            <Progress 
              value={progressPercent} 
              className="h-2"
              style={{
                backgroundColor: mission.bgColor,
              }}
            />
          </div>

          {/* Reward Info */}
          <div 
            className="rounded-xl p-3 mb-3"
            style={{ backgroundColor: mission.bgColor }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4" style={{ color: mission.color }} />
                <span className="text-sm text-gray-700">Reward</span>
              </div>
              <div className="flex items-center gap-2">
                {mission.points > 0 && (
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4" style={{ color: mission.color }} />
                    <span className="text-sm" style={{ color: mission.color }}>
                      +{mission.points}
                    </span>
                  </div>
                )}
                <span className="text-sm" style={{ color: mission.color }}>
                  {mission.reward}
                </span>
              </div>
            </div>
          </div>

          {/* Campaign End Date */}
          {mission.endDate && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>Ends: {mission.endDate}</span>
            </div>
          )}

          {/* Action Button */}
          {mission.completed ? (
            <Button
              className="w-full"
              variant="outline"
              disabled
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Completed
            </Button>
          ) : mission.progress >= mission.total ? (
            <Button
              className="w-full"
              style={{ backgroundColor: mission.color }}
              onClick={() => handleCompleteMission(mission.id, mission.type)}
            >
              <Trophy className="w-4 h-4 mr-2" />
              Claim Reward
            </Button>
          ) : (
            <Button
              className="w-full"
              variant="outline"
              style={{ borderColor: mission.color, color: mission.color }}
              onClick={() => handleStartMission(mission)}
            >
              <Zap className="w-4 h-4 mr-2" />
              Start Mission
            </Button>
          )}
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div 
        className="text-white px-6 pt-6 pb-4"
        style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
      >
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => onNavigate('home')}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-white text-xl">All Missions</h2>
            <p className="text-white/80 text-sm">Complete tasks to earn rewards</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 h-12 rounded-none">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="campaign">Campaign</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        <AnimatePresence mode="wait">
          {activeTab === 'daily' && (
            <motion.div
              key="daily"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {missions.daily.map(mission => renderMissionCard(mission))}
            </motion.div>
          )}

          {activeTab === 'weekly' && (
            <motion.div
              key="weekly"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {missions.weekly.map(mission => renderMissionCard(mission))}
            </motion.div>
          )}

          {activeTab === 'campaign' && (
            <motion.div
              key="campaign"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {missions.campaign.map(mission => renderMissionCard(mission))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  y: '50%', 
                  x: '50%',
                  scale: 0,
                  rotate: 0
                }}
                animate={{ 
                  y: `${Math.random() * 100}%`,
                  x: `${Math.random() * 100}%`,
                  scale: [0, 1, 0.8],
                  rotate: Math.random() * 360
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.02,
                  ease: 'easeOut'
                }}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ['#FF6B00', '#2E5BFF', '#16C47F', '#FFB800', '#E63946'][i % 5]
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <MobileBottomNav
        currentScreen="home"
        onNavigate={onNavigate}
        primaryColor={theme.primary}
      />
    </div>
  );
}
