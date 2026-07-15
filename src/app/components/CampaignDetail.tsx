import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Edit, Copy, Archive, Users, Target, TrendingUp, Calendar,
  Eye, EyeOff, Share2, Gift, ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner@2.0.3';
import { Separator } from './ui/separator';

interface CampaignDetailProps {
  campaign: any;
  onBack: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
  showPreview?: boolean;
}

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

export default function CampaignDetail({
  campaign,
  onBack,
  onEdit,
  onDuplicate,
  onArchive,
  showPreview: initialShowPreview = false
}: CampaignDetailProps) {
  const [showPreview, setShowPreview] = useState(initialShowPreview);
  const [showTerms, setShowTerms] = useState(false);

  const formatDate = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const startMonth = startDate.toLocaleString('en-US', { month: 'short' });
    const endMonth = endDate.toLocaleString('en-US', { month: 'short' });
    const year = endDate.getFullYear();

    if (startMonth === endMonth) {
      return `${startDay} - ${endDay} ${endMonth} ${year}`;
    }
    return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
  };

  const campaignTypeConfig: any = {
    Events: { color: 'bg-purple-100 text-purple-700 border-purple-200' },
    Code: { color: 'bg-blue-100 text-blue-700 border-blue-200' },
    Points: { color: 'bg-amber-100 text-amber-700 border-amber-200' },
    Promotional: { color: 'bg-pink-100 text-pink-700 border-pink-200' },
    Gamification: { color: 'bg-green-100 text-green-700 border-green-200' },
    System: { color: 'bg-slate-100 text-slate-700 border-slate-200' },
  };

  return (
    <div className="p-6 h-full overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className={`space-y-6 ${showPreview ? 'max-w-[calc(100%-420px)]' : 'max-w-full'}`}>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Button variant="ghost" onClick={onBack} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Campaigns
              </Button>
              <h2 className="text-gray-900">{campaign.name}</h2>
              <div className="flex items-center gap-3 mt-2">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs ${campaignTypeConfig[campaign.type]?.color || 'bg-gray-100 text-gray-700'}`}>
                  {campaign.type}
                </div>
                <Badge
                  variant={
                    campaign.status === 'Active' ? 'default' :
                    campaign.status === 'Upcoming' ? 'secondary' :
                    'outline'
                  }
                >
                  {campaign.status}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={showPreview ? 'default' : 'outline'}
                onClick={() => setShowPreview(!showPreview)}
                className="transition-all"
              >
                {showPreview ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Hide Preview
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Show Preview
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" onClick={onDuplicate}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </Button>
              <Button variant="outline" onClick={onArchive}>
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </Button>
            </div>
          </div>

          {/* Campaign Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-600 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Participants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-900">{campaign.participants.toLocaleString()}</div>
                <div className="text-gray-500 mt-1">Total joined</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-600 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-900">{campaign.engagement || 0}%</div>
                <div className="text-green-600 mt-1">Above average</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-600 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Conversion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-900">64%</div>
                <div className="text-gray-500 mt-1">Completed actions</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Duration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-900">30 Days</div>
                <div className="text-gray-500 mt-1">15 days left</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="participants">Participants</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-gray-500">Description</label>
                    <p className="text-gray-900 mt-1">
                      {campaign.description || 'Join this exciting campaign and unlock exclusive rewards. Participate now to start earning bonus points and special benefits.'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-500">Start Date</label>
                      <p className="text-gray-900 mt-1">{campaign.startDate}</p>
                    </div>
                    <div>
                      <label className="text-gray-500">End Date</label>
                      <p className="text-gray-900 mt-1">{campaign.endDate}</p>
                    </div>
                  </div>
                  {campaign.location && (
                    <div>
                      <label className="text-gray-500">Location</label>
                      <p className="text-gray-900 mt-1">{campaign.location}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Participant Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={participantData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {participantData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {participantData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-gray-600 text-sm">{item.name}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="participants">
              <Card>
                <CardHeader>
                  <CardTitle>Participant List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-600">
                    Total participants: {campaign.participants.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="engagement" stroke="#007AFF" strokeWidth={2} />
                      <Line type="monotone" dataKey="conversion" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-500">Campaign Status</label>
                      <p className="text-gray-900 mt-1">{campaign.status}</p>
                    </div>
                    <div>
                      <label className="text-gray-500">Campaign Type</label>
                      <p className="text-gray-900 mt-1">{campaign.type}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Mobile Preview Panel - Fixed Right Side */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed right-6 top-24 bottom-6 w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
          >
            {/* Preview Header */}
            <div className="bg-gradient-to-r from-[#007AFF] to-[#0051D5] px-6 py-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  <span className="font-semibold">Mobile Preview</span>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <EyeOff className="w-4 h-4" />
                </button>
              </div>
              <div className="text-blue-100 text-xs">iPhone 16 (430 × 932)</div>
            </div>

            {/* iPhone Frame */}
            <div className="p-6 bg-gray-100 h-[calc(100%-80px)] flex items-center justify-center overflow-auto">
              <div className="relative bg-black rounded-[3rem] p-3 shadow-2xl" style={{ width: '270px', height: '550px' }}>
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl z-10" />
                
                {/* Screen Content */}
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                  {/* Mobile App Preview Content */}
                  <div className="h-full flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
                      <div className="flex items-center justify-between px-4 py-3">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <ArrowLeft className="w-4 h-4 text-gray-900" />
                        </button>
                        <h3 className="text-sm text-gray-900 flex-1 text-center px-2 truncate">
                          Campaign
                        </h3>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <Share2 className="w-4 h-4 text-gray-900" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                      {/* Hero Image */}
                      <div className="h-32 bg-gradient-to-br from-blue-400 to-purple-500 relative">
                        <div className="absolute inset-0 bg-black/20" />
                      </div>

                      {/* Campaign Info Card */}
                      <div className="px-4 -mt-6 relative z-10 pb-16">
                        <div className="bg-white rounded-xl shadow-lg p-4" style={{ boxShadow: '0 2px 15px rgba(0,0,0,0.1)' }}>
                          {/* Title */}
                          <h2 className="text-gray-900 text-sm mb-2">
                            {campaign.name}
                          </h2>

                          {/* Date Range */}
                          <div className="flex items-center gap-1.5 text-gray-600 mb-3 text-xs">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formatDate(campaign.startDate, campaign.endDate)}</span>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#007AFF15' }}>
                                <Users className="w-4 h-4" style={{ color: '#007AFF' }} />
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-500">Participants</p>
                                <p className="text-xs text-gray-900">{campaign.participants.toLocaleString()}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FF6B6B15' }}>
                                <Gift className="w-4 h-4" style={{ color: '#FF6B6B' }} />
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-500">Reward</p>
                                <p className="text-xs text-gray-900">100 Points</p>
                              </div>
                            </div>
                          </div>

                          {/* Category Badge */}
                          <Badge variant="outline" className="text-[10px]" style={{ borderColor: '#007AFF', color: '#007AFF' }}>
                            {campaign.type}
                          </Badge>
                        </div>

                        {/* Description Section */}
                        <div className="py-4">
                          <h3 className="text-xs text-gray-900 mb-2">About This Campaign</h3>
                          <p className="text-[10px] text-gray-600 leading-relaxed">
                            {campaign.description || 'Join this exciting campaign and unlock exclusive rewards. Participate now to start earning bonus points and special benefits.'}
                          </p>
                        </div>

                        <Separator className="my-3" />

                        {/* Campaign Highlights */}
                        <div className="py-3">
                          <h3 className="text-xs text-gray-900 mb-3">Campaign Highlights</h3>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                              </div>
                              <p className="text-[10px] text-gray-600">Exclusive rewards for all participants</p>
                            </div>
                            <div className="flex gap-2">
                              <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                              </div>
                              <p className="text-[10px] text-gray-600">Easy to join with just one tap</p>
                            </div>
                            <div className="flex gap-2">
                              <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                              </div>
                              <p className="text-[10px] text-gray-600">Track your progress in real-time</p>
                            </div>
                          </div>
                        </div>

                        <Separator className="my-3" />

                        {/* Terms & Conditions */}
                        <div className="py-3">
                          <button
                            onClick={() => setShowTerms(!showTerms)}
                            className="w-full flex items-center justify-between"
                          >
                            <h3 className="text-xs text-gray-900">Terms & Conditions</h3>
                            {showTerms ? (
                              <ChevronUp className="w-4 h-4 text-gray-600" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-600" />
                            )}
                          </button>

                          <AnimatePresence>
                            {showTerms && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="pt-2">
                                  <p className="text-[10px] text-gray-600 mb-2">
                                    By joining this campaign, you agree to the following terms and conditions.
                                  </p>
                                  <ul className="list-disc list-inside space-y-1 text-[10px] text-gray-600">
                                    <li>Members must be logged in to participate</li>
                                    <li>Rewards will be credited within 24-48 hours</li>
                                    <li>Campaign duration and rewards are subject to change</li>
                                  </ul>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
                      <Button
                        className="w-full h-9 text-xs"
                        style={{ backgroundColor: '#007AFF' }}
                      >
                        Join Campaign Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
