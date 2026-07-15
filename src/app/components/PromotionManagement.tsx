import { useState } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Plus, Tag, TrendingUp, Sparkles, Calendar } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const promotions = [
  { id: 1, name: 'SUMMER50', code: 'SUMMER50', type: 'Discount', value: '50%', campaign: 'Summer Flash Sale', validFrom: '2024-11-01', validTo: '2024-11-30', limit: 100, used: 67, status: 'Active' },
  { id: 2, name: 'FREEGIFT', code: 'FREEGIFT', type: 'Free Gift', value: 'Premium Item', campaign: null, validFrom: '2024-10-15', validTo: '2024-11-15', limit: 50, used: 50, status: 'Expired' },
  { id: 3, name: 'POINTS2X', code: 'POINTS2X', type: 'Extra Points', value: '2x Points', campaign: 'Points Boost', validFrom: '2024-10-20', validTo: '2024-11-20', limit: 200, used: 134, status: 'Active' },
  { id: 4, name: 'VIP20', code: 'VIP20', type: 'Discount', value: '20%', campaign: 'VIP Exclusive', validFrom: '2024-11-01', validTo: '2024-12-31', limit: 500, used: 0, status: 'Active' },
];

const aiSuggestions = [
  { type: 'Discount', value: '30% off', reason: 'Based on upcoming holiday season', priority: 'High' },
  { type: 'Extra Points', value: '3x points', reason: 'Low engagement in inactive segment', priority: 'Medium' },
  { type: 'Free Shipping', value: 'Free delivery', reason: 'Cart abandonment is high', priority: 'High' },
  { type: 'Bundle Deal', value: 'Buy 2 Get 1', reason: 'Popular product combination trend', priority: 'Medium' },
];

export default function PromotionManagement() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleCreatePromotion = () => {
    toast.success('Promotion created successfully!');
    setShowCreateDialog(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-gray-900">Promotion Management</h2>
          <p className="text-gray-600 mt-1">Create and manage promotional offers</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Promotion
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Active Promotions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{promotions.filter(p => p.status === 'Active').length}</div>
            <div className="text-gray-500 mt-1">Currently running</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Total Redemptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{promotions.reduce((sum, p) => sum + p.used, 0)}</div>
            <div className="text-green-600 mt-1">+24% this month</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600">Avg. Usage Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">68%</div>
            <div className="text-gray-500 mt-1">Of total limits</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600">Revenue Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">$45.2K</div>
            <div className="text-gray-500 mt-1">Generated sales</div>
          </CardContent>
        </Card>
      </div>

      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI-Powered Promotion Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-gray-900">{suggestion.type}</div>
                    <div className="text-blue-600 mt-1">{suggestion.value}</div>
                  </div>
                  <Badge
                    variant={suggestion.priority === 'High' ? 'default' : 'secondary'}
                  >
                    {suggestion.priority}
                  </Badge>
                </div>
                <div className="text-gray-600 mt-3">{suggestion.reason}</div>
                <Button variant="outline" size="sm" className="mt-3 w-full">
                  Use This Suggestion
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Promotions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Promotions</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Active</Button>
              <Button variant="outline" size="sm">Expired</Button>
              <Button variant="outline" size="sm">All</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Valid Period</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.map((promo) => (
                <TableRow key={promo.id} className="hover:bg-gray-50">
                  <TableCell>{promo.name}</TableCell>
                  <TableCell>
                    <code className="bg-gray-100 px-2 py-1 rounded text-gray-900">
                      {promo.code}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{promo.type}</Badge>
                  </TableCell>
                  <TableCell className="text-blue-600">{promo.value}</TableCell>
                  <TableCell className="text-gray-600">
                    {promo.validFrom} - {promo.validTo}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full"
                          style={{ width: `${(promo.used / promo.limit) * 100}%` }}
                        />
                      </div>
                      <span className="text-gray-600 whitespace-nowrap">
                        {promo.used}/{promo.limit}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {promo.campaign || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={promo.status === 'Active' ? 'default' : 'secondary'}
                    >
                      {promo.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Promotion Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Create New Promotion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Promotion Name</Label>
                <Input placeholder="e.g., Summer Sale" className="mt-2" />
              </div>
              <div>
                <Label>Promotion Code</Label>
                <Input placeholder="e.g., SUMMER2024" className="mt-2" />
              </div>
            </div>
            
            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Describe your promotion..."
                rows={3}
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Promotion Type</Label>
                <Select>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discount">Discount</SelectItem>
                    <SelectItem value="gift">Free Gift</SelectItem>
                    <SelectItem value="points">Extra Points</SelectItem>
                    <SelectItem value="shipping">Free Shipping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Value</Label>
                <Input placeholder="e.g., 50% or 100 points" className="mt-2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Valid From</Label>
                <Input type="date" className="mt-2" />
              </div>
              <div>
                <Label>Valid To</Label>
                <Input type="date" className="mt-2" />
              </div>
            </div>

            <div>
              <Label>Link to Campaign (Optional)</Label>
              <Select>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select campaign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summer">Summer Flash Sale</SelectItem>
                  <SelectItem value="holiday">Holiday Lucky Draw</SelectItem>
                  <SelectItem value="vip">VIP Exclusive Rewards</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Link to Broadcast (Optional)</Label>
              <Select>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select broadcast" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flash">Flash Sale Alert</SelectItem>
                  <SelectItem value="vip">VIP Exclusive Offer</SelectItem>
                  <SelectItem value="newsletter">Weekly Newsletter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Usage Limit</Label>
                <Input type="number" placeholder="e.g., 100" className="mt-2" />
              </div>
              <div>
                <Label>Limit Per Member</Label>
                <Input type="number" placeholder="e.g., 1" className="mt-2" />
              </div>
            </div>

            <div className="border-t pt-4">
              <Label>Target Segment</Label>
              <Select>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members</SelectItem>
                  <SelectItem value="vip">VIP Only</SelectItem>
                  <SelectItem value="gold">Gold Members</SelectItem>
                  <SelectItem value="new">New Members</SelectItem>
                  <SelectItem value="inactive">Inactive Members</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleCreatePromotion} className="flex-1">
                Create Promotion
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
