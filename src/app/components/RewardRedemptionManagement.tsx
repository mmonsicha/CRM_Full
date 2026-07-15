import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { 
  Search, Download, Package, CheckCircle, Clock, 
  XCircle, Truck, User, Gift, MapPin, Loader2,
  CheckCircle2, Navigation, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';

type RedemptionStatus = 'Pending' | 'Approved' | 'Shipped' | 'Completed' | 'Cancelled';
type DeliveryMethod = 'Pickup' | 'Delivery';
type ShippingStatus = 'Processing' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Returned';

interface TrackingUpdate {
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

interface RedemptionRecord {
  id: number;
  memberName: string;
  memberId: string;
  campaignName: string;
  rewardName: string;
  points: number;
  date: string;
  deliveryMethod: DeliveryMethod;
  status: RedemptionStatus;
  phone: string;
  email: string;
  address?: string;
  shippingCompany?: string;
  trackingNumber?: string;
  shippingDate?: string;
  shippingStatus?: ShippingStatus;
  trackingUpdates?: TrackingUpdate[];
  apiConnected?: boolean;
}

const mockRedemptions: RedemptionRecord[] = [
  {
    id: 1,
    memberName: 'Sarah Chen',
    memberId: 'M001234',
    campaignName: 'Summer Campaign 2024',
    rewardName: 'iPhone 15 Pro Max',
    points: 5000,
    date: '2024-10-28 14:30',
    deliveryMethod: 'Delivery',
    status: 'Shipped',
    phone: '+66 81-234-5678',
    email: 'sarah.chen@email.com',
    address: '123 Sukhumvit Rd, Khlong Toei, Bangkok 10110',
    shippingCompany: 'Kerry',
    trackingNumber: 'KRY1234567890',
    shippingDate: '2024-10-29',
    shippingStatus: 'In Transit',
    apiConnected: true,
    trackingUpdates: [
      { status: 'Processing', location: 'Distribution Center - Bangkok', timestamp: '2024-10-29 08:00', description: 'Parcel received at sorting facility' },
      { status: 'In Transit', location: 'Transit Hub - Samut Prakan', timestamp: '2024-10-29 12:30', description: 'Package in transit to destination' },
      { status: 'In Transit', location: 'Local Delivery Center', timestamp: '2024-10-30 09:15', description: 'Arrived at delivery center' }
    ]
  },
  {
    id: 2,
    memberName: 'John Smith',
    memberId: 'M001235',
    campaignName: 'Point Booster Q4',
    rewardName: 'AirPods Pro 2',
    points: 2500,
    date: '2024-10-28 10:15',
    deliveryMethod: 'Pickup',
    status: 'Approved',
    phone: '+66 82-345-6789',
    email: 'john.smith@email.com'
  },
  {
    id: 3,
    memberName: 'Emily Wong',
    memberId: 'M001236',
    campaignName: 'New Year Special',
    rewardName: 'MacBook Air M2',
    points: 8000,
    date: '2024-10-27 16:45',
    deliveryMethod: 'Delivery',
    status: 'Completed',
    phone: '+66 83-456-7890',
    email: 'emily.wong@email.com',
    address: '456 Rama IV Rd, Pathum Wan, Bangkok 10400',
    shippingCompany: 'Flash',
    trackingNumber: 'FLS9876543210',
    shippingDate: '2024-10-25',
    shippingStatus: 'Delivered'
  },
  {
    id: 4,
    memberName: 'Michael Lee',
    memberId: 'M001237',
    campaignName: 'Summer Campaign 2024',
    rewardName: 'iPad Pro 11"',
    points: 4500,
    date: '2024-10-27 09:30',
    deliveryMethod: 'Delivery',
    status: 'Pending',
    phone: '+66 84-567-8901',
    email: 'michael.lee@email.com',
    address: '789 Phetchaburi Rd, Ratchathewi, Bangkok 10400'
  },
  {
    id: 5,
    memberName: 'Jessica Tan',
    memberId: 'M001238',
    campaignName: 'Loyalty Rewards 2024',
    rewardName: 'Sony WH-1000XM5',
    points: 1800,
    date: '2024-10-26 13:20',
    deliveryMethod: 'Pickup',
    status: 'Completed',
    phone: '+66 85-678-9012',
    email: 'jessica.tan@email.com'
  },
  {
    id: 6,
    memberName: 'David Kim',
    memberId: 'M001239',
    campaignName: 'Point Booster Q4',
    rewardName: 'Apple Watch Series 9',
    points: 3200,
    date: '2024-10-26 11:00',
    deliveryMethod: 'Delivery',
    status: 'Shipped',
    phone: '+66 86-789-0123',
    email: 'david.kim@email.com',
    address: '321 Sathon Rd, Sathon, Bangkok 10120',
    shippingCompany: 'J&T',
    trackingNumber: 'JT5555666777',
    shippingDate: '2024-10-27',
    shippingStatus: 'Out for Delivery',
    apiConnected: true,
    trackingUpdates: [
      { status: 'Processing', location: 'Warehouse - Bangkok', timestamp: '2024-10-27 07:00', description: 'Order processed and packed' },
      { status: 'In Transit', location: 'Main Hub', timestamp: '2024-10-27 14:20', description: 'Departed from origin facility' },
      { status: 'Out for Delivery', location: 'Delivery Vehicle - Sathorn Area', timestamp: '2024-10-30 08:45', description: 'Out for delivery - Expected today by 18:00' }
    ]
  },
  {
    id: 7,
    memberName: 'Lisa Anderson',
    memberId: 'M001240',
    campaignName: 'Summer Campaign 2024',
    rewardName: 'Nintendo Switch OLED',
    points: 2200,
    date: '2024-10-25 15:45',
    deliveryMethod: 'Pickup',
    status: 'Pending',
    phone: '+66 87-890-1234',
    email: 'lisa.a@email.com'
  },
  {
    id: 8,
    memberName: 'Robert Chang',
    memberId: 'M001241',
    campaignName: 'New Year Special',
    rewardName: 'Dyson Airwrap',
    points: 3500,
    date: '2024-10-25 10:30',
    deliveryMethod: 'Delivery',
    status: 'Cancelled',
    phone: '+66 88-901-2345',
    email: 'robert.c@email.com',
    address: '654 Vibhavadi Rangsit Rd, Chatuchak, Bangkok 10900'
  },
  {
    id: 9,
    memberName: 'Maria Santos',
    memberId: 'M001242',
    campaignName: 'Point Booster Q4',
    rewardName: 'Samsung Galaxy S24',
    points: 4200,
    date: '2024-10-24 14:20',
    deliveryMethod: 'Delivery',
    status: 'Pending',
    phone: '+66 89-012-3456',
    email: 'maria.s@email.com',
    address: '987 Silom Rd, Bang Rak, Bangkok 10500'
  },
  {
    id: 10,
    memberName: 'Thomas Wu',
    memberId: 'M001243',
    campaignName: 'Loyalty Rewards 2024',
    rewardName: 'Bose QuietComfort',
    points: 2800,
    date: '2024-10-24 11:15',
    deliveryMethod: 'Pickup',
    status: 'Approved',
    phone: '+66 90-123-4567',
    email: 'thomas.wu@email.com'
  },
];

const statusConfig: Record<RedemptionStatus, { label: string; color: string; bgColor: string }> = {
  Pending: { label: 'Pending', color: 'text-yellow-700', bgColor: 'bg-yellow-50' },
  Approved: { label: 'Approved', color: 'text-blue-700', bgColor: 'bg-blue-50' },
  Shipped: { label: 'Shipped', color: 'text-purple-700', bgColor: 'bg-purple-50' },
  Completed: { label: 'Completed', color: 'text-green-700', bgColor: 'bg-green-50' },
  Cancelled: { label: 'Cancelled', color: 'text-red-700', bgColor: 'bg-red-50' }
};

export default function RewardRedemptionManagement() {
  const [selectedRecord, setSelectedRecord] = useState<RedemptionRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deliveryFilter, setDeliveryFilter] = useState<string>('all');
  const [showShippingDialog, setShowShippingDialog] = useState(false);
  const [showApiConfirmation, setShowApiConfirmation] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [trackingUpdates, setTrackingUpdates] = useState<TrackingUpdate[]>([]);
  const [apiConnected, setApiConnected] = useState(false);
  
  // Editable fields in the detail panel
  const [editStatus, setEditStatus] = useState<RedemptionStatus>('Pending');
  const [editShippingCompany, setEditShippingCompany] = useState('');
  const [editTrackingNumber, setEditTrackingNumber] = useState('');
  const [editShippingDate, setEditShippingDate] = useState('');
  const [editShippingStatus, setEditShippingStatus] = useState<ShippingStatus>('Processing');

  // Calculate statistics
  const stats = {
    pending: mockRedemptions.filter(r => r.status === 'Pending').length,
    shipped: mockRedemptions.filter(r => r.status === 'Shipped').length,
    completed: mockRedemptions.filter(r => r.status === 'Completed').length,
    cancelled: mockRedemptions.filter(r => r.status === 'Cancelled').length,
  };

  // Filter redemptions
  const filteredRedemptions = mockRedemptions.filter(record => {
    const matchesSearch = searchQuery === '' || 
      record.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.rewardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.memberId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesDelivery = deliveryFilter === 'all' || record.deliveryMethod === deliveryFilter;
    
    return matchesSearch && matchesStatus && matchesDelivery;
  });

  // Simulate API polling for tracking updates
  useEffect(() => {
    if (isPolling && apiConnected) {
      const interval = setInterval(() => {
        const newUpdate: TrackingUpdate = {
          status: 'In Transit',
          location: `Update Location ${Date.now() % 100}`,
          timestamp: new Date().toLocaleString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          description: 'Tracking update from API'
        };
        setTrackingUpdates(prev => [...prev, newUpdate]);
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [isPolling, apiConnected]);

  const handleViewDetail = (record: RedemptionRecord) => {
    setSelectedRecord(record);
    setEditStatus(record.status);
    setEditShippingCompany(record.shippingCompany || '');
    setEditTrackingNumber(record.trackingNumber || '');
    setEditShippingDate(record.shippingDate || '');
    setEditShippingStatus(record.shippingStatus || 'Processing');
    setTrackingUpdates(record.trackingUpdates || []);
    setApiConnected(record.apiConnected || false);
    setIsPolling(false);
  };

  const handleSaveChanges = () => {
    toast.success('Changes saved successfully!');
    setSelectedRecord(null);
    setIsPolling(false);
  };

  const handleConnectShipping = () => {
    setShowShippingDialog(true);
    setTimeout(() => {
      setShowShippingDialog(false);
      setShowApiConfirmation(true);
      setTimeout(() => {
        setShowApiConfirmation(false);
        setApiConnected(true);
        setIsPolling(true);
        toast.success('Shipping API connected successfully. Real-time tracking updates enabled.');
      }, 2000);
    }, 1500);
  };

  const handleExportCSV = () => {
    toast.success('Exporting CSV...');
  };

  const handleCardFilter = (status: string) => {
    setStatusFilter(status);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-gray-900">Reward Redemption Management</h2>
          <p className="text-gray-600 mt-1">Track and manage all reward redemptions and deliveries</p>
        </div>
        <Button onClick={handleExportCSV}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card 
          className={`hover:shadow-lg transition-all cursor-pointer ${
            statusFilter === 'Pending' ? 'ring-2 ring-yellow-400 shadow-lg' : ''
          }`}
          onClick={() => handleCardFilter('Pending')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600 flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              Pending Redemptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{stats.pending}</div>
            <div className="text-gray-500 mt-1">Awaiting approval</div>
          </CardContent>
        </Card>

        <Card 
          className={`hover:shadow-lg transition-all cursor-pointer ${
            statusFilter === 'Shipped' ? 'ring-2 ring-purple-400 shadow-lg' : ''
          }`}
          onClick={() => handleCardFilter('Shipped')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600 flex items-center gap-2">
              <Truck className="w-4 h-4 text-purple-600" />
              Shipped
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{stats.shipped}</div>
            <div className="text-gray-500 mt-1">In transit</div>
          </CardContent>
        </Card>

        <Card 
          className={`hover:shadow-lg transition-all cursor-pointer ${
            statusFilter === 'Completed' ? 'ring-2 ring-green-400 shadow-lg' : ''
          }`}
          onClick={() => handleCardFilter('Completed')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{stats.completed}</div>
            <div className="text-gray-500 mt-1">Successfully delivered</div>
          </CardContent>
        </Card>

        <Card 
          className={`hover:shadow-lg transition-all cursor-pointer ${
            statusFilter === 'Cancelled' ? 'ring-2 ring-red-400 shadow-lg' : ''
          }`}
          onClick={() => handleCardFilter('Cancelled')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
              Cancelled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{stats.cancelled}</div>
            <div className="text-gray-500 mt-1">Redemptions cancelled</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by member, campaign, or reward name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Redemption Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={deliveryFilter} onValueChange={setDeliveryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Delivery Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="Pickup">Pickup</SelectItem>
                <SelectItem value="Delivery">Delivery</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-48">
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

      {/* Redemption Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Redemptions ({filteredRedemptions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member Name</TableHead>
                <TableHead>Member ID</TableHead>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Reward Name</TableHead>
                <TableHead>Points Used</TableHead>
                <TableHead>Redemption Date</TableHead>
                <TableHead>Delivery Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRedemptions.map((record) => (
                <TableRow 
                  key={record.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleViewDetail(record)}
                >
                  <TableCell>{record.memberName}</TableCell>
                  <TableCell>
                    <span className="text-blue-600">{record.memberId}</span>
                  </TableCell>
                  <TableCell>{record.campaignName}</TableCell>
                  <TableCell>{record.rewardName}</TableCell>
                  <TableCell>
                    <span className="text-amber-600">{record.points.toLocaleString()}</span>
                  </TableCell>
                  <TableCell className="text-gray-600">{record.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      {record.deliveryMethod === 'Delivery' ? (
                        <>
                          <Truck className="w-3 h-3" />
                          Delivery
                        </>
                      ) : (
                        <>
                          <Package className="w-3 h-3" />
                          Pickup
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${statusConfig[record.status].bgColor} ${statusConfig[record.status].color} border-0`}>
                      {statusConfig[record.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetail(record);
                      }}
                    >
                      View Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Sheet */}
      <Sheet open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <SheetContent className="sm:max-w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Redemption Detail</SheetTitle>
            <SheetDescription>
              Complete information about the reward redemption and delivery
            </SheetDescription>
          </SheetHeader>
          
          {selectedRecord && (
            <div className="space-y-6 mt-6">
              {/* Member Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-900">
                  <User className="w-5 h-5 text-blue-600" />
                  <h3>Member Info</h3>
                </div>
                <Card>
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="text-gray-900">{selectedRecord.memberName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="text-gray-900">{selectedRecord.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="text-gray-900">{selectedRecord.email}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Reward Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-900">
                  <Gift className="w-5 h-5 text-purple-600" />
                  <h3>Reward Information</h3>
                </div>
                <Card>
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reward Name:</span>
                      <span className="text-gray-900">{selectedRecord.rewardName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Campaign Name:</span>
                      <span className="text-gray-900">{selectedRecord.campaignName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Points Used:</span>
                      <span className="text-amber-600">{selectedRecord.points.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Redemption Date:</span>
                      <span className="text-gray-900">{selectedRecord.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Method:</span>
                      <Badge variant="outline">
                        {selectedRecord.deliveryMethod === 'Delivery' ? 'Delivery' : 'Pickup'}
                      </Badge>
                    </div>
                    <div className="pt-2 space-y-2">
                      <Label>Current Status</Label>
                      <Select value={editStatus} onValueChange={(value) => setEditStatus(value as RedemptionStatus)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Approved">Approved</SelectItem>
                          <SelectItem value="Shipped">Shipped</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Delivery Info - Only show if Delivery method */}
              {selectedRecord.deliveryMethod === 'Delivery' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-900">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <h3>Delivery Information</h3>
                  </div>
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6 space-y-4">
                      {selectedRecord.address && (
                        <div className="space-y-2">
                          <Label>Shipping Address</Label>
                          <p className="text-gray-700">{selectedRecord.address}</p>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Label>Shipping Company</Label>
                        <Select value={editShippingCompany} onValueChange={setEditShippingCompany}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select shipping company" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Kerry">Kerry Express</SelectItem>
                            <SelectItem value="Flash">Flash Express</SelectItem>
                            <SelectItem value="J&T">J&T Express</SelectItem>
                            <SelectItem value="ThaiPost">Thai Post</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Tracking Number</Label>
                        <Input 
                          value={editTrackingNumber}
                          onChange={(e) => setEditTrackingNumber(e.target.value)}
                          placeholder="Enter tracking number"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Shipping Date</Label>
                        <Input 
                          type="date"
                          value={editShippingDate}
                          onChange={(e) => setEditShippingDate(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Package Status</Label>
                        <Select value={editShippingStatus} onValueChange={(value) => setEditShippingStatus(value as ShippingStatus)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Processing">Processing</SelectItem>
                            <SelectItem value="In Transit">In Transit</SelectItem>
                            <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                            <SelectItem value="Delivered">Delivered</SelectItem>
                            <SelectItem value="Returned">Returned</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {!apiConnected && (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={handleConnectShipping}
                        >
                          <Truck className="w-4 h-4 mr-2" />
                          Connect Shipping API
                        </Button>
                      )}

                      {/* Real-time Tracking Component */}
                      {apiConnected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                          className="space-y-3 mt-4"
                        >
                          <div className="flex items-center justify-between bg-green-50 rounded-lg p-3 border border-green-200">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                              <span className="text-green-800">API Connected - Live Tracking Active</span>
                            </div>
                            {isPolling && (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              >
                                <Loader2 className="w-4 h-4 text-green-600" />
                              </motion.div>
                            )}
                          </div>

                          <Card>
                            <CardHeader className="pb-3">
                              <div className="flex items-center gap-2">
                                <Navigation className="w-5 h-5 text-blue-600" />
                                <CardTitle>Real-time Tracking Updates</CardTitle>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3 max-h-64 overflow-y-auto">
                                <AnimatePresence>
                                  {trackingUpdates.map((update, index) => (
                                    <motion.div
                                      key={index}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.4 }}
                                      className="flex gap-3 pb-3 border-b border-gray-200 last:border-0"
                                    >
                                      <div className="flex-shrink-0 mt-1">
                                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                      </div>
                                      <div className="flex-1 space-y-1">
                                        <div className="flex items-start justify-between gap-2">
                                          <p className="text-gray-900">{update.status}</p>
                                          <Badge variant="outline" className="text-xs whitespace-nowrap">
                                            {update.timestamp}
                                          </Badge>
                                        </div>
                                        <p className="text-gray-600 flex items-center gap-1">
                                          <MapPin className="w-3 h-3" />
                                          {update.location}
                                        </p>
                                        <p className="text-gray-500">{update.description}</p>
                                      </div>
                                    </motion.div>
                                  ))}
                                </AnimatePresence>
                                
                                {trackingUpdates.length === 0 && (
                                  <div className="text-center py-8 text-gray-500">
                                    <Package className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                    <p>Waiting for tracking updates...</p>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setSelectedRecord(null)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Shipping Connection Dialog */}
      <Dialog open={showShippingDialog} onOpenChange={setShowShippingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connecting to Shipping API</DialogTitle>
            <DialogDescription>
              Please wait while we establish the connection...
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Truck className="w-12 h-12 text-blue-600" />
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>

      {/* API Confirmation Dialog */}
      <Dialog open={showApiConfirmation} onOpenChange={setShowApiConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connection Successful!</DialogTitle>
            <DialogDescription>
              Shipping API connected successfully. Real-time tracking updates enabled.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-6 space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
            </motion.div>
            <div className="text-center">
              <p className="text-gray-900">API Status: Active</p>
              <p className="text-gray-600 mt-1">Live tracking data will appear shortly</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
