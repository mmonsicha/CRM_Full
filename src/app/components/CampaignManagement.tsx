import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Switch } from './ui/switch';
import { Plus, Users, Target, TrendingUp, Calendar, Upload, X, Edit, Copy, Archive, Filter, FileText, Code, Coins, Megaphone, Gamepad2, Settings as SettingsIcon, MapPin, Clock, FileUp, Gift, Eye, Pencil } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import {
  Tooltip as TooltipUI,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import CampaignDetail from './CampaignDetail';

// Campaign Type Configuration
const campaignTypeConfig = {
  Events: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Calendar },
  Code: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Code },
  Points: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Coins },
  Promotional: { color: 'bg-pink-100 text-pink-700 border-pink-200', icon: Megaphone },
  Gamification: { color: 'bg-green-100 text-green-700 border-green-200', icon: Gamepad2 },
  System: { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: SettingsIcon },
};

type CampaignType = keyof typeof campaignTypeConfig;

interface Campaign {
  id: number;
  name: string;
  type: CampaignType;
  startDate: string;
  endDate: string;
  participants: number;
  status: 'Active' | 'Upcoming' | 'Ended';
  engagement?: number;
  description?: string;
  location?: string;
  duration?: string;
  codeGeneration?: string;
  pointsToEarn?: number;
  linkedPromotionId?: string;
  missions?: string;
  triggerEvent?: string;
}

const initialCampaigns: Campaign[] = [
  { id: 1, name: 'Summer Music Festival', type: 'Events', startDate: '2024-11-01', endDate: '2024-11-30', participants: 2847, status: 'Active', engagement: 85, location: 'Central Park', duration: '3 hours' },
  { id: 2, name: 'Exclusive Discount Codes', type: 'Code', startDate: '2024-12-01', endDate: '2024-12-25', participants: 1523, status: 'Upcoming', engagement: 0, codeGeneration: 'AUTO-GEN' },
  { id: 3, name: 'Triple Points Weekend', type: 'Points', startDate: '2024-10-01', endDate: '2024-10-31', participants: 4521, status: 'Ended', engagement: 78, pointsToEarn: 300 },
  { id: 4, name: 'Flash Sale Campaign', type: 'Promotional', startDate: '2024-10-15', endDate: '2024-11-15', participants: 892, status: 'Active', engagement: 92, linkedPromotionId: 'PROMO-2024-001' },
  { id: 5, name: 'Lucky Spin Challenge', type: 'Gamification', startDate: '2024-11-05', endDate: '2024-11-20', participants: 3214, status: 'Active', engagement: 68, missions: 'Complete 5 spins' },
  { id: 6, name: 'New Member Welcome', type: 'System', startDate: '2024-01-01', endDate: '2024-12-31', participants: 5892, status: 'Active', engagement: 88, triggerEvent: 'Signup' },
];

const performanceData = [
  { date: 'Week 1', engagement: 65, conversion: 45 },
  { date: 'Week 2', engagement: 72, conversion: 52 },
  { date: 'Week 3', engagement: 78, conversion: 58 },
  { date: 'Week 4', engagement: 85, conversion: 64 },
];

const participantData = [
  { name: 'Joined', value: 2847, color: '#3b82f6' },
  { name: 'Completed', value: 1823, color: '#10b981' },
  { name: 'In Progress', value: 924, color: '#f59e0b' },
  { name: 'Dropped', value: 100, color: '#ef4444' },
];

