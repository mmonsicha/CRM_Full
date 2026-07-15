import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Crown, Plus, Edit, Eye, Trash2, Users, TrendingUp, Award, Gift, Sparkles, ShoppingBag, Star, Zap } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';

interface Tier {
  id: number;
  name: string;
  level: number;
  icon: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  pointCondition: number;
  purchaseCondition: number;
  privileges: string[];
  status: 'Active' | 'Inactive';
  memberCount: number;
  description?: string;
}

const initialTiers: Tier[] = [
  {
    id: 1,
    name: 'Bronze',
    level: 1,
    icon: '🥉',
    color: '#CD7F32',
    gradientFrom: '#CD7F32',
    gradientTo: '#A0522D',
    pointCondition: 0,
    purchaseCondition: 0,
    privileges: ['Basic rewards access', 'Earn 1x points', 'Standard support'],
    status: 'Active',
    memberCount: 1250,
    description: 'Entry level tier for all new members',
  },
  {
    id: 2,
    name: 'Silver',
    level: 2,
    icon: '🥈',
    color: '#C0C0C0',
    gradientFrom: '#C0C0C0',
    gradientTo: '#A8A8A8',
    pointCondition: 500,
    purchaseCondition: 5000,
    privileges: ['All Bronze benefits', 'Earn 1.2x points', 'Birthday rewards', 'Priority email support'],
    status: 'Active',
    memberCount: 850,
    description: 'Second tier with enhanced benefits',
  },
  {
    id: 3,
    name: 'Gold',
    level: 3,
    icon: '🥇',
    color: '#FFD700',
    gradientFrom: '#FFD700',
    gradientTo: '#FFA500',
    pointCondition: 1500,
    purchaseCondition: 15000,
    privileges: ['All Silver benefits', 'Earn 1.5x points', 'Free shipping', 'Exclusive event access', 'Priority chat support'],
    status: 'Active',
    memberCount: 420,
    description: 'Premium tier with exclusive perks',
  },
  {
    id: 4,
    name: 'Platinum',
    level: 4,
    icon: '💎',
    color: '#E5E4E2',
    gradientFrom: '#E5E4E2',
    gradientTo: '#BCC6CC',
    pointCondition: 5000,
    purchaseCondition: 50000,
    privileges: ['All Gold benefits', 'Earn 2x points', 'Personal shopping assistant', 'VIP events', 'Dedicated account manager', 'Early product access'],
    status: 'Active',
    memberCount: 125,
    description: 'Top tier with premium exclusive benefits',
  },
  {
    id: 5,
    name: 'Diamond',
    level: 5,
    icon: '💍',
    color: '#B9F2FF',
    gradientFrom: '#B9F2FF',
    gradientTo: '#00CED1',
    pointCondition: 15000,
    purchaseCondition: 150000,
    privileges: ['All Platinum benefits', 'Earn 3x points', 'Concierge service', 'Luxury gifts', 'Lifetime warranty', 'Private sales access'],
    status: 'Inactive',
    memberCount: 0,
    description: 'Ultra-exclusive tier (Coming soon)',
  },
];

