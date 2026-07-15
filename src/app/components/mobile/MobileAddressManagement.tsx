import { useState } from 'react';
import { ArrowLeft, MapPin, Plus, Edit2, Trash2, Check, Home, Building2, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { motion, AnimatePresence } from 'motion/react';
import { MobileScreen } from './MobileBottomNav';
import { toast } from 'sonner@2.0.3';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';

interface MobileAddressManagementProps {
  onNavigate: (screen: MobileScreen, data?: any) => void;
}

interface Address {
  id: string;
  name: string;
  recipient: string;
  phone: string;
  address: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
}

export default function MobileAddressManagement({ onNavigate }: MobileAddressManagementProps) {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      name: 'Home',
      recipient: 'Simson',
      phone: '+66 98 765 4321',
      address: '123 Sukhumvit Road, Khlong Toei, Bangkok 10110, Thailand',
      isDefault: true,
      type: 'home',
    },
    {
      id: '2',
      name: 'Office',
      recipient: 'Simson',
      phone: '+66 98 765 4321',
      address: '456 Silom Road, Bangrak, Bangkok 10500, Thailand',
      isDefault: false,
      type: 'work',
    },
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    recipient: '',
    phone: '',
    address: '',
    isDefault: false,
    type: 'home' as 'home' | 'work' | 'other',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      recipient: '',
      phone: '',
      address: '',
      isDefault: false,
      type: 'home',
    });
  };

  const handleAddAddress = () => {
    const newAddress: Address = {
      id: Date.now().toString(),
      ...formData,
    };

    // If setting as default, remove default from others
    if (formData.isDefault) {
      setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })));
    }

    setAddresses(prev => [...prev, newAddress]);
    setShowAddDialog(false);
    resetForm();
    toast.success('Address added successfully');
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      recipient: address.recipient,
      phone: address.phone,
      address: address.address,
      isDefault: address.isDefault,
      type: address.type,
    });
    setShowAddDialog(true);
  };

  const handleUpdateAddress = () => {
    if (!editingAddress) return;

    // If setting as default, remove default from others
    if (formData.isDefault) {
      setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })));
    }

    setAddresses(prev =>
      prev.map(addr =>
        addr.id === editingAddress.id
          ? { ...addr, ...formData }
          : addr
      )
    );

    setShowAddDialog(false);
    setEditingAddress(null);
    resetForm();
    toast.success('Address updated successfully');
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
    toast.success('Address deleted successfully');
  };

  const handleSetDefault = (id: string) => {
    setAddresses(prev =>
      prev.map(addr => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    toast.success('Default address updated');
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home className="w-5 h-5" />;
      case 'work':
        return <Building2 className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  const AddressCard = ({ address, index }: { address: Address; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="overflow-hidden" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                {getAddressIcon(address.type)}
              </div>
              <div>
                <h4 className="text-gray-900">{address.name}</h4>
                {address.isDefault && (
                  <div className="flex items-center gap-1 mt-1">
                    <Check className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-600">Default Address</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEditAddress(address)}
                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <Edit2 className="w-4 h-4 text-gray-600" />
              </button>
              {!address.isDefault && (
                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              )}
            </div>
          </div>

          {/* Address Details */}
          <div className="space-y-2 mb-3">
            <div>
              <p className="text-xs text-gray-500">Recipient</p>
              <p className="text-sm text-gray-900">{address.recipient}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="text-sm text-gray-900">{address.phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Address</p>
              <p className="text-sm text-gray-900">{address.address}</p>
            </div>
          </div>

          {/* Set Default Button */}
          {!address.isDefault && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSetDefault(address.id)}
              className="w-full"
            >
              Set as Default
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
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
          <h2 className="text-white text-xl flex-1">My Addresses</h2>
        </div>
        <p className="text-white/80 text-sm ml-13">
          Manage your delivery addresses
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-6">
        <div className="p-4 space-y-4">
          {/* Add New Address Button */}
          <button
            onClick={() => {
              resetForm();
              setEditingAddress(null);
              setShowAddDialog(true);
            }}
            className="w-full p-4 rounded-2xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Address</span>
          </button>

          {/* Address List */}
          {addresses.map((address, index) => (
            <AddressCard key={address.id} address={address} index={index} />
          ))}

          {addresses.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-gray-900 mb-2">No Addresses Yet</h3>
              <p className="text-gray-600 text-sm mb-6">
                Add your first delivery address
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Address Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
            <DialogDescription>
              {editingAddress ? 'Update your delivery address' : 'Add a new delivery address'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="address-name">Address Name *</Label>
              <Input
                id="address-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Home, Office"
              />
            </div>
            <div>
              <Label htmlFor="recipient">Recipient Name *</Label>
              <Input
                id="recipient"
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                placeholder="Full name"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+66 XX XXX XXXX"
              />
            </div>
            <div>
              <Label htmlFor="address">Address Detail *</Label>
              <textarea
                id="address"
                className="w-full min-h-[100px] p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address, building, floor, etc."
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="default"
                checked={formData.isDefault}
                onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked as boolean })}
              />
              <Label htmlFor="default" className="text-sm cursor-pointer">
                Set as default address
              </Label>
            </div>
            <Button
              onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
              className="w-full"
              style={{ backgroundColor: '#2E5BFF' }}
              disabled={!formData.name || !formData.recipient || !formData.phone || !formData.address}
            >
              {editingAddress ? 'Update Address' : 'Add Address'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
