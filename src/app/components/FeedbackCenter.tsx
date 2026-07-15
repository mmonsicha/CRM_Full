import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Star, MessageSquare, CheckCircle, Eye, EyeOff, Reply } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const reviews = [
  {
    id: 1,
    user: 'Sarah Chen',
    rating: 5,
    text: 'Amazing product! The quality exceeded my expectations. Will definitely buy again.',
    image: true,
    campaign: 'Summer Flash Sale',
    date: '2024-10-28',
    status: 'Published',
    response: null,
  },
  {
    id: 2,
    user: 'John Smith',
    rating: 4,
    text: 'Good service and fast delivery. Product is as described.',
    image: false,
    campaign: null,
    date: '2024-10-27',
    status: 'Published',
    response: 'Thank you for your feedback! We appreciate your support.',
  },
  {
    id: 3,
    user: 'Emily Wong',
    rating: 5,
    text: 'Love the rewards program! The points system is very generous and easy to use.',
    image: true,
    campaign: 'VIP Exclusive',
    date: '2024-10-26',
    status: 'Pending',
    response: null,
  },
  {
    id: 4,
    user: 'Michael Lee',
    rating: 3,
    text: 'Product is okay but shipping took longer than expected.',
    image: false,
    campaign: null,
    date: '2024-10-25',
    status: 'Published',
    response: 'We apologize for the delay. We are working to improve our delivery times.',
  },
  {
    id: 5,
    user: 'Jessica Tan',
    rating: 5,
    text: 'Exceptional customer service! They helped me resolve my issue quickly.',
    image: false,
    campaign: 'Holiday Lucky Draw',
    date: '2024-10-24',
    status: 'Published',
    response: null,
  },
];

export default function FeedbackCenter() {
  const [selectedReview, setSelectedReview] = useState<typeof reviews[0] | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [responseText, setResponseText] = useState('');

  const filteredReviews = reviews.filter(review => {
    if (filterStatus === 'all') return true;
    return review.status.toLowerCase() === filterStatus;
  });

  const handleApprove = (reviewId: number) => {
    toast.success('Review approved and published!');
  };

  const handleHide = (reviewId: number) => {
    toast.success('Review hidden from public view');
  };

  const handleReply = () => {
    if (selectedReview) {
      toast.success('Response posted successfully!');
      setShowResponseDialog(false);
      setResponseText('');
      setSelectedReview(null);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-gray-900">Feedback Center</h2>
          <p className="text-gray-600 mt-1">Manage customer reviews and feedback</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{reviews.length}</div>
            <div className="text-gray-500 mt-1">All time</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-gray-900">4.4</div>
              <div className="flex">
                {renderStars(4)}
              </div>
            </div>
            <div className="text-gray-500 mt-1">Out of 5.0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">
              {reviews.filter(r => r.status === 'Pending').length}
            </div>
            <div className="text-orange-600 mt-1">Needs moderation</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600">Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">
              {Math.round((reviews.filter(r => r.response).length / reviews.length) * 100)}%
            </div>
            <div className="text-gray-500 mt-1">Replied to reviews</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reviews</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-gray-600">
              Showing {filteredReviews.length} of {reviews.length} reviews
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                        {review.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-gray-900">{review.user}</div>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-gray-500">• {review.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        review.status === 'Published' ? 'default' :
                        review.status === 'Pending' ? 'secondary' :
                        'outline'
                      }
                    >
                      {review.status}
                    </Badge>
                    {review.campaign && (
                      <Badge variant="outline">{review.campaign}</Badge>
                    )}
                  </div>
                </div>

                {/* Review Text */}
                <div className="text-gray-700">{review.text}</div>

                {/* Image indicator */}
                {review.image && (
                  <div className="flex gap-2">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg" />
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg" />
                  </div>
                )}

                {/* Brand Response */}
                {review.response && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 ml-8">
                    <div className="flex items-start gap-2">
                      <Reply className="w-4 h-4 text-blue-600 mt-1" />
                      <div>
                        <div className="text-blue-900">Brand Response</div>
                        <div className="text-gray-700 mt-1">{review.response}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {review.status === 'Pending' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApprove(review.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                  )}
                  {review.status === 'Published' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleHide(review.id)}
                    >
                      <EyeOff className="w-4 h-4 mr-1" />
                      Hide
                    </Button>
                  )}
                  {review.status === 'Hidden' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApprove(review.id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Publish
                    </Button>
                  )}
                  {!review.response && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedReview(review);
                        setShowResponseDialog(true);
                      }}
                    >
                      <Reply className="w-4 h-4 mr-1" />
                      Reply
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Response Dialog */}
      <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Reply to Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedReview && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-gray-900">{selectedReview.user}</div>
                  {renderStars(selectedReview.rating)}
                </div>
                <div className="text-gray-700">{selectedReview.text}</div>
              </div>
            )}
            <div>
              <label className="text-gray-900">Your Response</label>
              <Textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Write your response to the customer..."
                rows={4}
                className="mt-2"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowResponseDialog(false);
                  setSelectedReview(null);
                  setResponseText('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleReply} className="flex-1">
                Post Response
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
