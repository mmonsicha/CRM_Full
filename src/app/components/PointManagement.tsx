import { useState } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Coins, TrendingUp, TrendingDown, Clock, Plus, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const pointsOverview = {
  totalIssued: 2400000,
  totalBurned: 1280000,
  totalExpired: 453000,
  activePoints: 1667000,
};

const pointDistribution = [
  { name: 'Active', value: 1667000, color: '#10b981' },
  { name: 'Burned', value: 1280000, color: '#ef4444' },
  { name: 'Expired', value: 453000, color: '#6b7280' },
];

const monthlyTrend = [
  { month: 'May', issued: 380000, burned: 210000, expired: 65000 },
  { month: 'Jun', issued: 420000, burned: 240000, expired: 72000 },
  { month: 'Jul', issued: 390000, burned: 225000, expired: 68000 },
  { month: 'Aug', issued: 450000, burned: 280000, expired: 85000 },
  { month: 'Sep', issued: 410000, burned: 260000, expired: 78000 },
  { month: 'Oct', issued: 350000, burned: 265000, expired: 85000 },
];

const pointRules = [
  { id: 1, name: 'Purchase Reward', trigger: 'Purchase', points: 10, condition: 'Per $1 spent', status: 'Active' },
  { id: 2, name: 'Campaign Join', trigger: 'Campaign Join', points: 100, condition: 'One-time per campaign', status: 'Active' },
  { id: 3, name: 'Product Review', trigger: 'Review', points: 50, condition: 'With photo', status: 'Active' },
  { id: 4, name: 'Referral Bonus', trigger: 'Referral', points: 200, condition: 'Per successful referral', status: 'Active' },
  { id: 5, name: 'Birthday Bonus', trigger: 'Birthday', points: 500, condition: 'Annual', status: 'Active' },
];

const transactions = [
  { id: 1, member: 'Sarah Chen', type: 'Earn', points: 250, reason: 'Purchase #12345', date: '2024-10-28 14:30', balance: 15420 },
  { id: 2, member: 'John Smith', type: 'Burn', points: -500, reason: 'Redeemed Premium Voucher', date: '2024-10-28 13:15', balance: 8750 },
  { id: 3, member: 'Emily Wong', type: 'Earn', points: 50, reason: 'Product Review', date: '2024-10-28 11:20', balance: 4320 },
  { id: 4, member: 'Michael Lee', type: 'Earn', points: 200, reason: 'Referral Bonus', date: '2024-10-28 10:45', balance: 2150 },
  { id: 5, member: 'Jessica Tan', type: 'Burn', points: -1000, reason: 'Redeemed Product', date: '2024-10-28 09:30', balance: 12890 },
  { id: 6, member: 'David Kim', type: 'Expire', points: -100, reason: 'Points Expired', date: '2024-10-28 00:00', balance: 950 },
];

export default function PointManagement() {
  const [showRuleDialog, setShowRuleDialog] = useState(false);

  const handleCreateRule = () => {
    toast.success('Point rule created successfully!');
    setShowRuleDialog(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-gray-900">Point Management</h2>
          <p className="text-gray-600 mt-1">Manage point rules and transactions</p>
        </div>
        <Button onClick={() => setShowRuleDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Point Rule
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600 flex items-center gap-2">
              <ArrowUpCircle className="w-4 h-4 text-green-600" />
              Total Issued
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{pointsOverview.totalIssued.toLocaleString()}</div>
            <div className="text-green-600 mt-1">+15% this month</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600 flex items-center gap-2">
              <ArrowDownCircle className="w-4 h-4 text-red-600" />
              Total Burned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{pointsOverview.totalBurned.toLocaleString()}</div>
            <div className="text-red-600 mt-1">+8% this month</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-600" />
              Total Expired
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{pointsOverview.totalExpired.toLocaleString()}</div>
            <div className="text-gray-500 mt-1">Last 6 months</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600 flex items-center gap-2">
              <Coins className="w-4 h-4 text-blue-600" />
              Active Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{pointsOverview.activePoints.toLocaleString()}</div>
            <div className="text-gray-500 mt-1">Currently available</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Points Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pointDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${(value / 1000).toFixed(0)}K`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pointDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="issued" fill="#10b981" name="Issued" />
                <Bar dataKey="burned" fill="#ef4444" name="Burned" />
                <Bar dataKey="expired" fill="#6b7280" name="Expired" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Point Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Point Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule Name</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pointRules.map((rule) => (
                <TableRow key={rule.id} className="hover:bg-gray-50">
                  <TableCell>{rule.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{rule.trigger}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-green-600">+{rule.points}</span>
                  </TableCell>
                  <TableCell className="text-gray-600">{rule.condition}</TableCell>
                  <TableCell>
                    <Badge variant="default">{rule.status}</Badge>
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

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id} className="hover:bg-gray-50">
                  <TableCell>{tx.member}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        tx.type === 'Earn' ? 'default' :
                        tx.type === 'Burn' ? 'secondary' :
                        'outline'
                      }
                    >
                      {tx.type === 'Earn' && <TrendingUp className="w-3 h-3 mr-1" />}
                      {tx.type === 'Burn' && <TrendingDown className="w-3 h-3 mr-1" />}
                      {tx.type === 'Expire' && <Clock className="w-3 h-3 mr-1" />}
                      {tx.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        tx.points > 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {tx.points > 0 ? '+' : ''}{tx.points}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600">{tx.reason}</TableCell>
                  <TableCell className="text-gray-600">{tx.date}</TableCell>
                  <TableCell>{tx.balance.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Rule Dialog */}
      <Dialog open={showRuleDialog} onOpenChange={setShowRuleDialog}>
        <DialogContent className="max-w-2xl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Create Point Rule</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Rule Name</Label>
              <Input placeholder="e.g., Social Share Bonus" className="mt-2" />
            </div>

            <div>
              <Label>Event Trigger</Label>
              <Select>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="campaign">Campaign Join</SelectItem>
                  <SelectItem value="review">Product Review</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="social">Social Share</SelectItem>
                  <SelectItem value="birthday">Birthday</SelectItem>
                  <SelectItem value="checkin">Daily Check-in</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Points Value</Label>
                <Input type="number" placeholder="e.g., 100" className="mt-2" />
              </div>
              <div>
                <Label>Rule Type</Label>
                <Select>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="earn">Earn Points</SelectItem>
                    <SelectItem value="burn">Burn Points</SelectItem>
                    <SelectItem value="expire">Expiration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Condition</Label>
              <Input
                placeholder="e.g., Per $1 spent, One-time per campaign"
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Expiration Period (days)</Label>
                <Input type="number" placeholder="e.g., 365" className="mt-2" />
              </div>
              <div>
                <Label>Max Points per Member</Label>
                <Input type="number" placeholder="e.g., 1000" className="mt-2" />
              </div>
            </div>

            <div>
              <Label>Target Segment</Label>
              <Select>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members</SelectItem>
                  <SelectItem value="new">New Members</SelectItem>
                  <SelectItem value="vip">VIP Only</SelectItem>
                  <SelectItem value="gold">Gold Members</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowRuleDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleCreateRule} className="flex-1">
                Create Rule
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
