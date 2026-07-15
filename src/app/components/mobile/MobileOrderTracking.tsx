import { useState } from 'react';
import { ArrowLeft, Package, Truck, CheckCircle, MapPin, Clock, Search, Filter, ChevronRight } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { motion, AnimatePresence } from 'motion/react';
import { MobileScreen } from './MobileBottomNav';

interface MobileOrderTrackingProps {
  onNavigate: (screen: MobileScreen, data?: any) => void;
}

interface OrderStatus {
  id: string;
  label: string;
  count: number;
  color: string;
  bgColor: string;
  icon: any;
}

interface Order {
  id: string;
  orderNumber: string;
  itemName: string;
  itemImage: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'pickup';
  date: string;
  time: string;
  quantity: number;
  trackingNumber?: string;
  estimatedDelivery?: string;
  address?: string;
  pickupLocation?: string;
}

const orderStatuses: OrderStatus[] = [
  { id: 'pending', label: 'Pending', count: 2, color: '#FF9F43', bgColor: '#FFF3E6', icon: Clock },
  { id: 'in-transit', label: 'In Transit', count: 3, color: '#2E5BFF', bgColor: '#E8EFFF', icon: Truck },
  { id: 'delivered', label: 'Delivered', count: 12, color: '#28C76F', bgColor: '#E6F9F0', icon: CheckCircle },
  { id: 'pickup', label: 'Ready for Pickup', count: 1, color: '#9B59B6', bgColor: '#F4ECFA', icon: MapPin },
];

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2025-001',
    itemName: 'Starbucks Coffee Voucher $20',
    itemImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
    status: 'in-transit',
    date: '2025-11-03',
    time: '14:30',
    quantity: 1,
    trackingNumber: 'TRK-2025-11030001',
    estimatedDelivery: '2025-11-05',
    address: '123 Main St, Bangkok, Thailand'
  },
  {
    id: '2',
    orderNumber: 'ORD-2025-002',
    itemName: 'Apple AirPods Pro',
    itemImage: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400',
    status: 'in-transit',
    date: '2025-11-02',
    time: '10:15',
    quantity: 1,
    trackingNumber: 'TRK-2025-11020001',
    estimatedDelivery: '2025-11-06',
    address: '123 Main St, Bangkok, Thailand'
  },
  {
    id: '3',
    orderNumber: 'ORD-2025-003',
    itemName: 'Premium Spa Package',
    itemImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400',
    status: 'pickup',
    date: '2025-11-01',
    time: '16:45',
    quantity: 1,
    pickupLocation: 'Wellness Center, Floor 2, Central World'
  },
  {
    id: '4',
    orderNumber: 'ORD-2025-004',
    itemName: 'Nike Running Shoes',
    itemImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    status: 'pending',
    date: '2025-11-04',
    time: '09:20',
    quantity: 1,
    estimatedDelivery: '2025-11-08'
  },
  {
    id: '5',
    orderNumber: 'ORD-2025-005',
    itemName: 'Wireless Headphones',
    itemImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    status: 'pending',
    date: '2025-11-04',
    time: '11:00',
    quantity: 1,
    estimatedDelivery: '2025-11-10'
  },
  {
    id: '6',
    orderNumber: 'ORD-2025-006',
    itemName: 'Amazon Gift Card $50',
    itemImage: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400',
    status: 'in-transit',
    date: '2025-11-01',
    time: '13:30',
    quantity: 1,
    trackingNumber: 'TRK-2025-11010002',
    estimatedDelivery: '2025-11-04'
  },
  {
    id: '7',
    orderNumber: 'ORD-2025-007',
    itemName: 'McDonald\'s Meal Voucher',
    itemImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    status: 'delivered',
    date: '2025-10-30',
    time: '15:20',
    quantity: 2,
  },
  {
    id: '8',
    orderNumber: 'ORD-2025-008',
    itemName: 'Fitness Tracker Watch',
    itemImage: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400',
    status: 'delivered',
    date: '2025-10-28',
    time: '10:45',
    quantity: 1,
  },
  {
    id: '9',
    orderNumber: 'ORD-2025-009',
    itemName: 'Cinema Tickets (2x)',
    itemImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400',
    status: 'delivered',
    date: '2025-10-25',
    time: '18:00',
    quantity: 2,
  }
];

