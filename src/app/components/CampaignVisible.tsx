import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Eye, EyeOff, Calendar as CalendarIcon, Clock, Edit, Search, Filter, 
  Download, X, ChevronRight, Check, Tag, Users, AlertCircle, Smartphone,
  Plus, Trash2, Settings, RefreshCw, Play, Pause
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { toast } from 'sonner@2.0.3';

interface CampaignVisibility {
  id: string;
  campaignName: string;
  type: 'Event' | 'Promotion' | 'Gamification' | 'Point Collection';
  startDate: string;
  endDate: string;
  visible: boolean;
  visibilityMode: 'Auto' | 'Scheduled' | 'Segment-Based' | 'Hidden' | 'Manual';
  scheduledDate?: string;
  scheduledTime?: string;
  visibilityRules?: {
    type: 'include' | 'exclude';
    segments: string[];
  };
}

interface Segment {
  id: string;
  name: string;
  memberCount: number;
}

// Shared segments data (same as in BroadcastManagement and MemberSegments)
const availableSegments: Segment[] = [
  { id: 'SEG001', name: 'VIP Customers', memberCount: 1248 },
  { id: 'SEG002', name: 'New Members (Q4 2025)', memberCount: 892 },
  { id: 'SEG003', name: 'Inactive Members', memberCount: 543 },
  { id: 'SEG004', name: 'Birthday This Month', memberCount: 327 },
  { id: 'SEG005', name: 'Gold Tier Members', memberCount: 2156 },
  { id: 'SEG006', name: 'All Active Members', memberCount: 4523 },
];

