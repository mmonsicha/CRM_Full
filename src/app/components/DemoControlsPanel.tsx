import { motion } from 'motion/react';
import { EyeOff, Eye, Settings as SettingsIcon, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { useAppPreview } from './AppPreviewContext';
import { toast } from 'sonner@2.0.3';

export default function DemoControlsPanel() {
  const {
    bottomNav,
    setBottomNav,
    landingSections,
    setLandingSections,
    quickActions,
    setQuickActions,
  } = useAppPreview();

  const toggleBottomNavVisibility = (id: string) => {
    setBottomNav(
      bottomNav.map((item) =>
        item.id === id ? { ...item, hidden: !item.hidden } : item
      )
    );
    
    const item = bottomNav.find((i) => i.id === id);
    toast.success(
      item?.hidden ? `${item.label} menu visible` : `${item?.label} menu hidden`,
      {
        description: 'Mobile preview updated',
      }
    );
  };

  const toggleSectionVisibility = (id: string) => {
    setLandingSections(
      landingSections.map((section) =>
        section.id === id ? { ...section, enabled: !section.enabled } : section
      )
    );
    
    const section = landingSections.find((s) => s.id === id);
    toast.success(
      section?.enabled ? `${section.label} hidden` : `${section?.label} visible`,
      {
        description: 'Landing page updated',
      }
    );
  };

  const toggleQuickActionVisibility = (id: string) => {
    setQuickActions(
      quickActions.map((action) =>
        action.id === id ? { ...action, enabled: !action.enabled } : action
      )
    );
    
    const action = quickActions.find((a) => a.id === id);
    toast.success(
      action?.enabled ? `${action.label} hidden` : `${action?.label} visible`,
      {
        description: 'Quick actions updated',
      }
    );
  };

  const resetAllVisibility = () => {
    // Show all bottom nav items
    setBottomNav(bottomNav.map((item) => ({ ...item, hidden: false })));
    
    // Show all landing sections
    setLandingSections(landingSections.map((section) => ({ ...section, enabled: true })));
    
    // Show all quick actions
    setQuickActions(quickActions.map((action) => ({ ...action, enabled: true })));
    
    toast.success('All items visible', {
      description: 'Demo controls reset',
    });
  };

  const visibleBottomNavCount = bottomNav.filter((i) => !i.hidden).length;
  const hiddenBottomNavCount = bottomNav.filter((i) => i.hidden).length;

  const visibleSectionsCount = landingSections.filter((s) => s.enabled).length;
  const hiddenSectionsCount = landingSections.filter((s) => !s.enabled).length;

  const visibleQuickActionsCount = quickActions.filter((a) => a.enabled).length;
  const hiddenQuickActionsCount = quickActions.filter((a) => !a.enabled).length;

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-gray-900 text-2xl mb-1 flex items-center gap-2">
              <SettingsIcon className="w-6 h-6 text-[#007AFF]" />
              Demo Controls
            </h2>
            <p className="text-gray-500 text-sm">
              Hide/show menus and sections for demo purposes - Changes apply in real-time
            </p>
          </div>
          <Button variant="outline" onClick={resetAllVisibility}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset All
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm text-blue-900 font-medium mb-1">Demo Mode</p>
            <p className="text-sm text-blue-700">
              Use these controls to simulate different app configurations. Hidden elements will
              disappear from the mobile preview, and the layout will adjust automatically using
              Auto Layout.
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        {/* Bottom Navigation Controls */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-gray-900 font-medium">Bottom Navigation Bar</h3>
              <p className="text-sm text-gray-500 mt-1">Control which menu items are visible</p>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-green-100 text-green-700 border-green-200">
                {visibleBottomNavCount} Visible
              </Badge>
              {hiddenBottomNavCount > 0 && (
                <Badge className="bg-red-100 text-red-700 border-red-200">
                  {hiddenBottomNavCount} Hidden
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {bottomNav
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                    item.hidden
                      ? 'bg-red-50 border-red-200 opacity-75'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.hidden ? (
                      <EyeOff className="w-5 h-5 text-red-600" />
                    ) : (
                      <Eye className="w-5 h-5 text-green-600" />
                    )}
                    <div>
                      <p className="text-gray-900 font-medium">{item.label}</p>
                      <p className="text-xs text-gray-500">
                        {item.hidden ? 'Hidden from bottom nav' : 'Visible in bottom nav'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      Position {item.order + 1}
                    </Badge>
                    <Switch
                      checked={!item.hidden}
                      onCheckedChange={() => toggleBottomNavVisibility(item.id)}
                    />
                  </div>
                </motion.div>
              ))}
          </div>

          {hiddenBottomNavCount > 0 && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                ⚠️ {hiddenBottomNavCount} menu item{hiddenBottomNavCount > 1 ? 's are' : ' is'}{' '}
                hidden. The mobile preview will automatically adjust the bottom navigation layout.
              </p>
            </div>
          )}
        </Card>

        {/* Landing Page Sections Controls */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-gray-900 font-medium">Landing Page Sections</h3>
              <p className="text-sm text-gray-500 mt-1">Show/hide home screen sections</p>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-green-100 text-green-700 border-green-200">
                {visibleSectionsCount} Visible
              </Badge>
              {hiddenSectionsCount > 0 && (
                <Badge className="bg-red-100 text-red-700 border-red-200">
                  {hiddenSectionsCount} Hidden
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {landingSections
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <motion.div
                  key={section.id}
                  layout
                  className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                    !section.enabled
                      ? 'bg-red-50 border-red-200 opacity-75'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {!section.enabled ? (
                      <EyeOff className="w-5 h-5 text-red-600" />
                    ) : (
                      <Eye className="w-5 h-5 text-green-600" />
                    )}
                    <div>
                      <p className="text-gray-900 font-medium">{section.label}</p>
                      <p className="text-xs text-gray-500 capitalize">
                        {section.enabled ? 'Visible on home page' : 'Hidden from home page'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      Order {section.order + 1}
                    </Badge>
                    <Switch
                      checked={section.enabled}
                      onCheckedChange={() => toggleSectionVisibility(section.id)}
                    />
                  </div>
                </motion.div>
              ))}
          </div>
        </Card>

        {/* Quick Actions Controls */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-gray-900 font-medium">Quick Actions</h3>
              <p className="text-sm text-gray-500 mt-1">Toggle quick action buttons</p>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-green-100 text-green-700 border-green-200">
                {visibleQuickActionsCount} Visible
              </Badge>
              {hiddenQuickActionsCount > 0 && (
                <Badge className="bg-red-100 text-red-700 border-red-200">
                  {hiddenQuickActionsCount} Hidden
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {quickActions
              .sort((a, b) => a.order - b.order)
              .map((action) => (
                <motion.div
                  key={action.id}
                  layout
                  className={`flex items-center justify-between p-3 border rounded-lg transition-all ${
                    !action.enabled
                      ? 'bg-red-50 border-red-200 opacity-75'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {!action.enabled ? (
                      <EyeOff className="w-4 h-4 text-red-600" />
                    ) : (
                      <Eye className="w-4 h-4 text-green-600" />
                    )}
                    <div>
                      <p className="text-gray-900 font-medium text-sm">{action.label}</p>
                      <p className="text-xs text-gray-500">{action.icon}</p>
                    </div>
                  </div>
                  <Switch
                    checked={action.enabled}
                    onCheckedChange={() => toggleQuickActionVisibility(action.id)}
                  />
                </motion.div>
              ))}
          </div>
        </Card>

        {/* Summary Card */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <h3 className="text-gray-900 font-medium mb-3">Current Configuration</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-2xl font-semibold text-[#007AFF]">{visibleBottomNavCount}</p>
              <p className="text-xs text-gray-600 mt-1">Bottom Nav Items</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-2xl font-semibold text-[#007AFF]">{visibleSectionsCount}</p>
              <p className="text-xs text-gray-600 mt-1">Home Sections</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-2xl font-semibold text-[#007AFF]">{visibleQuickActionsCount}</p>
              <p className="text-xs text-gray-600 mt-1">Quick Actions</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