export default function MobileOrderTracking({ onNavigate }: MobileOrderTrackingProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = mockOrders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesSearch = order.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusInfo = (status: string) => {
    return orderStatuses.find(s => s.id === status) || orderStatuses[0];
  };

  const handleStatusCardClick = (statusId: string) => {
    setSelectedStatus(selectedStatus === statusId ? 'all' : statusId);
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F8FAFD' }}>
      {/* Header */}
      <div
        className="text-white px-6 pt-6 pb-4"
        style={{ background: 'linear-gradient(135deg, #2E5BFF, #7288FF)' }}
      >
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h2 className="text-white text-xl mb-1">My Order Tracking</h2>
            <p className="text-white/80 text-sm">Track all your reward deliveries</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60"
          />
        </div>
      </div>

      {/* Status Cards */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <div className="grid grid-cols-2 gap-3">
          {orderStatuses.map((status) => {
            const Icon = status.icon;
            const isActive = selectedStatus === status.id;
            return (
              <motion.button
                key={status.id}
                onClick={() => handleStatusCardClick(status.id)}
                className="text-left p-4 rounded-2xl border-2 transition-all"
                style={{
                  backgroundColor: isActive ? status.bgColor : '#FFFFFF',
                  borderColor: isActive ? status.color : '#E5E7EB',
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: status.bgColor }}
                  >
                    <Icon className="w-5 h-5" style={{ color: status.color }} />
                  </div>
                  <span
                    className="text-2xl"
                    style={{ color: status.color }}
                  >
                    {status.count}
                  </span>
                </div>
                <p className="text-sm text-gray-900">{status.label}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Active Filter Badge */}
      {selectedStatus !== 'all' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 bg-white border-b border-gray-100"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Filtered by:</span>
            <Badge
              style={{ 
                backgroundColor: getStatusInfo(selectedStatus).bgColor,
                color: getStatusInfo(selectedStatus).color 
              }}
            >
              {getStatusInfo(selectedStatus).label}
            </Badge>
            <button
              onClick={() => setSelectedStatus('all')}
              className="ml-auto text-sm text-blue-600"
            >
              Clear
            </button>
          </div>
        </motion.div>
      )}

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="p-4 space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((order, index) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                    <button
                      onClick={() => onNavigate('reward-tracking', order)}
                      className="w-full text-left"
                    >
                      <div className="p-4">
                        <div className="flex gap-3 mb-3">
                          {/* Item Image */}
                          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                            <img
                              src={order.itemImage}
                              alt={order.itemName}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Order Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="text-gray-900 line-clamp-2">{order.itemName}</h3>
                              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            </div>
                            <p className="text-sm text-gray-500 mb-2">{order.orderNumber}</p>
                            <div
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs"
                              style={{
                                backgroundColor: statusInfo.bgColor,
                                color: statusInfo.color
                              }}
                            >
                              <StatusIcon className="w-3.5 h-3.5" />
                              {statusInfo.label}
                            </div>
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="pt-3 border-t border-gray-100 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Order Date</span>
                            <span className="text-gray-900">{order.date} • {order.time}</span>
                          </div>
                          
                          {order.trackingNumber && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Tracking #</span>
                              <span className="text-gray-900 font-mono text-xs">{order.trackingNumber}</span>
                            </div>
                          )}

                          {order.estimatedDelivery && order.status !== 'delivered' && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Est. Delivery</span>
                              <span className="text-gray-900">{order.estimatedDelivery}</span>
                            </div>
                          )}

                          {order.pickupLocation && (
                            <div className="flex items-start gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-gray-500 mb-0.5">Pickup Location</p>
                                <p className="text-gray-900">{order.pickupLocation}</p>
                              </div>
                            </div>
                          )}

                          {order.quantity > 1 && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Quantity</span>
                              <span className="text-gray-900">×{order.quantity}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredOrders.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">No orders found</h3>
              <p className="text-sm text-gray-500">
                {searchQuery ? 'Try adjusting your search' : 'No orders in this status'}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
