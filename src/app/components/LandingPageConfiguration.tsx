import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
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
  Layout, GripVertical, Save, Eye, Home, Gift, Coins,
  Megaphone, Store, User, Plus, X, Smartphone, Image as ImageIcon,
  Grid3x3, Code
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Reorder } from 'motion/react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';

interface LayoutSection {
  id: string;
  name: string;
  type: 'banner' | 'menu' | 'campaign-banner' | 'content';
  icon: any;
  enabled: boolean;
  order: number;
  config?: {
    bannerId?: string;
    menuItems?: Array<{ id: string; label: string; icon: string; link: string; enabled: boolean }>;
  };
}

interface MenuButton {
  id: string;
  label: string;
  icon: string;
  link: string;
  enabled: boolean;
}

const defaultMenuButtons: MenuButton[] = [
  { id: 'rewards', label: 'Rewards', icon: '🎁', link: '/rewards', enabled: true },
  { id: 'redeem', label: 'Redeem Points', icon: '💰', link: '/redeem', enabled: true },
  { id: 'campaigns', label: 'Campaigns', icon: '📢', link: '/campaigns', enabled: true },
  { id: 'store', label: 'Store', icon: '🏪', link: '/store', enabled: true },
  { id: 'profile', label: 'My Profile', icon: '👤', link: '/profile', enabled: true },
  { id: 'history', label: 'History', icon: '📋', link: '/history', enabled: false },
];

const bannerTemplates = [
  { id: 'banner1', name: 'Summer Sale 2024', type: 'Promotion' },
  { id: 'banner2', name: 'Welcome Banner', type: 'Home' },
  { id: 'banner3', name: 'Point Booster Campaign', type: 'Promotion' },
  { id: 'banner4', name: 'New Rewards Available', type: 'Home' },
];

const sectionTypes = [
  { value: 'banner', label: 'Banner Slide', icon: ImageIcon, description: 'Rotating image banner' },
  { value: 'campaign-banner', label: 'Campaign Banner', icon: Megaphone, description: 'Promotional banner' },
  { value: 'menu', label: 'Button Row', icon: Grid3x3, description: 'Grid of action buttons' },
  { value: 'content', label: 'Card Content', icon: Layout, description: 'Featured content cards' },
];

