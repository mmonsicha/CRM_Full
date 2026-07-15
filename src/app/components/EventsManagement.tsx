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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { Plus, Eye, Edit, Trash2, Upload, Calendar, Users, TrendingUp, ArrowLeft, ExternalLink, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Event {
  id: number;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  linkedCampaign: string;
  linkedCampaignId?: number;
  status: 'Active' | 'Upcoming' | 'Ended';
  description?: string;
  banner?: string;
  participants?: number;
  engagement?: number;
}

const initialEvents: Event[] = [
  {
    id: 1,
    name: 'Summer Music Festival 2024',
    type: 'Concert',
    startDate: '2024-11-01',
    endDate: '2024-11-30',
    linkedCampaign: 'Summer Music Festival',
    linkedCampaignId: 1,
    status: 'Active',
    description: 'Join us for the biggest music festival of the summer featuring top artists and amazing performances.',
    banner: 'https://images.unsplash.com/photo-1656283384093-1e227e621fad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGNvbmNlcnR8ZW58MXx8fHwxNzYyMzcyMDU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    participants: 2847,
    engagement: 85,
  },
  {
    id: 2,
    name: 'Tech Innovation Conference',
    type: 'Conference',
    startDate: '2024-12-05',
    endDate: '2024-12-06',
    linkedCampaign: 'Exclusive Discount Codes',
    linkedCampaignId: 2,
    status: 'Upcoming',
    description: 'Explore the latest in technology and innovation with industry leaders and pioneers.',
    banner: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwY29uZmVyZW5jZXxlbnwxfHx8fDE3NjIzMTUyMjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    participants: 0,
    engagement: 0,
  },
  {
    id: 3,
    name: 'Fashion Week Runway Show',
    type: 'Fashion',
    startDate: '2024-10-15',
    endDate: '2024-10-20',
    linkedCampaign: 'Flash Sale Campaign',
    linkedCampaignId: 4,
    status: 'Ended',
    description: 'Experience the latest fashion trends from top designers and emerging talents.',
    banner: 'https://images.unsplash.com/photo-1543728069-a3f97c5a2f32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc2hvdyUyMHJ1bndheXxlbnwxfHx8fDE3NjIzNDExOTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    participants: 1523,
    engagement: 78,
  },
];

export default function EventsManagement() {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({});
  const [uploadedBanner, setUploadedBanner] = useState<string | null>(null);

  const handleCreateEvent = () => {
    const event: Event = {
      id: events.length + 1,
      name: newEvent.name || 'New Event',
      type: newEvent.type || 'Conference',
      startDate: newEvent.startDate || '2024-11-01',
      endDate: newEvent.endDate || '2024-11-30',
      linkedCampaign: newEvent.linkedCampaign || 'No Campaign',
      status: 'Upcoming',
      description: newEvent.description,
      banner: uploadedBanner || undefined,
      participants: 0,
      engagement: 0,
      ...newEvent,
    };

    setEvents([event, ...events]);
    toast.success('Event created successfully!');
    setShowCreateDialog(false);
    setNewEvent({});
    setUploadedBanner(null);
  };

  const handleEditEvent = () => {
    if (selectedEvent) {
      setEvents(events.map(e =>
        e.id === selectedEvent.id ? { ...selectedEvent, ...newEvent } : e
      ));
      setSelectedEvent({ ...selectedEvent, ...newEvent });
      toast.success('Event updated successfully!');
      setShowEditDialog(false);
      setNewEvent({});
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(events.filter(e => e.id !== selectedEvent.id));
      toast.success('Event deleted successfully!');
      setShowDeleteDialog(false);
      setSelectedEvent(null);
      if (showEventDetail) {
        setShowEventDetail(false);
      }
    }
  };

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDetail(true);
  };

  const handleGoToCampaign = () => {
    toast.info('Navigating to campaign detail...');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedBanner(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const EventForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div>
        <Label>Event Name *</Label>
        <Input
          placeholder="Enter event name"
          value={newEvent.name || ''}
          onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
          className="mt-2"
        />
      </div>

      <div>
        <Label>Event Type *</Label>
        <Select
          value={newEvent.type || ''}
          onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select event type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Concert">Concert</SelectItem>
            <SelectItem value="Conference">Conference</SelectItem>
            <SelectItem value="Workshop">Workshop</SelectItem>
            <SelectItem value="Fashion">Fashion Show</SelectItem>
            <SelectItem value="Sports">Sports Event</SelectItem>
            <SelectItem value="Networking">Networking</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Start Date *</Label>
          <Input
            type="date"
            value={newEvent.startDate || ''}
            onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
            className="mt-2"
          />
        </div>
        <div>
          <Label>End Date *</Label>
          <Input
            type="date"
            value={newEvent.endDate || ''}
            onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
            className="mt-2"
          />
        </div>
      </div>

      <div>
        <Label>Linked Campaign</Label>
        <Select
          value={newEvent.linkedCampaign || ''}
          onValueChange={(value) => setNewEvent({ ...newEvent, linkedCampaign: value })}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select campaign" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Summer Music Festival">Summer Music Festival</SelectItem>
            <SelectItem value="Exclusive Discount Codes">Exclusive Discount Codes</SelectItem>
            <SelectItem value="Triple Points Weekend">Triple Points Weekend</SelectItem>
            <SelectItem value="Flash Sale Campaign">Flash Sale Campaign</SelectItem>
            <SelectItem value="Lucky Spin Challenge">Lucky Spin Challenge</SelectItem>
            <SelectItem value="New Member Welcome">New Member Welcome</SelectItem>
            <SelectItem value="No Campaign">No Campaign</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          placeholder="Enter event description..."
          value={newEvent.description || ''}
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          rows={4}
          className="mt-2"
        />
      </div>

      <div>
        <Label>Event Banner</Label>
        <div className="mt-2">
          {uploadedBanner || newEvent.banner ? (
            <div className="relative">
              <ImageWithFallback
                src={uploadedBanner || newEvent.banner || ''}
                alt="Event Banner"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                onClick={() => {
                  setUploadedBanner(null);
                  setNewEvent({ ...newEvent, banner: undefined });
                }}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#007AFF] transition-colors cursor-pointer block">
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <div className="text-gray-600">Click to upload banner</div>
              <div className="text-gray-500 mt-1 text-sm">PNG, JPG up to 5MB</div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <AnimatePresence mode="wait">
        {!showEventDetail ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-gray-900">Events Management</h2>
                <p className="text-gray-600 mt-1">Manage and track all your events</p>
              </div>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </div>

            {/* Event Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-600">Total Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-900">{events.length}</div>
                  <div className="text-gray-500 mt-1">All time</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-600">Active</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-900">{events.filter(e => e.status === 'Active').length}</div>
                  <div className="text-green-600 mt-1">Running now</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-600">Upcoming</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-900">{events.filter(e => e.status === 'Upcoming').length}</div>
                  <div className="text-blue-600 mt-1">Scheduled</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-600">Total Participants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-900">{events.reduce((sum, e) => sum + (e.participants || 0), 0).toLocaleString()}</div>
                  <div className="text-gray-500 mt-1">This month</div>
                </CardContent>
              </Card>
            </div>

            {/* Events Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Events</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Event Type</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Linked Campaign</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="popLayout">
                      {events.map((event) => (
                        <motion.tr
                          key={event.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="group hover:bg-gray-50 transition-colors border-b border-gray-200"
                        >
                          <TableCell className="py-4">
                            <div className="text-gray-900">{event.name}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{event.type}</Badge>
                          </TableCell>
                          <TableCell className="text-gray-600">{event.startDate}</TableCell>
                          <TableCell className="text-gray-600">{event.endDate}</TableCell>
                          <TableCell className="text-gray-600">{event.linkedCampaign}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                event.status === 'Active' ? 'default' :
                                event.status === 'Upcoming' ? 'secondary' :
                                'outline'
                              }
                            >
                              {event.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleViewEvent(event)}
                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50 hover:text-[#007AFF]"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>View Event</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                          setSelectedEvent(event);
                                          setNewEvent(event);
                                          setShowEditDialog(true);
                                        }}
                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50 hover:text-[#007AFF]"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit Event</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                          setSelectedEvent(event);
                                          setShowDeleteDialog(true);
                                        }}
                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Delete Event</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="space-y-6"
          >
            {/* Event Detail Header */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Button variant="ghost" onClick={() => setShowEventDetail(false)} className="mb-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Events
                </Button>
                <h2 className="text-gray-900">{selectedEvent?.name}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="outline">{selectedEvent?.type}</Badge>
                  <Badge
                    variant={
                      selectedEvent?.status === 'Active' ? 'default' :
                      selectedEvent?.status === 'Upcoming' ? 'secondary' :
                      'outline'
                    }
                  >
                    {selectedEvent?.status}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleGoToCampaign}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Go to Campaign
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewEvent(selectedEvent || {});
                    setShowEditDialog(true);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>

            {/* Event Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-600 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Participants
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-900">{selectedEvent?.participants?.toLocaleString() || 0}</div>
                  <div className="text-gray-500 mt-1">Total joined</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-600 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-900">{selectedEvent?.engagement || 0}%</div>
                  <div className="text-green-600 mt-1">Above average</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Start Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-900">{selectedEvent?.startDate}</div>
                  <div className="text-gray-500 mt-1">Event begins</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    End Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-900">{selectedEvent?.endDate}</div>
                  <div className="text-gray-500 mt-1">Event ends</div>
                </CardContent>
              </Card>
            </div>

            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedEvent?.banner && (
                  <div>
                    <label className="text-gray-500 mb-2 block">Event Banner</label>
                    <ImageWithFallback
                      src={selectedEvent.banner}
                      alt={selectedEvent.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div>
                  <label className="text-gray-500">Description</label>
                  <p className="text-gray-900 mt-2">
                    {selectedEvent?.description || 'No description provided.'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-500">Event Type</label>
                    <p className="text-gray-900 mt-1">{selectedEvent?.type}</p>
                  </div>
                  <div>
                    <label className="text-gray-500">Linked Campaign</label>
                    <p className="text-gray-900 mt-1">{selectedEvent?.linkedCampaign}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Event Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new event
            </DialogDescription>
          </DialogHeader>
          <EventForm />
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => {
              setShowCreateDialog(false);
              setNewEvent({});
              setUploadedBanner(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleCreateEvent}>
              Create Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update the event details
            </DialogDescription>
          </DialogHeader>
          <EventForm isEdit />
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => {
              setShowEditDialog(false);
              setNewEvent({});
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditEvent}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the event "{selectedEvent?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEvent} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}