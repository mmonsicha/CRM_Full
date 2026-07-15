import { useState } from 'react';
import { ArrowLeft, Shield, Lock, Eye, Bell, HelpCircle, MessageCircle, Phone, Mail, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { motion } from 'motion/react';
import { MobileScreen } from './MobileBottomNav';
import { toast } from 'sonner@2.0.3';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface MobileSettingsProps {
  onNavigate: (screen: MobileScreen, data?: any) => void;
}

export default function MobileSettings({ onNavigate }: MobileSettingsProps) {
  const [activeTab, setActiveTab] = useState('privacy');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);

  // Privacy settings state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [dataCollectionEnabled, setDataCollectionEnabled] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  const handleChangePassword = () => {
    setShowPasswordDialog(false);
    toast.success('Password changed successfully');
  };

  const handleContactSupport = (method: string) => {
    setShowContactDialog(false);
    toast.success(`Opening ${method}...`);
  };

  const SettingItem = ({ icon: Icon, title, description, action, showBorder = true }: any) => (
    <button
      onClick={action}
      className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
        showBorder ? 'border-b border-gray-100' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <div className="text-left">
          <h4 className="text-gray-900 text-sm">{title}</h4>
          {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </button>
  );

  const ToggleItem = ({ icon: Icon, title, description, checked, onChange, showBorder = true }: any) => (
    <div
      className={`flex items-center justify-between p-4 ${
        showBorder ? 'border-b border-gray-100' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <div className="text-left">
          <h4 className="text-gray-900 text-sm">{title}</h4>
          {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ backgroundColor: '#F8FAFD' }}>
      {/* Header */}
      <div
        className="text-white px-6 py-6"
        style={{ background: 'linear-gradient(135deg, #2E5BFF, #5B7FFF)' }}
      >
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => onNavigate('profile' as MobileScreen)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-white text-xl flex-1">Settings</h2>
        </div>
        <p className="text-white/80 text-sm ml-13">Manage your account settings</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="bg-white border-b">
          <TabsList className="w-full justify-start overflow-x-auto h-12 bg-transparent p-0">
            <TabsTrigger
              value="privacy"
              className="flex-shrink-0 px-8 data-[state=active]:border-b-2 rounded-none"
              style={{
                borderColor: activeTab === 'privacy' ? '#2E5BFF' : 'transparent',
                color: activeTab === 'privacy' ? '#2E5BFF' : '#6B7280',
              }}
            >
              Privacy & Security
            </TabsTrigger>
            <TabsTrigger
              value="support"
              className="flex-shrink-0 px-8 data-[state=active]:border-b-2 rounded-none"
              style={{
                borderColor: activeTab === 'support' ? '#2E5BFF' : 'transparent',
                color: activeTab === 'support' ? '#2E5BFF' : '#6B7280',
              }}
            >
              Help & Support
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pb-6">
          {/* Privacy & Security Tab */}
          <TabsContent value="privacy" className="m-0">
            <div className="p-4 space-y-4">
              {/* Security Card */}
              <Card className="overflow-hidden">
                <div className="p-4 bg-blue-50 border-b border-blue-100">
                  <h3 className="text-gray-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Security Settings
                  </h3>
                </div>
                <div className="bg-white">
                  <SettingItem
                    icon={Lock}
                    title="Change Password"
                    description="Update your account password"
                    action={() => setShowPasswordDialog(true)}
                  />
                  <ToggleItem
                    icon={Shield}
                    title="Two-Factor Authentication"
                    description="Add an extra layer of security"
                    checked={twoFactorEnabled}
                    onChange={setTwoFactorEnabled}
                  />
                  <ToggleItem
                    icon={Eye}
                    title="Biometric Login"
                    description="Use Face ID or fingerprint"
                    checked={biometricEnabled}
                    onChange={setBiometricEnabled}
                    showBorder={false}
                  />
                </div>
              </Card>

              {/* Privacy Card */}
              <Card className="overflow-hidden">
                <div className="p-4 bg-purple-50 border-b border-purple-100">
                  <h3 className="text-gray-900 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-purple-600" />
                    Data & Privacy
                  </h3>
                </div>
                <div className="bg-white">
                  <ToggleItem
                    icon={Bell}
                    title="Data Collection"
                    description="Allow us to collect usage data"
                    checked={dataCollectionEnabled}
                    onChange={setDataCollectionEnabled}
                  />
                  <ToggleItem
                    icon={Bell}
                    title="Analytics"
                    description="Help improve our services"
                    checked={analyticsEnabled}
                    onChange={setAnalyticsEnabled}
                    showBorder={false}
                  />
                </div>
              </Card>

              {/* Privacy Info */}
              <div className="px-2">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Your privacy is important to us. We collect data to improve your experience and provide personalized content. You can manage your preferences anytime.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Help & Support Tab */}
          <TabsContent value="support" className="m-0">
            <div className="p-4 space-y-4">
              {/* FAQ Section */}
              <Card className="overflow-hidden">
                <div className="p-4 bg-green-50 border-b border-green-100">
                  <h3 className="text-gray-900 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-green-600" />
                    Frequently Asked Questions
                  </h3>
                </div>
                <div className="bg-white">
                  <SettingItem
                    icon={HelpCircle}
                    title="How to earn points?"
                    description="Learn about our rewards system"
                    action={() => toast.info('Opening FAQ...')}
                  />
                  <SettingItem
                    icon={HelpCircle}
                    title="How to redeem rewards?"
                    description="Step-by-step redemption guide"
                    action={() => toast.info('Opening FAQ...')}
                  />
                  <SettingItem
                    icon={HelpCircle}
                    title="Account & membership tiers"
                    description="Understanding tier benefits"
                    action={() => toast.info('Opening FAQ...')}
                    showBorder={false}
                  />
                </div>
              </Card>

              {/* Contact Support Card */}
              <Card className="overflow-hidden">
                <div className="p-4 bg-orange-50 border-b border-orange-100">
                  <h3 className="text-gray-900 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-orange-600" />
                    Contact Support
                  </h3>
                </div>
                <div className="bg-white">
                  <SettingItem
                    icon={MessageCircle}
                    title="Live Chat"
                    description="Chat with our support team"
                    action={() => handleContactSupport('Live Chat')}
                  />
                  <SettingItem
                    icon={Phone}
                    title="Call Us"
                    description="1-800-LOYALTY (24/7)"
                    action={() => handleContactSupport('Phone Call')}
                  />
                  <SettingItem
                    icon={Mail}
                    title="Email Support"
                    description="support@loyaltyapp.com"
                    action={() => handleContactSupport('Email')}
                    showBorder={false}
                  />
                </div>
              </Card>

              {/* Support Hours */}
              <div className="px-2">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Our support team is available 24/7 to help you. Average response time: 2 hours for email, instant for live chat.
                </p>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Enter your current and new password</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
              />
            </div>
            <Button 
              onClick={handleChangePassword}
              className="w-full"
              style={{ backgroundColor: '#2E5BFF' }}
            >
              Change Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
