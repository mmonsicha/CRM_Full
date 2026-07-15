import { useState } from 'react';
import { ArrowLeft, Search, Filter, Heart, Users, Gift, Calendar, Bell } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '../ui/sheet';
import MobileBottomNav, { MobileScreen } from './MobileBottomNav';
import { useAppContext } from './MobileAppContainerEnhanced';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';

interface MobileEventsProps {
  onNavigate: (screen: MobileScreen, data?: any) => void;
  embedded?: boolean;
  onBack?: () => void;
  hideBottomNav?: boolean;
}

const categories = [
  'All',
  'Point Collection',
  'Fashion & Accessories',
  'Electronics',
  'Food & Beverage',
  'Pets',
  'Health & Beauty',
  'Travel & Entertainment',
  'Others'
];

const eventsData = [
  {
    id: 1,
    name: 'Summer Shopping Festival',
    description: 'Shop and earn double points on all purchases during the summer sale',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    participants: 1250,
    reward: '2x Points',
    category: 'Point Collection',
    isFavorite: false,
    terms: 'Valid for all product categories. Points will be credited within 24 hours.'
  },
  {
    id: 2,
    name: 'Refer & Earn Program',
    description: 'Invite your friends and get rewarded for every successful referral',
    image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600',
    startDate: '2025-05-15',
    endDate: '2025-12-31',
    participants: 890,
    reward: '500 Points',
    category: 'Point Collection',
    isFavorite: true,
    terms: 'Referee must complete first purchase. Points awarded after 30 days.'
  },
  {
    id: 3,
    name: 'Tech Gadget Bonanza',
    description: 'Exclusive deals on the latest smartphones, laptops, and smart home devices',
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600',
    startDate: '2025-06-10',
    endDate: '2025-07-10',
    participants: 2100,
    reward: 'Up to 40% Off',
    category: 'Electronics',
    isFavorite: false,
    terms: 'Limited stock available. First come, first served basis.'
  },
  {
    id: 4,
    name: 'Fashion Week Special',
    description: 'Discover trending styles and get exclusive discounts on premium brands',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea41f3cb?w=600',
    startDate: '2025-06-15',
    endDate: '2025-06-30',
    participants: 1680,
    reward: '30% Off + Free Shipping',
    category: 'Fashion & Accessories',
    isFavorite: true,
    terms: 'Valid on selected brands only. Cannot be combined with other offers.'
  },
  {
    id: 5,
    name: 'Gourmet Food Festival',
    description: 'Taste premium cuisines from top restaurants with special member pricing',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600',
    startDate: '2025-07-01',
    endDate: '2025-07-15',
    participants: 950,
    reward: '25% Cashback',
    category: 'Food & Beverage',
    isFavorite: false,
    terms: 'Dine-in only. Reservation required 48 hours in advance.'
  },
  {
    id: 6,
    name: 'Wellness & Spa Retreat',
    description: 'Relax and rejuvenate with luxury spa packages at exclusive member rates',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600',
    startDate: '2025-06-20',
    endDate: '2025-08-20',
    participants: 720,
    reward: 'Free Upgrade',
    category: 'Health & Beauty',
    isFavorite: false,
    terms: 'Subject to availability. Blackout dates apply during peak season.'
  },
  {
    id: 7,
    name: 'Pet Paradise Sale',
    description: 'Everything your furry friends need with amazing discounts and free treats',
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600',
    startDate: '2025-06-05',
    endDate: '2025-06-25',
    participants: 580,
    reward: 'Buy 2 Get 1 Free',
    category: 'Pets',
    isFavorite: false,
    terms: 'Applies to pet food and accessories. Toys excluded.'
  },
  {
    id: 8,
    name: 'Travel Adventure Deals',
    description: 'Book your dream vacation with exclusive packages and bonus points',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600',
    startDate: '2025-07-10',
    endDate: '2025-09-30',
    participants: 1340,
    reward: '1000 Bonus Points',
    category: 'Travel & Entertainment',
    isFavorite: true,
    terms: 'Valid for bookings above $500. Travel must be completed within 6 months.'
  },
];

