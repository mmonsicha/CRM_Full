import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { 
  Image as ImageIcon, Plus, Edit, Trash2, Eye, GripVertical,
  ChevronLeft, ChevronRight, Play, Pause, Save, Upload
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence, Reorder } from 'motion/react';

interface BannerTemplate {
  id: string;
  name: string;
  type: 'Home' | 'Promotion';
  imageUrl: string;
  active: boolean;
  order: number;
  link?: string;
  description?: string;
}

const mockBanners: BannerTemplate[] = [
  {
    id: '1',
    name: 'Summer Sale 2024',
    type: 'Promotion',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=300&fit=crop',
    active: true,
    order: 1,
    link: '/promotions/summer-sale',
    description: 'Summer promotional banner'
  },
  {
    id: '2',
    name: 'Welcome Banner',
    type: 'Home',
    imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=300&fit=crop',
    active: true,
    order: 2,
    link: '/home',
    description: 'Main welcome banner for home page'
  },
  {
    id: '3',
    name: 'Point Booster Campaign',
    type: 'Promotion',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=300&fit=crop',
    active: true,
    order: 3,
    link: '/campaigns/point-booster',
    description: 'Point booster promotional banner'
  },
  {
    id: '4',
    name: 'New Rewards Available',
    type: 'Home',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=300&fit=crop',
    active: false,
    order: 4,
    link: '/rewards',
    description: 'New rewards announcement banner'
  },
];

