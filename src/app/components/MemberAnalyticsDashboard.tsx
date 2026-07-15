import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { 
  Users, TrendingUp, ArrowUp, ArrowDown, Activity,
  UserPlus, Award, Target, RefreshCw, MessageCircle,
  UserX, Send, Eye, MousePointer
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';

const memberGrowthData = [
  { month: 'May', new: 420, active: 1250 },
  { month: 'Jun', new: 580, active: 1480 },
  { month: 'Jul', new: 720, active: 1650 },
  { month: 'Aug', new: 650, active: 1820 },
  { month: 'Sep', new: 890, active: 2100 },
  { month: 'Oct', new: 1050, active: 2350 },
];

const tierDistribution = [
  { name: 'Bronze', value: 4500, color: '#f97316' },
  { name: 'Silver', value: 2800, color: '#9ca3af' },
  { name: 'Gold', value: 1200, color: '#eab308' },
  { name: 'Platinum', value: 450, color: '#6b7280' },
];

const campaignParticipationByTier = [
  { campaign: 'Summer Campaign', Bronze: 1200, Silver: 850, Gold: 420, Platinum: 180 },
  { campaign: 'Point Booster Q4', Bronze: 980, Silver: 720, Gold: 380, Platinum: 150 },
  { campaign: 'New Year Special', Bronze: 850, Silver: 650, Gold: 320, Platinum: 120 },
  { campaign: 'Loyalty Rewards', Bronze: 720, Silver: 580, Gold: 280, Platinum: 100 },
];

const platformDistribution = [
  { name: 'LINE', members: 3850, color: '#00B900', newThisMonth: 420 },
  { name: 'Facebook', members: 2100, color: '#1877F2', newThisMonth: 280 },
  { name: 'Instagram', members: 1680, color: '#E4405F', newThisMonth: 180 },
  { name: 'TikTok', members: 1420, color: '#000000', newThisMonth: 120 },
  { name: 'In-store', members: 900, color: '#6B7280', newThisMonth: 50 },
];

const lineAnalytics = {
  totalFriends: 3850,
  newFriendsThisMonth: 420,
  blockedAccounts: 85,
  activeChats: 1250,
  broadcasts: {
    sent: 15,
    totalRecipients: 3765,
    delivered: 3652,
    opened: 2840,
    clicked: 1520,
    deliveryRate: 97.0,
    openRate: 77.8,
    clickRate: 53.5
  }
};

const memberMovementLog = [
  { id: 1, date: '2024-10-30 14:30', member: 'Sarah Chen', action: 'Tier Upgrade', source: 'Point Accumulation', platform: 'LINE', pointsChange: '+5000' },
  { id: 2, date: '2024-10-30 13:15', member: 'John Smith', action: 'New Registration', source: 'Website', platform: 'Facebook', pointsChange: '+100' },
  { id: 3, date: '2024-10-30 12:20', member: 'Emily Wong', action: 'Point Redemption', source: 'Reward Store', platform: 'LINE', pointsChange: '-2500' },
  { id: 4, date: '2024-10-30 11:45', member: 'Michael Lee', action: 'Campaign Join', source: 'Summer Campaign', platform: 'Instagram', pointsChange: '+500' },
  { id: 5, date: '2024-10-30 10:30', member: 'Jessica Tan', action: 'Point Earning', source: 'Purchase', platform: 'TikTok', pointsChange: '+250' },
  { id: 6, date: '2024-10-30 09:15', member: 'David Kim', action: 'Review Submitted', source: 'Product Review', platform: 'In-store', pointsChange: '+50' },
];

export default function MemberAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('month');
  const [tierFilter, setTierFilter] = useState('all');
  const [campaignFilter, setCampaignFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalMembers: 9950,
    newThisMonth: 1050,
    activeMembers: 6920,
    participationRate: 82
  });

  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  // Auto-refresh simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (isRefreshing) {
        setStats(prev => ({
          ...prev,
          totalMembers: prev.totalMembers + Math.floor(Math.random() * 10),
          activeMembers: prev.activeMembers + Math.floor(Math.random() * 5),
        }));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isRefreshing]);

  const handleRefresh = () => {
    setIsRefreshing(!isRefreshing);
    toast.success(isRefreshing ? 'Auto-refresh disabled' : 'Auto-refresh enabled - updates every 10 seconds');
  };

  const handlePieClick = (data: any) => {
    setSelectedTier(data.name);
    toast.success(`Filtering by ${data.name} tier`);
  };

  const handleCardClick = (filter: string) => {
    setTierFilter(filter);
    toast.success(`Filtering analytics by ${filter}`);
  };

  const totalMembers = tierDistribution.reduce((sum, tier) => sum + tier.value, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-[#007AFF] to-[#0051D5] rounded-xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-white">Member Analytics Dashboard</h2>
            <p className="text-blue-50 mt-1">Comprehensive insights on member distribution, campaigns, and platform analytics</p>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 bg-white/20 border-white/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleRefresh}
              className={`bg-white/20 hover:bg-white/30 text-white border-0 ${isRefreshing ? 'ring-2 ring-white' : ''}`}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Auto-Refresh'}
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => handleCardClick('all')}
        >
          <Card className="hover:shadow-lg transition-all cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-600 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#007AFF]" />
                Total Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-900">{stats.totalMembers.toLocaleString()}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-green-50 text-green-700">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  +12.5%
                </Badge>
                <span className="text-gray-500">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => handleCardClick('new')}
        >
          <Card className="hover:shadow-lg transition-all cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-600 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-green-600" />
                New This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-900">{stats.newThisMonth.toLocaleString()}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-green-50 text-green-700">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  +8.2%
                </Badge>
                <span className="text-gray-500">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => handleCardClick('active')}
        >
          <Card className="hover:shadow-lg transition-all cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-600 flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600" />
                Active Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-900">{stats.activeMembers.toLocaleString()}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                  {((stats.activeMembers / stats.totalMembers) * 100).toFixed(0)}% of total
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => handleCardClick('participation')}
        >
          <Card className="hover:shadow-lg transition-all cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-600 flex items-center gap-2">
                <Target className="w-4 h-4 text-[#FBBF24]" />
                Participation Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-900">{stats.participationRate}%</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-green-50 text-green-700">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  +5.3%
                </Badge>
                <span className="text-gray-500">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Member Rank Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Member Rank Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {tierDistribution.map((tier) => (
              <motion.div
                key={tier.name}
                whileHover={{ scale: 1.05 }}
                onClick={() => handlePieClick(tier)}
              >
                <Card className={`cursor-pointer transition-all ${selectedTier === tier.name ? 'ring-2 ring-[#007AFF] shadow-lg' : 'hover:shadow-md'}`}>
                  <CardContent className="pt-6 text-center">
                    <Award className="w-8 h-8 mx-auto mb-2" style={{ color: tier.color }} />
                    <div className="text-gray-900">{tier.value.toLocaleString()}</div>
                    <p className="text-gray-600 mt-1">{tier.name}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      {((tier.value / totalMembers) * 100).toFixed(1)}%
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tierDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                onClick={handlePieClick}
                style={{ cursor: 'pointer' }}
              >
                {tierDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Member Growth Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>New Members Over Time</CardTitle>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="Platinum">Platinum</SelectItem>
                  <SelectItem value="Gold">Gold</SelectItem>
                  <SelectItem value="Silver">Silver</SelectItem>
                  <SelectItem value="Bronze">Bronze</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={memberGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="new" stroke="#007AFF" strokeWidth={2} name="New Members" />
                <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={2} name="Active Members" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Campaign Participation by Rank */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Campaign Participation by Rank</CardTitle>
              <Select value={campaignFilter} onValueChange={setCampaignFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Campaigns</SelectItem>
                  <SelectItem value="summer">Summer Campaign</SelectItem>
                  <SelectItem value="booster">Point Booster Q4</SelectItem>
                  <SelectItem value="newyear">New Year Special</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaignParticipationByTier}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="campaign" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Bronze" fill="#f97316" />
                <Bar dataKey="Silver" fill="#9ca3af" />
                <Bar dataKey="Gold" fill="#eab308" />
                <Bar dataKey="Platinum" fill="#6b7280" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Platform Analytics Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#007AFF]" />
          Platform Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {platformDistribution.map((platform) => (
            <motion.div
              key={platform.name}
              whileHover={{ scale: 1.05 }}
              onClick={() => toast.success(`Viewing ${platform.name} members`)}
            >
              <Card className="cursor-pointer hover:shadow-md transition-all">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl mb-2">
                    {platform.name === 'LINE' && '💬'}
                    {platform.name === 'Facebook' && '👤'}
                    {platform.name === 'Instagram' && '📷'}
                    {platform.name === 'TikTok' && '🎵'}
                    {platform.name === 'In-store' && '🏪'}
                  </div>
                  <p className="text-gray-600 text-sm">{platform.name}</p>
                  <div className="text-gray-900 mt-2">{platform.members.toLocaleString()}</div>
                  <Badge variant="outline" className="mt-2 bg-green-50 text-green-700 border-green-200">
                    +{platform.newThisMonth} this month
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* LINE Insights Section */}
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100/50">
        <CardHeader className="bg-gradient-to-r from-[#00B900] to-[#00A000] text-white rounded-t-xl">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6" />
            <div>
              <CardTitle className="text-white">LINE Analytics & Insights</CardTitle>
              <p className="text-green-50 text-sm mt-1">Official Account statistics and broadcast performance</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* LINE Friends Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <Users className="w-8 h-8 text-[#00B900] mx-auto mb-2" />
                <div className="text-gray-900">{lineAnalytics.totalFriends.toLocaleString()}</div>
                <p className="text-gray-600 text-sm mt-1">Total Friends</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <UserPlus className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-gray-900">{lineAnalytics.newFriendsThisMonth.toLocaleString()}</div>
                <p className="text-gray-600 text-sm mt-1">New Friends (This Month)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <UserX className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <div className="text-gray-900">{lineAnalytics.blockedAccounts.toLocaleString()}</div>
                <p className="text-gray-600 text-sm mt-1">Blocked Accounts</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-gray-900">{lineAnalytics.activeChats.toLocaleString()}</div>
                <p className="text-gray-600 text-sm mt-1">Active Chats</p>
              </CardContent>
            </Card>
          </div>

          {/* Broadcast Statistics */}
          <div className="bg-white rounded-lg p-6 border border-green-200">
            <h4 className="text-gray-900 mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-[#007AFF]" />
              Broadcast Message Statistics (Last 30 Days)
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-gray-600 text-sm mb-2">Messages Sent</p>
                <div className="text-gray-900 mb-2">{lineAnalytics.broadcasts.sent.toLocaleString()}</div>
                <div className="text-gray-500 text-sm">
                  To {lineAnalytics.broadcasts.totalRecipients.toLocaleString()} recipients
                </div>
              </div>
              
              <div>
                <p className="text-gray-600 text-sm mb-2">Delivery Performance</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-gray-900">{lineAnalytics.broadcasts.delivered.toLocaleString()}</span>
                  <Badge className="bg-green-50 text-green-700 border-0">
                    {lineAnalytics.broadcasts.deliveryRate}%
                  </Badge>
                </div>
                <div className="text-gray-500 text-sm">Delivery rate</div>
              </div>

              <div>
                <p className="text-gray-600 text-sm mb-2">Engagement</p>
                <div className="text-gray-900 mb-2">
                  {lineAnalytics.broadcasts.clicked.toLocaleString()} clicks
                </div>
                <div className="text-gray-500 text-sm">
                  {lineAnalytics.broadcasts.clickRate}% click rate
                </div>
              </div>
            </div>

            {/* Broadcast Funnel */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6 text-center">
                  <Send className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-gray-900">{lineAnalytics.broadcasts.delivered.toLocaleString()}</div>
                  <p className="text-gray-600 text-sm mt-1">Delivered</p>
                  <Badge variant="outline" className="mt-2 bg-blue-50 text-blue-700 border-blue-300">
                    {lineAnalytics.broadcasts.deliveryRate}%
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6 text-center">
                  <Eye className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-gray-900">{lineAnalytics.broadcasts.opened.toLocaleString()}</div>
                  <p className="text-gray-600 text-sm mt-1">Opened</p>
                  <Badge variant="outline" className="mt-2 bg-green-50 text-green-700 border-green-300">
                    {lineAnalytics.broadcasts.openRate}%
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="pt-6 text-center">
                  <MousePointer className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-gray-900">{lineAnalytics.broadcasts.clicked.toLocaleString()}</div>
                  <p className="text-gray-600 text-sm mt-1">Clicked</p>
                  <Badge variant="outline" className="mt-2 bg-purple-50 text-purple-700 border-purple-300">
                    {lineAnalytics.broadcasts.clickRate}%
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Member Movement Log */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Member Movement Log</CardTitle>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="LINE">LINE</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="In-store">In-store</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Points Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberMovementLog.map((log) => (
                <TableRow key={log.id} className="hover:bg-gray-50">
                  <TableCell className="text-gray-600">{log.date}</TableCell>
                  <TableCell>{log.member}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.action}</Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">{log.source}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      <span>
                        {log.platform === 'LINE' && '💬'}
                        {log.platform === 'Facebook' && '👤'}
                        {log.platform === 'Instagram' && '📷'}
                        {log.platform === 'TikTok' && '🎵'}
                        {log.platform === 'In-store' && '🏪'}
                      </span>
                      {log.platform}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={log.pointsChange.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                      {log.pointsChange}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
