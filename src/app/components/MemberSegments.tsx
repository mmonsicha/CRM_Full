import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, Search, RefreshCw, Tag, Users, Calendar, User, Eye, Edit, Trash2,
  X, ChevronRight, Filter, Check, ChevronDown, Download, Radio, AlertCircle
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
import { toast } from 'sonner@2.0.3';

interface Segment {
  id: string;
  name: string;
  description: string;
  type: 'Dynamic' | 'Static';
  totalMembers: number;
  criteria: string[];
  createdBy: string;
  createdDate: string;
  status: 'Active' | 'Inactive';
  lastUpdated: string;
}

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

export default function MemberSegments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Create Segment Form State
  const [segmentName, setSegmentName] = useState('');
  const [segmentDescription, setSegmentDescription] = useState('');
  const [segmentType, setSegmentType] = useState<'Dynamic' | 'Static'>('Dynamic');
  const [conditions, setConditions] = useState<Condition[]>([
    { id: '1', field: '', operator: '', value: '' }
  ]);

  // Mock Segments Data
  const [segments, setSegments] = useState<Segment[]>([
    {
      id: 'SEG001',
      name: 'VIP Customers',
      description: 'High-value customers with lifetime spending > ฿50,000',
      type: 'Dynamic',
      totalMembers: 1248,
      criteria: ['Total Spending > ฿50,000', 'Tier = VIP'],
      createdBy: 'Admin User',
      createdDate: '2025-10-15',
      status: 'Active',
      lastUpdated: '2025-11-05',
    },
    {
      id: 'SEG002',
      name: 'New Members (Q4 2025)',
      description: 'Members who joined in Q4 2025',
      type: 'Static',
      totalMembers: 892,
      criteria: ['Join Date >= 2025-10-01', 'Join Date <= 2025-12-31'],
      createdBy: 'Marketing Team',
      createdDate: '2025-11-01',
      status: 'Active',
      lastUpdated: '2025-11-07',
    },
    {
      id: 'SEG003',
      name: 'Inactive Members',
      description: 'Members with no activity in the last 90 days',
      type: 'Dynamic',
      totalMembers: 543,
      criteria: ['Last Activity < 90 days ago'],
      createdBy: 'Admin User',
      createdDate: '2025-09-20',
      status: 'Active',
      lastUpdated: '2025-11-07',
    },
    {
      id: 'SEG004',
      name: 'Birthday This Month',
      description: 'Members celebrating birthday in November',
      type: 'Dynamic',
      totalMembers: 327,
      criteria: ['Birth Month = November'],
      createdBy: 'CRM Team',
      createdDate: '2025-11-01',
      status: 'Active',
      lastUpdated: '2025-11-07',
    },
    {
      id: 'SEG005',
      name: 'Gold Tier Members',
      description: 'All members in Gold tier',
      type: 'Dynamic',
      totalMembers: 2156,
      criteria: ['Tier = Gold'],
      createdBy: 'Admin User',
      createdDate: '2025-08-10',
      status: 'Active',
      lastUpdated: '2025-11-06',
    },
  ]);

  const filteredSegments = segments.filter((segment) =>
    segment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    segment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCondition = () => {
    setConditions([
      ...conditions,
      { id: Date.now().toString(), field: '', operator: '', value: '' }
    ]);
  };

  const handleRemoveCondition = (id: string) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter(c => c.id !== id));
    }
  };

  const handleUpdateCondition = (id: string, field: keyof Condition, value: string) => {
    setConditions(conditions.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const handleCreateSegment = () => {
    const newSegment: Segment = {
      id: `SEG${String(segments.length + 1).padStart(3, '0')}`,
      name: segmentName,
      description: segmentDescription,
      type: segmentType,
      totalMembers: Math.floor(Math.random() * 2000) + 100,
      criteria: conditions
        .filter(c => c.field && c.operator && c.value)
        .map(c => `${c.field} ${c.operator} ${c.value}`),
      createdBy: 'Admin User',
      createdDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setSegments([newSegment, ...segments]);
    setShowCreateModal(false);
    resetForm();
    toast.success('Segment created successfully!', {
      description: `${newSegment.name} has been added with ${newSegment.totalMembers} members.`,
    });
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSegmentName('');
    setSegmentDescription('');
    setSegmentType('Dynamic');
    setConditions([{ id: '1', field: '', operator: '', value: '' }]);
  };

  const handleDeleteSegment = (id: string) => {
    setSegments(segments.filter(s => s.id !== id));
    toast.success('Segment deleted successfully');
  };

  const handleViewDetail = (segment: Segment) => {
    setSelectedSegment(segment);
    setShowDetailModal(true);
  };

  const getEstimatedCount = () => {
    return Math.floor(Math.random() * 2000) + 100;
  };

  // Field options for condition builder
  const fieldOptions = [
    { value: 'totalSpending', label: 'Total Spending' },
    { value: 'tier', label: 'Member Tier' },
    { value: 'joinDate', label: 'Join Date' },
    { value: 'lastActivity', label: 'Last Activity' },
    { value: 'birthMonth', label: 'Birth Month' },
    { value: 'age', label: 'Age' },
    { value: 'gender', label: 'Gender' },
    { value: 'location', label: 'Location' },
    { value: 'points', label: 'Current Points' },
  ];

  const operatorOptions: Record<string, { value: string; label: string }[]> = {
    totalSpending: [
      { value: '>', label: 'Greater than' },
      { value: '<', label: 'Less than' },
      { value: '=', label: 'Equal to' },
      { value: '>=', label: 'Greater than or equal' },
      { value: '<=', label: 'Less than or equal' },
    ],
    tier: [
      { value: '=', label: 'Is' },
      { value: '!=', label: 'Is not' },
    ],
    joinDate: [
      { value: '>=', label: 'On or after' },
      { value: '<=', label: 'On or before' },
      { value: '=', label: 'Exactly on' },
    ],
    lastActivity: [
      { value: '<', label: 'Less than (days ago)' },
      { value: '>', label: 'More than (days ago)' },
    ],
    birthMonth: [
      { value: '=', label: 'Is' },
    ],
    age: [
      { value: '>', label: 'Older than' },
      { value: '<', label: 'Younger than' },
      { value: '>=', label: 'At least' },
      { value: '<=', label: 'At most' },
    ],
    gender: [
      { value: '=', label: 'Is' },
    ],
    location: [
      { value: '=', label: 'Is' },
      { value: 'contains', label: 'Contains' },
    ],
    points: [
      { value: '>', label: 'Greater than' },
      { value: '<', label: 'Less than' },
      { value: '>=', label: 'At least' },
      { value: '<=', label: 'At most' },
    ],
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-gray-900 text-2xl mb-1">Member Segments</h2>
            <p className="text-gray-500 text-sm">
              Create and manage customer segments for targeted campaigns
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                toast.success('Segments refreshed');
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
              Create New Segment
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Segments</p>
              <p className="text-gray-900 text-2xl mt-1">{segments.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Tag className="w-6 h-6 text-[#007AFF]" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Segments</p>
              <p className="text-gray-900 text-2xl mt-1">
                {segments.filter(s => s.status === 'Active').length}
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
              <p className="text-gray-500 text-sm">Total Members</p>
              <p className="text-gray-900 text-2xl mt-1">
                {segments.reduce((sum, s) => sum + s.totalMembers, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Dynamic Segments</p>
              <p className="text-gray-900 text-2xl mt-1">
                {segments.filter(s => s.type === 'Dynamic').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="p-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search segments by name or description..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* Segments Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Segment Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Criteria</TableHead>
              <TableHead>Total Members</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSegments.map((segment) => (
              <TableRow key={segment.id}>
                <TableCell>
                  <div>
                    <p className="text-gray-900">{segment.name}</p>
                    <p className="text-gray-500 text-xs">{segment.description}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`
                      ${segment.type === 'Dynamic' 
                        ? 'border-blue-200 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 bg-gray-50 text-gray-700'
                      }
                    `}
                  >
                    {segment.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {segment.criteria.slice(0, 2).map((criterion, idx) => (
                      <span key={idx} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                        {criterion}
                      </span>
                    ))}
                    {segment.criteria.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{segment.criteria.length - 2} more
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{segment.totalMembers.toLocaleString()}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{segment.createdBy}</TableCell>
                <TableCell className="text-gray-600">
                  {new Date(segment.createdDate).toLocaleDateString('en-GB')}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`
                      ${segment.status === 'Active'
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                      }
                    `}
                  >
                    {segment.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetail(segment)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
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
                      onClick={() => handleDeleteSegment(segment.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredSegments.length === 0 && (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No segments found</p>
            <p className="text-gray-400 text-sm">Try adjusting your search terms</p>
          </div>
        )}
      </Card>

      {/* Create Segment Modal - 3 Step Wizard */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Segment</DialogTitle>
            <DialogDescription>
              Follow the steps to create a targeted customer segment
            </DialogDescription>
          </DialogHeader>

          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3].map((step) => (
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
                      {step === 1 && 'Segment Info'}
                      {step === 2 && 'Define Conditions'}
                      {step === 3 && 'Review & Save'}
                    </p>
                  </div>
                </div>
                {step < 3 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 ${
                      currentStep > step ? 'bg-[#007AFF]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Segment Info */}
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="name">Segment Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., High-Value Customers Q4 2025"
                    value={segmentName}
                    onChange={(e) => setSegmentName(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this segment represents..."
                    value={segmentDescription}
                    onChange={(e) => setSegmentDescription(e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="type">Segment Type *</Label>
                  <Select value={segmentType} onValueChange={(v: any) => setSegmentType(v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dynamic">
                        <div>
                          <p>Dynamic</p>
                          <p className="text-xs text-gray-500">Updates automatically based on conditions</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="Static">
                        <div>
                          <p>Static</p>
                          <p className="text-xs text-gray-500">Fixed list of members</p>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-900 mb-1">Segment Type Guide</p>
                      <p className="text-xs text-blue-700">
                        <strong>Dynamic:</strong> Member list updates automatically when conditions are met<br />
                        <strong>Static:</strong> Member list is fixed at creation time
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Define Conditions */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-gray-900">Define Segment Conditions</h4>
                    <p className="text-sm text-gray-500">
                      Add conditions to filter members
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddCondition}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Condition
                  </Button>
                </div>

                <div className="space-y-3">
                  {conditions.map((condition, index) => (
                    <motion.div
                      key={condition.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 grid grid-cols-3 gap-3">
                          {/* Field */}
                          <div>
                            <Label className="text-xs">Field</Label>
                            <Select
                              value={condition.field}
                              onValueChange={(v) => handleUpdateCondition(condition.id, 'field', v)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                {fieldOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Operator */}
                          <div>
                            <Label className="text-xs">Operator</Label>
                            <Select
                              value={condition.operator}
                              onValueChange={(v) => handleUpdateCondition(condition.id, 'operator', v)}
                              disabled={!condition.field}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select operator" />
                              </SelectTrigger>
                              <SelectContent>
                                {condition.field && operatorOptions[condition.field]?.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Value */}
                          <div>
                            <Label className="text-xs">Value</Label>
                            <Input
                              placeholder="Enter value"
                              value={condition.value}
                              onChange={(e) => handleUpdateCondition(condition.id, 'value', e.target.value)}
                              className="mt-1"
                              disabled={!condition.operator}
                            />
                          </div>
                        </div>

                        {conditions.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveCondition(condition.id)}
                            className="mt-6"
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </Button>
                        )}
                      </div>

                      {index < conditions.length - 1 && (
                        <div className="flex items-center gap-2 mt-3 -mb-2">
                          <div className="h-px bg-gray-200 flex-1" />
                          <Badge variant="outline" className="text-xs">AND</Badge>
                          <div className="h-px bg-gray-200 flex-1" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      <span className="text-sm text-purple-900">Estimated members:</span>
                    </div>
                    <span className="text-purple-900">{getEstimatedCount().toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review & Save */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h4 className="text-gray-900 mb-4">Review Segment Details</h4>

                <Card className="p-4 bg-gray-50">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-500">Segment Name</Label>
                      <p className="text-gray-900 mt-1">{segmentName}</p>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-500">Description</Label>
                      <p className="text-gray-900 mt-1">
                        {segmentDescription || 'No description provided'}
                      </p>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-500">Type</Label>
                      <Badge variant="outline" className="mt-1">
                        {segmentType}
                      </Badge>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-500">Conditions</Label>
                      <div className="mt-2 space-y-2">
                        {conditions
                          .filter(c => c.field && c.operator && c.value)
                          .map((condition, idx) => (
                            <div
                              key={condition.id}
                              className="bg-white border border-gray-200 rounded p-2 text-sm"
                            >
                              <code className="text-blue-600">
                                {fieldOptions.find(f => f.value === condition.field)?.label}{' '}
                                {condition.operator} {condition.value}
                              </code>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-gray-500">Estimated Members</Label>
                        <span className="text-gray-900 text-lg">{getEstimatedCount().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-green-900 mb-1">Ready to Create</p>
                      <p className="text-xs text-green-700">
                        Your segment will be created and immediately available for use in broadcasts and campaigns.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
              {currentStep < 3 ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={currentStep === 1 && !segmentName}
                  className="bg-[#007AFF] hover:bg-[#0051D5]"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleCreateSegment}
                  className="bg-[#007AFF] hover:bg-[#0051D5]"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Create Segment
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Segment Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Tag className="w-6 h-6 text-[#007AFF]" />
              {selectedSegment?.name}
            </DialogTitle>
            <DialogDescription>
              View and manage segment details
            </DialogDescription>
          </DialogHeader>

          {selectedSegment && (
            <div className="space-y-6">
              {/* Segment Info */}
              <Card className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-xs text-gray-500">Segment Type</Label>
                    <Badge variant="outline" className="mt-1">
                      {selectedSegment.type}
                    </Badge>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-500">Status</Label>
                    <Badge className="mt-1 bg-green-100 text-green-700 border-green-200">
                      {selectedSegment.status}
                    </Badge>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-500">Total Members</Label>
                    <p className="text-gray-900 text-xl mt-1">
                      {selectedSegment.totalMembers.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-500">Created By</Label>
                    <p className="text-gray-900 mt-1">{selectedSegment.createdBy}</p>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-500">Created Date</Label>
                    <p className="text-gray-900 mt-1">
                      {new Date(selectedSegment.createdDate).toLocaleDateString('en-GB')}
                    </p>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-500">Last Updated</Label>
                    <p className="text-gray-900 mt-1">
                      {new Date(selectedSegment.lastUpdated).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <Label className="text-xs text-gray-500">Description</Label>
                  <p className="text-gray-900 mt-1">{selectedSegment.description}</p>
                </div>
              </Card>

              {/* Criteria */}
              <Card className="p-6">
                <h4 className="text-gray-900 mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-[#007AFF]" />
                  Segment Criteria
                </h4>
                <div className="space-y-2">
                  {selectedSegment.criteria.map((criterion, idx) => (
                    <div
                      key={idx}
                      className="bg-blue-50 border border-blue-200 rounded p-3 text-sm"
                    >
                      <code className="text-blue-900">{criterion}</code>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-[#007AFF] hover:bg-[#0051D5]"
                  onClick={() => {
                    toast.success('Redirecting to broadcast creation...');
                    setShowDetailModal(false);
                  }}
                >
                  <Radio className="w-4 h-4 mr-2" />
                  Use for Broadcast
                </Button>
                <Button variant="outline" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Segment
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Export Members
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