export default function MobileEvents({ onNavigate, embedded, onBack, hideBottomNav }: MobileEventsProps) {
  const { theme, unreadCount } = useAppContext();
  const [activeTab, setActiveTab] = useState('all');
  const [favorites, setFavorites] = useState<number[]>([2, 4, 8]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All']);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const handleToggleFavorite = (eventId: number, eventName: string) => {
    if (favorites.includes(eventId)) {
      setFavorites(favorites.filter(id => id !== eventId));
      toast.success(`Removed from favorites`, {
        description: eventName
      });
    } else {
      setFavorites([...favorites, eventId]);
      toast.success(`Added to favorites`, {
        description: eventName
      });
    }
  };

  const handleViewDetail = (event: any) => {
    onNavigate('event-detail', event);
  };

  const handleApplyFilter = () => {
    setShowFilter(false);
    toast.success('Filter applied');
  };

  const handleResetFilter = () => {
    setSelectedCategories(['All']);
    toast.info('Filter reset');
  };

  const toggleCategory = (category: string) => {
    if (category === 'All') {
      setSelectedCategories(['All']);
    } else {
      const newCategories = selectedCategories.filter(c => c !== 'All');
      if (selectedCategories.includes(category)) {
        const filtered = newCategories.filter(c => c !== category);
        setSelectedCategories(filtered.length === 0 ? ['All'] : filtered);
      } else {
        setSelectedCategories([...newCategories, category]);
      }
    }
  };

  const filterEvents = (events: typeof eventsData) => {
    let filtered = events;

    // Apply category filter
    if (!selectedCategories.includes('All')) {
      filtered = filtered.filter(event => selectedCategories.includes(event.category));
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const allEvents = filterEvents(eventsData);
  const favoriteEvents = filterEvents(eventsData.filter(e => favorites.includes(e.id)));

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

  const renderEventCard = (event: any) => {
    const isFavorite = favorites.includes(event.id);

    return (
      <motion.div
        key={event.id}
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <Card 
          className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
          onClick={() => handleViewDetail(event)}
          style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
        >
          {/* Image */}
          <div className="relative h-32 overflow-hidden bg-gray-100">
            <img 
              src={event.image} 
              alt={event.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            
            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFavorite(event.id, event.name);
              }}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <motion.div
                animate={isFavorite ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart 
                  className={`w-5 h-5 transition-colors ${
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  }`}
                />
              </motion.div>
            </button>
          </div>

          {/* Content */}
          <div className="p-3">
            {/* Event Name */}
            <h4 className="text-sm text-gray-900 mb-1 truncate">
              {event.name}
            </h4>

            {/* Description */}
            <p className="text-xs text-gray-600 mb-3 line-clamp-2 min-h-[32px]">
              {event.description}
            </p>

            {/* Date Range */}
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(event.startDate, event.endDate)}</span>
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Users className="w-3 h-3" />
                <span>{event.participants.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 text-xs" style={{ color: '#FF6B6B' }}>
                <Gift className="w-3 h-3" />
                <span className="truncate">{event.reward}</span>
              </div>
            </div>

            {/* Join Button */}
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                toast.success('Joined event successfully!');
              }}
              className="w-full h-8 text-xs"
              style={{ backgroundColor: '#2E5BFF' }}
            >
              Join Event
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Header - Hidden when embedded */}
      {!embedded && (
        <div 
          className="text-white px-6 pt-6 pb-4"
          style={{ background: 'linear-gradient(135deg, #2E5BFF, #5B7FFF)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => onNavigate('home')}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-white text-xl flex-1">Events</h2>
            
            {/* Action Buttons */}
            <button
              onClick={() => onNavigate('notification-center')}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center relative"
            >
              <Bell className="w-5 h-5" />
              {(unreadCount && unreadCount > 0) && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </div>
              )}
            </button>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowFilter(true)}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center relative"
            >
              <Filter className="w-5 h-5" />
              {selectedCategories.length > 0 && !selectedCategories.includes('All') && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                  {selectedCategories.length}
                </div>
              )}
            </button>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            </motion.div>
          )}
        </div>
      )}

      {/* Compact header bar for embedded mode with search and filter */}
      {embedded && (
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 bg-gray-50 border-gray-200"
              />
            </div>
            <button
              onClick={() => setShowFilter(true)}
              className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center relative hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-4 h-4 text-gray-600" />
              {selectedCategories.length > 0 && !selectedCategories.includes('All') && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                  {selectedCategories.length}
                </div>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-2 bg-transparent border-0 h-12 px-6">
            <TabsTrigger 
              value="all"
              className="data-[state=active]:border-b-2 rounded-none"
              style={{ 
                borderColor: activeTab === 'all' ? '#2E5BFF' : 'transparent',
                color: activeTab === 'all' ? '#2E5BFF' : '#6B7280'
              }}
            >
              All Events
            </TabsTrigger>
            <TabsTrigger 
              value="favorites"
              className="data-[state=active]:border-b-2 rounded-none relative"
              style={{ 
                borderColor: activeTab === 'favorites' ? '#2E5BFF' : 'transparent',
                color: activeTab === 'favorites' ? '#2E5BFF' : '#6B7280'
              }}
            >
              My Favorites
              {favorites.length > 0 && (
                <Badge 
                  className="ml-2 h-5 px-1.5 text-xs"
                  style={{ backgroundColor: '#FF6B6B', color: 'white' }}
                >
                  {favorites.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        <Tabs value={activeTab} className="h-full">
          <TabsContent value="all" className="m-0 p-4">
            <div className="grid grid-cols-2 gap-3">
              {allEvents.map(renderEventCard)}
            </div>

            {allEvents.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-gray-900 mb-2">No Events Found</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Try adjusting your filters or search
                </p>
                <Button
                  onClick={handleResetFilter}
                  variant="outline"
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="m-0 p-4">
            {favoriteEvents.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {favoriteEvents.map(renderEventCard)}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-gray-900 mb-2">No Favorites Yet</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Tap the heart icon on events to save them here
                </p>
                <Button
                  onClick={() => setActiveTab('all')}
                  style={{ backgroundColor: '#2E5BFF' }}
                >
                  Browse Events
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Filter Sheet */}
      <Sheet open={showFilter} onOpenChange={setShowFilter}>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Filter Events</SheetTitle>
            <SheetDescription>
              Select categories to filter events
            </SheetDescription>
          </SheetHeader>

          <div className="py-6 space-y-4 overflow-y-auto max-h-[calc(80vh-180px)]">
            {categories.map((category) => (
              <div key={category} className="flex items-center gap-3">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                />
                <label
                  htmlFor={category}
                  className="text-sm text-gray-900 cursor-pointer flex-1"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>

          <SheetFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleResetFilter}
              className="flex-1"
            >
              Reset
            </Button>
            <Button
              onClick={handleApplyFilter}
              className="flex-1"
              style={{ backgroundColor: '#2E5BFF' }}
            >
              Apply Filter
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Bottom Navigation */}
      {!hideBottomNav && (
        <MobileBottomNav
          currentScreen="events"
          onNavigate={onNavigate}
          primaryColor="#2E5BFF"
        />
      )}
    </div>
  );
}