export default function LandingPageConfiguration() {
  const [sections, setSections] = useState<LayoutSection[]>([
    {
      id: 'banner-top',
      name: 'Main Banner Section',
      type: 'banner',
      icon: Layout,
      enabled: true,
      order: 1,
      config: { bannerId: 'banner2' }
    },
    {
      id: 'menu-actions',
      name: 'Menu Action Buttons',
      type: 'menu',
      icon: Layout,
      enabled: true,
      order: 2,
      config: { menuItems: defaultMenuButtons }
    },
    {
      id: 'campaign-banner',
      name: 'Campaign Banner Section',
      type: 'campaign-banner',
      icon: Layout,
      enabled: true,
      order: 3,
      config: { bannerId: 'banner3' }
    },
    {
      id: 'content',
      name: 'Featured Content',
      type: 'content',
      icon: Layout,
      enabled: true,
      order: 4,
      config: {}
    },
  ]);

  const [menuButtons, setMenuButtons] = useState<MenuButton[]>(defaultMenuButtons);
  const [showAddSectionDialog, setShowAddSectionDialog] = useState(false);

  const handleToggleSection = (id: string, enabled: boolean) => {
    setSections(sections.map(s => s.id === id ? { ...s, enabled } : s));
    toast.success(enabled ? 'Section enabled' : 'Section disabled');
  };

  const handleReorder = (newOrder: LayoutSection[]) => {
    const reordered = newOrder.map((section, index) => ({
      ...section,
      order: index + 1
    }));
    setSections(reordered);
  };

  const handleBannerSelect = (sectionId: string, bannerId: string) => {
    setSections(sections.map(s => 
      s.id === sectionId 
        ? { ...s, config: { ...s.config, bannerId } }
        : s
    ));
    toast.success('Banner template selected');
  };

  const handleToggleMenuItem = (id: string, enabled: boolean) => {
    setMenuButtons(menuButtons.map(m => m.id === id ? { ...m, enabled } : m));
    setSections(sections.map(s => 
      s.type === 'menu' 
        ? { ...s, config: { ...s.config, menuItems: menuButtons.map(m => m.id === id ? { ...m, enabled } : m) } }
        : s
    ));
    toast.success(enabled ? 'Menu item enabled' : 'Menu item disabled');
  };

  const handleSaveLayout = () => {
    toast.success('Landing page layout saved successfully!');
  };

  const handleAddSection = (type: string) => {
    const sectionType = sectionTypes.find(t => t.value === type);
    const newSection: LayoutSection = {
      id: Date.now().toString(),
      name: sectionType?.label || 'New Section',
      type: type as LayoutSection['type'],
      icon: Layout,
      enabled: true,
      order: sections.length + 1,
      config: {}
    };
    setSections([...sections, newSection]);
    setShowAddSectionDialog(false);
    toast.success(`${sectionType?.label} added to layout`);
  };

  const handleRemoveSection = (id: string) => {
    if (sections.length <= 2) {
      toast.error('Layout must have at least 2 sections');
      return;
    }
    setSections(sections.filter(s => s.id !== id));
    toast.success('Section removed from layout');
  };

  const enabledSections = sections.filter(s => s.enabled);
  const enabledMenuItems = menuButtons.filter(m => m.enabled);

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className="text-gray-600">Customer App Configuration</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-900">Landing Page</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="bg-gradient-to-r from-[#007AFF] to-[#0051D5] rounded-xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-white">Landing Page Configuration</h2>
            <p className="text-blue-50 mt-1">Configure home page layout, sections, and menu buttons</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowAddSectionDialog(true)}
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
            <Button
              onClick={handleSaveLayout}
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Layout
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Layout Sections */}
          <Card>
            <CardHeader>
              <CardTitle>Home Page Sections</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Drag to reorder sections. Toggle visibility for each section.</p>
              
              <Reorder.Group axis="y" values={sections} onReorder={handleReorder} className="space-y-3">
                {sections.map((section) => (
                  <Reorder.Item key={section.id} value={section}>
                    <Card className={`cursor-move transition-all ${section.enabled ? 'bg-white' : 'bg-gray-50'}`}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <GripVertical className="w-5 h-5 text-gray-400 mt-1" />
                          
                          <div className="flex-1 space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-gray-900">{section.name}</h4>
                                <p className="text-gray-500 text-sm">Order: {section.order}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge variant={section.enabled ? 'default' : 'outline'}>
                                  {section.enabled ? 'Visible' : 'Hidden'}
                                </Badge>
                                <Switch
                                  checked={section.enabled}
                                  onCheckedChange={(checked) => handleToggleSection(section.id, checked)}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveSection(section.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Section Configuration */}
                            {section.enabled && (
                              <div className="pl-4 border-l-2 border-blue-200 space-y-3">
                                {section.type === 'banner' || section.type === 'campaign-banner' ? (
                                  <div className="space-y-2">
                                    <Label className="text-sm">Select Banner Template</Label>
                                    <Select
                                      value={section.config?.bannerId || ''}
                                      onValueChange={(value) => handleBannerSelect(section.id, value)}
                                    >
                                      <SelectTrigger className="max-w-md">
                                        <SelectValue placeholder="Choose banner template" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {bannerTemplates.map((banner) => (
                                          <SelectItem key={banner.id} value={banner.id}>
                                            {banner.name} ({banner.type})
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                ) : section.type === 'menu' ? (
                                  <div className="space-y-2">
                                    <Label className="text-sm">Menu Action Buttons</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                      {menuButtons.map((item) => (
                                        <div
                                          key={item.id}
                                          className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                                            item.enabled ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                                          }`}
                                        >
                                          <div className="flex items-center gap-2">
                                            <span className="text-lg">{item.icon}</span>
                                            <span className="text-sm text-gray-900">{item.label}</span>
                                          </div>
                                          <Switch
                                            checked={item.enabled}
                                            onCheckedChange={(checked) => handleToggleMenuItem(item.id, checked)}
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : section.type === 'content' ? (
                                  <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-gray-600 text-sm">Featured content and promotional materials</p>
                                  </div>
                                ) : null}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader className="bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#007AFF]" />
                <CardTitle>Live Preview</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden shadow-lg">
                {/* Mobile Frame */}
                <div className="bg-[#007AFF] p-4 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white">Customer App</h3>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">
                        🔔
                      </div>
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">
                        ⚙️
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="space-y-0">
                  {enabledSections.map((section) => (
                    <div key={section.id} className="border-b border-gray-100 last:border-b-0">
                      {section.type === 'banner' && (
                        <div className="relative h-32 bg-gradient-to-r from-purple-400 to-pink-400">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center text-white">
                              <p className="text-sm">
                                {bannerTemplates.find(b => b.id === section.config?.bannerId)?.name || 'Banner'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {section.type === 'menu' && (
                        <div className="p-4 bg-gray-50">
                          <div className="grid grid-cols-3 gap-3">
                            {enabledMenuItems.slice(0, 6).map((item) => (
                              <div
                                key={item.id}
                                className="flex flex-col items-center gap-2 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                              >
                                <span className="text-2xl">{item.icon}</span>
                                <span className="text-xs text-gray-700 text-center leading-tight">
                                  {item.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {section.type === 'campaign-banner' && (
                        <div className="relative h-24 bg-gradient-to-r from-blue-400 to-cyan-400">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center text-white">
                              <p className="text-xs">
                                {bannerTemplates.find(b => b.id === section.config?.bannerId)?.name || 'Campaign'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {section.type === 'content' && (
                        <div className="p-4">
                          <div className="space-y-2">
                            <div className="h-16 bg-gray-200 rounded-lg"></div>
                            <div className="h-16 bg-gray-200 rounded-lg"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Bottom Navigation */}
                <div className="bg-white border-t p-3">
                  <div className="flex justify-around">
                    <div className="flex flex-col items-center gap-1 text-[#007AFF]">
                      <Home className="w-5 h-5" />
                      <span className="text-xs">Home</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-gray-400">
                      <Gift className="w-5 h-5" />
                      <span className="text-xs">Rewards</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-gray-400">
                      <Coins className="w-5 h-5" />
                      <span className="text-xs">Points</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-gray-400">
                      <User className="w-5 h-5" />
                      <span className="text-xs">Profile</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800 text-sm">
                  <Eye className="w-4 h-4 inline mr-1" />
                  Preview updates in real-time as you configure sections
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Section Dialog */}
      <Dialog open={showAddSectionDialog} onOpenChange={setShowAddSectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Section</DialogTitle>
            <DialogDescription>
              Choose the type of section to add to your landing page
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {sectionTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => handleAddSection(type.value)}
                  className="flex flex-col items-center gap-3 p-6 border-2 rounded-lg hover:border-[#007AFF] hover:bg-blue-50 transition-all text-center group"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-[#007AFF] transition-colors">
                    <Icon className="w-6 h-6 text-[#007AFF] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-gray-900 mb-1">{type.label}</p>
                    <p className="text-xs text-gray-500">{type.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddSectionDialog(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
