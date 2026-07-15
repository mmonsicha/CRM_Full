import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Users, Calendar, MapPin, ChevronRight, Clock, Gift } from 'lucide-react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { MobileScreen } from '../MobileBottomNav';
import { toast } from 'sonner@2.0.3';

export interface EventData {
  id: number | string;
  name: string;
  title?: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  participants: number | string;
  reward: string;
  prize?: string;
  category: string;
  isFavorite?: boolean;
  terms?: string;
  duration?: string;
  status?: string;
  gradient?: string;
  progress?: number;
}

interface EventsListProps {
  events: EventData[];
  onEventClick: (event: EventData) => void;
  onFavoriteToggle?: (eventId: number | string) => void;
  favorites?: (number | string)[];
  compact?: boolean;
  showProgress?: boolean;
}

export default function EventsList({
  events,
  onEventClick,
  onFavoriteToggle,
  favorites = [],
  compact = false,
  showProgress = false,
}: EventsListProps) {
  const handleFavoriteClick = (e: React.MouseEvent, eventId: number | string) => {
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(eventId);
      const isFavorited = favorites.includes(eventId);
      toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
    }
  };

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <Card
            className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
            onClick={() => onEventClick(event)}
          >
            {/* Event Image */}
            <div className="relative h-48">
              <img
                src={event.image}
                alt={event.name || event.title || ''}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                <Badge className="bg-[#007AFF] text-white border-0 shadow-md">
                  {event.category}
                </Badge>
              </div>

              {/* Status Badge */}
              {event.status && (
                <div className="absolute top-3 right-3">
                  <Badge 
                    className={`text-white border-0 shadow-md ${
                      event.status === 'Active' ? 'bg-green-500' :
                      event.status === 'Upcoming' ? 'bg-blue-500' :
                      'bg-gray-500'
                    }`}
                  >
                    {event.status}
                  </Badge>
                </div>
              )}

              {/* Favorite Button */}
              {onFavoriteToggle && (
                <button
                  onClick={(e) => handleFavoriteClick(e, event.id)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                >
                  <Heart
                    className={`w-4.5 h-4.5 ${
                      favorites.includes(event.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-700'
                    }`}
                  />
                </button>
              )}

              {/* Event Title Overlay */}
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-white text-lg mb-1 line-clamp-1">
                  {event.name || event.title}
                </h3>
                <p className="text-white/90 text-sm line-clamp-2">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Event Info */}
            <div className="p-4 space-y-3">
              {/* Event Stats */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{event.duration || formatDateRange(event.startDate, event.endDate)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{typeof event.participants === 'number' ? event.participants.toLocaleString() : event.participants}</span>
                </div>
                <div className="flex items-center gap-1.5 text-yellow-600">
                  <Gift className="w-4 h-4" />
                  <span className="text-sm">{event.reward || event.prize}</span>
                </div>
              </div>

              {/* Progress Bar (if enabled) */}
              {showProgress && event.progress !== undefined && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Progress</span>
                    <span>{event.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${event.progress}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-[#007AFF] to-[#00C6FF] rounded-full"
                    />
                  </div>
                </div>
              )}

              {/* View Details Button */}
              <Button
                className="w-full bg-[#007AFF] hover:bg-[#0051D5] text-white h-10"
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick(event);
                }}
              >
                View Detail
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

// Helper function to format date range
function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  
  const daysUntilEnd = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilEnd > 0) {
    return `${daysUntilEnd} Days Left`;
  } else if (daysUntilEnd === 0) {
    return 'Ends Today';
  } else {
    return 'Ended';
  }
}
