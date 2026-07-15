import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Gamepad2, Plus, Edit, Trash2, Eye, GripVertical, Save,
  Play, Pause, Award, Gift, Ticket, Coins, X
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence, Reorder } from 'motion/react';

interface GameSlot {
  id: string;
  label: string;
  reward: string;
  rewardType: 'Product' | 'Points' | 'Coupon';
  probability: number;
  color: string;
}

interface Game {
  id: string;
  name: string;
  type: 'Wheel' | 'Random';
  rewardType: 'Product' | 'Points' | 'Coupon' | 'Mixed';
  active: boolean;
  order: number;
  connectedCampaign?: string;
  slots: GameSlot[];
}

const mockGames: Game[] = [
  {
    id: '1',
    name: 'Lucky Spin Wheel',
    type: 'Wheel',
    rewardType: 'Mixed',
    active: true,
    order: 1,
    connectedCampaign: 'Summer Campaign 2024',
    slots: [
      { id: 's1', label: 'Prize 1', reward: '100 Points', rewardType: 'Points', probability: 20, color: '#FF6B6B' },
      { id: 's2', label: 'Prize 2', reward: '50 Points', rewardType: 'Points', probability: 30, color: '#4ECDC4' },
      { id: 's3', label: 'Coupon', reward: '$10 Voucher', rewardType: 'Coupon', probability: 25, color: '#45B7D1' },
      { id: 's4', label: 'Try Again', reward: 'No Prize', rewardType: 'Points', probability: 25, color: '#96CEB4' },
    ]
  },
  {
    id: '2',
    name: 'Random Prize Draw',
    type: 'Random',
    rewardType: 'Product',
    active: true,
    order: 2,
    connectedCampaign: 'Point Booster Q4',
    slots: [
      { id: 's5', label: 'Grand Prize', reward: 'iPhone 15', rewardType: 'Product', probability: 5, color: '#FFB6B9' },
      { id: 's6', label: 'Second Prize', reward: 'AirPods Pro', rewardType: 'Product', probability: 15, color: '#FEE715' },
      { id: 's7', label: 'Third Prize', reward: 'Gift Card', rewardType: 'Coupon', probability: 30, color: '#BAE1FF' },
      { id: 's8', label: 'Consolation', reward: '10 Points', rewardType: 'Points', probability: 50, color: '#C7CEEA' },
    ]
  },
  {
    id: '3',
    name: 'Daily Point Spinner',
    type: 'Wheel',
    rewardType: 'Points',
    active: false,
    order: 3,
    slots: [
      { id: 's9', label: '500 Points', reward: '500 Points', rewardType: 'Points', probability: 10, color: '#FFD93D' },
      { id: 's10', label: '200 Points', reward: '200 Points', rewardType: 'Points', probability: 20, color: '#6BCB77' },
      { id: 's11', label: '100 Points', reward: '100 Points', rewardType: 'Points', probability: 30, color: '#4D96FF' },
      { id: 's12', label: '50 Points', reward: '50 Points', rewardType: 'Points', probability: 40, color: '#FF6B9D' },
    ]
  },
];

const campaigns = [
  'Summer Campaign 2024',
  'Point Booster Q4',
  'New Year Special',
  'Loyalty Rewards Program',
];

