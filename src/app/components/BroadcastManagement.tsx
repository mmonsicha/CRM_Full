import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, Search, RefreshCw, Send, Calendar, Eye, Edit, Trash2,
  X, ChevronRight, Check, Users, Image as ImageIcon, Clock, 
  Mail, MessageSquare, Radio, Tag, AlertCircle, TrendingUp,
  MousePointerClick, CheckCircle, BarChart3, Download, Play,
  Pause, Copy
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Broadcast {
  id: string;
  name: string;
  targetSegment: string;
  segmentSize: number;
  messageType: string;
  message: string;
  image?: string;
  schedule: 'Immediate' | 'Scheduled';
  scheduledDate?: string;
  scheduledTime?: string;
  channels: string[];
  status: 'Draft' | 'Scheduled' | 'Sending' | 'Sent' | 'Failed';
  createdBy: string;
  createdDate: string;
  sentCount?: number;
  deliveredCount?: number;
  openedCount?: number;
  clickedCount?: number;
}

export default function BroadcastManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedBroadcast, setSelectedBroadcast] = useState<Broadcast | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedView, setSelectedView] = useState<'all' | 'scheduled' | 'sent' | 'draft'>('all');

  // Create Broadcast Form State
  const [broadcastName, setBroadcastName] = useState('');
  const [messageType, setMessageType] = useState('promotional');
  const [messageContent, setMessageContent] = useState('');
  const [messageImage, setMessageImage] = useState('');
  const [targetSegment, setTargetSegment] = useState('');
  const [scheduleType, setScheduleType] = useState<'immediate' | 'scheduled'>('immediate');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['push']);

  // Mock Broadcasts Data
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([
    {
      id: 'BC001',
      name: 'Flash Sale - 50% Off',
      targetSegment: 'VIP Customers',
      segmentSize: 1248,
      messageType: 'Promotional',
      message: '🎉 Flash Sale Alert! Get 50% OFF on all items for the next 24 hours. VIP members get an extra 10% off!',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
      schedule: 'Sent',
      channels: ['LINE', 'Push', 'Email'],
      status: 'Sent',
      createdBy: 'Marketing Team',
      createdDate: '2025-11-05',
      sentCount: 1248,
      deliveredCount: 1235,
      openedCount: 1108,
      clickedCount: 743,
    },
    {
      id: 'BC002',
      name: 'November Birthday Celebration',
      targetSegment: 'Birthday This Month',
      segmentSize: 327,
      messageType: 'Event',
      message: '🎂 Happy Birthday! Enjoy a special gift from us - 500 bonus points and a 20% discount coupon!',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800',
      schedule: 'Scheduled',
      scheduledDate: '2025-11-08',
      scheduledTime: '09:00',
      channels: ['LINE', 'Push'],
      status: 'Scheduled',
      createdBy: 'CRM Team',
      createdDate: '2025-11-06',
    },
    {
      id: 'BC003',
      name: 'Re-engagement Campaign',
      targetSegment: 'Inactive Members',
      segmentSize: 543,
      messageType: 'Engagement',
      message: 'We miss you! Come back and claim your 300 welcome-back points. Plus exclusive offers waiting for you!',
      schedule: 'Sent',
      channels: ['Email', 'Push'],
      status: 'Sent',
      createdBy: 'Admin User',
      createdDate: '2025-11-03',
      sentCount: 543,
      deliveredCount: 521,
      openedCount: 287,
      clickedCount: 156,
    },
    {
      id: 'BC004',
      name: 'New Product Launch Announcement',
      targetSegment: 'Gold Tier Members',
      segmentSize: 2156,
      messageType: 'Product',
      message: '✨ Exclusive First Look! Be the first to explore our new luxury collection. Gold members get early access!',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      schedule: 'Scheduled',
      scheduledDate: '2025-11-10',
      scheduledTime: '10:00',
      channels: ['LINE', 'Email'],
      status: 'Scheduled',
      createdBy: 'Product Team',
      createdDate: '2025-11-07',
    },
    {
      id: 'BC005',
      name: 'Points Expiry Reminder',
      targetSegment: 'All Active Members',
      segmentSize: 4523,
      messageType: 'Notification',
      message: '⏰ Reminder: You have 1,500 points expiring on Nov 30. Use them now to redeem amazing rewards!',
      schedule: 'Immediate',
      channels: ['Push'],
      status: 'Draft',
      createdBy: 'Admin User',
      createdDate: '2025-11-07',
    },
  ]);

  // Mock Segments (imported from MemberSegments)
  const availableSegments = [
    { id: 'SEG001', name: 'VIP Customers', memberCount: 1248 },
    { id: 'SEG002', name: 'New Members (Q4 2025)', memberCount: 892 },
    { id: 'SEG003', name: 'Inactive Members', memberCount: 543 },
    { id: 'SEG004', name: 'Birthday This Month', memberCount: 327 },
    { id: 'SEG005', name: 'Gold Tier Members', memberCount: 2156 },
    { id: 'SEG006', name: 'All Active Members', memberCount: 4523 },
  ];

  const getFilteredBroadcasts = () => {
    let filtered = broadcasts;

    if (selectedView !== 'all') {
      filtered = filtered.filter(b => {
        if (selectedView === 'scheduled') return b.status === 'Scheduled';
        if (selectedView === 'sent') return b.status === 'Sent';
        if (selectedView === 'draft') return b.status === 'Draft';
        return true;
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.targetSegment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredBroadcasts = getFilteredBroadcasts();

  const handleToggleChannel = (channel: string) => {
    setSelectedChannels(prev =>
      prev.includes(channel)
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    );
  };

  const handleCreateBroadcast = () => {
    const selectedSegmentData = availableSegments.find(s => s.id === targetSegment);
    
    const newBroadcast: Broadcast = {
      id: `BC${String(broadcasts.length + 1).padStart(3, '0')}`,
      name: broadcastName,
      targetSegment: selectedSegmentData?.name || 'Unknown',
      segmentSize: selectedSegmentData?.memberCount || 0,
      messageType: messageType,
      message: messageContent,
      image: messageImage || undefined,
      schedule: scheduleType === 'immediate' ? 'Immediate' : 'Scheduled',
      scheduledDate: scheduleType === 'scheduled' ? scheduledDate : undefined,
      scheduledTime: scheduleType === 'scheduled' ? scheduledTime : undefined,
      channels: selectedChannels,
      status: scheduleType === 'immediate' ? 'Sending' : 'Scheduled',
      createdBy: 'Admin User',
      createdDate: new Date().toISOString().split('T')[0],
    };

    setBroadcasts([newBroadcast, ...broadcasts]);
    setShowCreateModal(false);
    resetForm();
    
    toast.success(
      scheduleType === 'immediate' 
        ? 'Broadcast is being sent!' 
        : 'Broadcast scheduled successfully!',
      {
        description: `Targeting ${selectedSegmentData?.memberCount.toLocaleString()} members via ${selectedChannels.join(', ')}`,
      }
    );
  };

  const resetForm = () => {
    setCurrentStep(1);
    setBroadcastName('');
    setMessageType('promotional');
    setMessageContent('');
    setMessageImage('');
    setTargetSegment('');
    setScheduleType('immediate');
    setScheduledDate('');
    setScheduledTime('');
    setSelectedChannels(['push']);
  };

  const handleDeleteBroadcast = (id: string) => {
    setBroadcasts(broadcasts.filter(b => b.id !== id));
    toast.success('Broadcast deleted successfully');
  };

  const handleViewDetail = (broadcast: Broadcast) => {
    setSelectedBroadcast(broadcast);
    setShowDetailModal(true);
  };

  const handleViewAnalytics = (broadcast: Broadcast) => {
    setSelectedBroadcast(broadcast);
    setShowAnalyticsModal(true);
  };

  const getSelectedSegmentData = () => {
    return availableSegments.find(s => s.id === targetSegment);
  };

  // Analytics mock data
  const performanceData = [
    { time: '00:00', sent: 0, delivered: 0, opened: 0, clicked: 0 },
    { time: '03:00', sent: 312, delivered: 308, opened: 156, clicked: 89 },
    { time: '06:00', sent: 624, delivered: 617, opened: 401, clicked: 234 },
    { time: '09:00', sent: 936, delivered: 925, opened: 739, clicked: 487 },
    { time: '12:00', sent: 1248, delivered: 1235, opened: 986, clicked: 658 },
    { time: '15:00', sent: 1248, delivered: 1235, opened: 1065, clicked: 712 },
    { time: '18:00', sent: 1248, delivered: 1235, opened: 1108, clicked: 743 },
  ];

  const channelData = [
    { name: 'LINE', value: 45 },
    { name: 'Push', value: 30 },
    { name: 'Email', value: 25 },
  ];

  const COLORS = ['#06C755', '#007AFF', '#FF9500'];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-gray-900 text-2xl mb-1">Broadcast Center</h2>
            <p className="text-gray-500 text-sm">
              Create and manage targeted message campaigns
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                toast.success('Broadcasts refreshed');
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#007AFF] hover:bg-[#0051D5]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Broadcast
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Broadcasts</p>
              <p className="text-gray-900 text-2xl mt-1">{broadcasts.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Send className="w-6 h-6 text-[#007AFF]" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Scheduled</p>
              <p className="text-gray-900 text-2xl mt-1">
                {broadcasts.filter(b => b.status === 'Scheduled').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Sent This Month</p>
              <p className="text-gray-900 text-2xl mt-1">
                {broadcasts.filter(b => b.status === 'Sent').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Avg. Open Rate</p>
              <p className="text-gray-900 text-2xl mt-1">
                {broadcasts.filter(b => b.openedCount).length > 0
                  ? Math.round(
                      broadcasts
                        .filter(b => b.openedCount && b.sentCount)
                        .reduce((sum, b) => sum + ((b.openedCount! / b.sentCount!) * 100), 0) /
                      broadcasts.filter(b => b.openedCount && b.sentCount).length
                    )
                  : 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search broadcasts by name or segment..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={selectedView === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedView('all')}
              className={selectedView === 'all' ? 'bg-[#007AFF]' : ''}
            >
              All
            </Button>
            <Button
              variant={selectedView === 'scheduled' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedView('scheduled')}
              className={selectedView === 'scheduled' ? 'bg-[#007AFF]' : ''}
            >
              Scheduled
            </Button>
            <Button
              variant={selectedView === 'sent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedView('sent')}
              className={selectedView === 'sent' ? 'bg-[#007AFF]' : ''}
            >
              Sent
            </Button>
            <Button
              variant={selectedView === 'draft' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedView('draft')}
              className={selectedView === 'draft' ? 'bg-[#007AFF]' : ''}
            >
              Draft
            </Button>
          </div>
        </div>
      </Card>

      {/* Broadcasts Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Broadcast Name</TableHead>
              <TableHead>Target Segment</TableHead>
              <TableHead>Message Type</TableHead>
              <TableHead>Channels</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBroadcasts.map((broadcast) => (
              <TableRow key={broadcast.id}>
                <TableCell>
                  <div>
                    <p className="text-gray-900">{broadcast.name}</p>
                    <p className="text-gray-500 text-xs">{broadcast.id}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-gray-900 text-sm">{broadcast.targetSegment}</p>
                      <p className="text-gray-500 text-xs">
                        {broadcast.segmentSize.toLocaleString()} members
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                    {broadcast.messageType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {broadcast.channels.map((channel) => (
                      <Badge
                        key={channel}
                        variant="outline"
                        className={`text-xs ${
                          channel === 'LINE'
                            ? 'border-green-200 bg-green-50 text-green-700'
                            : channel === 'Push'
                            ? 'border-blue-200 bg-blue-50 text-blue-700'
                            : 'border-orange-200 bg-orange-50 text-orange-700'
                        }`}
                      >
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {broadcast.schedule === 'Scheduled' ? (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <div>
                        <p className="text-gray-900 text-sm">{broadcast.scheduledDate}</p>
                        <p className="text-gray-500 text-xs">{broadcast.scheduledTime}</p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-600 text-sm">Immediate</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      broadcast.status === 'Sent'
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : broadcast.status === 'Scheduled'
                        ? 'bg-orange-100 text-orange-700 border-orange-200'
                        : broadcast.status === 'Sending'
                        ? 'bg-blue-100 text-blue-700 border-blue-200'
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    {broadcast.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600 text-sm">{broadcast.createdBy}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetail(broadcast)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {broadcast.status === 'Sent' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewAnalytics(broadcast)}
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        toast.info('Edit feature coming soon');
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteBroadcast(broadcast.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredBroadcasts.length === 0 && (
          <div className="text-center py-12">
            <Send className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No broadcasts found</p>
            <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </Card>

      {/* Create Broadcast Modal - 4 Step Wizard */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Broadcast</DialogTitle>
            <DialogDescription>
              Send targeted messages to your customer segments
            </DialogDescription>
          </DialogHeader>

          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      currentStep >= step
                        ? 'bg-[#007AFF] text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {currentStep > step ? <Check className="w-5 h-5" /> : step}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${currentStep >= step ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step === 1 && 'Basic Info'}
                      {step === 2 && 'Target Segment'}
                      {step === 3 && 'Schedule & Channel'}
                      {step === 4 && 'Review & Confirm'}
                    </p>
                  </div>
                </div>
                {step < 4 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 ${
                      currentStep > step ? 'bg-[#007AFF]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Form */}
            <div className="col-span-2">
              <AnimatePresence mode="wait">
                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="name">Broadcast Name *</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Flash Sale Weekend Special"
                        value={broadcastName}
                        onChange={(e) => setBroadcastName(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="type">Message Type *</Label>
                      <Select value={messageType} onValueChange={setMessageType}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="promotional">Promotional</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="notification">Notification</SelectItem>
                          <SelectItem value="engagement">Engagement</SelectItem>
                          <SelectItem value="product">Product</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message">Message Content *</Label>
                      <Textarea
                        id="message"
                        placeholder="Write your message here..."
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        className="mt-1"
                        rows={5}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {messageContent.length} / 500 characters
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="image">Image URL (Optional)</Label>
                      <Input
                        id="image"
                        placeholder="https://example.com/image.jpg"
                        value={messageImage}
                        onChange={(e) => setMessageImage(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Select Target Segment */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="segment">Select Target Segment *</Label>
                      <Select value={targetSegment} onValueChange={setTargetSegment}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Choose a segment" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSegments.map((segment) => (
                            <SelectItem key={segment.id} value={segment.id}>
                              <div className="flex items-center justify-between w-full">
                                <span>{segment.name}</span>
                                <span className="text-gray-500 text-xs ml-4">
                                  {segment.memberCount.toLocaleString()} members
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {targetSegment && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Tag className="w-5 h-5 text-blue-600" />
                            <span className="text-blue-900 font-medium">
                              {getSelectedSegmentData()?.name}
                            </span>
                          </div>
                          <Badge className="bg-blue-600">
                            {getSelectedSegmentData()?.memberCount.toLocaleString()} members
                          </Badge>
                        </div>
                        <p className="text-sm text-blue-700">
                          Your broadcast will be sent to all members in this segment.
                        </p>
                      </motion.div>
                    )}

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-900 mb-1">Need a new segment?</p>
                          <p className="text-xs text-gray-600 mb-3">
                            You can create custom segments in Member Segments section
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              toast.info('Navigate to Member Segments to create new segments');
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Create New Segment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Schedule & Channel */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <Label className="mb-3 block">When to Send *</Label>
                      <div className="space-y-3">
                        <div
                          onClick={() => setScheduleType('immediate')}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            scheduleType === 'immediate'
                              ? 'border-[#007AFF] bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                scheduleType === 'immediate'
                                  ? 'border-[#007AFF]'
                                  : 'border-gray-300'
                              }`}
                            >
                              {scheduleType === 'immediate' && (
                                <div className="w-3 h-3 bg-[#007AFF] rounded-full" />
                              )}
                            </div>
                            <div>
                              <p className="text-gray-900 font-medium">Send Immediately</p>
                              <p className="text-gray-500 text-sm">
                                Broadcast will be sent right away
                              </p>
                            </div>
                          </div>
                        </div>

                        <div
                          onClick={() => setScheduleType('scheduled')}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            scheduleType === 'scheduled'
                              ? 'border-[#007AFF] bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                scheduleType === 'scheduled'
                                  ? 'border-[#007AFF]'
                                  : 'border-gray-300'
                              }`}
                            >
                              {scheduleType === 'scheduled' && (
                                <div className="w-3 h-3 bg-[#007AFF] rounded-full" />
                              )}
                            </div>
                            <div>
                              <p className="text-gray-900 font-medium">Schedule for Later</p>
                              <p className="text-gray-500 text-sm">
                                Choose a specific date and time
                              </p>
                            </div>
                          </div>

                          {scheduleType === 'scheduled' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="ml-8 grid grid-cols-2 gap-3"
                            >
                              <div>
                                <Label className="text-xs">Date</Label>
                                <Input
                                  type="date"
                                  value={scheduledDate}
                                  onChange={(e) => setScheduledDate(e.target.value)}
                                  className="mt-1"
                                  min={new Date().toISOString().split('T')[0]}
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Time</Label>
                                <Input
                                  type="time"
                                  value={scheduledTime}
                                  onChange={(e) => setScheduledTime(e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="mb-3 block">Delivery Channels *</Label>
                      <div className="space-y-2">
                        {[
                          { id: 'LINE', name: 'LINE', icon: MessageSquare, color: 'green' },
                          { id: 'Push', name: 'Push Notification', icon: Radio, color: 'blue' },
                          { id: 'Email', name: 'Email', icon: Mail, color: 'orange' },
                        ].map((channel) => {
                          const Icon = channel.icon;
                          const isSelected = selectedChannels.includes(channel.id);
                          return (
                            <div
                              key={channel.id}
                              onClick={() => handleToggleChannel(channel.id)}
                              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                                isSelected
                                  ? `border-${channel.color}-500 bg-${channel.color}-50`
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Icon
                                    className={`w-5 h-5 ${
                                      isSelected ? `text-${channel.color}-600` : 'text-gray-400'
                                    }`}
                                  />
                                  <span className="text-gray-900">{channel.name}</span>
                                </div>
                                <div
                                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                    isSelected
                                      ? 'border-[#007AFF] bg-[#007AFF]'
                                      : 'border-gray-300'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Review & Confirm */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h4 className="text-gray-900 mb-4">Review Broadcast Details</h4>

                    <Card className="p-4 bg-gray-50">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-xs text-gray-500">Broadcast Name</Label>
                          <p className="text-gray-900 mt-1">{broadcastName}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs text-gray-500">Message Type</Label>
                            <Badge variant="outline" className="mt-1 capitalize">
                              {messageType}
                            </Badge>
                          </div>

                          <div>
                            <Label className="text-xs text-gray-500">Target Segment</Label>
                            <p className="text-gray-900 mt-1 text-sm">
                              {getSelectedSegmentData()?.name}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {getSelectedSegmentData()?.memberCount.toLocaleString()} members
                            </p>
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs text-gray-500">Schedule</Label>
                          <p className="text-gray-900 mt-1">
                            {scheduleType === 'immediate'
                              ? 'Send Immediately'
                              : `${scheduledDate} at ${scheduledTime}`}
                          </p>
                        </div>

                        <div>
                          <Label className="text-xs text-gray-500">Channels</Label>
                          <div className="flex gap-2 mt-1">
                            {selectedChannels.map((channel) => (
                              <Badge key={channel} variant="outline">
                                {channel}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <Label className="text-xs text-gray-500">Message Preview</Label>
                          <div className="bg-white border border-gray-200 rounded-lg p-3 mt-2">
                            <p className="text-gray-900 text-sm">{messageContent}</p>
                          </div>
                        </div>
                      </div>
                    </Card>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-green-900 mb-1">Ready to Send</p>
                          <p className="text-xs text-green-700">
                            Your broadcast will reach{' '}
                            {getSelectedSegmentData()?.memberCount.toLocaleString()} members via{' '}
                            {selectedChannels.join(', ')}.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column - Live Preview */}
            <div className="col-span-1">
              <div className="sticky top-4">
                <Label className="text-xs text-gray-500 mb-2 block">Live Preview</Label>
                <motion.div
                  layout
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200"
                >
                  {/* Mobile Frame */}
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Mobile Header */}
                    <div className="bg-gradient-to-r from-[#007AFF] to-[#0051D5] p-3 text-white">
                      <p className="text-xs opacity-75">Notification</p>
                      <p className="text-sm font-medium">CRM Master</p>
                    </div>

                    {/* Message Content */}
                    <div className="p-4">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={messageContent + messageImage}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {messageImage && (
                            <div className="mb-3 rounded-lg overflow-hidden">
                              <img
                                src={messageImage}
                                alt="Preview"
                                className="w-full h-32 object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          )}

                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="text-xs border-blue-200 bg-blue-50 text-blue-700"
                              >
                                {messageType || 'Type'}
                              </Badge>
                            </div>

                            <p className="text-sm text-gray-900">
                              {messageContent || 'Your message will appear here...'}
                            </p>

                            {targetSegment && (
                              <div className="flex items-center gap-1 text-xs text-gray-500 mt-3">
                                <Users className="w-3 h-3" />
                                <span>
                                  {getSelectedSegmentData()?.memberCount.toLocaleString()}{' '}
                                  recipients
                                </span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Mobile Footer */}
                    <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500 text-center">
                        {scheduleType === 'scheduled' && scheduledDate
                          ? `Scheduled: ${scheduledDate}`
                          : 'Immediate delivery'}
                      </p>
                    </div>
                  </div>

                  {/* Channel Indicators */}
                  {selectedChannels.length > 0 && (
                    <div className="mt-3 flex gap-2 justify-center">
                      {selectedChannels.map((channel) => (
                        <Badge
                          key={channel}
                          variant="outline"
                          className={`text-xs ${
                            channel === 'LINE'
                              ? 'border-green-200 bg-green-50 text-green-700'
                              : channel === 'Push'
                              ? 'border-blue-200 bg-blue-50 text-blue-700'
                              : 'border-orange-200 bg-orange-50 text-orange-700'
                          }`}
                        >
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                if (currentStep === 1) {
                  setShowCreateModal(false);
                  resetForm();
                } else {
                  setCurrentStep(currentStep - 1);
                }
              }}
            >
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </Button>

            <div className="flex gap-2">
              {currentStep < 4 ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={
                    (currentStep === 1 && (!broadcastName || !messageContent)) ||
                    (currentStep === 2 && !targetSegment) ||
                    (currentStep === 3 &&
                      (selectedChannels.length === 0 ||
                        (scheduleType === 'scheduled' && (!scheduledDate || !scheduledTime))))
                  }
                  className="bg-[#007AFF] hover:bg-[#0051D5]"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleCreateBroadcast}
                  className="bg-[#007AFF] hover:bg-[#0051D5]"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {scheduleType === 'immediate' ? 'Send Now' : 'Schedule Broadcast'}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Broadcast Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Send className="w-6 h-6 text-[#007AFF]" />
              {selectedBroadcast?.name}
            </DialogTitle>
            <DialogDescription>View broadcast details and performance</DialogDescription>
          </DialogHeader>

          {selectedBroadcast && (
            <div className="space-y-6">
              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <Label className="text-xs text-gray-500">Target Segment</Label>
                  <p className="text-gray-900 mt-1">{selectedBroadcast.targetSegment}</p>
                  <p className="text-gray-500 text-sm">
                    {selectedBroadcast.segmentSize.toLocaleString()} members
                  </p>
                </Card>

                <Card className="p-4">
                  <Label className="text-xs text-gray-500">Status</Label>
                  <Badge
                    className={`mt-1 ${
                      selectedBroadcast.status === 'Sent'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {selectedBroadcast.status}
                  </Badge>
                </Card>

                <Card className="p-4">
                  <Label className="text-xs text-gray-500">Channels</Label>
                  <div className="flex gap-2 mt-1">
                    {selectedBroadcast.channels.map((ch) => (
                      <Badge key={ch} variant="outline">
                        {ch}
                      </Badge>
                    ))}
                  </div>
                </Card>

                <Card className="p-4">
                  <Label className="text-xs text-gray-500">Created By</Label>
                  <p className="text-gray-900 mt-1">{selectedBroadcast.createdBy}</p>
                  <p className="text-gray-500 text-sm">{selectedBroadcast.createdDate}</p>
                </Card>
              </div>

              {/* Message Preview */}
              <Card className="p-6">
                <h4 className="text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-[#007AFF]" />
                  Message Preview
                </h4>

                {selectedBroadcast.image && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img
                      src={selectedBroadcast.image}
                      alt="Broadcast"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900">{selectedBroadcast.message}</p>
                </div>
              </Card>

              {/* Performance Stats (if sent) */}
              {selectedBroadcast.status === 'Sent' && selectedBroadcast.sentCount && (
                <Card className="p-6">
                  <h4 className="text-gray-900 mb-4">Performance Summary</h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm">Sent</p>
                      <p className="text-gray-900 text-xl mt-1">
                        {selectedBroadcast.sentCount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Delivered</p>
                      <p className="text-gray-900 text-xl mt-1">
                        {selectedBroadcast.deliveredCount?.toLocaleString()}
                      </p>
                      <p className="text-green-600 text-xs">
                        {Math.round(
                          ((selectedBroadcast.deliveredCount || 0) / selectedBroadcast.sentCount) *
                            100
                        )}
                        %
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Opened</p>
                      <p className="text-gray-900 text-xl mt-1">
                        {selectedBroadcast.openedCount?.toLocaleString()}
                      </p>
                      <p className="text-blue-600 text-xs">
                        {Math.round(
                          ((selectedBroadcast.openedCount || 0) / selectedBroadcast.sentCount) * 100
                        )}
                        %
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Clicked</p>
                      <p className="text-gray-900 text-xl mt-1">
                        {selectedBroadcast.clickedCount?.toLocaleString()}
                      </p>
                      <p className="text-purple-600 text-xs">
                        {Math.round(
                          ((selectedBroadcast.clickedCount || 0) / selectedBroadcast.sentCount) * 100
                        )}
                        %
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {selectedBroadcast.status === 'Sent' && (
                  <Button
                    className="flex-1 bg-[#007AFF] hover:bg-[#0051D5]"
                    onClick={() => {
                      setShowDetailModal(false);
                      handleViewAnalytics(selectedBroadcast);
                    }}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Full Analytics
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    toast.info('Duplicate feature coming soon');
                  }}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Broadcast Analytics Modal */}
      <Dialog open={showAnalyticsModal} onOpenChange={setShowAnalyticsModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-[#007AFF]" />
              Broadcast Analytics - {selectedBroadcast?.name}
            </DialogTitle>
            <DialogDescription>
              Detailed performance metrics and insights
            </DialogDescription>
          </DialogHeader>

          {selectedBroadcast && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-500 text-sm">Delivery Rate</p>
                    <Send className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-gray-900 text-2xl">
                    {selectedBroadcast.deliveredCount && selectedBroadcast.sentCount
                      ? Math.round(
                          (selectedBroadcast.deliveredCount / selectedBroadcast.sentCount) * 100
                        )
                      : 0}
                    %
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {selectedBroadcast.deliveredCount?.toLocaleString()} /{' '}
                    {selectedBroadcast.sentCount?.toLocaleString()}
                  </p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-500 text-sm">Open Rate</p>
                    <Eye className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-gray-900 text-2xl">
                    {selectedBroadcast.openedCount && selectedBroadcast.sentCount
                      ? Math.round((selectedBroadcast.openedCount / selectedBroadcast.sentCount) * 100)
                      : 0}
                    %
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {selectedBroadcast.openedCount?.toLocaleString()} opens
                  </p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-500 text-sm">Click Rate</p>
                    <MousePointerClick className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-gray-900 text-2xl">
                    {selectedBroadcast.clickedCount && selectedBroadcast.sentCount
                      ? Math.round(
                          (selectedBroadcast.clickedCount / selectedBroadcast.sentCount) * 100
                        )
                      : 0}
                    %
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {selectedBroadcast.clickedCount?.toLocaleString()} clicks
                  </p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-500 text-sm">Conversion</p>
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                  </div>
                  <p className="text-gray-900 text-2xl">8.2%</p>
                  <p className="text-gray-500 text-xs mt-1">102 conversions</p>
                </Card>
              </div>

              {/* Performance Over Time */}
              <Card className="p-6">
                <h4 className="text-gray-900 mb-4">Performance Over Time</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="time" stroke="#999" />
                    <YAxis stroke="#999" />
                    <ChartTooltip />
                    <Line
                      type="monotone"
                      dataKey="sent"
                      stroke="#6B7280"
                      strokeWidth={2}
                      name="Sent"
                    />
                    <Line
                      type="monotone"
                      dataKey="delivered"
                      stroke="#10B981"
                      strokeWidth={2}
                      name="Delivered"
                    />
                    <Line
                      type="monotone"
                      dataKey="opened"
                      stroke="#007AFF"
                      strokeWidth={2}
                      name="Opened"
                    />
                    <Line
                      type="monotone"
                      dataKey="clicked"
                      stroke="#9333EA"
                      strokeWidth={2}
                      name="Clicked"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Channel Distribution */}
              <div className="grid grid-cols-2 gap-6">
                <Card className="p-6">
                  <h4 className="text-gray-900 mb-4">Channel Distribution</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={channelData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {channelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6">
                  <h4 className="text-gray-900 mb-4">Engagement Funnel</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Sent</span>
                        <span className="text-sm font-medium">1,248 (100%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gray-600 h-2 rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Delivered</span>
                        <span className="text-sm font-medium">1,235 (99%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '99%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Opened</span>
                        <span className="text-sm font-medium">1,108 (89%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '89%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Clicked</span>
                        <span className="text-sm font-medium">743 (60%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Converted</span>
                        <span className="text-sm font-medium">102 (8%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{ width: '8%' }} />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Export Actions */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Export Full Report
                </Button>
                <Button variant="outline" className="flex-1">
                  <Users className="w-4 h-4 mr-2" />
                  View Engaged Members
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
