import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Palette, Layout, Navigation, Zap, Image as ImageIcon,
  Tag, Eye, Check, GripVertical, Plus, Trash2, Edit,
  Save, RotateCcw, ChevronDown, Upload, Link as LinkIcon,
  EyeOff, Settings as SettingsIcon
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useAppPreview } from './AppPreviewContext';
import { toast } from 'sonner@2.0.3';

export default function CustomerAppConfigPanel() {
  const {
    theme,
    setTheme,
    landingSections,
    toggleLandingSection,
    reorderLandingSections,
    quickActions,
    toggleQuickAction,
    reorderQuickActions,
    bottomNav,
    banners,
    currentUserSegment,
    setCurrentUserSegment,
    currentUserTier,
    setCurrentUserTier,
  } = useAppPreview();

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const themePresets = [
    {
      id: 'default',
      name: 'Default Blue',
      primaryColor: '#007AFF',
      secondaryColor: '#0051D5',
      accentColor: '#FF9500',
    },
    {
      id: 'festival',
      name: 'Festival',
      primaryColor: '#FF2D55',
      secondaryColor: '#FF6482',
      accentColor: '#FFD60A',
    },
    {
      id: 'minimal',
      name: 'Minimal',
      primaryColor: '#1C1C1E',
      secondaryColor: '#48484A',
      accentColor: '#98989D',
    },
    {
      id: 'premium',
      name: 'Premium',
      primaryColor: '#8E44AD',
      secondaryColor: '#9B59B6',
      accentColor: '#F39C12',
    },
  ];

  const handleApplyPreset = (presetId: string) => {
    const preset = themePresets.find((p) => p.id === presetId);
    if (preset) {
      setTheme({
        ...theme,
        preset: presetId as any,
        primaryColor: preset.primaryColor,
        secondaryColor: preset.secondaryColor,
        accentColor: preset.accentColor,
      });
      toast.success('Theme applied', {
        description: `${preset.name} theme is now active`,
      });
    }
  };

  const handleDragStart = (index: number, type: 'section' | 'quickAction') => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number, type: 'section' | 'quickAction') => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    if (type === 'section') {
      reorderLandingSections(draggedIndex, index);
    } else {
      reorderQuickActions(draggedIndex, index);
    }
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-gray-900 text-2xl mb-1">Customer App Configuration</h2>
        <p className="text-gray-500 text-sm">
          Configure the mobile app appearance and layout - Changes reflect in real-time
        </p>
      </div>

      <Tabs defaultValue="theme" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="theme">
            <Palette className="w-4 h-4 mr-2" />
            Theme
          </TabsTrigger>
          <TabsTrigger value="layout">
            <Layout className="w-4 h-4 mr-2" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="navigation">
            <Navigation className="w-4 h-4 mr-2" />
            Navigation
          </TabsTrigger>
          <TabsTrigger value="quick-actions">
            <Zap className="w-4 h-4 mr-2" />
            Quick Actions
          </TabsTrigger>
          <TabsTrigger value="banners">
            <ImageIcon className="w-4 h-4 mr-2" />
            Banners
          </TabsTrigger>
        </TabsList>

        {/* Theme Settings */}
        <TabsContent value="theme" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-gray-900 font-medium mb-4">Theme Presets</h3>
            <div className="grid grid-cols-2 gap-4">
              {themePresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset.id)}
                  className={`relative border-2 rounded-xl p-4 transition-all hover:shadow-md ${
                    theme.preset === preset.id
                      ? 'border-[#007AFF] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {theme.preset === preset.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-[#007AFF] rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-lg"
                      style={{
                        background: `linear-gradient(135deg, ${preset.primaryColor}, ${preset.secondaryColor})`,
                      }}
                    />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{preset.name}</p>
                      <p className="text-xs text-gray-500">Theme</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div
                      className="flex-1 h-8 rounded"
                      style={{ backgroundColor: preset.primaryColor }}
                    />
                    <div
                      className="flex-1 h-8 rounded"
                      style={{ backgroundColor: preset.secondaryColor }}
                    />
                    <div
                      className="flex-1 h-8 rounded"
                      style={{ backgroundColor: preset.accentColor }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-gray-900 font-medium mb-4">Custom Colors</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm mb-2 block">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={theme.primaryColor}
                    onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm mb-2 block">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={theme.secondaryColor}
                    onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={theme.secondaryColor}
                    onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm mb-2 block">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={theme.accentColor}
                    onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={theme.accentColor}
                    onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTheme({
                    ...theme,
                    primaryColor: '#007AFF',
                    secondaryColor: '#0051D5',
                    accentColor: '#FF9500',
                  });
                  toast.info('Colors reset to default');
                }}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Default
              </Button>
            </div>
          </Card>

          {/* Preview Test User */}
          <Card className="p-6">
            <h3 className="text-gray-900 font-medium mb-4">Preview Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm mb-2 block">Test User Segment</Label>
                <Select value={currentUserSegment} onValueChange={setCurrentUserSegment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SEG001">VIP Customers</SelectItem>
                    <SelectItem value="SEG002">New Members (Q4 2025)</SelectItem>
                    <SelectItem value="SEG003">Inactive Members</SelectItem>
                    <SelectItem value="SEG004">Birthday This Month</SelectItem>
                    <SelectItem value="SEG005">Gold Tier Members</SelectItem>
                    <SelectItem value="SEG006">All Active Members</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm mb-2 block">Test User Tier</Label>
                <Select value={currentUserTier} onValueChange={setCurrentUserTier}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRONZE">Bronze</SelectItem>
                    <SelectItem value="SILVER">Silver</SelectItem>
                    <SelectItem value="GOLD">Gold</SelectItem>
                    <SelectItem value="PLATINUM">Platinum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Change segment and tier to test campaign visibility and tier-specific features
            </p>
          </Card>
        </TabsContent>

        {/* Landing Page Layout */}
        <TabsContent value="layout" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-gray-900 font-medium">Landing Page Sections</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Drag to reorder, toggle to show/hide
                </p>
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                {landingSections.filter((s) => s.enabled).length} Active
              </Badge>
            </div>

            <div className="space-y-2">
              {landingSections
                .sort((a, b) => a.order - b.order)
                .map((section, index) => (
                  <div
                    key={section.id}
                    draggable
                    onDragStart={() => handleDragStart(index, 'section')}
                    onDragOver={(e) => handleDragOver(e, index, 'section')}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-3 p-4 border rounded-lg transition-all cursor-move ${
                      section.enabled
                        ? 'bg-white border-gray-200 hover:border-gray-300'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    } ${draggedIndex === index ? 'opacity-50' : ''}`}
                  >
                    <GripVertical className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{section.label}</p>
                      <p className="text-xs text-gray-500 capitalize">{section.type}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        Order: {section.order + 1}
                      </Badge>
                      <Switch
                        checked={section.enabled}
                        onCheckedChange={() => {
                          toggleLandingSection(section.id);
                          toast.success(
                            section.enabled ? 'Section hidden' : 'Section visible',
                            { description: section.label }
                          );
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 font-medium mb-1">Live Preview</p>
                <p className="text-sm text-blue-700">
                  Changes to section order and visibility are reflected immediately in the mobile
                  preview on the right
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Bottom Navigation */}
        <TabsContent value="navigation" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-gray-900 font-medium">Bottom Navigation Bar</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Configure navigation items (max 5 items)
                </p>
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                {bottomNav.filter((n) => n.enabled).length} / 5
              </Badge>
            </div>

            <div className="space-y-2">
              {bottomNav
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 p-4 border rounded-lg ${
                      item.enabled
                        ? 'bg-white border-gray-200'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.icon} icon</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Position: {item.order + 1}
                    </Badge>
                    <Switch checked={item.enabled} disabled />
                  </div>
                ))}
            </div>

            <p className="text-xs text-gray-500 mt-4">
              All navigation items are currently required. This will be customizable in a future update.
            </p>
          </Card>
        </TabsContent>

        {/* Quick Actions */}
        <TabsContent value="quick-actions" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-gray-900 font-medium">Quick Action Buttons</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Drag to reorder, toggle to show/hide
                </p>
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                {quickActions.filter((a) => a.enabled).length} Active
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {quickActions
                .sort((a, b) => a.order - b.order)
                .map((action, index) => (
                  <div
                    key={action.id}
                    draggable
                    onDragStart={() => handleDragStart(index, 'quickAction')}
                    onDragOver={(e) => handleDragOver(e, index, 'quickAction')}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-3 p-4 border rounded-lg transition-all cursor-move ${
                      action.enabled
                        ? 'bg-white border-gray-200 hover:border-gray-300'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    } ${draggedIndex === index ? 'opacity-50' : ''}`}
                  >
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium text-sm">{action.label}</p>
                      <p className="text-xs text-gray-500">{action.icon}</p>
                    </div>
                    <Switch
                      checked={action.enabled}
                      onCheckedChange={() => {
                        toggleQuickAction(action.id);
                        toast.success(
                          action.enabled ? 'Quick action hidden' : 'Quick action visible',
                          { description: action.label }
                        );
                      }}
                    />
                  </div>
                ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-gray-900 font-medium mb-4">Add New Quick Action</h3>
            <Button variant="outline" className="w-full" disabled>
              <Plus className="w-4 h-4 mr-2" />
              Add Quick Action
            </Button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Custom quick actions coming soon
            </p>
          </Card>
        </TabsContent>

        {/* Banners */}
        <TabsContent value="banners" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-gray-900 font-medium">Banner Management</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Configure hero banners for the home screen
                </p>
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                {banners.filter((b) => b.enabled).length} Active
              </Badge>
            </div>

            <div className="space-y-3">
              {banners
                .sort((a, b) => a.order - b.order)
                .map((banner) => (
                  <div
                    key={banner.id}
                    className={`border rounded-lg overflow-hidden ${
                      banner.enabled ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex gap-3 p-3">
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-24 h-16 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-medium truncate">{banner.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs capitalize">
                            {banner.linkType}
                          </Badge>
                          <span className="text-xs text-gray-500">Order: {banner.order + 1}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" disabled>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Switch checked={banner.enabled} disabled />
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <Button variant="outline" className="w-full mt-4" disabled>
              <Plus className="w-4 h-4 mr-2" />
              Add New Banner
            </Button>
          </Card>

          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <ImageIcon className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 font-medium mb-1">Auto-Slide Feature</p>
                <p className="text-sm text-blue-700">
                  Banners automatically slide every 5 seconds. Users can also swipe left/right to
                  navigate banners manually.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}