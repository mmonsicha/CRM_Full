import { useState } from 'react';
import { ArrowLeft, Share2, Calendar, Users, Gift, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '../ui/sheet';
import MobileBottomNav, { MobileScreen } from './MobileBottomNav';
import { useAppContext } from './MobileAppContainerEnhanced';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';

interface MobileEventDetailProps {
  eventData: any;
  onNavigate: (screen: MobileScreen, data?: any) => void;
}

export default function MobileEventDetail({ eventData, onNavigate }: MobileEventDetailProps) {
  const { theme, joinEvent } = useAppContext();
  const [isJoined, setIsJoined] = useState(eventData?.isJoined || false);
  const [showTerms, setShowTerms] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleJoinClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmJoin = () => {
    setShowConfirmModal(false);
    // Add event to joined events in context
    if (joinEvent) {
      joinEvent(eventData);
    }
    setIsJoined(true);
    // Show success modal after a brief delay
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 300);
  };

  const handleGoToMyEvents = () => {
    setShowSuccessModal(false);
    setTimeout(() => {
      onNavigate('my-events');
    }, 200);
  };

  const handleShare = () => {
    toast.success('Share link copied to clipboard');
  };

  const formatDate = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const startMonth = startDate.toLocaleString('en-US', { month: 'short' });
    const endMonth = endDate.toLocaleString('en-US', { month: 'short' });
    const year = endDate.getFullYear();

    if (startMonth === endMonth) {
      return `${startDay} - ${endDay} ${endMonth} ${year}`;
    }
    return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <motion.button
            onClick={() => onNavigate('campaign')}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </motion.button>
          <h3 className="text-gray-900 flex-1 text-center px-4 truncate">
            {eventData?.name || 'Event Details'}
          </h3>
          <motion.button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Share2 className="w-5 h-5 text-gray-900" />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Hero Image */}
        <div className={`h-64 bg-gradient-to-br ${eventData?.image || 'from-blue-400 to-purple-500'} relative`}>
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Event Info Card */}
        <div className="px-6 -mt-8 relative z-10">
          <div className="bg-white rounded-2xl shadow-lg p-6" style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.1)' }}>
            {/* Title */}
            <h2 className="text-gray-900 text-xl mb-2">
              {eventData?.name}
            </h2>

            {/* Date Range */}
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <Calendar className="w-5 h-5" />
              <span>{formatDate(eventData?.startDate, eventData?.endDate)}</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#2E5BFF15' }}
                >
                  <Users className="w-5 h-5" style={{ color: '#2E5BFF' }} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Participants</p>
                  <p className="text-sm text-gray-900">{eventData?.participants.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#FF6B6B15' }}
                >
                  <Gift className="w-5 h-5" style={{ color: '#FF6B6B' }} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Reward</p>
                  <p className="text-sm text-gray-900">{eventData?.reward}</p>
                </div>
              </div>
            </div>

            {/* Category Badge */}
            <Badge 
              variant="outline" 
              className="text-xs"
              style={{ borderColor: '#2E5BFF', color: '#2E5BFF' }}
            >
              {eventData?.category}
            </Badge>
          </div>
        </div>

        {/* Description Section */}
        <div className="px-6 py-6">
          <h3 className="text-gray-900 mb-3">About This Event</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {eventData?.description}
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mt-3">
            Join thousands of members in this exciting event and unlock exclusive rewards. 
            Participate now to start earning bonus points and special benefits.
          </p>
        </div>

        <Separator className="mx-6" />

        {/* Event Highlights */}
        <div className="px-6 py-6">
          <h3 className="text-gray-900 mb-4">Event Highlights</h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
              <p className="text-sm text-gray-600">Exclusive rewards for all participants</p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              </div>
              <p className="text-sm text-gray-600">Easy to join with just one tap</p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
              </div>
              <p className="text-sm text-gray-600">Track your progress in real-time</p>
            </div>
          </div>
        </div>

        <Separator className="mx-6" />

        {/* Terms & Conditions Accordion */}
        <div className="px-6 py-6">
          <button
            onClick={() => setShowTerms(!showTerms)}
            className="w-full flex items-center justify-between"
          >
            <h3 className="text-gray-900">Terms & Conditions</h3>
            {showTerms ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>

          <AnimatePresence>
            {showTerms && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-3">
                  <p className="text-sm text-gray-600">
                    {eventData?.terms || 'Terms and conditions will be displayed here.'}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                    <li>Members must be logged in to participate</li>
                    <li>Rewards will be credited within 24-48 hours</li>
                    <li>Event duration and rewards are subject to change</li>
                    <li>One participation per member account</li>
                    <li>Cannot be combined with other promotions</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-16 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        {isJoined ? (
          <Button
            disabled
            className="w-full h-12 bg-gray-200 text-gray-500 cursor-not-allowed"
          >
            ✓ Joined
          </Button>
        ) : (
          <Button
            onClick={handleJoinClick}
            className="w-full h-12"
            style={{ backgroundColor: '#2E5BFF' }}
          >
            Join Event Now
          </Button>
        )}
      </div>

      {/* Confirmation Modal */}
      <Sheet open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <SheetContent side="bottom" className="h-auto rounded-t-3xl">
          <SheetHeader className="text-left mb-4">
            <SheetTitle>Confirm Participation</SheetTitle>
            <SheetDescription>
              You're about to join this event
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 py-4">
            {/* Event Summary */}
            <div className="p-4 rounded-xl bg-gray-50">
              <h4 className="text-gray-900 mb-2">{eventData?.name}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Gift className="w-4 h-4" style={{ color: '#FF6B6B' }} />
                <span>Reward: {eventData?.reward}</span>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              By joining, you agree to the event terms and conditions. Your participation will be recorded and you can track your progress in My Events.
            </p>
          </div>

          <SheetFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
              className="flex-1"
            >
              Not Now
            </Button>
            <Button
              onClick={handleConfirmJoin}
              className="flex-1"
              style={{ backgroundColor: '#2E5BFF' }}
            >
              Confirm Join
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md mx-4 rounded-2xl">
          <div className="flex flex-col items-center text-center py-6">
            {/* Animated Checkmark */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.1
              }}
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: '#4CAF5020' }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.3
                }}
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#4CAF50' }}
              >
                <Check className="w-9 h-9 text-white stroke-[3]" />
              </motion.div>
            </motion.div>

            {/* Success Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-gray-900 text-xl mb-2">
                You've Successfully Joined!
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Your participation has been recorded. Good luck!
              </p>
            </motion.div>

            {/* Action Buttons */}
            <div className="w-full space-y-2">
              <Button
                onClick={() => {
                  setShowSuccessModal(false);
                  setTimeout(() => {
                    onNavigate('reward-claim', {
                      id: 'reward-1',
                      name: eventData?.reward || 'Event Reward',
                      type: 'Product',
                      image: 'https://images.unsplash.com/photo-1674620213535-9b2a2553ef40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaWZ0JTIwYm94JTIwcmV3YXJkJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjIyNDI5MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
                      description: 'Your reward for joining this event',
                    });
                  }, 200);
                }}
                className="w-full h-12"
                style={{ backgroundColor: '#2E5BFF' }}
              >
                🎁 Claim Your Reward
              </Button>
              <Button
                onClick={handleGoToMyEvents}
                variant="outline"
                className="w-full h-10"
              >
                Go to My Events
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation */}
      <MobileBottomNav
        currentScreen="events"
        onNavigate={onNavigate}
        primaryColor="#2E5BFF"
      />
    </div>
  );
}