import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Palette, Smartphone, Save, Check } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';

interface PresetTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  background: string;
  font: string;
}

interface FestivalTheme {
  id: string;
  name: string;
  icon: string;
  colors: string[];
  description: string;
}

const presetThemes: PresetTheme[] = [
  {
    id: 'default',
    name: 'Default Blue',
    primary: '#007AFF',
    secondary: '#FBBF24',
    background: '#F9FAFB',
    font: '#111827'
  },
  {
    id: 'purple',
    name: 'Purple Dream',
    primary: '#9333EA',
    secondary: '#F59E0B',
    background: '#FAF5FF',
    font: '#1F2937'
  },
  {
    id: 'green',
    name: 'Fresh Green',
    primary: '#10B981',
    secondary: '#3B82F6',
    background: '#F0FDF4',
    font: '#064E3B'
  },
  {
    id: 'red',
    name: 'Vibrant Red',
    primary: '#EF4444',
    secondary: '#F59E0B',
    background: '#FEF2F2',
    font: '#7F1D1D'
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    primary: '#0EA5E9',
    secondary: '#06B6D4',
    background: '#F0F9FF',
    font: '#0C4A6E'
  },
  {
    id: 'sunset',
    name: 'Sunset Orange',
    primary: '#F97316',
    secondary: '#FBBF24',
    background: '#FFF7ED',
    font: '#7C2D12'
  },
];

const festivalThemes: FestivalTheme[] = [
  {
    id: 'valentine',
    name: 'Valentine',
    icon: '💝',
    colors: ['#FF1493', '#FFB6C1', '#FFC0CB'],
    description: 'Romantic pink and red theme'
  },
  {
    id: 'halloween',
    name: 'Halloween',
    icon: '🎃',
    colors: ['#FF6600', '#000000', '#FFA500'],
    description: 'Spooky orange and black theme'
  },
  {
    id: 'newyear',
    name: 'New Year',
    icon: '🎉',
    colors: ['#FFD700', '#0000FF', '#FFFFFF'],
    description: 'Festive gold and blue theme'
  },
  {
    id: 'christmas',
    name: 'Christmas',
    icon: '🎄',
    colors: ['#DC143C', '#228B22', '#FFFFFF'],
    description: 'Classic red and green theme'
  },
];

