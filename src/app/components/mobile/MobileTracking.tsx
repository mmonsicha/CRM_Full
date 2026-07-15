import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, Phone } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import MobileBottomNav, { MobileScreen } from './MobileBottomNav';
import { useAppContext } from './MobileAppContainerEnhanced';

interface MobileTrackingProps {
  onNavigate: (screen: MobileScreen, data?: any) => void;
}

const deliveries = [
  {
    id: 1,
    rewardName: 'Premium Coffee Set',
    rewardImage: 'from-amber-400 to-orange-500',
    trackingNumber: 'TRK2025060001',
    courier: 'Flash Express',
    status: 'Delivering',
    statusColor: 'blue',
    lastUpdate: '2 hours ago',
    estimatedDelivery: 'Today, 5:00 PM',
    currentLocation: 'Out for delivery - Bangkok Hub',
  },
  {
    id: 2,
    rewardName: 'Wellness Package',
    rewardImage: 'from-green-400 to-teal-500',
    trackingNumber: 'TRK2025060002',
    courier: 'Kerry Express',
    status: 'Preparing',
    statusColor: 'yellow',
    lastUpdate: '5 hours ago',
    estimatedDelivery: 'Tomorrow, 3:00 PM',
    currentLocation: 'Warehouse - Packing',
  },
  {
    id: 3,
    rewardName: 'Tech Gadget Bundle',
    rewardImage: 'from-blue-400 to-purple-500',
    trackingNumber: 'TRK2025060003',
    courier: 'DHL Express',
    status: 'Delivered',
    statusColor: 'green',
    lastUpdate: '1 day ago',
    estimatedDelivery: 'Delivered',
    currentLocation: 'Delivered to recipient',
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Preparing':
      return <Package className="w-5 h-5" />;
    case 'Delivering':
      return <Truck className="w-5 h-5" />;
    case 'Delivered':
      return <CheckCircle className="w-5 h-5" />;
    default:
      return <Clock className="w-5 h-5" />;
  }
};

const getStatusColor = (color: string) => {
  switch (color) {
    case 'green':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'blue':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'yellow':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export default function MobileTracking({ onNavigate }: MobileTrackingProps) {
  const { theme } = useAppContext();

  const handleViewDetails = (delivery: any) => {
    onNavigate('tracking-detail', delivery);
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
          <h2 className="text-white text-xl">Delivery Tracking</h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <p className="text-xs text-white/80 mb-1">In Transit</p>
            <p className="text-2xl text-white">1</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <p className="text-xs text-white/80 mb-1">Preparing</p>
            <p className="text-2xl text-white">1</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <p className="text-xs text-white/80 mb-1">Delivered</p>
            <p className="text-2xl text-white">1</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 pb-20">
        <div className="space-y-4">
          {deliveries.map((delivery) => (
            <Card 
              key={delivery.id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleViewDetails(delivery)}
            >
              <div className="p-4">
                <div className="flex gap-4 mb-4">
                  {/* Reward Image */}
                  <div className={`w-20 h-20 rounded-lg bg-gradient-to-br ${delivery.rewardImage} flex-shrink-0`} />
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-gray-900 mb-1 truncate">{delivery.rewardName}</h4>
                    <p className="text-sm text-gray-600 mb-2">{delivery.courier}</p>
                    <Badge className={`${getStatusColor(delivery.statusColor)} border text-xs`}>
                      {getStatusIcon(delivery.status)}
                      <span className="ml-1">{delivery.status}</span>
                    </Badge>
                  </div>
                </div>

                {/* Tracking Info */}
                <div className="space-y-2 mb-4 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tracking #</span>
                    <span className="text-gray-900 font-mono">{delivery.trackingNumber}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Estimated</span>
                    <span className="text-gray-900">{delivery.estimatedDelivery}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-900">{delivery.currentLocation}</span>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(delivery);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  View Tracking Details
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {deliveries.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">No Active Deliveries</h3>
            <p className="text-gray-600 text-sm mb-6">
              Your redeemed rewards will appear here
            </p>
            <Button
              onClick={() => onNavigate('rewards')}
              style={{ backgroundColor: theme.primary }}
            >
              Browse Rewards
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav
        currentScreen="home"
        onNavigate={onNavigate}
        primaryColor={theme.primary}
      />
    </div>
  );
}