export default function GamificationManagement() {
  const [games, setGames] = useState<Game[]>(mockGames);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<string | null>(null);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const handleCreateNew = () => {
    const newGame: Game = {
      id: Date.now().toString(),
      name: 'New Game',
      type: 'Wheel',
      rewardType: 'Points',
      active: false,
      order: games.length + 1,
      slots: [
        { id: 's1', label: 'Prize 1', reward: '100 Points', rewardType: 'Points', probability: 25, color: '#FF6B6B' },
        { id: 's2', label: 'Prize 2', reward: '50 Points', rewardType: 'Points', probability: 25, color: '#4ECDC4' },
        { id: 's3', label: 'Prize 3', reward: '25 Points', rewardType: 'Points', probability: 25, color: '#45B7D1' },
        { id: 's4', label: 'Try Again', reward: 'No Prize', rewardType: 'Points', probability: 25, color: '#96CEB4' },
      ]
    };
    setEditingGame(newGame);
    setShowEditDialog(true);
  };

  const handleEdit = (game: Game) => {
    setEditingGame({ ...game, slots: [...game.slots] });
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!editingGame) return;

    const totalProbability = editingGame.slots.reduce((sum, slot) => sum + slot.probability, 0);
    if (totalProbability !== 100) {
      toast.error('Total probability must equal 100%');
      return;
    }

    if (games.find(g => g.id === editingGame.id)) {
      setGames(games.map(g => g.id === editingGame.id ? editingGame : g));
      toast.success('Game updated successfully!');
    } else {
      setGames([...games, editingGame]);
      toast.success('Game created successfully!');
    }
    setShowEditDialog(false);
    setEditingGame(null);
  };

  const handleDelete = (id: string) => {
    setGameToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (gameToDelete) {
      setGames(games.filter(g => g.id !== gameToDelete));
      toast.success('Game deleted successfully!');
      setShowDeleteDialog(false);
      setGameToDelete(null);
    }
  };

  const handlePreview = (game: Game) => {
    setSelectedGame(game);
    setShowPreviewDialog(true);
    setSpinning(false);
    setSelectedSlot(null);
  };

  const handleToggleActive = (id: string, active: boolean) => {
    setGames(games.map(g => g.id === id ? { ...g, active } : g));
    toast.success(active ? 'Game activated' : 'Game deactivated');
  };

  const handleSaveOrder = () => {
    toast.success('Game order saved successfully!');
  };

  const handleReorder = (newOrder: Game[]) => {
    const reordered = newOrder.map((game, index) => ({
      ...game,
      order: index + 1
    }));
    setGames(reordered);
  };

  const handleSpinWheel = () => {
    if (!selectedGame) return;
    
    setSpinning(true);
    setSelectedSlot(null);

    // Simulate spinning for 2 seconds
    setTimeout(() => {
      // Select random slot based on probability
      const random = Math.random() * 100;
      let cumulative = 0;
      let winningSlot = 0;

      for (let i = 0; i < selectedGame.slots.length; i++) {
        cumulative += selectedGame.slots[i].probability;
        if (random <= cumulative) {
          winningSlot = i;
          break;
        }
      }

      setSelectedSlot(winningSlot);
      setSpinning(false);
      toast.success(`You won: ${selectedGame.slots[winningSlot].reward}!`, {
        duration: 4000,
      });
    }, 2000);
  };

  const handleAddSlot = () => {
    if (!editingGame || editingGame.slots.length >= 10) return;

    const newSlot: GameSlot = {
      id: Date.now().toString(),
      label: `Prize ${editingGame.slots.length + 1}`,
      reward: '10 Points',
      rewardType: 'Points',
      probability: 10,
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
    };
    setEditingGame({
      ...editingGame,
      slots: [...editingGame.slots, newSlot]
    });
  };

  const handleRemoveSlot = (slotId: string) => {
    if (!editingGame || editingGame.slots.length <= 2) {
      toast.error('Game must have at least 2 slots');
      return;
    }
    setEditingGame({
      ...editingGame,
      slots: editingGame.slots.filter(s => s.id !== slotId)
    });
  };

  const handleUpdateSlot = (slotId: string, updates: Partial<GameSlot>) => {
    if (!editingGame) return;
    setEditingGame({
      ...editingGame,
      slots: editingGame.slots.map(s => s.id === slotId ? { ...s, ...updates } : s)
    });
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'Product': return <Gift className="w-4 h-4" />;
      case 'Points': return <Coins className="w-4 h-4" />;
      case 'Coupon': return <Ticket className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#007AFF] to-[#0051D5] rounded-xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-white">Gamification Management</h2>
            <p className="text-blue-50 mt-1">Create and manage interactive games for customer engagement</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSaveOrder}
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Order
            </Button>
            <Button
              onClick={handleCreateNew}
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Game
            </Button>
          </div>
        </div>
      </div>

      {/* Games Table */}
      <Card>
        <CardHeader>
          <CardTitle>Game List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Game Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reward Type</TableHead>
                  <TableHead>Connected Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {games.map((game) => (
                  <TableRow
                    key={game.id}
                    className="hover:bg-gray-50"
                  >
                      <TableCell>
                        <GripVertical className="w-4 h-4 text-gray-400" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Gamepad2 className="w-4 h-4 text-[#007AFF]" />
                          <span className="text-gray-900">{game.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {game.type === 'Wheel' ? '🎡' : '🎰'} {game.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getRewardIcon(game.rewardType)}
                          <span className="text-gray-600">{game.rewardType}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {game.connectedCampaign ? (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700">
                            {game.connectedCampaign}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">Not connected</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={game.active}
                            onCheckedChange={(checked) => handleToggleActive(game.id, checked)}
                          />
                          <Badge variant={game.active ? 'default' : 'outline'}>
                            {game.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(game)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePreview(game)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(game.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingGame && games.find(g => g.id === editingGame.id) ? 'Edit' : 'Create'} Game
            </DialogTitle>
            <DialogDescription>
              Configure game settings, rewards, and probabilities
            </DialogDescription>
          </DialogHeader>
          {editingGame && (
            <div className="space-y-6 py-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Game Name</Label>
                  <Input
                    value={editingGame.name}
                    onChange={(e) => setEditingGame({ ...editingGame, name: e.target.value })}
                    placeholder="Enter game name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Game Type</Label>
                  <Select
                    value={editingGame.type}
                    onValueChange={(value: 'Wheel' | 'Random') => 
                      setEditingGame({ ...editingGame, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Wheel">🎡 Wheel of Fortune</SelectItem>
                      <SelectItem value="Random">🎰 Random Draw</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Reward Type</Label>
                  <Select
                    value={editingGame.rewardType}
                    onValueChange={(value: any) => 
                      setEditingGame({ ...editingGame, rewardType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Product">🎁 Product</SelectItem>
                      <SelectItem value="Points">💰 Points</SelectItem>
                      <SelectItem value="Coupon">🎟️ Coupon</SelectItem>
                      <SelectItem value="Mixed">🎨 Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Connect to Campaign (Optional)</Label>
                  <Select
                    value={editingGame.connectedCampaign || 'none'}
                    onValueChange={(value) => 
                      setEditingGame({ ...editingGame, connectedCampaign: value === 'none' ? undefined : value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {campaigns.map((campaign) => (
                        <SelectItem key={campaign} value={campaign}>
                          {campaign}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Slots Configuration */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Prize Slots (Max 10)</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAddSlot}
                    disabled={editingGame.slots.length >= 10}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Slot
                  </Button>
                </div>

                <div className="space-y-3">
                  {editingGame.slots.map((slot, index) => (
                    <Card key={slot.id}>
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded"
                                style={{ backgroundColor: slot.color }}
                              />
                              <span className="text-gray-600">Slot {index + 1}</span>
                            </div>
                            {editingGame.slots.length > 2 && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemoveSlot(slot.id)}
                              >
                                <X className="w-4 h-4 text-red-600" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-2">
                              <Label className="text-sm">Label</Label>
                              <Input
                                value={slot.label}
                                onChange={(e) => handleUpdateSlot(slot.id, { label: e.target.value })}
                                placeholder="Prize label"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm">Reward</Label>
                              <Input
                                value={slot.reward}
                                onChange={(e) => handleUpdateSlot(slot.id, { reward: e.target.value })}
                                placeholder="e.g., 100 Points"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm">Type</Label>
                              <Select
                                value={slot.rewardType}
                                onValueChange={(value: any) => handleUpdateSlot(slot.id, { rewardType: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Product">Product</SelectItem>
                                  <SelectItem value="Points">Points</SelectItem>
                                  <SelectItem value="Coupon">Coupon</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm">Probability (%)</Label>
                            <Input
                              type="number"
                              value={slot.probability}
                              onChange={(e) => handleUpdateSlot(slot.id, { probability: Number(e.target.value) })}
                              min="0"
                              max="100"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className={`p-3 rounded-lg border ${
                  editingGame.slots.reduce((sum, slot) => sum + slot.probability, 0) === 100
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <p className={`text-sm ${
                    editingGame.slots.reduce((sum, slot) => sum + slot.probability, 0) === 100
                      ? 'text-green-800'
                      : 'text-red-800'
                  }`}>
                    Total Probability: {editingGame.slots.reduce((sum, slot) => sum + slot.probability, 0)}%
                    {editingGame.slots.reduce((sum, slot) => sum + slot.probability, 0) !== 100 && (
                      <span className="ml-2">⚠️ Must equal 100%</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-gray-900">Active Status</p>
                  <p className="text-gray-500 text-sm">Make this game available in the customer app</p>
                </div>
                <Switch
                  checked={editingGame.active}
                  onCheckedChange={(checked) => setEditingGame({ ...editingGame, active: checked })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="bg-[#007AFF] hover:bg-[#0051D5]">
              <Save className="w-4 h-4 mr-2" />
              Save Game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Interactive Game Preview</DialogTitle>
            <DialogDescription>
              {selectedGame?.name} - Click to play and test the game
            </DialogDescription>
          </DialogHeader>
          {selectedGame && (
            <div className="py-6">
              <Tabs defaultValue={selectedGame.type.toLowerCase()}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="wheel">Wheel View</TabsTrigger>
                  <TabsTrigger value="prizes">Prize List</TabsTrigger>
                </TabsList>

                <TabsContent value="wheel" className="mt-6">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-8">
                    {selectedGame.type === 'Wheel' ? (
                      <div className="text-center space-y-6">
                        <div className="relative w-80 h-80 mx-auto">
                          <motion.div
                            animate={{ 
                              rotate: spinning ? 360 * 5 + (selectedSlot !== null ? (selectedSlot / selectedGame.slots.length) * 360 : 0) : 0 
                            }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            className="w-full h-full rounded-full border-8 border-white shadow-2xl relative overflow-hidden"
                          >
                            {selectedGame.slots.map((slot, index) => {
                              const angle = (360 / selectedGame.slots.length) * index;
                              const nextAngle = (360 / selectedGame.slots.length) * (index + 1);
                              return (
                                <div
                                  key={slot.id}
                                  className="absolute inset-0 flex items-center justify-center"
                                  style={{
                                    clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((angle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((angle - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos((nextAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((nextAngle - 90) * Math.PI / 180)}%)`,
                                    backgroundColor: slot.color,
                                  }}
                                >
                                  <div
                                    className="absolute text-white text-xs p-2"
                                    style={{
                                      transform: `rotate(${angle + (360 / selectedGame.slots.length) / 2}deg)`,
                                      transformOrigin: 'center',
                                    }}
                                  >
                                    {slot.label}
                                  </div>
                                </div>
                              );
                            })}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl shadow-lg z-10">
                                🎯
                              </div>
                            </div>
                          </motion.div>
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20">
                            <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-red-500" />
                          </div>
                        </div>
                        <Button
                          onClick={handleSpinWheel}
                          disabled={spinning}
                          size="lg"
                          className="bg-[#007AFF] hover:bg-[#0051D5]"
                        >
                          {spinning ? 'Spinning...' : 'Spin the Wheel!'}
                        </Button>
                        {selectedSlot !== null && !spinning && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 bg-white rounded-lg shadow-lg"
                          >
                            <p className="text-gray-900 mb-2">🎉 Congratulations!</p>
                            <p className="text-gray-600">You won: <strong>{selectedGame.slots[selectedSlot].reward}</strong></p>
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center space-y-6">
                        <h3 className="text-gray-900">Random Draw</h3>
                        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                          {selectedGame.slots.map((slot, index) => (
                            <motion.div
                              key={slot.id}
                              whileHover={{ scale: 1.05 }}
                              className="p-6 rounded-lg text-white cursor-pointer shadow-lg"
                              style={{ backgroundColor: slot.color }}
                              onClick={() => {
                                setSelectedSlot(index);
                                toast.success(`You selected: ${slot.reward}!`);
                              }}
                            >
                              <div className="flex items-center justify-center gap-2 mb-2">
                                {getRewardIcon(slot.rewardType)}
                                <p>{slot.label}</p>
                              </div>
                              <p className="text-sm opacity-90">{slot.reward}</p>
                              <p className="text-xs opacity-75 mt-2">{slot.probability}% chance</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="prizes" className="mt-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        {selectedGame.slots.map((slot) => (
                          <div
                            key={slot.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-12 h-12 rounded flex items-center justify-center"
                                style={{ backgroundColor: slot.color }}
                              >
                                {getRewardIcon(slot.rewardType)}
                              </div>
                              <div>
                                <p className="text-gray-900">{slot.label}</p>
                                <p className="text-gray-600 text-sm">{slot.reward}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline">{slot.rewardType}</Badge>
                              <p className="text-gray-500 text-sm mt-1">{slot.probability}% chance</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowPreviewDialog(false)}>Close Preview</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Game</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this game? This action cannot be undone and will affect any connected campaigns.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