export default function SettingsTheme() {
  const [themeType, setThemeType] = useState<'preset' | 'festival'>('preset');
  const [selectedPreset, setSelectedPreset] = useState('default');
  const [selectedFestival, setSelectedFestival] = useState('valentine');

  const activeTheme = themeType === 'preset' 
    ? presetThemes.find(t => t.id === selectedPreset)
    : null;

  const activeFestival = themeType === 'festival'
    ? festivalThemes.find(t => t.id === selectedFestival)
    : null;

  const handleApplyTheme = () => {
    const themeName = themeType === 'preset' 
      ? activeTheme?.name 
      : activeFestival?.name;
    
    toast.success(`${themeName} theme applied successfully!`, {
      description: 'Theme changes are now visible in the customer app'
    });
  };

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
            <BreadcrumbPage className="text-gray-900">Settings Theme</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="bg-gradient-to-r from-[#007AFF] to-[#0051D5] rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Palette className="w-6 h-6" />
          <h2 className="text-white">Customer App Theme Settings</h2>
        </div>
        <p className="text-blue-50">Customize the look and feel of your customer-facing application</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Theme Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Theme Type</CardTitle>
              <p className="text-gray-500 text-sm mt-1">Select either preset or festival theme (only one can be active)</p>
            </CardHeader>
            <CardContent>
              <RadioGroup value={themeType} onValueChange={(value: 'preset' | 'festival') => setThemeType(value)}>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      themeType === 'preset' 
                        ? 'border-[#007AFF] bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setThemeType('preset')}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="preset" id="preset" />
                      <div className="flex-1">
                        <Label htmlFor="preset" className="cursor-pointer text-gray-900">Preset Theme</Label>
                        <p className="text-xs text-gray-500 mt-1">Professional color palettes</p>
                      </div>
                    </div>
                    {themeType === 'preset' && (
                      <Badge className="absolute top-2 right-2 bg-[#007AFF]">
                        <Check className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>

                  <div 
                    className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      themeType === 'festival' 
                        ? 'border-[#007AFF] bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setThemeType('festival')}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="festival" id="festival" />
                      <div className="flex-1">
                        <Label htmlFor="festival" className="cursor-pointer text-gray-900">Festival Theme</Label>
                        <p className="text-xs text-gray-500 mt-1">Seasonal celebration themes</p>
                      </div>
                    </div>
                    {themeType === 'festival' && (
                      <Badge className="absolute top-2 right-2 bg-[#007AFF]">
                        <Check className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Theme Selection */}
          <Card>
            <CardHeader>
              <CardTitle>
                {themeType === 'preset' ? 'Select Preset Theme' : 'Select Festival Theme'}
              </CardTitle>
              <p className="text-gray-500 text-sm mt-1">
                {themeType === 'preset' 
                  ? 'Choose from professionally designed color schemes'
                  : 'Choose a seasonal theme for special occasions'
                }
              </p>
            </CardHeader>
            <CardContent>
              {themeType === 'preset' ? (
                <div className="grid grid-cols-2 gap-4">
                  {presetThemes.map((theme) => (
                    <motion.div
                      key={theme.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedPreset(theme.id)}
                      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedPreset === theme.id
                          ? 'border-[#007AFF] shadow-lg bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-8 h-8 rounded" style={{ backgroundColor: theme.primary }} />
                            <div className="w-8 h-8 rounded" style={{ backgroundColor: theme.secondary }} />
                            <div className="w-8 h-8 rounded border" style={{ backgroundColor: theme.background }} />
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-900">{theme.name}</p>
                          <p className="text-xs text-gray-500">Primary • Secondary • Background</p>
                        </div>
                      </div>
                      {selectedPreset === theme.id && (
                        <Badge className="absolute top-2 right-2 bg-[#007AFF] border-0">
                          <Check className="w-3 h-3" />
                        </Badge>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {festivalThemes.map((theme) => (
                    <motion.div
                      key={theme.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedFestival(theme.id)}
                      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedFestival === theme.id
                          ? 'border-[#007AFF] shadow-lg bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="text-4xl mb-2">{theme.icon}</div>
                        <div>
                          <p className="text-gray-900">{theme.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{theme.description}</p>
                        </div>
                        <div className="flex gap-1">
                          {theme.colors.map((color, index) => (
                            <div 
                              key={index}
                              className="w-6 h-6 rounded border border-gray-200"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                      {selectedFestival === theme.id && (
                        <Badge className="absolute top-2 right-2 bg-[#007AFF] border-0">
                          <Check className="w-3 h-3" />
                        </Badge>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Apply Button */}
          <div className="flex gap-3">
            <Button onClick={handleApplyTheme} className="bg-[#007AFF] hover:bg-[#0051D5]" size="lg">
              <Save className="w-4 h-4 mr-2" />
              Apply Theme
            </Button>
            <Button variant="outline" size="lg">Cancel</Button>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader className="bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#007AFF]" />
                <CardTitle>Live Preview</CardTitle>
              </div>
              <p className="text-sm text-gray-500">Customer App Home Page</p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="bg-gray-100 rounded-lg p-4 shadow-xl">
                {/* Mobile Frame */}
                <div className="bg-white rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg">
                  {/* App Header */}
                  <div 
                    className="p-4 text-white"
                    style={{ 
                      backgroundColor: themeType === 'preset' 
                        ? activeTheme?.primary 
                        : activeFestival?.colors[0] || '#007AFF'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-white">Customer App</h3>
                      <div className="flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">
                          🔔
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Banner */}
                  <div 
                    className="h-24 flex items-center justify-center"
                    style={{ 
                      background: themeType === 'preset'
                        ? `linear-gradient(135deg, ${activeTheme?.primary}, ${activeTheme?.secondary})`
                        : `linear-gradient(135deg, ${activeFestival?.colors[0]}, ${activeFestival?.colors[1]})`
                    }}
                  >
                    <p className="text-white text-sm">Welcome Banner</p>
                  </div>

                  {/* Menu Actions */}
                  <div 
                    className="p-4"
                    style={{ backgroundColor: themeType === 'preset' ? activeTheme?.background : '#F9FAFB' }}
                  >
                    <div className="grid grid-cols-3 gap-3">
                      {['Rewards', 'Points', 'Store', 'Profile', 'History', 'More'].map((item) => (
                        <div
                          key={item}
                          className="flex flex-col items-center gap-2 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs"
                            style={{ 
                              backgroundColor: themeType === 'preset' 
                                ? activeTheme?.secondary 
                                : activeFestival?.colors[2] || '#FBBF24'
                            }}
                          >
                            {item[0]}
                          </div>
                          <span 
                            className="text-xs text-center"
                            style={{ 
                              color: themeType === 'preset' 
                                ? activeTheme?.font 
                                : '#111827'
                            }}
                          >
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-4 space-y-3">
                    <div className="h-16 bg-gray-100 rounded-lg"></div>
                    <div className="h-16 bg-gray-100 rounded-lg"></div>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="bg-white border-t p-3">
                    <div className="flex justify-around">
                      {['Home', 'Rewards', 'Points', 'Profile'].map((item, index) => (
                        <div 
                          key={item}
                          className="flex flex-col items-center gap-1"
                          style={{ 
                            color: index === 0 
                              ? (themeType === 'preset' ? activeTheme?.primary : activeFestival?.colors[0])
                              : '#9CA3AF'
                          }}
                        >
                          <div className="w-5 h-5 rounded-full bg-current opacity-20"></div>
                          <span className="text-xs">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme Info */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800 text-sm">
                  <strong>Active Theme:</strong> {themeType === 'preset' ? activeTheme?.name : activeFestival?.name}
                </p>
                <p className="text-blue-600 text-xs mt-1">
                  Preview updates in real-time
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
