import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from './ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Switch } from './ui/switch';
import { 
  Truck, MapPin, Package, CheckCircle, Clock, XCircle, 
  AlertCircle, Map, Radio, Loader2, Phone, Mail, Navigation2,
  Power, PowerOff
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';

interface CourierAPI {
  id: string;
  name: string;
  logo: string;
  connected: boolean;
  color: string;
}

interface DeliveryOrder {
  id: string;
  orderId: string;
  memberName: string;
  trackingNumber: string;
  courier: string;
  status: 'Delivered' | 'In Transit' | 'Pending' | 'Returned' | 'Cancelled';
  lastUpdate: string;
  deliveryMethod: string;
  memberPhone: string;
  memberEmail: string;
  address: string;
  estimatedDelivery: string;
  timeline: Array<{
    status: string;
    location: string;
    timestamp: string;
    description: string;
  }>;
}

const courierAPIs: CourierAPI[] = [
  { id: 'kerry', name: 'Kerry Express', logo: '🚚', connected: false, color: '#00A859' },
  { id: 'flash', name: 'Flash Express', logo: '⚡', connected: false, color: '#FF6B00' },
  { id: 'jnt', name: 'J&T Express', logo: '📦', connected: false, color: '#E31E24' },
  { id: 'thaipost', name: 'Thai Post', logo: '📮', connected: false, color: '#0066CC' },
];

const mockDeliveries: DeliveryOrder[] = [
  {
    id: '1',
    orderId: 'ORD-001234',
    memberName: 'Sarah Chen',
    trackingNumber: 'KRY1234567890',
    courier: 'Kerry Express',
    status: 'In Transit',
    lastUpdate: '2024-10-30 14:30',
    deliveryMethod: 'Standard Delivery',
    memberPhone: '+66 81-234-5678',
    memberEmail: 'sarah.chen@email.com',
    address: '123 Sukhumvit Rd, Khlong Toei, Bangkok 10110',
    estimatedDelivery: '2024-10-31 18:00',
    timeline: [
      { status: 'Order Placed', location: 'Warehouse', timestamp: '2024-10-29 08:00', description: 'Order received and processing' },
      { status: 'Picked Up', location: 'Distribution Center Bangkok', timestamp: '2024-10-29 14:30', description: 'Package picked up from seller' },
      { status: 'In Transit', location: 'Transit Hub Samut Prakan', timestamp: '2024-10-30 09:15', description: 'Package in transit to destination' },
      { status: 'In Transit', location: 'Local Delivery Center', timestamp: '2024-10-30 14:30', description: 'Arrived at delivery center' }
    ]
  },
  {
    id: '2',
    orderId: 'ORD-001235',
    memberName: 'John Smith',
    trackingNumber: 'FLS9876543210',
    courier: 'Flash Express',
    status: 'Delivered',
    lastUpdate: '2024-10-29 16:45',
    deliveryMethod: 'Express Delivery',
    memberPhone: '+66 82-345-6789',
    memberEmail: 'john.smith@email.com',
    address: '456 Rama IV Rd, Pathum Wan, Bangkok 10400',
    estimatedDelivery: '2024-10-29 18:00',
    timeline: [
      { status: 'Order Placed', location: 'Warehouse', timestamp: '2024-10-28 10:00', description: 'Order received' },
      { status: 'Out for Delivery', location: 'Delivery Vehicle', timestamp: '2024-10-29 08:30', description: 'Out for delivery' },
      { status: 'Delivered', location: 'Customer Address', timestamp: '2024-10-29 16:45', description: 'Package delivered successfully' }
    ]
  },
  {
    id: '3',
    orderId: 'ORD-001236',
    memberName: 'Emily Wong',
    trackingNumber: 'JT5555666777',
    courier: 'J&T Express',
    status: 'Pending',
    lastUpdate: '2024-10-30 09:00',
    deliveryMethod: 'Standard Delivery',
    memberPhone: '+66 83-456-7890',
    memberEmail: 'emily.wong@email.com',
    address: '789 Phetchaburi Rd, Ratchathewi, Bangkok 10400',
    estimatedDelivery: '2024-11-01 18:00',
    timeline: [
      { status: 'Order Placed', location: 'Warehouse', timestamp: '2024-10-30 09:00', description: 'Waiting for pickup' }
    ]
  },
  {
    id: '4',
    orderId: 'ORD-001237',
    memberName: 'Michael Lee',
    trackingNumber: 'TP8888999000',
    courier: 'Thai Post',
    status: 'Returned',
    lastUpdate: '2024-10-28 11:20',
    deliveryMethod: 'Standard Delivery',
    memberPhone: '+66 84-567-8901',
    memberEmail: 'michael.lee@email.com',
    address: '321 Sathon Rd, Sathon, Bangkok 10120',
    estimatedDelivery: '-',
    timeline: [
      { status: 'Order Placed', location: 'Warehouse', timestamp: '2024-10-25 10:00', description: 'Order received' },
      { status: 'Delivery Failed', location: 'Customer Address', timestamp: '2024-10-27 15:00', description: 'Customer not available' },
      { status: 'Returned', location: 'Return Center', timestamp: '2024-10-28 11:20', description: 'Package returned to sender' }
    ]
  },
];

const statusColors = {
  'Delivered': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  'In Transit': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Pending': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  'Returned': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  'Cancelled': { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
};

export default function DeliveryTrackingCenter() {
  const [couriers, setCouriers] = useState<CourierAPI[]>(courierAPIs);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOrder | null>(null);
  const [showCourierDialog, setShowCourierDialog] = useState(false);
  const [showMapDialog, setShowMapDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [courierFilter, setCourierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isPolling, setIsPolling] = useState(false);
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>(mockDeliveries);

  const connectedCouriers = couriers.filter(c => c.connected);
  const isAnyConnected = connectedCouriers.length > 0;

  // Simulate API polling
  useEffect(() => {
    if (isPolling && isAnyConnected) {
      const interval = setInterval(() => {
        setDeliveries(prev => prev.map(delivery => ({
          ...delivery,
          lastUpdate: new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })
        })));
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isPolling, isAnyConnected]);

  const toggleCourier = (courierId: string) => {
    setCouriers(prev => prev.map(c => 
      c.id === courierId ? { ...c, connected: !c.connected } : c
    ));
    const courier = couriers.find(c => c.id === courierId);
    if (courier) {
      toast.success(`${courier.name} ${courier.connected ? 'disconnected' : 'connected'} successfully!`);
    }
  };

  const handleConnectAll = () => {
    setShowCourierDialog(true);
  };

  const handleDisconnectAll = () => {
    setCouriers(prev => prev.map(c => ({ ...c, connected: false })));
    setIsPolling(false);
    toast.success('All couriers disconnected');
  };

  const handleStartPolling = () => {
    if (isAnyConnected) {
      setIsPolling(true);
      toast.success('Real-time tracking activated');
    } else {
      toast.error('Please connect at least one courier first');
    }
  };

  const handleCancelDelivery = () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }
    toast.success('Delivery cancelled successfully');
    setShowCancelDialog(false);
    setCancelReason('');
    setSelectedDelivery(null);
  };

  const handleMarkReturned = () => {
    toast.success('Delivery marked as returned');
    setSelectedDelivery(null);
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesCourier = courierFilter === 'all' || delivery.courier === courierFilter;
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    return matchesCourier && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg p-6 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-white">Delivery Tracking Center</h2>
            <p className="text-blue-50 mt-1">Real-time courier integration and delivery monitoring</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleConnectAll}
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <Power className="w-4 h-4 mr-2" />
              Connect Couriers
            </Button>
            {isAnyConnected && (
              <Button
                variant="secondary"
                onClick={handleDisconnectAll}
                className="bg-white/20 hover:bg-white/30 text-white border-0"
              >
                <PowerOff className="w-4 h-4 mr-2" />
                Disconnect All
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => setShowMapDialog(true)}
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <Map className="w-4 h-4 mr-2" />
              View Map
            </Button>
          </div>
        </div>

        {/* Connection Status */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isAnyConnected ? (
              <>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white">Connected ({connectedCouriers.length} couriers)</span>
              </>
            ) : (
              <>
                <div className="w-3 h-3 bg-red-400 rounded-full" />
                <span className="text-white">Disconnected</span>
              </>
            )}
          </div>
          {isAnyConnected && (
            <Button
              size="sm"
              onClick={handleStartPolling}
              disabled={isPolling}
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <Radio className="w-4 h-4 mr-2" />
              {isPolling ? 'Polling Active' : 'Start Real-time Updates'}
            </Button>
          )}
        </div>
      </div>

      {/* Courier Connection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {couriers.map((courier) => (
          <motion.div
            key={courier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className={`transition-all ${courier.connected ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{courier.logo}</span>
                    <div>
                      <p className="text-gray-900">{courier.name}</p>
                      <p className="text-gray-500">{courier.connected ? 'Active' : 'Inactive'}</p>
                    </div>
                  </div>
                  <Switch
                    checked={courier.connected}
                    onCheckedChange={() => toggleCourier(courier.id)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Select value={courierFilter} onValueChange={setCourierFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Couriers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Couriers</SelectItem>
                {couriers.map(c => (
                  <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Returned">Returned</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Deliveries Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Deliveries ({filteredDeliveries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Member Name</TableHead>
                <TableHead>Tracking Number</TableHead>
                <TableHead>Courier</TableHead>
                <TableHead>Current Status</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead>Delivery Method</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeliveries.map((delivery) => (
                <TableRow 
                  key={delivery.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedDelivery(delivery)}
                >
                  <TableCell>
                    <span className="text-blue-600">{delivery.orderId}</span>
                  </TableCell>
                  <TableCell>{delivery.memberName}</TableCell>
                  <TableCell className="font-mono text-sm">{delivery.trackingNumber}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{delivery.courier}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[delivery.status].bg} ${statusColors[delivery.status].text} border-0`}>
                      {delivery.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">{delivery.lastUpdate}</TableCell>
                  <TableCell>{delivery.deliveryMethod}</TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDelivery(delivery);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delivery Detail Sheet */}
      <Sheet open={!!selectedDelivery} onOpenChange={() => setSelectedDelivery(null)}>
        <SheetContent className="sm:max-w-[700px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Delivery Detail</SheetTitle>
            <SheetDescription>
              Complete tracking information and delivery status
            </SheetDescription>
          </SheetHeader>

          {selectedDelivery && (
            <div className="space-y-6 mt-6">
              {/* Member Info */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    <CardTitle>Member Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="text-gray-900">{selectedDelivery.memberName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="text-gray-900">{selectedDelivery.memberPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="text-gray-900">{selectedDelivery.memberEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span className="text-gray-900 text-right">{selectedDelivery.address}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Order Info */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-purple-600" />
                    <CardTitle>Order Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="text-blue-600">{selectedDelivery.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tracking Number:</span>
                    <span className="font-mono text-sm">{selectedDelivery.trackingNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Courier:</span>
                    <Badge variant="outline">{selectedDelivery.courier}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge className={`${statusColors[selectedDelivery.status].bg} ${statusColors[selectedDelivery.status].text} border-0`}>
                      {selectedDelivery.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Delivery:</span>
                    <span className="text-gray-900">{selectedDelivery.estimatedDelivery}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Timeline */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Navigation2 className="w-5 h-5 text-green-600" />
                    <CardTitle>Delivery Timeline</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedDelivery.timeline.map((event, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-3"
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-blue-600 rounded-full" />
                          {index < selectedDelivery.timeline.length - 1 && (
                            <div className="w-0.5 h-full bg-blue-200 my-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-gray-900">{event.status}</p>
                            <Badge variant="outline" className="text-xs">
                              {event.timestamp}
                            </Badge>
                          </div>
                          <p className="text-gray-600 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </p>
                          <p className="text-gray-500 mt-1">{event.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Map Route Placeholder */}
              <Card className="bg-gray-50">
                <CardContent className="pt-6">
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Map className="w-12 h-12 mx-auto mb-2" />
                      <p>Google Maps Route View</p>
                      <p className="text-sm">Current Location: {selectedDelivery.timeline[selectedDelivery.timeline.length - 1].location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="grid grid-cols-3 gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setShowCancelDialog(true)}
                  disabled={selectedDelivery.status === 'Delivered' || selectedDelivery.status === 'Cancelled'}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleMarkReturned}
                  disabled={selectedDelivery.status === 'Delivered' || selectedDelivery.status === 'Returned'}
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Mark Returned
                </Button>
                <Button variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Courier Connection Dialog */}
      <Dialog open={showCourierDialog} onOpenChange={setShowCourierDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Courier APIs</DialogTitle>
            <DialogDescription>
              Select couriers to connect for real-time tracking
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {couriers.map((courier) => (
              <div key={courier.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{courier.logo}</span>
                  <div>
                    <p className="text-gray-900">{courier.name}</p>
                    <p className="text-gray-500 text-sm">{courier.connected ? 'Connected' : 'Not connected'}</p>
                  </div>
                </div>
                <Switch
                  checked={courier.connected}
                  onCheckedChange={() => toggleCourier(courier.id)}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowCourierDialog(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Map View Dialog */}
      <Dialog open={showMapDialog} onOpenChange={setShowMapDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Delivery Map View</DialogTitle>
            <DialogDescription>
              Real-time locations of all active deliveries
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Map className="w-16 h-16 mx-auto mb-3" />
              <p>Google Maps Integration</p>
              <p className="text-sm mt-1">Showing {deliveries.filter(d => d.status === 'In Transit').length} active deliveries</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Delivery Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Delivery</DialogTitle>
            <DialogDescription>
              Please provide a reason for cancelling this delivery
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Cancellation Reason</Label>
              <Textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter reason for cancellation..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Keep Delivery
            </Button>
            <Button onClick={handleCancelDelivery} variant="destructive">
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
