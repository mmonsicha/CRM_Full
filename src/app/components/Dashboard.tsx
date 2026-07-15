import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Users, TrendingUp, Coins, Activity, Plus,
  Megaphone, Tag, Radio, ArrowUp, ArrowDown
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart
} from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';

const memberGrowthData = [
  { month: 'Jan', new: 420, returning: 1250, engagement: 68 },
  { month: 'Feb', new: 580, returning: 1480, engagement: 72 },
  { month: 'Mar', new: 720, returning: 1650, engagement: 75 },
  { month: 'Apr', new: 650, returning: 1820, engagement: 71 },
  { month: 'May', new: 890, returning: 2100, engagement: 78 },
  { month: 'Jun', new: 1050, returning: 2350, engagement: 82 },
];

const recentActivities = [
  { id: 1, user: 'Sarah Chen', action: 'Redeemed 500 points', time: '2 minutes ago', type: 'redeem' },
  { id: 2, user: 'John Smith', action: 'Joined Summer Campaign', time: '15 minutes ago', type: 'join' },
  { id: 3, user: 'Emily Wong', action: 'Left a 5-star review', time: '23 minutes ago', type: 'review' },
  { id: 4, user: 'Michael Lee', action: 'Earned 100 points', time: '45 minutes ago', type: 'earn' },
  { id: 5, user: 'Jessica Tan', action: 'Upgraded to Gold rank', time: '1 hour ago', type: 'upgrade' },
];

export default function Dashboard() {
  const [createDialog, setCreateDialog] = useState<string | null>(null);

  const handleQuickCreate = (type: string) => {
    setCreateDialog(type);
  };

  const handleCreate = () => {
    toast.success(`${createDialog} created successfully!`);
    setCreateDialog(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-600">Total Members</CardTitle>
            <Users className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">12,847</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                <ArrowUp className="w-3 h-3 mr-1" />
                +12.5%
              </Badge>
              <span className="text-gray-500">vs last month</span>
            </div>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-gray-600">
                <span>New: 1,050</span>
                <span>Returning: 2,350</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-600">Active Campaigns</CardTitle>
            <Megaphone className="w-5 h-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">24</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                8 Upcoming
              </Badge>
              <span className="text-gray-500">3 ending soon</span>
            </div>
            <div className="mt-3">
              <div className="text-gray-600">Avg. Engagement: 78%</div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-600">Points Overview</CardTitle>
            <Coins className="w-5 h-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">2.4M</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-green-700">+450K Issued</span>
              <span className="text-gray-400">|</span>
              <span className="text-red-700">-280K Burned</span>
            </div>
            <div className="mt-3">
              <div className="text-gray-600">Active Points: 1.67M</div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-600">Engagement Rate</CardTitle>
            <Activity className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">82%</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                <ArrowUp className="w-3 h-3 mr-1" />
                +4.2%
              </Badge>
              <span className="text-gray-500">Great!</span>
            </div>
            <div className="mt-3">
              <div className="text-gray-600">Monthly Active: 9,234</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Create Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => handleQuickCreate('Campaign')}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
            <Button
              onClick={() => handleQuickCreate('Promotion')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Promotion
            </Button>
            <Button
              onClick={() => handleQuickCreate('Broadcast')}
              className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Broadcast
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Member Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={memberGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="new" fill="#3b82f6" name="New Members" />
                <Bar dataKey="returning" fill="#8b5cf6" name="Returning" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={memberGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Engagement %"
                  dot={{ fill: '#10b981', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'redeem' ? 'bg-red-100 text-red-600' :
                  activity.type === 'join' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'review' ? 'bg-yellow-100 text-yellow-600' :
                  activity.type === 'earn' ? 'bg-green-100 text-green-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {activity.type === 'redeem' && <Coins className="w-5 h-5" />}
                  {activity.type === 'join' && <Megaphone className="w-5 h-5" />}
                  {activity.type === 'review' && <Activity className="w-5 h-5" />}
                  {activity.type === 'earn' && <TrendingUp className="w-5 h-5" />}
                  {activity.type === 'upgrade' && <ArrowUp className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="text-gray-900">{activity.user}</div>
                  <div className="text-gray-600">{activity.action}</div>
                </div>
                <div className="text-gray-500">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Create Dialog */}
      <Dialog open={!!createDialog} onOpenChange={() => setCreateDialog(null)}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Create New {createDialog}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input placeholder={`${createDialog} name`} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea placeholder={`Describe your ${createDialog?.toLowerCase()}`} rows={3} />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setCreateDialog(null)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create {createDialog}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
