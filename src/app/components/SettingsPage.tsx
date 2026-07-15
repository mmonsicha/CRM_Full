import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { 
  Users, Shield, Key, Moon, CheckCircle, Plus, 
  Facebook, MessageCircle, Hash, Link as LinkIcon
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const roles = [
  { id: 1, name: 'Admin', users: 2, permissions: ['All Access'], color: 'bg-red-100 text-red-700' },
  { id: 2, name: 'Marketer', users: 5, permissions: ['Campaigns', 'Broadcasts', 'Promotions'], color: 'bg-blue-100 text-blue-700' },
  { id: 3, name: 'Operator', users: 8, permissions: ['Members', 'Products', 'Feedback'], color: 'bg-green-100 text-green-700' },
];

const apiConnections = [
  { id: 1, name: 'LINE OA', platform: 'LINE', status: 'Connected', lastSync: '2024-10-28 10:30' },
  { id: 2, name: 'Facebook Business', platform: 'Facebook', status: 'Connected', lastSync: '2024-10-27 15:45' },
  { id: 3, name: 'LIFF App', platform: 'LINE', status: 'Connected', lastSync: '2024-10-28 09:15' },
];

const socialPlatforms = [
  { id: 1, name: 'LINE Official Account', icon: MessageCircle, connected: true, traffic: 12450, leads: 847 },
  { id: 2, name: 'Facebook Page', icon: Facebook, connected: true, traffic: 8920, leads: 523 },
  { id: 3, name: 'TikTok', icon: Hash, connected: false, traffic: 0, leads: 0 },
];

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showApiDialog, setShowApiDialog] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const handleSaveRole = () => {
    toast.success('Role created successfully!');
    setShowRoleDialog(false);
  };

  const handleConnectApi = () => {
    toast.success('API key saved successfully!');
    setShowApiDialog(false);
  };

  const handleConnectPlatform = (platform: string) => {
    toast.success(`${platform} connected successfully!`);
    setSelectedPlatform(null);
  };

  return (
    <div className="p-6">
      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="api">API Management</TabsTrigger>
          <TabsTrigger value="social">Social Integration</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        {/* Roles & Permissions */}
        <TabsContent value="roles" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-900">Role Management</h3>
              <p className="text-gray-600 mt-1">Manage user roles and permissions</p>
            </div>
            <Button onClick={() => setShowRoleDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Role
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role) => (
              <Card key={role.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className={role.color}>{role.name}</Badge>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{role.users}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-gray-600">Permissions:</div>
                    {role.permissions.map((permission, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">{permission}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Edit Role
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Permission Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Marketer</TableHead>
                    <TableHead>Operator</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    'Dashboard',
                    'Members',
                    'Campaigns',
                    'Broadcasts',
                    'Promotions',
                    'Points',
                    'Products',
                    'Feedback',
                    'Settings',
                  ].map((module) => (
                    <TableRow key={module}>
                      <TableCell>{module}</TableCell>
                      <TableCell>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </TableCell>
                      <TableCell>
                        {['Campaigns', 'Broadcasts', 'Promotions'].includes(module) ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                        )}
                      </TableCell>
                      <TableCell>
                        {['Members', 'Products', 'Feedback'].includes(module) ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Management */}
        <TabsContent value="api" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-900">API Key Management</h3>
              <p className="text-gray-600 mt-1">Manage external integrations and API keys</p>
            </div>
            <Button onClick={() => setShowApiDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add API Key
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Connected APIs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Name</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Sync</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiConnections.map((api) => (
                    <TableRow key={api.id}>
                      <TableCell>{api.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{api.platform}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {api.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">{api.lastSync}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                API Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>LINE Messaging API Channel ID</Label>
                <Input
                  type="password"
                  value="••••••••••••••••"
                  readOnly
                  className="mt-2"
                />
              </div>
              <div>
                <Label>LINE Messaging API Channel Secret</Label>
                <Input
                  type="password"
                  value="••••••••••••••••"
                  readOnly
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Facebook App ID</Label>
                <Input
                  type="password"
                  value="••••••••••••••••"
                  readOnly
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Facebook App Secret</Label>
                <Input
                  type="password"
                  value="••••••••••••••••"
                  readOnly
                  className="mt-2"
                />
              </div>
              <Button>Update API Keys</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Integration */}
        <TabsContent value="social" className="space-y-6">
          <div>
            <h3 className="text-gray-900">Social Media Integration</h3>
            <p className="text-gray-600 mt-1">Connect and manage social media platforms</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {socialPlatforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <Card key={platform.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-blue-600" />
                        <CardTitle className="text-base">{platform.name}</CardTitle>
                      </div>
                      <Badge variant={platform.connected ? 'default' : 'secondary'}>
                        {platform.connected ? 'Connected' : 'Not Connected'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {platform.connected ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Traffic:</span>
                          <span className="text-gray-900">{platform.traffic.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Leads:</span>
                          <span className="text-gray-900">{platform.leads.toLocaleString()}</span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          Manage Connection
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setSelectedPlatform(platform.name)}
                        size="sm"
                        className="w-full"
                      >
                        Connect Platform
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Social Performance Report</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Platform</TableHead>
                    <TableHead>Total Traffic</TableHead>
                    <TableHead>Leads Generated</TableHead>
                    <TableHead>Conversion Rate</TableHead>
                    <TableHead>Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {socialPlatforms
                    .filter((p) => p.connected)
                    .map((platform) => (
                      <TableRow key={platform.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {platform.icon === MessageCircle && <MessageCircle className="w-4 h-4 text-green-600" />}
                            {platform.icon === Facebook && <Facebook className="w-4 h-4 text-blue-600" />}
                            <span>{platform.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{platform.traffic.toLocaleString()}</TableCell>
                        <TableCell>{platform.leads.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className="text-green-600">
                            {((platform.leads / platform.traffic) * 100).toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell>${(platform.leads * 45).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Auto-Share Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-share new campaigns to social media</Label>
                  <p className="text-gray-500 mt-1">Automatically post when creating a new campaign</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-share promotions</Label>
                  <p className="text-gray-500 mt-1">Share promotion codes to connected platforms</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Sync member data</Label>
                  <p className="text-gray-500 mt-1">Keep member profiles synchronized across platforms</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <div>
            <h3 className="text-gray-900">General Settings</h3>
            <p className="text-gray-600 mt-1">Configure system preferences</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="flex items-center gap-2">
                    <Moon className="w-4 h-4" />
                    Dark Mode
                  </Label>
                  <p className="text-gray-500 mt-1">Enable dark theme for the dashboard</p>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email notifications</Label>
                  <p className="text-gray-500 mt-1">Receive updates via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Low stock alerts</Label>
                  <p className="text-gray-500 mt-1">Get notified when products are running low</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>New review notifications</Label>
                  <p className="text-gray-500 mt-1">Alert when customers leave reviews</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Version:</span>
                <span className="text-gray-900">v2.4.1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="text-gray-900">2024-10-15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Database Status:</span>
                <Badge variant="default" className="bg-green-600">Healthy</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Role Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Create a new role and assign permissions for users in your system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Role Name</Label>
              <Input placeholder="e.g., Content Manager" className="mt-2" />
            </div>
            <div>
              <Label>Select Permissions</Label>
              <div className="mt-2 space-y-2">
                {['Dashboard', 'Members', 'Campaigns', 'Products', 'Feedback'].map((perm) => (
                  <div key={perm} className="flex items-center gap-2">
                    <input type="checkbox" id={perm} className="rounded" />
                    <label htmlFor={perm} className="text-gray-700">{perm}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowRoleDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSaveRole} className="flex-1">
                Create Role
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add API Dialog */}
      <Dialog open={showApiDialog} onOpenChange={setShowApiDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add API Connection</DialogTitle>
            <DialogDescription>
              Configure a new API connection by providing the service credentials.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Service Name</Label>
              <Input placeholder="e.g., Payment Gateway" className="mt-2" />
            </div>
            <div>
              <Label>Platform</Label>
              <Select>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">LINE</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="custom">Custom API</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>API Key</Label>
              <Input type="password" placeholder="Enter API key" className="mt-2" />
            </div>
            <div>
              <Label>API Secret</Label>
              <Input type="password" placeholder="Enter API secret" className="mt-2" />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowApiDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleConnectApi} className="flex-1">
                Connect API
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Connect Platform Dialog */}
      <Dialog open={!!selectedPlatform} onOpenChange={() => setSelectedPlatform(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect to {selectedPlatform}</DialogTitle>
            <DialogDescription>
              Set up your social media integration by providing your app credentials.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Follow the instructions to connect your {selectedPlatform} account.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-blue-900">Steps:</div>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-gray-700">
                <li>Log in to your {selectedPlatform} account</li>
                <li>Go to Developer Settings</li>
                <li>Create a new app and copy credentials</li>
                <li>Paste the credentials below</li>
              </ol>
            </div>
            <div>
              <Label>App ID / Client ID</Label>
              <Input placeholder="Enter App ID" className="mt-2" />
            </div>
            <div>
              <Label>App Secret / Client Secret</Label>
              <Input type="password" placeholder="Enter App Secret" className="mt-2" />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setSelectedPlatform(null)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={() => selectedPlatform && handleConnectPlatform(selectedPlatform)}
                className="flex-1"
              >
                Connect
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
