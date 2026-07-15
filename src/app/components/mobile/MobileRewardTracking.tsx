import { ArrowLeft, Package, Truck, CheckCircle, XCircle, MapPin, Phone, Copy, AlertCircle, Camera } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Textarea } from '../ui/textarea';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { MobileScreen } from './MobileBottomNav';
import { toast } from 'sonner@2.0.3';

interface MobileRewardTrackingProps {
  onNavigate: (screen: MobileScreen, data?: any) => void;
  rewardData?: any;
}

export default function MobileRewardTracking({ onNavigate, rewardData }: MobileRewardTrackingProps) {
  const [currentStep, setCurrentStep] = useState(2);
  const [showMapOverlay, setShowMapOverlay] = useState(false);
  const [showReportIssue, setShowReportIssue] = useState(false);
  const [issueReason, setIssueReason] = useState('');
  const [simulateProgress, setSimulateProgress] = useState(false);

  const reward = rewardData || {
    id: '2',
    name: 'Wireless Bluetooth Headphones',
    image: 'https://images.unsplash.com/photo-1502096472573-eaac515392c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwZWxlY3Ryb25pY3MlMjBwcm9kdWN0fGVufDF8fHx8MTc2MjE0MjM3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    trackingNumber: 'TH1234567890',
    carrier: 'Kerry Express',
    deliveryProgress: 50,
  };

  const steps = [
    {
      id: 1,
      title: 'Order Placed',
      description: 'Your reward claim has been received',
      date: '2025-11-01 10:30 AM',
      icon: Package,
      color: '#16C47F',
    },
    {
      id: 2,
      title: 'Packed',
      description: 'Your reward has been packed and ready to ship',
      date: '2025-11-02 02:15 PM',
      icon: Package,
      color: '#2E5BFF',
    },
    {
      id: 3,
      title: 'Out for Delivery',
      description: 'Your reward is on the way',
      date: currentStep >= 3 ? '2025-11-03 09:00 AM' : '',
      icon: Truck,
      color: '#FFB800',
    },
    {
      id: 4,
      title: 'Delivered',
      description: 'Reward successfully delivered',
      date: currentStep >= 4 ? '2025-11-03 04:30 PM' : '',
      icon: CheckCircle,
      color: '#16C47F',
    },
  ];

  const carrierInfo = {
    name: reward.carrier || 'Kerry Express',
    phone: '1217',
    hotline: '02-123-4567',
  };

  // Auto-simulate delivery progress
  useEffect(() => {
    if (simulateProgress) {
      const timer = setTimeout(() => {
        if (currentStep < 4) {
          setCurrentStep(currentStep + 1);
        } else {
          setSimulateProgress(false);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, simulateProgress]);

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(reward.trackingNumber);
    toast.success('Tracking number copied!');
  };

  const handleSubmitIssue = () => {
    toast.success('Issue reported successfully');
    setShowReportIssue(false);
    setIssueReason('');
  };

  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ backgroundColor: '#F8FAFD' }}>
      {/* Header */}
      <div
        className="text-white px-6 py-6"
        style={{ background: 'linear-gradient(135deg, #2E5BFF, #5B7FFF)' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('my-rewards' as MobileScreen)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-white text-xl flex-1">Delivery Tracking</h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-6">
        {/* Reward Info */}
        <div className="p-4">
          <Card className="overflow-hidden" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
            <div className="flex gap-3 p-4">
              <img
                src={reward.image}
                alt={reward.name}
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h4 className="text-sm text-gray-900 mb-1">{reward.name}</h4>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#2E5BFF15', color: '#2E5BFF' }}>
                    {reward.type || 'Product'}
                  </span>
                  <span
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      backgroundColor: currentStep === 4 ? '#16C47F15' : '#FFB80015',
                      color: currentStep === 4 ? '#16C47F' : '#FFB800',
                    }}
                  >
                    {currentStep === 4 ? 'Delivered' : 'In Transit'}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Tracking Number */}
        <div className="px-4 mb-4">
          <Card className="p-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs text-gray-500 mb-1">Tracking Number</div>
                <div className="text-sm text-gray-900">{reward.trackingNumber}</div>
              </div>
              <button
                onClick={handleCopyTracking}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#2E5BFF15' }}
              >
                <Copy className="w-4 h-4" style={{ color: '#2E5BFF' }} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500 mb-1">Carrier</div>
                <div className="text-sm text-gray-900">{carrierInfo.name}</div>
              </div>
              <a
                href={`tel:${carrierInfo.phone}`}
                className="flex items-center gap-1 text-sm"
                style={{ color: '#2E5BFF' }}
              >
                <Phone className="w-4 h-4" />
                <span>{carrierInfo.phone}</span>
              </a>
            </div>
          </Card>
        </div>

        {/* Progress Bar */}
        <div className="px-4 mb-4">
          <Card className="p-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">Delivery Progress</span>
              <span className="text-sm" style={{ color: '#2E5BFF' }}>
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2 mb-3" />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Step {currentStep} of {steps.length}</span>
              <span>{steps[currentStep - 1]?.title}</span>
            </div>
          </Card>
        </div>

        {/* Track in Real-time Button */}
        <div className="px-4 mb-4">
          <Button
            className="w-full h-12 flex items-center justify-center gap-2"
            style={{ backgroundColor: '#16C47F' }}
            onClick={() => setShowMapOverlay(true)}
          >
            <MapPin className="w-5 h-5" />
            Track in Real-Time
          </Button>
        </div>

        {/* Simulate Auto Progress */}
        {currentStep < 4 && (
          <div className="px-4 mb-4">
            <Button
              variant="outline"
              className="w-full h-10"
              onClick={() => setSimulateProgress(true)}
              disabled={simulateProgress}
            >
              {simulateProgress ? 'Simulating Progress...' : '⚡ Simulate Real-time Update (Demo)'}
            </Button>
          </div>
        )}

        {/* Tracking Timeline */}
        <div className="px-4 mb-4">
          <h5 className="text-gray-900 mb-3">Delivery Timeline</h5>
          <Card className="p-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div className="space-y-4">
              {steps.map((step, index) => {
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                const StepIcon = step.icon;

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className="relative flex-shrink-0">
                        <motion.div
                          animate={{
                            backgroundColor: isCompleted || isCurrent ? step.color : '#E5E7EB',
                            scale: isCurrent ? [1, 1.1, 1] : 1,
                          }}
                          transition={{ duration: 0.3, repeat: isCurrent ? Infinity : 0, repeatDelay: 1 }}
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                        >
                          <StepIcon className="w-5 h-5 text-white" />
                        </motion.div>
                        {index < steps.length - 1 && (
                          <div
                            className="absolute left-5 top-10 w-0.5 h-8"
                            style={{
                              backgroundColor: currentStep > step.id ? '#2E5BFF' : '#E5E7EB',
                            }}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-4">
                        <h6 className={`text-sm mb-1 ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step.title}
                        </h6>
                        <p className={`text-xs mb-1 ${isCompleted || isCurrent ? 'text-gray-600' : 'text-gray-400'}`}>
                          {step.description}
                        </p>
                        {step.date && (
                          <p className="text-xs text-gray-400">{step.date}</p>
                        )}
                        {isCurrent && simulateProgress && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-2 text-xs px-2 py-1 rounded inline-block"
                            style={{ backgroundColor: '#FFB80015', color: '#FFB800' }}
                          >
                            ⚡ Updating in real-time...
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Report Issue */}
        <div className="px-4 mb-4">
          <Button
            variant="outline"
            className="w-full h-10 flex items-center justify-center gap-2"
            onClick={() => setShowReportIssue(true)}
          >
            <AlertCircle className="w-4 h-4" />
            Report an Issue
          </Button>
        </div>

        {/* Delivery Success Message */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4"
          >
            <Card className="p-4" style={{ backgroundColor: '#16C47F15', border: 'none' }}>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: '#16C47F' }} />
                <div>
                  <h6 className="text-sm mb-1" style={{ color: '#16C47F' }}>
                    🎉 Reward Delivered Successfully!
                  </h6>
                  <p className="text-xs text-gray-600">
                    Your reward has been delivered. We hope you enjoy it! Please rate your delivery experience.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Map Overlay */}
      <AnimatePresence>
        {showMapOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowMapOverlay(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl"
              style={{ height: '85%' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Map Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-gray-900">Live Tracking</h3>
                <button
                  onClick={() => setShowMapOverlay(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <XCircle className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Mock Map */}
              <div className="flex-1 bg-gray-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: '#2E5BFF' }}
                    >
                      <Truck className="w-8 h-8 text-white" />
                    </motion.div>
                    <h4 className="text-gray-900 mb-2">Driver is on the way</h4>
                    <p className="text-sm text-gray-600 mb-4">Estimated arrival: 30 minutes</p>
                    <div className="p-3 rounded-xl bg-white inline-block" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                      <p className="text-xs text-gray-600 mb-1">Current Location</p>
                      <p className="text-sm text-gray-900">📍 Sukhumvit Rd, Bangkok</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Footer */}
              <div className="p-4 border-t bg-white">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#2E5BFF15' }}
                  >
                    <Package className="w-6 h-6" style={{ color: '#2E5BFF' }} />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm text-gray-900 mb-0.5">Driver: John Doe</h5>
                    <p className="text-xs text-gray-500">Kerry Express • {reward.trackingNumber}</p>
                  </div>
                  <a
                    href="tel:0812345678"
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#16C47F' }}
                  >
                    <Phone className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Issue Modal */}
      <AnimatePresence>
        {showReportIssue && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowReportIssue(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl text-gray-900 mb-4">Report an Issue</h3>
              
              <div className="mb-4">
                <label className="text-sm text-gray-700 mb-2 block">What's the problem?</label>
                <Textarea
                  placeholder="Describe the issue with your delivery..."
                  value={issueReason}
                  onChange={(e) => setIssueReason(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="mb-4">
                <label className="text-sm text-gray-700 mb-2 block">Attach Photo (Optional)</label>
                <button className="w-full h-24 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 text-gray-500 hover:border-gray-400 transition-colors">
                  <Camera className="w-5 h-5" />
                  <span className="text-sm">Upload Photo</span>
                </button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowReportIssue(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  style={{ backgroundColor: '#E63946' }}
                  onClick={handleSubmitIssue}
                  disabled={!issueReason.trim()}
                >
                  Submit Report
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