export default function BannerThumbnailManagement() {
  const [banners, setBanners] = useState<BannerTemplate[]>(mockBanners);
  const [selectedBanner, setSelectedBanner] = useState<BannerTemplate | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerTemplate | null>(null);

  const activeBanners = banners.filter(b => b.active).sort((a, b) => a.order - b.order);

  const handleCreateNew = () => {
    const newBanner: BannerTemplate = {
      id: Date.now().toString(),
      name: 'New Banner Template',
      type: 'Home',
      imageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=300&fit=crop',
      active: false,
      order: banners.length + 1,
      description: ''
    };
    setEditingBanner(newBanner);
    setShowEditDialog(true);
  };

  const handleEdit = (banner: BannerTemplate) => {
    setEditingBanner({ ...banner });
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!editingBanner) return;

    if (banners.find(b => b.id === editingBanner.id)) {
      setBanners(banners.map(b => b.id === editingBanner.id ? editingBanner : b));
      toast.success('Banner template updated successfully!');
    } else {
      setBanners([...banners, editingBanner]);
      toast.success('Banner template created successfully!');
    }
    setShowEditDialog(false);
    setEditingBanner(null);
  };

  const handleDelete = (id: string) => {
    setBannerToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (bannerToDelete) {
      setBanners(banners.filter(b => b.id !== bannerToDelete));
      toast.success('Banner template deleted successfully!');
      setShowDeleteDialog(false);
      setBannerToDelete(null);
    }
  };

  const handlePreview = (banner: BannerTemplate) => {
    setSelectedBanner(banner);
    setCurrentSlide(activeBanners.findIndex(b => b.id === banner.id));
    setShowPreviewDialog(true);
  };

  const handleToggleActive = (id: string, active: boolean) => {
    setBanners(banners.map(b => b.id === id ? { ...b, active } : b));
    toast.success(active ? 'Banner activated' : 'Banner deactivated');
  };

  const handleSaveOrder = () => {
    toast.success('Banner display order saved successfully!');
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleReorder = (newOrder: BannerTemplate[]) => {
    const reordered = newOrder.map((banner, index) => ({
      ...banner,
      order: index + 1
    }));
    setBanners(reordered);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#007AFF] to-[#0051D5] rounded-xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-white">Banner & Thumbnail Templates</h2>
            <p className="text-blue-50 mt-1">Manage banner templates for customer app home and promotion pages</p>
          </div>
          <Button
            onClick={handleCreateNew}
            className="bg-white/20 hover:bg-white/30 text-white border-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Template
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Banner List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Banner Templates</CardTitle>
                <Button onClick={handleSaveOrder} size="sm" variant="outline">
                  <Save className="w-4 h-4 mr-2" />
                  Save Order
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Preview</TableHead>
                      <TableHead>Template Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {banners.map((banner) => (
                      <TableRow
                        key={banner.id}
                        className="hover:bg-gray-50"
                      >
                          <TableCell>
                            <GripVertical className="w-4 h-4 text-gray-400" />
                          </TableCell>
                          <TableCell>
                            <img
                              src={banner.imageUrl}
                              alt={banner.name}
                              className="w-20 h-10 object-cover rounded"
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-gray-900">{banner.name}</p>
                              {banner.description && (
                                <p className="text-gray-500 text-sm">{banner.description}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={banner.type === 'Home' ? 'default' : 'outline'}>
                              {banner.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={banner.active}
                                onCheckedChange={(checked) => handleToggleActive(banner.id, checked)}
                              />
                              <Badge variant={banner.active ? 'default' : 'outline'}>
                                {banner.active ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(banner)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePreview(banner)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(banner.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader className="bg-gradient-to-br from-blue-50 to-purple-50">
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {activeBanners.length > 0 ? (
                <div className="space-y-4">
                  <div className="relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                        className="relative rounded-lg overflow-hidden"
                      >
                        <img
                          src={activeBanners[currentSlide]?.imageUrl}
                          alt={activeBanners[currentSlide]?.name}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                          <p className="text-white text-sm">{activeBanners[currentSlide]?.name}</p>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation Arrows */}
                    {activeBanners.length > 1 && (
                      <>
                        <button
                          onClick={prevSlide}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={nextSlide}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Slide Indicators */}
                  <div className="flex items-center justify-center gap-2">
                    {activeBanners.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentSlide ? 'bg-[#007AFF] w-6' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Auto-play Controls */}
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    >
                      {isAutoPlaying ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Auto Play
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="text-center text-sm text-gray-500">
                    Showing {currentSlide + 1} of {activeBanners.length} active banners
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No active banners</p>
                  <p className="text-sm mt-1">Create and activate banners to see preview</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingBanner && banners.find(b => b.id === editingBanner.id) ? 'Edit' : 'Create'} Banner Template
            </DialogTitle>
            <DialogDescription>
              Configure banner template settings and upload image
            </DialogDescription>
          </DialogHeader>
          {editingBanner && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Template Name</Label>
                <Input
                  value={editingBanner.name}
                  onChange={(e) => setEditingBanner({ ...editingBanner, name: e.target.value })}
                  placeholder="Enter template name"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={editingBanner.description || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, description: e.target.value })}
                  placeholder="Brief description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={editingBanner.type}
                    onValueChange={(value: 'Home' | 'Promotion') => 
                      setEditingBanner({ ...editingBanner, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Home">Home</SelectItem>
                      <SelectItem value="Promotion">Promotion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Link URL (Optional)</Label>
                  <Input
                    value={editingBanner.link || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, link: e.target.value })}
                    placeholder="/page/url"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Banner Image</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#007AFF] transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">Click to upload or drag and drop</p>
                  <p className="text-gray-400 text-xs mt-1">Recommended: 800x300px</p>
                </div>
                {editingBanner.imageUrl && (
                  <img
                    src={editingBanner.imageUrl}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg mt-2"
                  />
                )}
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-gray-900">Active Status</p>
                  <p className="text-gray-500 text-sm">Display this banner in the app</p>
                </div>
                <Switch
                  checked={editingBanner.active}
                  onCheckedChange={(checked) => setEditingBanner({ ...editingBanner, active: checked })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="bg-[#007AFF] hover:bg-[#0051D5]">
              <Save className="w-4 h-4 mr-2" />
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Banner Slideshow Preview</DialogTitle>
            <DialogDescription>
              Preview how banners will appear in the customer app
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8">
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="relative rounded-lg overflow-hidden shadow-2xl"
                  >
                    <img
                      src={activeBanners[currentSlide]?.imageUrl}
                      alt={activeBanners[currentSlide]?.name}
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                      <h3 className="text-white mb-2">{activeBanners[currentSlide]?.name}</h3>
                      <p className="text-white/80 text-sm">{activeBanners[currentSlide]?.description}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                {activeBanners.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-xl"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-xl"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="flex gap-2">
                  {activeBanners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentSlide ? 'bg-[#007AFF] w-8' : 'bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPreviewDialog(false)}>Close Preview</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Banner Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this banner template? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
