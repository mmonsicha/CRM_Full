import { ArrowLeft, Calendar, Gift, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import MobileBottomNav, { MobileScreen } from './MobileBottomNav';
import { useAppContext } from './MobileAppContainerEnhanced';
import { motion } from 'motion/react';

interface MobileMyEventsProps {
  onNavigate: (screen: MobileScreen, data?: any) => void;
}

export default function MobileMyEvents({ onNavigate }: MobileMyEventsProps) {
  const { theme, joinedEvents } = useAppContext();

  const getEventStatus = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const start = new Date(endDate);
    start.setMonth(start.getMonth() - 2); // Assume 2 month duration

    if (today < start) {
      return { label: 'Upcoming', color: '#2E5BFF', bgColor: '#2E5BFF15' };
    } else if (today > end) {
      return { label: 'Completed', color: '#6B7280', bgColor: '#6B728015' };
    } else {
      return { label: 'Ongoing', color: '#4CAF50', bgColor: '#4CAF5015' };
    }
  };

  const formatJoinDate = (date: string) => {
    const joinDate = new Date(date);
    return joinDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
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
          <h2 className="text-white text-xl flex-1">My Events</h2>
        </div>
        <p className="text-white/80 text-sm ml-13">
          {joinedEvents?.length || 0} events joined
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20 p-4">
        {joinedEvents && joinedEvents.length > 0 ? (
          <div className="space-y-3">
            {joinedEvents.map((event: any, index: number) => {
              const status = getEventStatus(event.endDate);
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
                    onClick={() => onNavigate('event-detail', { ...event, isJoined: true })}
                    style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                  >
                    <div className="flex gap-4 p-4">
                      {/* Event Thumbnail */}
                      <div 
                        className={`w-24 h-24 rounded-xl bg-gradient-to-br ${event.image} flex-shrink-0`}
                      >
                        <div className="w-full h-full bg-black/10 rounded-xl" />
                      </div>

                      {/* Event Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm text-gray-900 line-clamp-2 pr-2">
                            {event.name}
                          </h4>
                          <Badge 
                            className="text-xs px-2 py-0.5 flex-shrink-0"
                            style={{ 
                              backgroundColor: status.bgColor,
                              color: status.color,
                              border: 'none'
                            }}
                          >
                            {status.label}
                          </Badge>
                        </div>

                        {/* Join Date */}
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                          <Clock className="w-3 h-3" />
                          <span>Joined {formatJoinDate(event.joinDate)}</span>
                        </div>

                        {/* Reward */}
                        <div className="flex items-center gap-1 text-xs mb-3">
                          <Gift className="w-3 h-3" style={{ color: '#FF6B6B' }} />
                          <span style={{ color: '#FF6B6B' }}>{event.reward}</span>
                        </div>

                        {/* View Details Button */}
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full h-7 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate('event-detail', { ...event, isJoined: true });
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">No Events Joined Yet</h3>
            <p className="text-gray-600 text-sm mb-6">
              Start exploring events and join to earn rewards
            </p>
            <Button
              onClick={() => onNavigate('events')}
              style={{ backgroundColor: '#2E5BFF' }}
            >
              Browse Events
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav
        currentScreen="profile"
        onNavigate={onNavigate}
        primaryColor="#2E5BFF"
      />
    </div>
  );
}
