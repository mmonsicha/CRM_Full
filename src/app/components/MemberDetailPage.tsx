import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Progress } from './ui/progress';
import { 
  User, Mail, Phone, MapPin, Calendar, TrendingUp, Coins,
  Gift, Megaphone, Star, Package, MessageCircle, Edit, ArrowLeft
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';
import { getMemberById } from './memberData';

const tierProgress = {
  Bronze: { current: 2000, next: 5000, nextTier: 'Silver' },
  Silver: { current: 6000, next: 10000, nextTier: 'Gold' },
  Gold: { current: 12000, next: 20000, nextTier: 'Platinum' },
  Platinum: { current: 25000, next: 25000, nextTier: 'Max' },
};

const tierColors = {
  Platinum: 'bg-gradient-to-r from-gray-400 to-gray-600 text-white',
  Gold: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
  Silver: 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900',
  Bronze: 'bg-gradient-to-r from-orange-400 to-orange-600 text-white',
};

interface MemberDetailPageProps {
  memberId: string | null;
  onBack: () => void;
}

export default function MemberDetailPage({ memberId, onBack }: MemberDetailPageProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  const memberData = getMemberById(memberId);
  
  // If no member found, show error state
  if (!memberData) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
        <User className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-gray-900 mb-2">Member Not Found</h2>
        <p className="text-gray-600 mb-6">The requested member could not be found.</p>
        <Button onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Members
        </Button>
      </div>
    );
  }
  
  const progress = tierProgress[memberData.tier as keyof typeof tierProgress];
  const progressPercentage = (progress.current / progress.next) * 100;

  const handleBack = () => {
    onBack();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Members
        </Button>
      </div>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarFallback className="bg-white text-blue-600 text-3xl">
                {memberData.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-white mb-2">{memberData.name}</h2>
              <div className="flex items-center gap-3 mb-3">
                <Badge className={tierColors[memberData.tier as keyof typeof tierColors]}>
                  {memberData.tier} Member
                </Badge>
                <Badge className="bg-green-500 text-white border-0">
                  {memberData.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-blue-50">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{memberData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{memberData.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{memberData.address || 'No address provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {memberData.joinDate}</span>
                </div>
              </div>
            </div>
          </div>
          <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-600 flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-600" />
                Total Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-900">{memberData.points.toLocaleString()}</div>
              <div className="text-gray-500 mt-1">Current balance</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-600 flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-purple-600" />
                Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-900">{memberData.campaigns.length}</div>
              <div className="text-gray-500 mt-1">Total joined</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-600 flex items-center gap-2">
                <Gift className="w-4 h-4 text-green-600" />
                Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-900">{memberData.rewards.length}</div>
              <div className="text-gray-500 mt-1">Total redeemed</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Points Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-900">{memberData.totalEarned.toLocaleString()}</div>
              <div className="text-gray-500 mt-1">Lifetime total</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tier Progress */}
      {memberData.tier !== 'Platinum' && (
        <Card>
          <CardHeader>
            <CardTitle>Tier Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress to {progress.nextTier}</span>
                <span className="text-gray-900">{progress.current.toLocaleString()} / {progress.next.toLocaleString()}</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-gray-500 text-sm">
                {(progress.next - progress.current).toLocaleString()} points until {progress.nextTier} tier
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="rewards">Reward History</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Points Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Points Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-gray-600">Total Earned</p>
                  <p className="text-gray-900 mt-1">{memberData.totalEarned.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Used</p>
                  <p className="text-gray-900 mt-1">{memberData.totalUsed.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Expired</p>
                  <p className="text-gray-900 mt-1">{memberData.totalExpired.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Points Activity (Last 6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={memberData.activity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="points" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Participation</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign Name</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Points Earned</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memberData.campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>{campaign.name}</TableCell>
                      <TableCell className="text-gray-600">{campaign.joinDate}</TableCell>
                      <TableCell>
                        <Badge className={campaign.status === 'Active' ? 'bg-green-50 text-green-700 border-0' : 'bg-gray-50 text-gray-700 border-0'}>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-amber-600">+{campaign.points}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Reward Redemption History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reward Name</TableHead>
                    <TableHead>Points Used</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memberData.rewards.map((reward) => (
                    <TableRow key={reward.id}>
                      <TableCell>{reward.name}</TableCell>
                      <TableCell className="text-amber-600">-{reward.points.toLocaleString()}</TableCell>
                      <TableCell className="text-gray-600">{reward.date}</TableCell>
                      <TableCell>
                        <Badge className={reward.status === 'Completed' ? 'bg-green-50 text-green-700 border-0' : 'bg-orange-50 text-orange-700 border-0'}>
                          {reward.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="mt-6">
          <div className="space-y-4">
            {memberData.feedbacks.map((feedback) => (
              <Card key={feedback.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-gray-900">{feedback.campaign}</p>
                      <div className="flex gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-gray-500 text-sm">{feedback.date}</span>
                  </div>
                  <p className="text-gray-600">{feedback.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <Button variant="outline" className="w-full">
              <MessageCircle className="w-4 h-4 mr-2" />
              Send Message
            </Button>
            <Button variant="outline" className="w-full">
              <Coins className="w-4 h-4 mr-2" />
              Adjust Points
            </Button>
            <Button variant="outline" className="w-full">
              <Package className="w-4 h-4 mr-2" />
              View Orders
            </Button>
            <Button variant="outline" className="w-full">
              <Gift className="w-4 h-4 mr-2" />
              Gift Reward
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
