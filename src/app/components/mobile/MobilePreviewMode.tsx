import { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { 
  ArrowLeft, Smartphone, Tablet, Monitor, RotateCw,
  Maximize2, Minimize2, Palette, Layout, Eye
} from 'lucide-react';
import { motion } from 'motion/react';
import MobileAppContainerEnhanced from './MobileAppContainerEnhanced';

interface MobilePreviewModeProps {
  onBack: () => void;
}

type DeviceType = 'iphone16' | 'iphone16pro' | 'pixel8' | 'tablet';
type Orientation = 'portrait' | 'landscape';

const devices = {
  iphone16: {
    name: 'iPhone 16',
    width: 430,
    height: 932,
    ratio: '430:932'
  },
  iphone16pro: {
    name: 'iPhone 16 Pro Max',
    width: 440,
    height: 956,
    ratio: '440:956'
  },
  pixel8: {
    name: 'Google Pixel 8',
    width: 412,
    height: 915,
    ratio: '412:915'
  },
  tablet: {
    name: 'iPad Pro 11"',
    width: 834,
    height: 1194,
    ratio: '834:1194'
  }
};

export default function MobilePreviewMode({ onBack }: MobilePreviewModeProps) {
  const [device, setDevice] = useState<DeviceType>('iphone16');
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(false);

  const currentDevice = devices[device];
  const displayWidth = orientation === 'portrait' ? currentDevice.width : currentDevice.height;
  const displayHeight = orientation === 'portrait' ? currentDevice.height : currentDevice.width;

  const toggleOrientation = () => {
    setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait');
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.1, 1.5));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.1, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="h-8 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#007AFF]" />
              <h2 className="text-gray-900">Mobile App Preview</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              Live Preview
            </Badge>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          {/* Device Selector */}
          <div className="flex items-center gap-3">
            <Select value={device} onValueChange={(value: DeviceType) => setDevice(value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="iphone16">
                  📱 iPhone 16
                </SelectItem>
                <SelectItem value="iphone16pro">
                  📱 iPhone 16 Pro Max
                </SelectItem>
                <SelectItem value="pixel8">
                  📱 Google Pixel 8
                </SelectItem>
                <SelectItem value="tablet">
                  💻 iPad Pro 11"
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-500">
              {displayWidth} × {displayHeight} px
            </div>
          </div>

          {/* Tools */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleOrientation}
              title="Rotate device"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
            <div className="h-6 w-px bg-gray-200" />
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              title="Zoom out"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <div className="text-sm text-gray-600 min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 1.5}
              title="Zoom in"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetZoom}
              title="Reset zoom"
            >
              Reset
            </Button>
            <div className="h-6 w-px bg-gray-200" />
            <Button
              variant={showGrid ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
              title="Toggle grid"
            >
              <Layout className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 relative">
        {/* Grid Overlay */}
        {showGrid && (
          <div 
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0, 122, 255, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0, 122, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '8px 8px'
            }}
          />
        )}

        {/* Device Preview */}
        <div className="flex items-center justify-center min-h-full p-8">
          <motion.div
            key={`${device}-${orientation}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: zoom }}
            transition={{ duration: 0.3 }}
            className="origin-center"
          >
            <MobileAppContainerEnhanced />
          </motion.div>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-gray-500">
            <span>Device: {currentDevice.name}</span>
            <span>•</span>
            <span>Orientation: {orientation}</span>
            <span>•</span>
            <span>Zoom: {Math.round(zoom * 100)}%</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Eye className="w-4 h-4" />
            <span>Interactive prototype mode</span>
          </div>
        </div>
      </div>
    </div>
  );
}
