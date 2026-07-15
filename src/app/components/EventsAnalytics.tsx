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
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Users, Calendar, TrendingUp, Link2, Download, FileSpreadsheet,
  FileText, Filter, ArrowUpRight, ExternalLink, CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

// Mock data for analytics
const participationTrendData = [
  { month: 'Jan', participants: 1200, events: 4 },
  { month: 'Feb', participants: 1500, events: 5 },
  { month: 'Mar', participants: 1800, events: 6 },
  { month: 'Apr', participants: 2200, events: 7 },
  { month: 'May', participants: 2600, events: 8 },
  { month: 'Jun', participants: 3100, events: 9 },
  { month: 'Jul', participants: 2847, events: 8 },
];

const eventTypeDistribution = [
  { name: 'Concert', value: 35, count: 5, color: '#007AFF' },
  { name: 'Conference', value: 25, count: 4, color: '#10b981' },
  { name: 'Workshop', value: 20, count: 3, color: '#f59e0b' },
  { name: 'Fashion', value: 12, count: 2, color: '#ec4899' },
  { name: 'Sports', value: 8, count: 1, color: '#8b5cf6' },
];

const eventCampaignConnections = [
  {
    id: 1,
    eventName: 'Summer Music Festival 2024',
    eventType: 'Concert',
    campaignName: 'Summer Music Festival',
    participants: 2847,
    status: 'Active',
    engagement: 85,
    startDate: '2024-11-01',
  },
  {
    id: 2,
    eventName: 'Tech Innovation Conference',
    eventType: 'Conference',
    campaignName: 'Exclusive Discount Codes',
    participants: 1523,
    status: 'Upcoming',
    engagement: 0,
    startDate: '2024-12-05',
  },
  {
    id: 3,
    eventName: 'Fashion Week Runway Show',
    eventType: 'Fashion',
    campaignName: 'Flash Sale Campaign',
    participants: 1892,
    status: 'Ended',
    engagement: 78,
    startDate: '2024-10-15',
  },
  {
    id: 4,
    eventName: 'Marketing Workshop Series',
    eventType: 'Workshop',
    campaignName: 'Triple Points Weekend',
    participants: 1234,
    status: 'Active',
    engagement: 72,
    startDate: '2024-11-10',
  },
  {
    id: 5,
    eventName: 'Annual Sports Challenge',
    eventType: 'Sports',
    campaignName: 'Lucky Spin Challenge',
    participants: 987,
    status: 'Active',
    engagement: 68,
    startDate: '2024-11-15',
  },
];

interface EventsAnalyticsProps {
  onNavigateToEvent?: (eventId: number) => void;
  onNavigateToCampaign?: (campaignId: number) => void;
}

