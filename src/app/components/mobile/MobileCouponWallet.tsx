import { ArrowLeft, Ticket, QrCode, Clock, CheckCircle, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { MobileScreen } from './MobileBottomNav';

interface MobileCouponWalletProps {
  onNavigate: (screen: MobileScreen, data?: any) => void;
  newCouponData?: any;
}

interface Coupon {
  id: string;
  title: string;
  description: string;
  discount: string;
  code: string;
  expiryDate: string;
  status: 'Active' | 'Used' | 'Expired';
  image?: string;
  terms?: string[];
  category?: string;
  storeName?: string;
  storePhone?: string;
  rewardName?: string;
  rewardImage?: string;
}

export default function MobileCouponWallet({ onNavigate, newCouponData }: MobileCouponWalletProps) {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [qrTimer, setQrTimer] = useState(300); // 5 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showNewCouponModal, setShowNewCouponModal] = useState(false);

  // Mock coupons data - will be combined with new coupon
  const baseCoupons: Coupon[] = [
    {
      id: '1',
      title: '50% Off Premium Coffee',
      description: 'Get 50% discount on all premium coffee drinks',
      discount: '50% OFF',
      code: 'COFFEE50',
      expiryDate: '2025-12-31',
      status: 'Active',
      category: 'Food & Beverage',
      terms: [
        'Valid at all participating stores',
        'Cannot be combined with other offers',
        'One use per customer',
        'Valid until December 31, 2025',
      ],
    },
    {
      id: '2',
      title: 'Free Dessert with Any Meal',
      description: 'Complimentary dessert when you purchase any main course',
      discount: 'FREE',
      code: 'DESSERT2025',
      expiryDate: '2025-11-30',
      status: 'Active',
      category: 'Food & Beverage',
      terms: [
        'Valid for dine-in only',
        'Minimum purchase of ฿200 required',
        'Cannot be exchanged for cash',
      ],
    },
    {
      id: '3',
      title: '฿100 Shopping Voucher',
      description: 'Get ฿100 discount on your next purchase',
      discount: '฿100',
      code: 'SHOP100',
      expiryDate: '2025-10-25',
      status: 'Used',
      category: 'Shopping',
      terms: [
        'Minimum purchase of ฿500',
        'Valid at selected stores only',
      ],
    },
    {
      id: '4',
      title: '20% Off Spa Treatment',
      description: 'Enjoy 20% off on all spa treatments',
      discount: '20% OFF',
      code: 'SPA20',
      expiryDate: '2025-10-15',
      status: 'Expired',
      category: 'Wellness',
      terms: [
        'Advance booking required',
        'Valid for treatments above ฿1000',
      ],
    },
  ];

  // Combine base coupons with new coupon data if provided
  const coupons: Coupon[] = newCouponData ? [newCouponData, ...baseCoupons] : baseCoupons;

  // Show new coupon modal on mount if new coupon exists
  useEffect(() => {
    if (newCouponData) {
      setShowNewCouponModal(true);
      setTimeout(() => {
        setShowNewCouponModal(false);
      }, 3000);
    }
  }, [newCouponData]);

  // QR Timer countdown
  useEffect(() => {
    if (isTimerActive && qrTimer > 0) {
      const timer = setTimeout(() => setQrTimer(qrTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (qrTimer === 0) {
      setIsTimerActive(false);
      setShowQR(false);
      setQrTimer(300);
    }
  }, [qrTimer, isTimerActive]);

  const filterCouponsByStatus = (status: string) => {
    const statusMap: { [key: string]: Coupon['status'][] } = {
      active: ['Active'],
      used: ['Used'],
      expired: ['Expired'],
    };
    return coupons.filter(c => statusMap[status]?.includes(c.status));
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUseCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setShowQR(true);
    setIsTimerActive(true);
    setQrTimer(300);
  };

  const CouponCard = ({ coupon, index }: { coupon: Coupon; index: number }) => {
    const isActive = coupon.status === 'Active';
    const isUsed = coupon.status === 'Used';
    const isExpired = coupon.status === 'Expired';

    const daysUntilExpiry = Math.ceil(
      (new Date(coupon.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card
          className={`overflow-hidden relative ${
            isExpired || isUsed ? 'opacity-60' : ''
          }`}
          style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}
        >
          {/* Coupon Design with Cut-Edge Style */}
          <div className="relative">
            {/* Left Circle Notch */}
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 rounded-r-full"
              style={{ backgroundColor: '#F8FAFD' }}
            />
            {/* Right Circle Notch */}
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 rounded-l-full"
              style={{ backgroundColor: '#F8FAFD' }}
            />

            <div
              className="p-4"
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, #2E5BFF 0%, #5B7FFF 100%)'
                  : 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)',
              }}
            >
              {/* Status Badge */}
              {isUsed && (
                <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded text-xs text-gray-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Used
                </div>
              )}
              {isExpired && (
                <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded text-xs" style={{ color: '#E63946' }}>
                  Expired
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Ticket className="w-5 h-5 text-white" />
                    <span className="text-xs text-white/80">{coupon.category}</span>
                  </div>
                  <h4 className="text-white mb-1">{coupon.title}</h4>
                  <p className="text-white/80 text-xs">{coupon.description}</p>
                </div>
                <div className="text-right ml-3">
                  <div
                    className="text-2xl mb-1"
                    style={{
                      background: 'linear-gradient(135deg, #FFB800, #FFC933)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 'bold',
                    }}
                  >
                    {coupon.discount}
                  </div>
                </div>
              </div>

              {/* Dotted Line */}
              <div className="border-t border-dashed border-white/30 my-3" />

              {/* Code and Expiry */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded text-white text-xs">
                    {coupon.code}
                  </div>
                </div>
                <div className="text-white/80 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {isActive && daysUntilExpiry > 0 && (
                    <span>
                      {daysUntilExpiry} day{daysUntilExpiry > 1 ? 's' : ''} left
                    </span>
                  )}
                  {isExpired && <span>Expired</span>}
                  {isUsed && <span>Redeemed</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="p-3 bg-white">
            <Button
              className="w-full h-9"
              variant={isActive ? 'default' : 'outline'}
              style={isActive ? { backgroundColor: '#2E5BFF' } : {}}
              disabled={!isActive}
              onClick={() => handleUseCoupon(coupon)}
            >
              {isActive && (
                <>
                  <QrCode className="w-4 h-4 mr-2" />
                  Use Now
                </>
              )}
              {isUsed && 'Already Used'}
              {isExpired && 'Expired'}
            </Button>
          </div>

          {/* Terms Link */}
          {coupon.terms && coupon.terms.length > 0 && (
            <div className="px-3 pb-3">
              <button
                className="text-xs text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedCoupon(coupon)}
              >
                View Terms & Conditions
              </button>
            </div>
          )}
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
        <Ticket className="w-10 h-10" style={{ color: '#2E5BFF' }} />
      </div>
      <h3 className="text-gray-900 mb-2">No Coupons Yet</h3>
      <p className="text-gray-600 text-sm mb-6">{message}</p>
      <Button onClick={() => onNavigate('events')} style={{ backgroundColor: '#2E5BFF' }}>
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
            onClick={() => onNavigate('my-rewards' as MobileScreen)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-white text-xl flex-1">Coupon Wallet</h2>
        </div>
        <p className="text-white/80 text-sm ml-13">{coupons.length} total coupons</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="bg-white border-b">
          <TabsList className="w-full justify-start overflow-x-auto h-12 bg-transparent p-0">
            <TabsTrigger
              value="active"
              className="flex-shrink-0 px-8 data-[state=active]:border-b-2 rounded-none"
              style={{
                borderColor: activeTab === 'active' ? '#2E5BFF' : 'transparent',
                color: activeTab === 'active' ? '#2E5BFF' : '#6B7280',
              }}
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              value="used"
              className="flex-shrink-0 px-8 data-[state=active]:border-b-2 rounded-none"
              style={{
                borderColor: activeTab === 'used' ? '#2E5BFF' : 'transparent',
                color: activeTab === 'used' ? '#2E5BFF' : '#6B7280',
              }}
            >
              Used
            </TabsTrigger>
            <TabsTrigger
              value="expired"
              className="flex-shrink-0 px-8 data-[state=active]:border-b-2 rounded-none"
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
        <div className="flex-1 overflow-y-auto pb-6">
          <TabsContent value="active" className="m-0 p-4">
            <div className="space-y-4">
              {filterCouponsByStatus('active').length > 0 ? (
                filterCouponsByStatus('active').map((coupon, index) => (
                  <CouponCard key={coupon.id} coupon={coupon} index={index} />
                ))
              ) : (
                <EmptyState message="Join events and claim rewards to get exclusive coupons" />
              )}
            </div>
          </TabsContent>

          <TabsContent value="used" className="m-0 p-4">
            <div className="space-y-4">
              {filterCouponsByStatus('used').length > 0 ? (
                filterCouponsByStatus('used').map((coupon, index) => (
                  <CouponCard key={coupon.id} coupon={coupon} index={index} />
                ))
              ) : (
                <EmptyState message="No used coupons yet" />
              )}
            </div>
          </TabsContent>

          <TabsContent value="expired" className="m-0 p-4">
            <div className="space-y-4">
              {filterCouponsByStatus('expired').length > 0 ? (
                filterCouponsByStatus('expired').map((coupon, index) => (
                  <CouponCard key={coupon.id} coupon={coupon} index={index} />
                ))
              ) : (
                <EmptyState message="No expired coupons" />
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* QR Code Full Screen Modal */}
      <AnimatePresence>
        {showQR && selectedCoupon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ background: 'linear-gradient(135deg, #2E5BFF, #5B7FFF)' }}
          >
            <div className="h-full flex flex-col text-white">
              {/* Header */}
              <div className="flex items-center justify-between p-6">
                <h3 className="text-xl">Scan to Redeem</h3>
                <button
                  onClick={() => {
                    setShowQR(false);
                    setIsTimerActive(false);
                    setQrTimer(300);
                  }}
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* QR Code */}
              <div className="flex-1 flex items-center justify-center p-6">
                <motion.div
                  initial={{ scale: 0.8, rotateY: 0 }}
                  animate={{ scale: 1, rotateY: 360 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white p-8 rounded-3xl"
                  style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}
                >
                  {/* Mock QR Code */}
                  <div className="w-64 h-64 bg-gray-900 rounded-2xl flex items-center justify-center mb-4">
                    <div className="text-center">
                      <QrCode className="w-48 h-48 text-white mx-auto mb-2" />
                      <div className="text-white text-xs">{selectedCoupon.code}</div>
                    </div>
                  </div>

                  {/* Coupon Info */}
                  <div className="text-center">
                    <h4 className="text-gray-900 mb-1">{selectedCoupon.title}</h4>
                    <div
                      className="text-2xl mb-2"
                      style={{
                        background: 'linear-gradient(135deg, #2E5BFF, #5B7FFF)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 'bold',
                      }}
                    >
                      {selectedCoupon.discount}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Timer and Code */}
              <div className="p-6 space-y-4">
                {/* Countdown Timer */}
                <motion.div
                  animate={{ scale: qrTimer < 60 ? [1, 1.05, 1] : 1 }}
                  transition={{ duration: 1, repeat: qrTimer < 60 ? Infinity : 0 }}
                  className="text-center"
                >
                  <div className="text-sm text-white/80 mb-2">Valid for</div>
                  <div
                    className="text-4xl"
                    style={{
                      color: qrTimer < 60 ? '#FFB800' : '#FFFFFF',
                    }}
                  >
                    {formatTimer(qrTimer)}
                  </div>
                </motion.div>

                {/* Coupon Code */}
                <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
                  <div className="text-center">
                    <div className="text-sm text-white/80 mb-1">Coupon Code</div>
                    <div className="text-2xl tracking-wider">{selectedCoupon.code}</div>
                  </div>
                </Card>

                {/* Instructions */}
                <div className="text-center text-sm text-white/80">
                  Show this QR code to the cashier to redeem your coupon
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terms Modal */}
      <AnimatePresence>
        {selectedCoupon && !showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-end z-50"
            onClick={() => setSelectedCoupon(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-t-3xl w-full max-h-[80%] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl text-gray-900">Terms & Conditions</h3>
                  <button
                    onClick={() => setSelectedCoupon(null)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="mb-4">
                  <h4 className="text-gray-900 mb-2">{selectedCoupon.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{selectedCoupon.description}</p>
                </div>

                {selectedCoupon.terms && selectedCoupon.terms.length > 0 && (
                  <div>
                    <h5 className="text-sm text-gray-700 mb-3">Please read carefully:</h5>
                    <ul className="space-y-2">
                      {selectedCoupon.terms.map((term, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-gray-400 mt-0.5">•</span>
                          <span>{term}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedCoupon.status === 'Active' && (
                  <Button
                    className="w-full h-12 mt-6"
                    style={{ backgroundColor: '#2E5BFF' }}
                    onClick={() => {
                      handleUseCoupon(selectedCoupon);
                      setSelectedCoupon(null);
                    }}
                  >
                    <QrCode className="w-5 h-5 mr-2" />
                    Use Coupon Now
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Coupon Modal */}
      <AnimatePresence>
        {showNewCouponModal && newCouponData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-end z-50"
            onClick={() => setShowNewCouponModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-t-3xl w-full max-h-[80%] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl text-gray-900">New Coupon Available</h3>
                  <button
                    onClick={() => setShowNewCouponModal(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="mb-4">
                  <h4 className="text-gray-900 mb-2">{newCouponData.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{newCouponData.description}</p>
                </div>

                {newCouponData.terms && newCouponData.terms.length > 0 && (
                  <div>
                    <h5 className="text-sm text-gray-700 mb-3">Please read carefully:</h5>
                    <ul className="space-y-2">
                      {newCouponData.terms.map((term, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-gray-400 mt-0.5">•</span>
                          <span>{term}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {newCouponData.status === 'Active' && (
                  <Button
                    className="w-full h-12 mt-6"
                    style={{ backgroundColor: '#2E5BFF' }}
                    onClick={() => {
                      handleUseCoupon(newCouponData);
                      setShowNewCouponModal(false);
                    }}
                  >
                    <QrCode className="w-5 h-5 mr-2" />
                    Use Coupon Now
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}