export default function TierMaster() {
  const [tiers, setTiers] = useState<Tier[]>(initialTiers);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showActivateDialog, setShowActivateDialog] = useState(false);
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [formData, setFormData] = useState<Partial<Tier>>({
    name: '',
    level: 1,
    icon: '🥉',
    color: '#CD7F32',
    pointCondition: 0,
    purchaseCondition: 0,
    privileges: [],
    status: 'Active',
    description: '',
  });
  const [privilegeInput, setPrivilegeInput] = useState('');

  const handleCreate = () => {
    const newTier: Tier = {
      id: Math.max(...tiers.map(t => t.id)) + 1,
      name: formData.name!,
      level: formData.level!,
      icon: formData.icon!,
      color: formData.color!,
      gradientFrom: formData.color!,
      gradientTo: formData.color!,
      pointCondition: formData.pointCondition!,
      purchaseCondition: formData.purchaseCondition!,
      privileges: formData.privileges!,
      status: formData.status!,
      memberCount: 0,
      description: formData.description,
    };
    setTiers([...tiers, newTier]);
    toast.success('Tier created successfully', { description: `"${newTier.name}" tier has been created` });
    setShowCreateDialog(false);
    resetForm();
  };

  const handleEdit = () => {
    if (selectedTier) {
      setTiers(tiers.map(t => t.id === selectedTier.id ? { ...selectedTier, ...formData } : t));
      toast.success('Tier updated successfully', { description: `"${formData.name}" tier has been updated` });
      setShowEditDialog(false);
      setSelectedTier(null);
      resetForm();
    }
  };

  const handleDelete = () => {
    if (selectedTier) {
      setTiers(tiers.filter(t => t.id !== selectedTier.id));
      toast.success('Tier deleted successfully', { description: `"${selectedTier.name}" tier has been removed` });
      setShowDeleteDialog(false);
      setSelectedTier(null);
    }
  };

  const handleToggleStatus = (tier: Tier) => {
    setSelectedTier(tier);
    setShowActivateDialog(true);
  };

  const confirmToggleStatus = () => {
    if (selectedTier) {
      const newStatus = selectedTier.status === 'Active' ? 'Inactive' : 'Active';
      setTiers(tiers.map(t => t.id === selectedTier.id ? { ...t, status: newStatus } : t));
      toast.success(
        `Tier ${newStatus.toLowerCase()}`,
        { description: `"${selectedTier.name}" is now ${newStatus.toLowerCase()}` }
      );
    }
    setShowActivateDialog(false);
    setSelectedTier(null);
  };

  const openEditDialog = (tier: Tier) => {
    setSelectedTier(tier);
    setFormData({
      name: tier.name,
      level: tier.level,
      icon: tier.icon,
      color: tier.color,
      pointCondition: tier.pointCondition,
      purchaseCondition: tier.purchaseCondition,
      privileges: tier.privileges,
      status: tier.status,
      description: tier.description,
    });
    setShowEditDialog(true);
  };

  const openDetailDialog = (tier: Tier) => {
    setSelectedTier(tier);
    setShowDetailDialog(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      level: 1,
      icon: '🥉',
      color: '#CD7F32',
      pointCondition: 0,
      purchaseCondition: 0,
      privileges: [],
      status: 'Active',
      description: '',
    });
    setPrivilegeInput('');
  };

  const addPrivilege = () => {
    if (privilegeInput.trim()) {
      setFormData({
        ...formData,
        privileges: [...(formData.privileges || []), privilegeInput.trim()]
      });
      setPrivilegeInput('');
    }
  };

  const removePrivilege = (index: number) => {
    setFormData({
      ...formData,
      privileges: formData.privileges?.filter((_, i) => i !== index) || []
    });
  };

  const totalMembers = tiers.reduce((sum, tier) => sum + tier.memberCount, 0);
  const activeTiers = tiers.filter(t => t.status === 'Active').length;

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-gray-900 mb-2" style={{ fontSize: '28px', fontWeight: '700' }}>
              Tier Master
            </h1>
            <p className="text-gray-600">Manage membership tiers and privileges</p>
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="gap-2"
            style={{ backgroundColor: '#007AFF' }}
          >
            <Plus className="w-4 h-4" />
            Create New Tier
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <motion.div whileHover={{ scale: 1.02, y: -4 }} transition={{ duration: 0.2 }}>
            <Card className="border-2" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Tiers</p>
                    <p className="text-3xl text-gray-900" style={{ fontWeight: '700' }}>
                      {tiers.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02, y: -4 }} transition={{ duration: 0.2 }}>
            <Card className="border-2" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active Tiers</p>
                    <p className="text-3xl text-green-600" style={{ fontWeight: '700' }}>
                      {activeTiers}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02, y: -4 }} transition={{ duration: 0.2 }}>
            <Card className="border-2" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Members</p>
                    <p className="text-3xl text-blue-600" style={{ fontWeight: '700' }}>
                      {totalMembers.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02, y: -4 }} transition={{ duration: 0.2 }}>
            <Card className="border-2" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Avg. Level</p>
                    <p className="text-3xl text-purple-600" style={{ fontWeight: '700' }}>
                      {(tiers.reduce((sum, t) => sum + t.level, 0) / tiers.length).toFixed(1)}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tier Cards Grid */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <AnimatePresence mode="popLayout">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <Card 
                  className="overflow-hidden border-2 cursor-pointer"
                  style={{ 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderColor: tier.status === 'Active' ? tier.color : '#e5e7eb'
                  }}
                  onClick={() => openDetailDialog(tier)}
                >
                  <div 
                    className="h-3"
                    style={{ 
                      background: `linear-gradient(135deg, ${tier.gradientFrom}, ${tier.gradientTo})`,
                      opacity: tier.status === 'Active' ? 1 : 0.5
                    }}
                  />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{tier.icon}</div>
                        <div>
                          <h3 className="text-gray-900 font-semibold text-lg">{tier.name}</h3>
                          <p className="text-sm text-gray-500">Level {tier.level}</p>
                        </div>
                      </div>
                      <Badge 
                        className={tier.status === 'Active' 
                          ? 'bg-green-100 text-green-700 border-green-200' 
                          : 'bg-gray-100 text-gray-700 border-gray-200'}
                      >
                        {tier.status}
                      </Badge>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Point Requirement</span>
                        <span className="font-semibold text-gray-900">{tier.pointCondition.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Purchase Requirement</span>
                        <span className="font-semibold text-gray-900">฿{tier.purchaseCondition.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Members</span>
                        <span className="font-semibold" style={{ color: tier.color }}>
                          {tier.memberCount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditDialog(tier);
                        }}
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(tier);
                        }}
                        style={tier.status === 'Active' ? {} : { backgroundColor: '#007AFF', color: 'white' }}
                      >
                        {tier.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Table View */}
        <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <CardHeader>
            <CardTitle>Tier Management Table</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tier Name</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Point Condition</TableHead>
                  <TableHead>Purchase Condition</TableHead>
                  <TableHead>Privileges</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {tiers.map((tier, index) => (
                    <motion.tr
                      key={tier.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{tier.icon}</span>
                          <span className="font-medium text-gray-900">{tier.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{tier.level}</Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {tier.pointCondition.toLocaleString()} pts
                      </TableCell>
                      <TableCell className="text-gray-600">
                        ฿{tier.purchaseCondition.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {tier.privileges.length} privileges
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={tier.status === 'Active' 
                            ? 'bg-green-100 text-green-700 border-green-200' 
                            : 'bg-gray-100 text-gray-700 border-gray-200'}
                        >
                          {tier.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openDetailDialog(tier)}
                              className="gap-1"
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditDialog(tier)}
                              className="gap-1"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedTier(tier);
                                setShowDeleteDialog(true);
                              }}
                              className="gap-1 text-red-600 hover:text-red-700 hover:border-red-300"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </motion.div>
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

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog || showEditDialog} onOpenChange={(open) => {
        if (!open) {
          setShowCreateDialog(false);
          setShowEditDialog(false);
          resetForm();
        }
      }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{showEditDialog ? 'Edit Tier' : 'Create New Tier'}</DialogTitle>
            <DialogDescription>
              {showEditDialog ? 'Update tier information and privileges' : 'Set up a new membership tier with conditions and benefits'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tier Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Gold"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Level</Label>
                <Input
                  type="number"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Icon (Emoji)</Label>
                <Input
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="🥇"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Tier Color</Label>
                <Input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="mt-1 h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Point Requirement</Label>
                <Input
                  type="number"
                  value={formData.pointCondition}
                  onChange={(e) => setFormData({ ...formData, pointCondition: parseInt(e.target.value) })}
                  placeholder="1500"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Purchase Requirement (฿)</Label>
                <Input
                  type="number"
                  value={formData.purchaseCondition}
                  onChange={(e) => setFormData({ ...formData, purchaseCondition: parseInt(e.target.value) })}
                  placeholder="15000"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this tier..."
                className="mt-1"
                rows={2}
              />
            </div>

            <div>
              <Label>Privileges</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={privilegeInput}
                  onChange={(e) => setPrivilegeInput(e.target.value)}
                  placeholder="Enter a privilege..."
                  onKeyPress={(e) => e.key === 'Enter' && addPrivilege()}
                />
                <Button onClick={addPrivilege} type="button">Add</Button>
              </div>
              <div className="mt-3 space-y-2">
                {formData.privileges?.map((privilege, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm text-gray-700">{privilege}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removePrivilege(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <Label>Status</Label>
                <p className="text-sm text-gray-500">Enable this tier for members</p>
              </div>
              <Switch
                checked={formData.status === 'Active'}
                onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? 'Active' : 'Inactive' })}
                style={{ backgroundColor: formData.status === 'Active' ? '#007AFF' : undefined }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCreateDialog(false);
              setShowEditDialog(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button 
              onClick={showEditDialog ? handleEdit : handleCreate}
              style={{ backgroundColor: '#007AFF' }}
            >
              {showEditDialog ? 'Save Changes' : 'Create Tier'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedTier?.icon}</span>
              {selectedTier?.name} Tier Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedTier && (
            <div className="py-4">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="privileges">Privileges</TabsTrigger>
                  <TabsTrigger value="members">Members</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div 
                    className="p-6 rounded-xl"
                    style={{ 
                      background: `linear-gradient(135deg, ${selectedTier.gradientFrom}20, ${selectedTier.gradientTo}20)`
                    }}
                  >
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Tier Level</p>
                        <p className="text-2xl font-bold text-gray-900">Level {selectedTier.level}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Status</p>
                        <Badge 
                          className={selectedTier.status === 'Active' 
                            ? 'bg-green-100 text-green-700 border-green-200' 
                            : 'bg-gray-100 text-gray-700 border-gray-200'}
                        >
                          {selectedTier.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Point Requirement</p>
                        <p className="text-2xl font-bold" style={{ color: selectedTier.color }}>
                          {selectedTier.pointCondition.toLocaleString()} pts
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Purchase Requirement</p>
                        <p className="text-2xl font-bold" style={{ color: selectedTier.color }}>
                          ฿{selectedTier.purchaseCondition.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Description</p>
                    <p className="text-gray-900">{selectedTier.description || 'No description available'}</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="privileges" className="space-y-3 mt-4">
                  {selectedTier.privileges.map((privilege, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${selectedTier.color}20` }}
                      >
                        <Star className="w-4 h-4" style={{ color: selectedTier.color }} />
                      </div>
                      <span className="text-gray-900">{privilege}</span>
                    </motion.div>
                  ))}
                </TabsContent>
                
                <TabsContent value="members" className="space-y-4 mt-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <p className="text-4xl font-bold" style={{ color: selectedTier.color }}>
                          {selectedTier.memberCount.toLocaleString()}
                        </p>
                        <p className="text-gray-600 mt-1">Total Members</p>
                      </div>
                      <Progress 
                        value={(selectedTier.memberCount / totalMembers) * 100} 
                        className="h-2"
                      />
                      <p className="text-sm text-gray-500 text-center mt-2">
                        {((selectedTier.memberCount / totalMembers) * 100).toFixed(1)}% of all members
                      </p>
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <p className="text-sm text-gray-600">This Month</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">+{Math.floor(selectedTier.memberCount * 0.12)}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <p className="text-sm text-gray-600">Avg. Spend</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          ฿{(selectedTier.purchaseCondition * 1.5).toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tier</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedTier?.name}" tier? This action cannot be undone and will affect {selectedTier?.memberCount} members.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Activate/Deactivate Confirmation Dialog */}
      <AlertDialog open={showActivateDialog} onOpenChange={setShowActivateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedTier?.status === 'Active' ? 'Deactivate' : 'Activate'} Tier
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {selectedTier?.status === 'Active' ? 'deactivate' : 'activate'} "{selectedTier?.name}" tier?
              {selectedTier?.status === 'Active' 
                ? ' Members will no longer be able to join this tier.' 
                : ' This tier will become available for members to join.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmToggleStatus}
              style={{ backgroundColor: '#007AFF' }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