export default function CampaignManagement() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [filterType, setFilterType] = useState<CampaignType | 'All'>('All');
  const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({});
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const filteredCampaigns = filterType === 'All' 
    ? campaigns 
    : campaigns.filter(c => c.type === filterType);

  const handleCreateCampaign = () => {
    const campaign: Campaign = {
      id: campaigns.length + 1,
      name: newCampaign.name || 'New Campaign',
      type: newCampaign.type || 'Events',
      startDate: newCampaign.startDate || '2024-11-01',
      endDate: newCampaign.endDate || '2024-11-30',
      participants: 0,
      status: 'Upcoming',
      engagement: 0,
      ...newCampaign,
    };
    
    setCampaigns([campaign, ...campaigns]);
    toast.success('Campaign created successfully!');
    setShowCreateDialog(false);
    setNewCampaign({});
    setUploadedImage(null);
  };

  const handleEditCampaign = () => {
    if (selectedCampaign) {
      setCampaigns(campaigns.map(c => 
        c.id === selectedCampaign.id ? { ...selectedCampaign, ...newCampaign } : c
      ));
      setSelectedCampaign({ ...selectedCampaign, ...newCampaign });
      toast.success('Campaign updated successfully!');
      setShowEditDialog(false);
      setNewCampaign({});
    }
  };

  const handleDuplicateCampaign = () => {
    if (selectedCampaign) {
      const duplicated: Campaign = {
        ...selectedCampaign,
        id: campaigns.length + 1,
        name: `${selectedCampaign.name} (Copy)`,
        participants: 0,
        status: 'Upcoming',
        engagement: 0,
      };
      setCampaigns([duplicated, ...campaigns]);
      toast.success('Campaign duplicated successfully!');
      setShowDuplicateDialog(false);
    }
  };

  const handleArchiveCampaign = () => {
    if (selectedCampaign) {
      setCampaigns(campaigns.filter(c => c.id !== selectedCampaign.id));
      toast.success('Campaign archived successfully!');
      setShowArchiveDialog(false);
      setSelectedCampaign(null);
    }
  };

  const handleViewCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const CampaignTypeBadge = ({ type }: { type: CampaignType }) => {
    const config = campaignTypeConfig[type];
    const Icon = config.icon;
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs ${config.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {type}
      </div>
    );
  };

  const DynamicCampaignFields = ({ type }: { type: CampaignType }) => {
    switch (type) {
      case 'Events':
        return (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="space-y-4"
          >
            <div>
              <Label>Location</Label>
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Enter event location" 
                  value={newCampaign.location || ''}
                  onChange={(e) => setNewCampaign({ ...newCampaign, location: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Duration</Label>
              <div className="flex items-center gap-2 mt-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="e.g., 3 hours" 
                  value={newCampaign.duration || ''}
                  onChange={(e) => setNewCampaign({ ...newCampaign, duration: e.target.value })}
                />
              </div>
            </div>
          </motion.div>
        );
      
      case 'Code':
        return (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="space-y-4"
          >
            <div>
              <Label>Code Generation Method</Label>
              <Select 
                value={newCampaign.codeGeneration || ''}
                onValueChange={(value) => setNewCampaign({ ...newCampaign, codeGeneration: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AUTO-GEN">Auto Generate</SelectItem>
                  <SelectItem value="MANUAL">Manual Entry</SelectItem>
                  <SelectItem value="IMPORT">Import CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newCampaign.codeGeneration === 'IMPORT' && (
              <div>
                <Label>Upload CSV File</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <FileUp className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <div className="text-gray-600">Click to upload CSV</div>
                  <div className="text-gray-500 mt-1">CSV file with codes</div>
                </div>
              </div>
            )}
          </motion.div>
        );
      
      case 'Points':
        return (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="space-y-4"
          >
            <div>
              <Label>Points to Earn</Label>
              <div className="flex items-center gap-2 mt-2">
                <Coins className="w-4 h-4 text-gray-400" />
                <Input 
                  type="number" 
                  placeholder="Enter points amount" 
                  value={newCampaign.pointsToEarn || ''}
                  onChange={(e) => setNewCampaign({ ...newCampaign, pointsToEarn: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label>Earning Conditions</Label>
              <Textarea 
                placeholder="Describe how members can earn points..." 
                rows={3} 
                className="mt-2"
              />
            </div>
          </motion.div>
        );
      
      case 'Promotional':
        return (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="space-y-4"
          >
            <div>
              <Label>Linked Promotion ID</Label>
              <div className="flex items-center gap-2 mt-2">
                <Gift className="w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="e.g., PROMO-2024-001" 
                  value={newCampaign.linkedPromotionId || ''}
                  onChange={(e) => setNewCampaign({ ...newCampaign, linkedPromotionId: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Promotion Details</Label>
              <Textarea 
                placeholder="Describe the promotional offer..." 
                rows={3} 
                className="mt-2"
              />
            </div>
          </motion.div>
        );
      
      case 'Gamification':
        return (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="space-y-4"
          >
            <div>
              <Label>Missions</Label>
              <Textarea 
                placeholder="List the missions or challenges..." 
                rows={3} 
                className="mt-2"
                value={newCampaign.missions || ''}
                onChange={(e) => setNewCampaign({ ...newCampaign, missions: e.target.value })}
              />
            </div>
            <div>
              <Label>Reward Rules</Label>
              <Textarea 
                placeholder="Define how rewards are distributed..." 
                rows={3} 
                className="mt-2"
              />
            </div>
          </motion.div>
        );
      
      case 'System':
        return (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="space-y-4"
          >
            <div>
              <Label>Trigger Event Type</Label>
              <Select 
                value={newCampaign.triggerEvent || ''}
                onValueChange={(value) => setNewCampaign({ ...newCampaign, triggerEvent: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select trigger event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Signup">New Member Signup</SelectItem>
                  <SelectItem value="Purchase">First Purchase</SelectItem>
                  <SelectItem value="Birthday">Member Birthday</SelectItem>
                  <SelectItem value="Anniversary">Join Anniversary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Auto-trigger Settings</Label>
              <Textarea 
                placeholder="Configure automatic campaign activation..." 
                rows={3} 
                className="mt-2"
              />
            </div>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <AnimatePresence mode="wait">
        {!selectedCampaign ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-gray-900">Campaign Management</h2>
                <p className="text-gray-600 mt-1">Manage and track all your campaigns</p>
              </div>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Campaign
              </Button>
            </div>

            {/* Campaign Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-600">Total Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-900">{campaigns.length}</div>
                  <div className="text-gray-500 mt-1">All time</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-600">Active</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-900">{campaigns.filter(c => c.status === 'Active').length}</div>
                  <div className="text-green-600 mt-1">Running now</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-600">Upcoming</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-900">{campaigns.filter(c => c.status === 'Upcoming').length}</div>
                  <div className="text-blue-600 mt-1">Scheduled</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-600">Total Participants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-900">{campaigns.reduce((sum, c) => sum + c.participants, 0).toLocaleString()}</div>
                  <div className="text-gray-500 mt-1">This month</div>
                </CardContent>
              </Card>
            </div>

            {/* Campaign List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Campaigns</CardTitle>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <Select value={filterType} onValueChange={(value) => setFilterType(value as CampaignType | 'All')}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Types</SelectItem>
                        <SelectItem value="Events">Events</SelectItem>
                        <SelectItem value="Code">Code</SelectItem>
                        <SelectItem value="Points">Points</SelectItem>
                        <SelectItem value="Promotional">Promotional</SelectItem>
                        <SelectItem value="Gamification">Gamification</SelectItem>
                        <SelectItem value="System">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="popLayout">
                      {filteredCampaigns.map((campaign) => (
                        <motion.tr
                          key={campaign.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="group cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-200"
                        >
                          <TableCell className="py-4">
                            <div className="text-gray-900">{campaign.name}</div>
                          </TableCell>
                          <TableCell>
                            <CampaignTypeBadge type={campaign.type} />
                          </TableCell>
                          <TableCell className="text-gray-600">{campaign.startDate}</TableCell>
                          <TableCell className="text-gray-600">{campaign.endDate}</TableCell>
                          <TableCell className="text-gray-900">{campaign.participants.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                campaign.status === 'Active' ? 'default' :
                                campaign.status === 'Upcoming' ? 'secondary' :
                                'outline'
                              }
                            >
                              {campaign.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <TooltipProvider>
                                <TooltipUI>
                                  <TooltipTrigger asChild>
                                    <div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleViewCampaign(campaign)}
                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50 hover:text-[#007AFF]"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>View Campaign</p>
                                  </TooltipContent>
                                </TooltipUI>
                              </TooltipProvider>

                              <TooltipProvider>
                                <TooltipUI>
                                  <TooltipTrigger asChild>
                                    <div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedCampaign(campaign);
                                          setNewCampaign(campaign);
                                          setShowEditDialog(true);
                                        }}
                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50 hover:text-[#007AFF]"
                                      >
                                        <Pencil className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit Campaign</p>
                                  </TooltipContent>
                                </TooltipUI>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <CampaignDetail
            campaign={selectedCampaign}
            onBack={() => setSelectedCampaign(null)}
            onEdit={() => {
              setNewCampaign(selectedCampaign);
              setShowEditDialog(true);
            }}
            onDuplicate={() => setShowDuplicateDialog(true)}
            onArchive={() => setShowArchiveDialog(true)}
            showPreview={true}
          />
        )}
      </AnimatePresence>

      {/* Create Campaign Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Campaign Name</Label>
              <Input 
                placeholder="Enter campaign name" 
                className="mt-2" 
                value={newCampaign.name || ''}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea 
                placeholder="Describe your campaign" 
                rows={3} 
                className="mt-2"
                value={newCampaign.description || ''}
                onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
              />
            </div>
            <div>
              <Label>Campaign Type</Label>
              <Select 
                value={newCampaign.type} 
                onValueChange={(value) => setNewCampaign({ ...newCampaign, type: value as CampaignType })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Events">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Events
                    </div>
                  </SelectItem>
                  <SelectItem value="Code">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      Code
                    </div>
                  </SelectItem>
                  <SelectItem value="Points">
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4" />
                      Points
                    </div>
                  </SelectItem>
                  <SelectItem value="Promotional">
                    <div className="flex items-center gap-2">
                      <Megaphone className="w-4 h-4" />
                      Promotional
                    </div>
                  </SelectItem>
                  <SelectItem value="Gamification">
                    <div className="flex items-center gap-2">
                      <Gamepad2 className="w-4 h-4" />
                      Gamification
                    </div>
                  </SelectItem>
                  <SelectItem value="System">
                    <div className="flex items-center gap-2">
                      <SettingsIcon className="w-4 h-4" />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dynamic Fields Based on Campaign Type */}
            <AnimatePresence mode="wait">
              {newCampaign.type && <DynamicCampaignFields type={newCampaign.type} />}
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input 
                  type="date" 
                  className="mt-2"
                  value={newCampaign.startDate || ''}
                  onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input 
                  type="date" 
                  className="mt-2"
                  value={newCampaign.endDate || ''}
                  onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <Label>Campaign Image</Label>
              <input
                type="file"
                id="campaign-image"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {uploadedImage ? (
                <div className="mt-2 relative">
                  <img 
                    src={uploadedImage} 
                    alt="Campaign" 
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="campaign-image"
                  className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <div className="text-gray-600">Click to upload or drag and drop</div>
                  <div className="text-gray-500 mt-1">PNG, JPG up to 5MB</div>
                </label>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowCreateDialog(false);
                  setNewCampaign({});
                  setUploadedImage(null);
                }} 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleCreateCampaign} className="flex-1">
                Create Campaign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Campaign Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Campaign Name</Label>
              <Input 
                placeholder="Enter campaign name" 
                className="mt-2" 
                value={newCampaign.name || ''}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea 
                placeholder="Describe your campaign" 
                rows={3} 
                className="mt-2"
                value={newCampaign.description || ''}
                onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input 
                  type="date" 
                  className="mt-2"
                  value={newCampaign.startDate || ''}
                  onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input 
                  type="date" 
                  className="mt-2"
                  value={newCampaign.endDate || ''}
                  onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowEditDialog(false);
                  setNewCampaign({});
                }} 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleEditCampaign} className="flex-1">
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Duplicate Campaign Dialog */}
      <AlertDialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duplicate Campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              This will create a copy of "{selectedCampaign?.name}" with all settings and configurations. You can edit the duplicate after creation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDuplicateCampaign}>
              Duplicate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Archive Campaign Dialog */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive "{selectedCampaign?.name}"? This campaign will be moved to the archive and will no longer be active.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchiveCampaign} className="bg-red-600 hover:bg-red-700">
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}