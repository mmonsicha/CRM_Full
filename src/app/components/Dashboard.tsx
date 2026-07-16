import { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import {
  Users, TrendingUp, Coins, Activity, Plus,
  Megaphone, ArrowUp
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { toast } from 'sonner@2.0.3';

// ── Sellsuki DS 3.0 (Mode B) ──────────────────────────────────────────────
// Typography → ssk-heading / ssk-text (token-based, >=18px). Actions → ssk-button
// (themeColor="primary" — the original per-button purple/blue/pink gradients are
// substituted with the single brand color; DS 3.0 drives color from brand tokens).
// Stat values use ssk-heading so they stay on the type scale (no hardcoded px).
// Layout containers (Card/Dialog) are kept as app-level shells; Recharts is kept
// as-is (no ssk chart equivalent verified yet). Verify ssk-badge/ssk-input props
// against DS 3.0 Storybook once the MCP is connected.

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
            <ssk-heading level="4">Total Members</ssk-heading>
            <Users className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <ssk-heading level="1">12,847</ssk-heading>
            <div className="flex items-center gap-2 mt-2">
              <ssk-badge themeColor="success">
                <ArrowUp className="w-3 h-3 mr-1" />+12.5%
              </ssk-badge>
              <ssk-text variant="body">vs last month</ssk-text>
            </div>
            <div className="mt-3 flex justify-between">
              <ssk-text variant="body">New: 1,050</ssk-text>
              <ssk-text variant="body">Returning: 2,350</ssk-text>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <ssk-heading level="4">Active Campaigns</ssk-heading>
            <Megaphone className="w-5 h-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <ssk-heading level="1">24</ssk-heading>
            <div className="flex items-center gap-2 mt-2">
              <ssk-badge themeColor="info">8 Upcoming</ssk-badge>
              <ssk-text variant="body">3 ending soon</ssk-text>
            </div>
            <div className="mt-3">
              <ssk-text variant="body">Avg. Engagement: 78%</ssk-text>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <ssk-heading level="4">Points Overview</ssk-heading>
            <Coins className="w-5 h-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <ssk-heading level="1">2.4M</ssk-heading>
            <div className="flex items-center gap-2 mt-2">
              <ssk-text variant="body" style={{ color: '#15803D' }}>+450K Issued</ssk-text>
              <ssk-text variant="body" style={{ color: '#9CA3AF' }}>|</ssk-text>
              <ssk-text variant="body" style={{ color: '#B91C1C' }}>-280K Burned</ssk-text>
            </div>
            <div className="mt-3">
              <ssk-text variant="body">Active Points: 1.67M</ssk-text>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <ssk-heading level="4">Engagement Rate</ssk-heading>
            <Activity className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <ssk-heading level="1">82%</ssk-heading>
            <div className="flex items-center gap-2 mt-2">
              <ssk-badge themeColor="success">
                <ArrowUp className="w-3 h-3 mr-1" />+4.2%
              </ssk-badge>
              <ssk-text variant="body">Great!</ssk-text>
            </div>
            <div className="mt-3">
              <ssk-text variant="body">Monthly Active: 9,234</ssk-text>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Create Buttons */}
      <Card>
        <CardHeader>
          <ssk-heading level="3">Quick Actions</ssk-heading>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <ssk-button variant="solid" themeColor="primary" onClick={() => handleQuickCreate('Campaign')}>
              <Plus className="w-4 h-4 mr-2" />New Campaign
            </ssk-button>
            <ssk-button variant="solid" themeColor="primary" onClick={() => handleQuickCreate('Promotion')}>
              <Plus className="w-4 h-4 mr-2" />New Promotion
            </ssk-button>
            <ssk-button variant="solid" themeColor="primary" onClick={() => handleQuickCreate('Broadcast')}>
              <Plus className="w-4 h-4 mr-2" />New Broadcast
            </ssk-button>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <ssk-heading level="3">Member Growth</ssk-heading>
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
            <ssk-heading level="3">Campaign Engagement Rate</ssk-heading>
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
          <ssk-heading level="3">Recent Activities</ssk-heading>
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
                  <ssk-heading level="4" style={{ display: 'block' }}>{activity.user}</ssk-heading>
                  <ssk-text variant="body" style={{ display: 'block' }}>{activity.action}</ssk-text>
                </div>
                <ssk-text variant="body">{activity.time}</ssk-text>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Create Dialog */}
      <Dialog open={!!createDialog} onOpenChange={() => setCreateDialog(null)}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <ssk-heading level="3">Create New {createDialog}</ssk-heading>
          </DialogHeader>
          <div className="space-y-4">
            <ssk-input label="Name" placeholder={`${createDialog} name`} />
            <ssk-input
              label="Description"
              multiline
              rows={3}
              placeholder={`Describe your ${createDialog?.toLowerCase()}`}
            />
            <div className="flex gap-3 justify-end">
              <ssk-button variant="outline" onClick={() => setCreateDialog(null)}>
                Cancel
              </ssk-button>
              <ssk-button variant="solid" themeColor="primary" onClick={handleCreate}>
                Create {createDialog}
              </ssk-button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
