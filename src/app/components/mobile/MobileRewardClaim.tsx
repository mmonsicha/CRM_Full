import { ArrowLeft, Gift, Store, Truck, CreditCard, MapPin, ChevronRight, Check, Home } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { MobileScreen } from './MobileBottomNav';

interface MobileRewardClaimProps {
  onNavigate: (screen: MobileScreen, data?: any) => void;
  rewardData?: {
    id: string;
    name: string;
    type: string;
    image: string;
    description: string;
  };
}

export default function MobileRewardClaim({ onNavigate, rewardData }: MobileRewardClaimProps) {
  const [claimMethod, setClaimMethod] = useState<'delivery' | 'store' | 'digital' | 'homeservice' | 'evoucher'>('delivery');
  const [selectedAddress, setSelectedAddress] = useState('home');
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [enableTracking, setEnableTracking] = useState(true);
  const [selectedStore, setSelectedStore] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCouponGeneration, setShowCouponGeneration] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);

  const reward = rewardData || {
    id: '1',
    name: 'Premium Wireless Headphones',
    type: 'Product',
    image: 'https://images.unsplash.com/photo-1502096472573-eaac515392c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwZWxlY3Ryb25pY3MlMjBwcm9kdWN0fGVufDF8fHx8MTc2MjE0MjM3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'High-quality wireless headphones with active noise cancellation',
  };

  // Product Type Detection Logic
  const getProductType = (type: string): 'digital' | 'service' | 'physical' => {
    const typeUpper = type.toUpperCase();
    
    // Digital products
    const digitalKeywords = ['GIFT CARD', 'E-BOOK', 'EBOOK', 'DISCOUNT CODE', 'VOUCHER', 'COUPON', 'DIGITAL', 'E-VOUCHER', 'EVOUCHER'];
    if (digitalKeywords.some(keyword => typeUpper.includes(keyword))) {
      return 'digital';
    }
    
    // Service products
    const serviceKeywords = ['SPA', 'HAIRCUT', 'FORTUNE', 'CLEANING', 'SERVICE', 'MASSAGE', 'TREATMENT', 'CONSULTATION'];
    if (serviceKeywords.some(keyword => typeUpper.includes(keyword))) {
      return 'service';
    }
    
    // Default to physical
    return 'physical';
  };

  const productType = getProductType(reward.type);

  // Get available claim methods based on product type
  const getAvailableClaimMethods = () => {
    switch (productType) {
      case 'digital':
        return ['digital'];
      case 'service':
        return ['homeservice', 'store', 'evoucher'];
      case 'physical':
      default:
        return ['delivery', 'store', 'evoucher'];
    }
  };

  const availableClaimMethods = getAvailableClaimMethods();

  // Set initial claim method based on available methods
  if (!availableClaimMethods.includes(claimMethod)) {
    setClaimMethod(availableClaimMethods[0] as any);
  }

  const addresses = [
    { id: 'home', name: 'Home', address: '123 Main St, Bangkok 10110', isDefault: true },
    { id: 'work', name: 'Office', address: '456 Business Ave, Bangkok 10120', isDefault: false },
  ];

  const stores = [
    { id: '1', name: 'Central World Branch', distance: '2.3 km', phone: '02-123-4567' },
    { id: '2', name: 'Siam Paragon Branch', distance: '3.5 km', phone: '02-234-5678' },
    { id: '3', name: 'EmQuartier Branch', distance: '5.1 km', phone: '02-345-6789' },
  ];

  // Generate next 7 days for booking
  const getNextDays = (count: number) => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < count; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.getDate(),
        monthName: date.toLocaleDateString('en-US', { month: 'short' }),
      });
    }
    return days;
  };

  const availableDays = getNextDays(7);
  const timeSlots = [
    { id: 'morning-1', time: '09:00', period: 'Morning', available: true },
    { id: 'morning-2', time: '10:00', period: 'Morning', available: true },
    { id: 'morning-3', time: '11:00', period: 'Morning', available: false },
    { id: 'afternoon-1', time: '13:00', period: 'Afternoon', available: true },
    { id: 'afternoon-2', time: '14:00', period: 'Afternoon', available: true },
    { id: 'afternoon-3', time: '15:00', period: 'Afternoon', available: true },
    { id: 'evening-1', time: '17:00', period: 'Evening', available: true },
    { id: 'evening-2', time: '18:00', period: 'Evening', available: false },
    { id: 'evening-3', time: '19:00', period: 'Evening', available: true },
  ];

  const handleConfirmClaim = () => {
    setShowConfirmation(true);
    
    // Auto-navigate after 2 seconds
    setTimeout(() => {
      setShowConfirmation(false);
      
      // Only delivery goes to tracking, all others generate digital coupons
      if (claimMethod === 'delivery') {
        onNavigate('reward-tracking' as MobileScreen, {
          ...reward,
          status: 'In Delivery',
          trackingNumber: 'TH' + Math.random().toString().slice(2, 12),
          carrier: 'Kerry Express',
          deliveryProgress: 0,
        });
      } else {
        // Show coupon generation animation for all other methods
        setShowCouponGeneration(true);
        
        // After generation animation, navigate to coupon wallet with new coupon
        setTimeout(() => {
          let newCoupon;
          
          if (claimMethod === 'store') {
            const selectedStoreData = stores.find(s => s.id === selectedStore);
            newCoupon = {
              id: `COUPON-${Date.now()}`,
              title: `${reward.name} - Store ${productType === 'service' ? 'Service' : 'Pickup'}`,
              description: `Redeemable at ${selectedStoreData?.name || 'selected store'}`,
              discount: 'FREE',
              code: `STORE${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
              expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              status: 'Active' as const,
              category: reward.type,
              storeName: selectedStoreData?.name,
              storePhone: selectedStoreData?.phone,
              rewardName: reward.name,
              rewardImage: reward.image,
              terms: [
                `Valid at ${selectedStoreData?.name || 'selected store'} only`,
                'Please bring valid ID for verification',
                'Cannot be exchanged for cash',
                'Valid for 30 days from issue date',
              ],
            };
          } else if (claimMethod === 'homeservice') {
            const selectedAddressData = addresses.find(a => a.id === selectedAddress);
            newCoupon = {
              id: `COUPON-${Date.now()}`,
              title: `${reward.name} - Home Service`,
              description: `Service at ${selectedAddressData?.name || 'your address'}`,
              discount: 'FREE',
              code: `HOME${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
              expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 60 days
              status: 'Active' as const,
              category: reward.type,
              rewardName: reward.name,
              rewardImage: reward.image,
              terms: [
                `Service at ${selectedAddressData?.address || 'selected address'}`,
                'A specialist will contact you within 24 hours',
                'Valid for 60 days from issue date',
                'Cancellation must be made 24 hours in advance',
              ],
            };
          } else if (claimMethod === 'digital') {
            newCoupon = {
              id: `COUPON-${Date.now()}`,
              title: reward.name,
              description: reward.description,
              discount: 'FREE',
              code: `DIGITAL${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
              expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days
              status: 'Active' as const,
              category: reward.type,
              rewardName: reward.name,
              rewardImage: reward.image,
              terms: [
                'Valid at all participating stores',
                'Show QR code at checkout to redeem',
                'Cannot be combined with other offers',
                'Valid for 90 days from issue date',
              ],
            };
          } else if (claimMethod === 'evoucher') {
            newCoupon = {
              id: `COUPON-${Date.now()}`,
              title: `${reward.name} - E-Voucher`,
              description: 'Digital voucher for in-store redemption',
              discount: 'FREE',
              code: `VOUCHER${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
              expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 45 days
              status: 'Active' as const,
              category: reward.type,
              rewardName: reward.name,
              rewardImage: reward.image,
              terms: [
                'Redeemable at any store location',
                'Show QR code to staff for verification',
                'Please bring valid ID',
                'Valid for 45 days from issue date',
              ],
            };
          }
          
          onNavigate('coupon-wallet' as MobileScreen, { newCoupon });
        }, 1500);
      }
    }, 2000);
  };

  const handleBookingConfirm = () => {
    setShowBookingConfirmation(true);
  };

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
          <h2 className="text-white text-xl flex-1">Claim Reward</h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-6">
        {/* Reward Banner */}
        <div className="p-4">
          <Card className="overflow-hidden" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
            <img
              src={reward.image}
              alt={reward.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-start gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#2E5BFF15' }}
                >
                  <Gift className="w-5 h-5" style={{ color: '#2E5BFF' }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">{reward.name}</h3>
                  <p className="text-sm text-gray-600">{reward.description}</p>
                </div>
              </div>
              <div className="mt-3 p-3 rounded-xl" style={{ backgroundColor: '#FFB80015' }}>
                <p className="text-xs" style={{ color: '#FFB800' }}>
                  🎁 <span className="font-semibold">Type:</span> {reward.type}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Claim Method Selection */}
        <div className="px-4 mb-6">
          <h4 className="text-gray-900 mb-3">Choose Claim Method</h4>
          <RadioGroup value={claimMethod} onValueChange={(v: any) => setClaimMethod(v)}>
            <div className="space-y-3">
              {/* Home Delivery Option - Physical products only */}
              {availableClaimMethods.includes('delivery') && (
                <label htmlFor="delivery" className="cursor-pointer">
                  <Card
                    className={`p-4 cursor-pointer transition-all ${
                      claimMethod === 'delivery' ? 'ring-2' : ''
                    }`}
                    style={{
                      borderColor: claimMethod === 'delivery' ? '#2E5BFF' : 'transparent',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: '#2E5BFF15' }}
                      >
                        <Truck className="w-6 h-6" style={{ color: '#2E5BFF' }} />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-gray-900 mb-0.5">Home Delivery</h5>
                        <p className="text-xs text-gray-500">Get it delivered to your address</p>
                      </div>
                      <RadioGroupItem value="delivery" id="delivery" />
                    </div>
                  </Card>
                </label>
              )}

              {/* Home Service Option - Service products only */}
              {availableClaimMethods.includes('homeservice') && (
                <label htmlFor="homeservice" className="cursor-pointer">
                  <Card
                    className={`p-4 cursor-pointer transition-all ${
                      claimMethod === 'homeservice' ? 'ring-2' : ''
                    }`}
                    style={{
                      borderColor: claimMethod === 'homeservice' ? '#2E5BFF' : 'transparent',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: '#9B59B615' }}
                      >
                        <Home className="w-6 h-6" style={{ color: '#9B59B6' }} />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-gray-900 mb-0.5">Home Service</h5>
                        <p className="text-xs text-gray-500">Service at your location</p>
                      </div>
                      <RadioGroupItem value="homeservice" id="homeservice" />
                    </div>
                  </Card>
                </label>
              )}

              {/* Store Pickup Option - Physical & Service products */}
              {availableClaimMethods.includes('store') && (
                <label htmlFor="store" className="cursor-pointer">
                  <Card
                    className={`p-4 cursor-pointer transition-all ${
                      claimMethod === 'store' ? 'ring-2' : ''
                    }`}
                    style={{
                      borderColor: claimMethod === 'store' ? '#2E5BFF' : 'transparent',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: '#FFB80015' }}
                      >
                        <Store className="w-6 h-6" style={{ color: '#FFB800' }} />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-gray-900 mb-0.5">Claim at Store</h5>
                        <p className="text-xs text-gray-500">
                          {productType === 'service' ? 'Visit branch for service' : 'Pick up at nearest branch'}
                        </p>
                      </div>
                      <RadioGroupItem value="store" id="store" />
                    </div>
                  </Card>
                </label>
              )}

              {/* Digital Coupon Option - Digital products */}
              {availableClaimMethods.includes('digital') && (
                <label htmlFor="digital" className="cursor-pointer">
                  <Card
                    className={`p-4 cursor-pointer transition-all ${
                      claimMethod === 'digital' ? 'ring-2' : ''
                    }`}
                    style={{
                      borderColor: claimMethod === 'digital' ? '#2E5BFF' : 'transparent',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: '#16C47F15' }}
                      >
                        <CreditCard className="w-6 h-6" style={{ color: '#16C47F' }} />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-gray-900 mb-0.5">Digital Coupon</h5>
                        <p className="text-xs text-gray-500">Use instantly with QR code</p>
                      </div>
                      <RadioGroupItem value="digital" id="digital" />
                    </div>
                  </Card>
                </label>
              )}

              {/* E-Voucher Option - Physical products */}
              {availableClaimMethods.includes('evoucher') && (
                <label htmlFor="evoucher" className="cursor-pointer">
                  <Card
                    className={`p-4 cursor-pointer transition-all ${
                      claimMethod === 'evoucher' ? 'ring-2' : ''
                    }`}
                    style={{
                      borderColor: claimMethod === 'evoucher' ? '#2E5BFF' : 'transparent',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: '#E6397215' }}
                      >
                        <CreditCard className="w-6 h-6" style={{ color: '#E63972' }} />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-gray-900 mb-0.5">E-Voucher {productType === 'service' ? '(Walk-in)' : ''}</h5>
                        <p className="text-xs text-gray-500">
                          {productType === 'service' 
                            ? 'Walk-in voucher for any branch' 
                            : 'Digital voucher for pickup'}
                        </p>
                      </div>
                      <RadioGroupItem value="evoucher" id="evoucher" />
                    </div>
                  </Card>
                </label>
              )}
            </div>
          </RadioGroup>
        </div>

        {/* Delivery Details */}
        <AnimatePresence mode="wait">
          {claimMethod === 'delivery' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 mb-6"
            >
              <Card className="p-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h5 className="text-gray-900 mb-3">Delivery Details</h5>

                {/* Address Selection */}
                <div className="mb-4">
                  <Label className="text-sm text-gray-700 mb-2 block">Delivery Address</Label>
                  <Select value={selectedAddress} onValueChange={setSelectedAddress}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {addresses.map((addr) => (
                        <SelectItem key={addr.id} value={addr.id}>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" style={{ color: '#2E5BFF' }} />
                            <div>
                              <div className="flex items-center gap-2">
                                <span>{addr.name}</span>
                                {addr.isDefault && (
                                  <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#2E5BFF15', color: '#2E5BFF' }}>
                                    Default
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">{addr.address}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Delivery Speed */}
                <div className="mb-4">
                  <Label className="text-sm text-gray-700 mb-2 block">Delivery Option</Label>
                  <RadioGroup value={deliveryOption} onValueChange={setDeliveryOption}>
                    <div className="space-y-2">
                      <label htmlFor="standard" className="flex items-center justify-between p-3 rounded-xl border cursor-pointer">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="standard" id="standard" />
                          <div>
                            <div className="text-sm text-gray-900">Standard Delivery</div>
                            <div className="text-xs text-gray-500">3-5 business days • Free</div>
                          </div>
                        </div>
                      </label>
                      <label htmlFor="express" className="flex items-center justify-between p-3 rounded-xl border cursor-pointer">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="express" id="express" />
                          <div>
                            <div className="text-sm text-gray-900">Express Delivery</div>
                            <div className="text-xs text-gray-500">1-2 business days • ฿50</div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Real-time Tracking Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: '#F8FAFD' }}>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-900">Enable Real-time Tracking</div>
                  </div>
                  <Switch checked={enableTracking} onCheckedChange={setEnableTracking} />
                </div>
              </Card>
            </motion.div>
          )}

          {/* Store Selection */}
          {claimMethod === 'store' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 mb-6"
            >
              <h5 className="text-gray-900 mb-3">Select Store</h5>
              <div className="space-y-3">
                {stores.map((store) => (
                  <Card
                    key={store.id}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedStore === store.id ? 'ring-2' : ''
                    }`}
                    style={{
                      borderColor: selectedStore === store.id ? '#2E5BFF' : 'transparent',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                    onClick={() => setSelectedStore(store.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h6 className="text-sm text-gray-900 mb-1">{store.name}</h6>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                          <MapPin className="w-3 h-3" />
                          <span>{store.distance} away</span>
                        </div>
                        <div className="text-xs text-gray-500">📞 {store.phone}</div>
                      </div>
                      {selectedStore === store.id && (
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: '#2E5BFF' }}
                        >
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Home Service Details */}
          {claimMethod === 'homeservice' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 mb-6"
            >
              <Card className="p-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h5 className="text-gray-900 mb-3">Service Details</h5>

                {/* Address Selection */}
                <div className="mb-4">
                  <Label className="text-sm text-gray-700 mb-2 block">Service Address</Label>
                  <Select value={selectedAddress} onValueChange={setSelectedAddress}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {addresses.map((addr) => (
                        <SelectItem key={addr.id} value={addr.id}>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" style={{ color: '#2E5BFF' }} />
                            <div>
                              <div className="flex items-center gap-2">
                                <span>{addr.name}</span>
                                {addr.isDefault && (
                                  <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#2E5BFF15', color: '#2E5BFF' }}>
                                    Default
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">{addr.address}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Service Info */}
                <div className="p-3 rounded-xl" style={{ backgroundColor: '#9B59B615' }}>
                  <div className="flex items-start gap-2">
                    <Home className="w-4 h-4 mt-0.5" style={{ color: '#9B59B6' }} />
                    <div className="flex-1">
                      <p className="text-sm mb-1" style={{ color: '#9B59B6' }}>
                        Home Service Appointment
                      </p>
                      <p className="text-xs text-gray-600">
                        A specialist will contact you within 24 hours to schedule your service appointment.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* E-Voucher Info */}
          {claimMethod === 'evoucher' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 mb-6"
            >
              <Card className="p-4" style={{ backgroundColor: '#E6397215', border: 'none' }}>
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#E63972' }}
                  >
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h6 className="text-sm mb-1" style={{ color: '#E63972' }}>
                      {productType === 'service' ? 'E-Voucher Walk-in Service' : 'E-Voucher for Store Pickup'}
                    </h6>
                    <p className="text-xs text-gray-600">
                      {productType === 'service' 
                        ? 'Your e-voucher will be added to your wallet. Walk into any participating branch and show the QR code to redeem your service.' 
                        : 'Your e-voucher will be added to your wallet and can be redeemed at any store location. Show the QR code to collect your reward.'}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confirm Button */}
      <div className="p-4 border-t bg-white">
        <Button
          className="w-full h-12"
          style={{ backgroundColor: '#2E5BFF' }}
          onClick={handleConfirmClaim}
          disabled={claimMethod === 'store' && !selectedStore}
        >
          {claimMethod === 'delivery' && 'Confirm Claim & Track'}
          {claimMethod === 'store' && 'Reserve & Pickup'}
          {claimMethod === 'homeservice' && 'Book Service'}
          {claimMethod === 'digital' && 'Add to Wallet'}
          {claimMethod === 'evoucher' && 'Get E-Voucher'}
        </Button>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowConfirmation(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Confetti Effect */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: '#16C47F15' }}
              >
                <Gift className="w-10 h-10" style={{ color: '#16C47F' }} />
              </motion.div>

              <h3 className="text-xl text-gray-900 mb-2">🎉 Reward Claimed Successfully!</h3>
              <p className="text-sm text-gray-600 mb-6">
                {claimMethod === 'delivery' &&
                  'Your reward will be delivered soon. You can track it anytime in My Rewards.'}
                {claimMethod === 'store' &&
                  'Your reward is reserved! Please bring your ID to collect it at the selected store.'}
                {claimMethod === 'digital' &&
                  'Your coupon is now in your wallet. Show the QR code at checkout to redeem.'}
              </p>

              <div className="flex gap-2">
                {claimMethod === 'delivery' && (
                  <Button
                    className="flex-1"
                    style={{ backgroundColor: '#2E5BFF' }}
                    onClick={() => {
                      setShowConfirmation(false);
                      onNavigate('reward-tracking' as MobileScreen);
                    }}
                  >
                    Track Delivery
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowConfirmation(false);
                    onNavigate('home');
                  }}
                >
                  Back to Home
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coupon Generation Modal */}
      <AnimatePresence>
        {showCouponGeneration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="text-center"
            >
              {/* Animated Coupon Icon */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
                className="w-32 h-32 rounded-3xl mx-auto mb-6 flex items-center justify-center bg-white/20 backdrop-blur-sm"
              >
                <CreditCard className="w-16 h-16 text-white" />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl text-white mb-3"
              >
                Generating Digital Coupon...
              </motion.h3>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-white/90"
              >
                🎟️ Creating your pickup voucher
              </motion.p>

              {/* Loading Animation */}
              <motion.div
                className="flex justify-center gap-2 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-white rounded-full"
                    animate={{
                      y: [0, -20, 0],
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}