export default function CampaignVisible() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignVisibility | null>(null);
  const [mockUserSegment, setMockUserSegment] = useState('SEG001');

  // Edit Modal State
  const [visibilityMode, setVisibilityMode] = useState<CampaignVisibility['visibilityMode']>('Auto');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [ruleType, setRuleType] = useState<'include' | 'exclude'>('include');
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);

  const [campaigns, setCampaigns] = useState<CampaignVisibility[]>([
    {
      id: 'CMP001',
      campaignName: 'Summer Shopping Festival',
      type: 'Event',
      startDate: '2025-06-01',
      endDate: '2025-08-31',
      visible: true,
      visibilityMode: 'Auto',
    },
    {
      id: 'CMP002',
      campaignName: 'VIP Exclusive Rewards',
      type: 'Event',
      startDate: '2025-05-15',
      endDate: '2025-12-31',
      visible: true,
      visibilityMode: 'Segment-Based',
      visibilityRules: {
        type: 'include',
        segments: ['SEG001', 'SEG005'],
      },
    },
    {
      id: 'CMP003',
      campaignName: 'Flash Sale - 50% OFF',
      type: 'Promotion',
      startDate: '2025-11-10',
      endDate: '2025-11-15',
      visible: false,
      visibilityMode: 'Scheduled',
      scheduledDate: '2025-11-09',
      scheduledTime: '00:00',
    },
    {
      id: 'CMP004',
      campaignName: 'New Member Welcome',
      type: 'Event',
      startDate: '2025-11-01',
      endDate: '2025-11-30',
      visible: true,
      visibilityMode: 'Segment-Based',
      visibilityRules: {
        type: 'include',
        segments: ['SEG002'],
      },
    },
    {
      id: 'CMP005',
      campaignName: 'Lucky Spin Challenge',
      type: 'Gamification',
      startDate: '2025-06-01',
      endDate: '2025-06-30',
      visible: true,
      visibilityMode: 'Manual',
    },
    {
      id: 'CMP006',
      campaignName: 'Triple Points Weekend',
      type: 'Point Collection',
      startDate: '2025-11-08',
      endDate: '2025-11-10',
      visible: false,
      visibilityMode: 'Hidden',
    },
  ]);

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.campaignName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleSegment = (segmentId: string) => {
    setSelectedSegments(prev =>
      prev.includes(segmentId)
        ? prev.filter(id => id !== segmentId)
        : [...prev, segmentId]
    );
  };

  const handleEditVisibility = (campaign: CampaignVisibility) => {
    setSelectedCampaign(campaign);
    setVisibilityMode(campaign.visibilityMode);
    setScheduledDate(campaign.scheduledDate || '');
    setScheduledTime(campaign.scheduledTime || '');
    setRuleType(campaign.visibilityRules?.type || 'include');
    setSelectedSegments(campaign.visibilityRules?.segments || []);
    setShowEditModal(true);
  };

  const handleSaveVisibility = () => {
    if (!selectedCampaign) return;

    const updatedCampaign: CampaignVisibility = {
      ...selectedCampaign,
      visibilityMode,
      scheduledDate: visibilityMode === 'Scheduled' ? scheduledDate : undefined,
      scheduledTime: visibilityMode === 'Scheduled' ? scheduledTime : undefined,
      visibilityRules:
        visibilityMode === 'Segment-Based'
          ? { type: ruleType, segments: selectedSegments }
          : undefined,
      visible: visibilityMode === 'Hidden' ? false : selectedCampaign.visible,
    };

    setCampaigns(campaigns.map(c => (c.id === selectedCampaign.id ? updatedCampaign : c)));
    setShowEditModal(false);
    toast.success('Visibility settings updated', {
      description: `${selectedCampaign.campaignName} visibility has been configured`,
    });
  };

  const handleQuickToggle = (campaignId: string) => {
    setCampaigns(
      campaigns.map(c =>
        c.id === campaignId ? { ...c, visible: !c.visible } : c
      )
    );
    const campaign = campaigns.find(c => c.id === campaignId);
    toast.success(
      campaign?.visible ? 'Campaign hidden' : 'Campaign is now visible',
      { description: campaign?.campaignName }
    );
  };

  const handlePreview = (campaign: CampaignVisibility) => {
    setSelectedCampaign(campaign);
    setShowPreviewModal(true);
  };

  const isCampaignVisibleToUser = (campaign: CampaignVisibility, userSegment: string): boolean => {
    if (campaign.visibilityMode === 'Hidden') return false;
    if (!campaign.visible) return false;

    if (campaign.visibilityMode === 'Segment-Based' && campaign.visibilityRules) {
      const { type, segments } = campaign.visibilityRules;
      const isInSegment = segments.includes(userSegment);

      if (type === 'include') {
        return isInSegment;
      } else {
        return !isInSegment;
      }
    }

    return campaign.visible;
  };

  const getVisibilityDescription = (campaign: CampaignVisibility): string => {
    switch (campaign.visibilityMode) {
      case 'Auto':
        return 'Visible to all members during campaign period';
      case 'Manual':
        return 'Manually controlled visibility';
      case 'Scheduled':
        return `Will be visible from ${campaign.scheduledDate} at ${campaign.scheduledTime}`;
      case 'Hidden':
        return 'Hidden from all members';
      case 'Segment-Based':
        if (campaign.visibilityRules) {
          const segmentNames = campaign.visibilityRules.segments
            .map(id => availableSegments.find(s => s.id === id)?.name)
            .filter(Boolean);
          const action = campaign.visibilityRules.type === 'include' ? 'Visible to' : 'Hidden from';
          return `${action}: ${segmentNames.join(', ')}`;
        }
        return 'Segment-based visibility';
      default:
        return 'Unknown visibility mode';
    }
  };

  const getAffectedMemberCount = (): number => {
    if (visibilityMode !== 'Segment-Based') {
      return availableSegments.reduce((sum, s) => sum + s.memberCount, 0);
    }

    const selectedSegmentData = availableSegments.filter(s =>
      selectedSegments.includes(s.id)
    );

    const count = selectedSegmentData.reduce((sum, s) => sum + s.memberCount, 0);

    if (ruleType === 'exclude') {
      const totalMembers = availableSegments.reduce((sum, s) => sum + s.memberCount, 0);
      return totalMembers - count;
    }

    return count;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-gray-900 text-2xl mb-1">Campaign Visibility Management</h2>
            <p className="text-gray-500 text-sm">
              Control which campaigns are visible to different member segments
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                toast.success('Campaign visibility refreshed');
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Campaigns</p>
              <p className="text-gray-900 text-2xl mt-1">{campaigns.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-[#007AFF]" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Currently Visible</p>
              <p className="text-gray-900 text-2xl mt-1">
                {campaigns.filter(c => c.visible).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Segment-Based</p>
              <p className="text-gray-900 text-2xl mt-1">
                {campaigns.filter(c => c.visibilityMode === 'Segment-Based').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Tag className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Scheduled</p>
              <p className="text-gray-900 text-2xl mt-1">
                {campaigns.filter(c => c.visibilityMode === 'Scheduled').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="p-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search campaigns..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Visibility Mode</TableHead>
              <TableHead>Visibility Rules</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCampaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell>
                  <div>
                    <p className="text-gray-900">{campaign.campaignName}</p>
                    <p className="text-gray-500 text-xs">{campaign.id}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                    {campaign.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-600">
                    <p>{new Date(campaign.startDate).toLocaleDateString('en-GB')}</p>
                    <p className="text-xs text-gray-500">
                      to {new Date(campaign.endDate).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${
                      campaign.visibilityMode === 'Auto'
                        ? 'border-blue-200 bg-blue-50 text-blue-700'
                        : campaign.visibilityMode === 'Segment-Based'
                        ? 'border-purple-200 bg-purple-50 text-purple-700'
                        : campaign.visibilityMode === 'Scheduled'
                        ? 'border-orange-200 bg-orange-50 text-orange-700'
                        : campaign.visibilityMode === 'Hidden'
                        ? 'border-red-200 bg-red-50 text-red-700'
                        : 'border-gray-200 bg-gray-50 text-gray-700'
                    }`}
                  >
                    {campaign.visibilityMode}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <p className="text-xs text-gray-600">{getVisibilityDescription(campaign)}</p>
                    {campaign.visibilityMode === 'Segment-Based' && campaign.visibilityRules && (
                      <div className="flex gap-1 mt-1">
                        {campaign.visibilityRules.segments.slice(0, 2).map(segId => {
                          const segment = availableSegments.find(s => s.id === segId);
                          return segment ? (
                            <Badge
                              key={segId}
                              variant="outline"
                              className="text-xs border-purple-200 bg-purple-50 text-purple-700"
                            >
                              {segment.name}
                            </Badge>
                          ) : null;
                        })}
                        {campaign.visibilityRules.segments.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{campaign.visibilityRules.segments.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={campaign.visible && campaign.visibilityMode !== 'Hidden'}
                      onCheckedChange={() => handleQuickToggle(campaign.id)}
                      disabled={campaign.visibilityMode === 'Hidden'}
                    />
                    <Badge
                      className={`${
                        campaign.visible && campaign.visibilityMode !== 'Hidden'
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      {campaign.visible && campaign.visibilityMode !== 'Hidden'
                        ? 'Visible'
                        : 'Hidden'}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePreview(campaign)}
                    >
                      <Smartphone className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditVisibility(campaign)}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <Eye className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No campaigns found</p>
          </div>
        )}
      </Card>

      {/* Edit Visibility Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configure Visibility Settings</DialogTitle>
            <DialogDescription>
              Control when and to whom this campaign is visible
            </DialogDescription>
          </DialogHeader>

          {selectedCampaign && (
            <div className="space-y-6">
              {/* Campaign Info */}
              <Card className="p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-gray-900 font-medium">{selectedCampaign.campaignName}</h4>
                    <p className="text-gray-500 text-sm">
                      {new Date(selectedCampaign.startDate).toLocaleDateString('en-GB')} -{' '}
                      {new Date(selectedCampaign.endDate).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <Badge variant="outline">{selectedCampaign.type}</Badge>
                </div>
              </Card>

              {/* Visibility Mode Selection */}
              <div>
                <Label className="mb-3 block">Visibility Mode *</Label>
                <RadioGroup value={visibilityMode} onValueChange={(v: any) => setVisibilityMode(v)}>
                  <div className="space-y-3">
                    {/* Auto */}
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        visibilityMode === 'Auto'
                          ? 'border-[#007AFF] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setVisibilityMode('Auto')}
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value="Auto" id="auto" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="auto" className="cursor-pointer">
                            <div className="flex items-center gap-2 mb-1">
                              <Eye className="w-4 h-4 text-blue-600" />
                              <span className="font-medium">Automatic</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Visible to all members during campaign period
                            </p>
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Segment-Based */}
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        visibilityMode === 'Segment-Based'
                          ? 'border-[#007AFF] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setVisibilityMode('Segment-Based')}
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value="Segment-Based" id="segment" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="segment" className="cursor-pointer">
                            <div className="flex items-center gap-2 mb-1">
                              <Tag className="w-4 h-4 text-purple-600" />
                              <span className="font-medium">Segment-Based</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Control visibility based on member segments
                            </p>
                          </Label>

                          {visibilityMode === 'Segment-Based' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 space-y-4"
                            >
                              {/* Rule Type */}
                              <div>
                                <Label className="text-sm mb-2 block">Visibility Rule</Label>
                                <div className="grid grid-cols-2 gap-3">
                                  <div
                                    onClick={() => setRuleType('include')}
                                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                                      ruleType === 'include'
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div
                                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                          ruleType === 'include'
                                            ? 'border-green-600'
                                            : 'border-gray-300'
                                        }`}
                                      >
                                        {ruleType === 'include' && (
                                          <div className="w-2 h-2 bg-green-600 rounded-full" />
                                        )}
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-900">
                                          Show to Selected
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          Only visible to selected segments
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    onClick={() => setRuleType('exclude')}
                                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                                      ruleType === 'exclude'
                                        ? 'border-red-500 bg-red-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div
                                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                          ruleType === 'exclude'
                                            ? 'border-red-600'
                                            : 'border-gray-300'
                                        }`}
                                      >
                                        {ruleType === 'exclude' && (
                                          <div className="w-2 h-2 bg-red-600 rounded-full" />
                                        )}
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-900">
                                          Hide from Selected
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          Hidden from selected segments
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Segment Selection */}
                              <div>
                                <Label className="text-sm mb-2 block">Select Segments</Label>
                                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                                  {availableSegments.map((segment) => {
                                    const isSelected = selectedSegments.includes(segment.id);
                                    return (
                                      <div
                                        key={segment.id}
                                        onClick={() => handleToggleSegment(segment.id)}
                                        className={`border rounded-lg p-3 cursor-pointer transition-all ${
                                          isSelected
                                            ? 'border-[#007AFF] bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-3">
                                            <div
                                              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                                isSelected
                                                  ? 'border-[#007AFF] bg-[#007AFF]'
                                                  : 'border-gray-300'
                                              }`}
                                            >
                                              {isSelected && (
                                                <Check className="w-3 h-3 text-white" />
                                              )}
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-900">
                                                {segment.name}
                                              </p>
                                              <p className="text-xs text-gray-500">
                                                {segment.memberCount.toLocaleString()} members
                                              </p>
                                            </div>
                                          </div>
                                          <Tag className="w-4 h-4 text-gray-400" />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Scheduled */}
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        visibilityMode === 'Scheduled'
                          ? 'border-[#007AFF] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setVisibilityMode('Scheduled')}
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value="Scheduled" id="scheduled" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="scheduled" className="cursor-pointer">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-4 h-4 text-orange-600" />
                              <span className="font-medium">Scheduled</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Automatically show at specific date and time
                            </p>
                          </Label>

                          {visibilityMode === 'Scheduled' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-4 grid grid-cols-2 gap-3"
                            >
                              <div>
                                <Label className="text-xs">Visibility Date</Label>
                                <Input
                                  type="date"
                                  value={scheduledDate}
                                  onChange={(e) => setScheduledDate(e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Visibility Time</Label>
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

                    {/* Manual */}
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        visibilityMode === 'Manual'
                          ? 'border-[#007AFF] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setVisibilityMode('Manual')}
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value="Manual" id="manual" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="manual" className="cursor-pointer">
                            <div className="flex items-center gap-2 mb-1">
                              <Settings className="w-4 h-4 text-gray-600" />
                              <span className="font-medium">Manual Control</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Manually toggle visibility using the switch
                            </p>
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Hidden */}
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        visibilityMode === 'Hidden'
                          ? 'border-[#007AFF] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setVisibilityMode('Hidden')}
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value="Hidden" id="hidden" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="hidden" className="cursor-pointer">
                            <div className="flex items-center gap-2 mb-1">
                              <EyeOff className="w-4 h-4 text-red-600" />
                              <span className="font-medium">Hidden</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Keep campaign completely hidden from all members
                            </p>
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Summary */}
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-900 font-medium mb-1">
                      Visibility Summary
                    </p>
                    <p className="text-sm text-blue-700">
                      {visibilityMode === 'Auto' &&
                        'Campaign will be visible to all members during the campaign period.'}
                      {visibilityMode === 'Manual' &&
                        'You can manually control visibility using the toggle switch.'}
                      {visibilityMode === 'Scheduled' &&
                        scheduledDate &&
                        scheduledTime &&
                        `Campaign will automatically become visible on ${scheduledDate} at ${scheduledTime}.`}
                      {visibilityMode === 'Hidden' &&
                        'Campaign will be hidden from all members regardless of other settings.'}
                      {visibilityMode === 'Segment-Based' &&
                        selectedSegments.length > 0 &&
                        `Campaign will be ${
                          ruleType === 'include' ? 'visible to' : 'hidden from'
                        } approximately ${getAffectedMemberCount().toLocaleString()} members in the selected segments.`}
                      {visibilityMode === 'Segment-Based' &&
                        selectedSegments.length === 0 &&
                        'Please select at least one segment.'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveVisibility}
              className="bg-[#007AFF] hover:bg-[#0051D5]"
              disabled={
                (visibilityMode === 'Segment-Based' && selectedSegments.length === 0) ||
                (visibilityMode === 'Scheduled' && (!scheduledDate || !scheduledTime))
              }
            >
              <Check className="w-4 h-4 mr-2" />
              Save Visibility Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Smartphone className="w-6 h-6 text-[#007AFF]" />
              Mobile App Preview - {selectedCampaign?.campaignName}
            </DialogTitle>
            <DialogDescription>
              Preview campaign visibility for different member segments
            </DialogDescription>
          </DialogHeader>

          {selectedCampaign && (
            <div className="grid grid-cols-2 gap-6">
              {/* Left - Controls */}
              <div className="space-y-4">
                <Card className="p-4">
                  <h4 className="text-gray-900 font-medium mb-3">Test User Segment</h4>
                  <Select value={mockUserSegment} onValueChange={setMockUserSegment}>
                    <SelectTrigger>
                      <SelectValue />
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
                </Card>

                <Card className="p-4">
                  <h4 className="text-gray-900 font-medium mb-3">Campaign Info</h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-500">Name</Label>
                      <p className="text-gray-900 text-sm mt-1">
                        {selectedCampaign.campaignName}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Type</Label>
                      <Badge variant="outline" className="mt-1">
                        {selectedCampaign.type}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Visibility Mode</Label>
                      <Badge
                        variant="outline"
                        className={`mt-1 ${
                          selectedCampaign.visibilityMode === 'Segment-Based'
                            ? 'border-purple-200 bg-purple-50 text-purple-700'
                            : 'border-blue-200 bg-blue-50 text-blue-700'
                        }`}
                      >
                        {selectedCampaign.visibilityMode}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Period</Label>
                      <p className="text-gray-900 text-sm mt-1">
                        {new Date(selectedCampaign.startDate).toLocaleDateString('en-GB')} -{' '}
                        {new Date(selectedCampaign.endDate).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="text-gray-900 font-medium mb-3">Visibility Rules</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {getVisibilityDescription(selectedCampaign)}
                  </p>

                  {selectedCampaign.visibilityMode === 'Segment-Based' &&
                    selectedCampaign.visibilityRules && (
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-500">Target Segments</Label>
                        <div className="flex flex-wrap gap-2">
                          {selectedCampaign.visibilityRules.segments.map((segId) => {
                            const segment = availableSegments.find((s) => s.id === segId);
                            return segment ? (
                              <Badge
                                key={segId}
                                variant="outline"
                                className="border-purple-200 bg-purple-50 text-purple-700"
                              >
                                {segment.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                </Card>

                <Card
                  className={`p-4 ${
                    isCampaignVisibleToUser(selectedCampaign, mockUserSegment)
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isCampaignVisibleToUser(selectedCampaign, mockUserSegment) ? (
                      <>
                        <Eye className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm text-green-900 font-medium">
                            Visible to this segment
                          </p>
                          <p className="text-xs text-green-700">
                            Campaign will appear in the mobile app
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-5 h-5 text-red-600" />
                        <div>
                          <p className="text-sm text-red-900 font-medium">
                            Hidden from this segment
                          </p>
                          <p className="text-xs text-red-700">
                            Campaign will not appear in the mobile app
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              </div>

              {/* Right - Mobile Preview */}
              <div className="sticky top-4">
                <Label className="text-xs text-gray-500 mb-2 block">
                  Mobile App Preview (
                  {availableSegments.find((s) => s.id === mockUserSegment)?.name})
                </Label>
                <motion.div
                  layout
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200"
                >
                  {/* Mobile Frame */}
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Mobile Header */}
                    <div className="bg-gradient-to-r from-[#007AFF] to-[#0051D5] p-4 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">Events & Campaigns</h3>
                        <Badge className="bg-white/20 text-white border-0">
                          {availableSegments.find((s) => s.id === mockUserSegment)?.name}
                        </Badge>
                      </div>
                    </div>

                    {/* Campaign List */}
                    <div className="p-4 space-y-3">
                      <AnimatePresence mode="wait">
                        {isCampaignVisibleToUser(selectedCampaign, mockUserSegment) ? (
                          <motion.div
                            key="visible"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-16 h-16 bg-gradient-to-br from-[#007AFF] to-[#0051D5] rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-2xl">🎉</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-gray-900 font-medium mb-1">
                                  {selectedCampaign.campaignName}
                                </h4>
                                <p className="text-gray-500 text-xs mb-2">
                                  {new Date(selectedCampaign.startDate).toLocaleDateString('en-GB')}{' '}
                                  - {new Date(selectedCampaign.endDate).toLocaleDateString('en-GB')}
                                </p>
                                <Badge
                                  variant="outline"
                                  className="text-xs border-blue-200 bg-blue-50 text-blue-700"
                                >
                                  {selectedCampaign.type}
                                </Badge>
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-12"
                          >
                            <EyeOff className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">
                              This campaign is not visible to
                            </p>
                            <p className="text-gray-900 font-medium">
                              {availableSegments.find((s) => s.id === mockUserSegment)?.name}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Other sample campaigns */}
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 opacity-50">
                        <div className="flex items-start gap-3">
                          <div className="w-16 h-16 bg-gray-300 rounded-lg flex-shrink-0" />
                          <div className="flex-1">
                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-gray-300 rounded w-1/2" />
                          </div>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 opacity-50">
                        <div className="flex items-start gap-3">
                          <div className="w-16 h-16 bg-gray-300 rounded-lg flex-shrink-0" />
                          <div className="flex-1">
                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-gray-300 rounded w-1/2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
