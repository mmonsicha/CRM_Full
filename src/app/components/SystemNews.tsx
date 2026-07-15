import { useState } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Newspaper, Calendar, Tag as TagIcon } from 'lucide-react';

const newsItems = [
  {
    id: 1,
    title: 'New Feature: AI-Powered Campaign Suggestions',
    category: 'Feature',
    date: '2024-10-28',
    excerpt: 'Introducing intelligent campaign recommendations based on your member data and engagement patterns.',
    image: true,
    content: 'We are excited to announce our new AI-powered campaign suggestion feature. This advanced system analyzes your member behavior, engagement patterns, and historical campaign performance to provide personalized recommendations for your next campaigns. Simply navigate to the Campaign Management section to start receiving smart suggestions tailored to your business needs.',
  },
  {
    id: 2,
    title: 'Scheduled Maintenance - October 30, 2024',
    category: 'Maintenance',
    date: '2024-10-26',
    excerpt: 'System will be undergoing maintenance for performance improvements.',
    image: false,
    content: 'We will be performing scheduled maintenance on Tuesday, October 30, 2024, from 2:00 AM to 4:00 AM (UTC+7). During this time, the system may experience brief interruptions. We apologize for any inconvenience and appreciate your patience as we work to improve our service.',
  },
  {
    id: 3,
    title: 'Enhanced Social Media Integration',
    category: 'Update',
    date: '2024-10-24',
    excerpt: 'Now you can automatically share campaigns to TikTok and Instagram.',
    image: true,
    content: 'We have expanded our social media integration capabilities! You can now connect your TikTok and Instagram business accounts to automatically share your campaigns and promotions. This update also includes improved analytics for tracking social media performance and ROI. Visit the Settings page to connect your accounts.',
  },
  {
    id: 4,
    title: 'Product Update: Advanced Analytics Dashboard',
    category: 'Feature',
    date: '2024-10-20',
    excerpt: 'Get deeper insights with our new analytics tools and custom reports.',
    image: true,
    content: 'Our new Advanced Analytics Dashboard provides comprehensive insights into your member behavior, campaign performance, and revenue metrics. Features include custom report builder, exportable data, real-time statistics, and predictive analytics. Upgrade to our Pro plan to access these powerful tools.',
  },
  {
    id: 5,
    title: 'Security Update: Two-Factor Authentication',
    category: 'Update',
    date: '2024-10-18',
    excerpt: 'Enhanced security with 2FA now available for all admin accounts.',
    image: false,
    content: 'We have implemented two-factor authentication (2FA) to enhance the security of your admin accounts. We strongly recommend enabling 2FA for all team members with access to the CRM. You can enable this feature in your account settings under Security & Privacy.',
  },
  {
    id: 6,
    title: 'Holiday Campaign Templates Available',
    category: 'Feature',
    date: '2024-10-15',
    excerpt: 'Pre-designed templates for your holiday season campaigns.',
    image: true,
    content: 'Get ready for the holiday season with our new collection of campaign templates! Choose from festive designs for Christmas, New Year, and other celebrations. Each template is fully customizable and optimized for high engagement. Find them in the Campaign Management section when creating a new campaign.',
  },
];

export default function SystemNews() {
  const [selectedNews, setSelectedNews] = useState<typeof newsItems[0] | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredNews = newsItems.filter(item => {
    if (filterCategory === 'all') return true;
    return item.category === filterCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Feature':
        return 'bg-blue-100 text-blue-700';
      case 'Update':
        return 'bg-green-100 text-green-700';
      case 'Maintenance':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-gray-900">System News & Updates</h2>
          <p className="text-gray-600 mt-1">Stay updated with the latest features and announcements</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600 flex items-center gap-2">
              <Newspaper className="w-4 h-4" />
              Total Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{newsItems.length}</div>
            <div className="text-gray-500 mt-1">This month</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600">New Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">
              {newsItems.filter(n => n.category === 'Feature').length}
            </div>
            <div className="text-blue-600 mt-1">Recently added</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600">Upcoming Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">
              {newsItems.filter(n => n.category === 'Maintenance').length}
            </div>
            <div className="text-orange-600 mt-1">Scheduled</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <TagIcon className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Feature">Features</SelectItem>
                <SelectItem value="Update">Updates</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-gray-600">
              Showing {filteredNews.length} of {newsItems.length} announcements
            </div>
          </div>
        </CardContent>
      </Card>

      {/* News Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((item) => (
          <Card
            key={item.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedNews(item)}
          >
            {item.image && (
              <div className="w-full h-40 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-t-lg" />
            )}
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge className={getCategoryColor(item.category)}>
                  {item.category}
                </Badge>
                <div className="flex items-center gap-1 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{item.date}</span>
                </div>
              </div>
              <CardTitle className="text-base">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 line-clamp-3">{item.excerpt}</p>
              <Button variant="link" className="mt-3 px-0">
                Read More →
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* News Detail Dialog */}
      <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge className={selectedNews ? getCategoryColor(selectedNews.category) : ''}>
                  {selectedNews?.category}
                </Badge>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{selectedNews?.date}</span>
                </div>
              </div>
              <DialogTitle className="text-xl">{selectedNews?.title}</DialogTitle>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            {selectedNews?.image && (
              <div className="w-full h-64 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-lg" />
            )}
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {selectedNews?.content}
              </p>
            </div>
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedNews(null)} className="flex-1">
                Close
              </Button>
              <Button className="flex-1">
                Learn More
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