export default function EventsAnalytics({ onNavigateToEvent, onNavigateToCampaign }: EventsAnalyticsProps) {
  const [dateRange, setDateRange] = useState('last-30-days');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState<'excel' | 'pdf'>('excel');
  const [exportLoading, setExportLoading] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null);

  // Summary calculations
  const totalParticipants = eventCampaignConnections.reduce((sum, item) => sum + item.participants, 0);
  const activeEvents = eventCampaignConnections.filter(e => e.status === 'Active').length;
  const mostPopularEvent = eventCampaignConnections.reduce((prev, current) => 
    (prev.participants > current.participants) ? prev : current
  );
  const linkedCampaigns = new Set(eventCampaignConnections.map(e => e.campaignName)).size;

  const handleExport = () => {
    setExportLoading(true);
    // Simulate export delay
    setTimeout(() => {
      setExportLoading(false);
      setShowExportDialog(false);
      toast.success(
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <div>
            <div className="font-semibold">Export Successful!</div>
            <div className="text-sm text-gray-600">
              Analytics data exported as {exportFormat.toUpperCase()}
            </div>
          </div>
        </div>,
        {
          duration: 4000,
        }
      );
    }, 2000);
  };

  const handleMostPopularClick = () => {
    toast.info('Navigating to event detail...');
    if (onNavigateToEvent) {
      onNavigateToEvent(mostPopularEvent.id);
    }
  };

  const handleCampaignClick = (campaignName: string) => {
    toast.info(`Navigating to ${campaignName}...`);
    if (onNavigateToCampaign) {
      // Find campaign ID based on name (mock)
      const campaignId = 1;
      onNavigateToCampaign(campaignId);
    }
  };

  const handlePieClick = (data: any) => {
    setSelectedEventType(data.name);
    toast.info(`Filtered by ${data.name} events`);
  };

  const filteredConnections = selectedEventType
    ? eventCampaignConnections.filter(e => e.eventType === selectedEventType)
    : eventCampaignConnections;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-gray-900">Events Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">Track performance and insights across all events</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowExportDialog(true)}
            variant="outline"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export Data
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200"
      >
        <Filter className="w-5 h-5 text-gray-500" />
        <div className="flex items-center gap-2 flex-1">
          <Label className="text-gray-600 whitespace-nowrap">Date Range:</Label>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 Days</SelectItem>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="last-90-days">Last 90 Days</SelectItem>
              <SelectItem value="last-12-months">Last 12 Months</SelectItem>
              <SelectItem value="all-time">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-gray-600 whitespace-nowrap">Status:</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ended">Ended</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {selectedEventType && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedEventType(null)}
            className="text-gray-600"
          >
            Clear Filter
          </Button>
        )}
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-[#007AFF]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-600">Total Participants</CardTitle>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5 text-[#007AFF]" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-gray-900">{totalParticipants.toLocaleString()}</div>
              <div className="text-green-600 mt-1 flex items-center gap-1 text-sm">
                <TrendingUp className="w-3 h-3" />
                +12.5% from last period
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-green-500">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-600">Active Events</CardTitle>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-gray-900">{activeEvents}</div>
              <div className="text-gray-500 mt-1 text-sm">Running now</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <Card
            onClick={handleMostPopularClick}
            className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-amber-500"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-600">Most Popular Event</CardTitle>
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-gray-900 text-sm truncate">{mostPopularEvent.eventName}</div>
              <div className="text-gray-500 mt-1 flex items-center gap-2 text-sm">
                <span>{mostPopularEvent.participants.toLocaleString()} participants</span>
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-purple-500">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-600">Linked Campaigns</CardTitle>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Link2 className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-gray-900">{linkedCampaigns}</div>
              <div className="text-gray-500 mt-1 text-sm">Total campaigns</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Event Participation Trend</CardTitle>
                <Badge variant="outline" className="text-[#007AFF] border-[#007AFF]">
                  Last 7 months
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={participationTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="participants"
                    stroke="#007AFF"
                    strokeWidth={3}
                    dot={{ fill: '#007AFF', r: 5 }}
                    activeDot={{ r: 7 }}
                    animationDuration={1000}
                  />
                  <Line
                    type="monotone"
                    dataKey="events"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 5 }}
                    activeDot={{ r: 7 }}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Event Type Distribution</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Click to filter table</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={eventTypeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    onClick={handlePieClick}
                    animationDuration={1000}
                    style={{ cursor: 'pointer' }}
                  >
                    {eventTypeDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        className="hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '8px 12px',
                    }}
                    formatter={(value: any, name: string) => [`${value}%`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {eventTypeDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-gray-900">{item.count} events</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Data Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.45 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Event-to-Campaign Connection Overview</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedEventType
                    ? `Showing ${selectedEventType} events only`
                    : 'All events and their linked campaigns'}
                </p>
              </div>
              {selectedEventType && (
                <Badge variant="secondary" className="text-sm">
                  Filtered by {selectedEventType}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Linked Campaign</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Start Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {filteredConnections.map((item) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="group hover:bg-gray-50 transition-colors border-b border-gray-200"
                    >
                      <TableCell className="py-4">
                        <div className="text-gray-900">{item.eventName}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.eventType}</Badge>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleCampaignClick(item.campaignName)}
                          className="flex items-center gap-2 text-[#007AFF] hover:underline group/link"
                        >
                          <span>{item.campaignName}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </button>
                      </TableCell>
                      <TableCell className="text-gray-900">
                        {item.participants.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === 'Active' ? 'default' :
                            item.status === 'Upcoming' ? 'secondary' :
                            'outline'
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.engagement}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="h-full bg-[#007AFF] rounded-full"
                            />
                          </div>
                          <span className="text-sm text-gray-600">{item.engagement}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{item.startDate}</TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Analytics Data</DialogTitle>
            <DialogDescription>
              Choose your preferred format to export the analytics data
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label>Export Format</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setExportFormat('excel')}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                    exportFormat === 'excel'
                      ? 'border-[#007AFF] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileSpreadsheet className={`w-6 h-6 ${
                    exportFormat === 'excel' ? 'text-[#007AFF]' : 'text-gray-400'
                  }`} />
                  <div className="text-left">
                    <div className="font-semibold text-sm text-gray-900">Excel</div>
                    <div className="text-xs text-gray-500">.xlsx format</div>
                  </div>
                </button>
                <button
                  onClick={() => setExportFormat('pdf')}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                    exportFormat === 'pdf'
                      ? 'border-[#007AFF] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileText className={`w-6 h-6 ${
                    exportFormat === 'pdf' ? 'text-[#007AFF]' : 'text-gray-400'
                  }`} />
                  <div className="text-left">
                    <div className="font-semibold text-sm text-gray-900">PDF</div>
                    <div className="text-xs text-gray-500">.pdf format</div>
                  </div>
                </button>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm text-gray-700">
                <strong>Note:</strong> The export will include all filtered data currently displayed in the dashboard.
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowExportDialog(false)}
              disabled={exportLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={exportLoading}
              className="gap-2"
            >
              {exportLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Download className="w-4 h-4" />
                  </motion.div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export {exportFormat.toUpperCase()}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
