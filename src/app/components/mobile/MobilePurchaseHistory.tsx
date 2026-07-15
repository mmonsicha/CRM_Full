import { ArrowLeft, ShoppingBag, Star, FileText, RotateCcw, AlertCircle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import MobileBottomNav, { MobileScreen } from './MobileBottomNav';
import { useAppContext } from './MobileAppContainerEnhanced';
import { toast } from 'sonner@2.0.3';

interface MobilePurchaseHistoryProps {
  onNavigate: (screen: MobileScreen, data?: any) => void;
}

const purchases = [
  {
    id: 1,
    orderNumber: 'ORD2025060001',
    date: '2025-06-04',
    items: [
      { name: 'Premium Coffee Set', quantity: 1, price: 1500 }
    ],
    total: 1500,
    status: 'Delivered',
    canReview: true,
    canRequestInvoice: true,
    reviewSubmitted: false,
  },
  {
    id: 2,
    orderNumber: 'ORD2025060002',
    date: '2025-06-02',
    items: [
      { name: 'Wellness Package', quantity: 1, price: 2500 },
      { name: 'Aromatherapy Candles', quantity: 2, price: 400 }
    ],
    total: 3300,
    status: 'Delivered',
    canReview: true,
    canRequestInvoice: true,
    reviewSubmitted: true,
  },
  {
    id: 3,
    orderNumber: 'ORD2025050015',
    date: '2025-05-10',
    items: [
      { name: 'Tech Gadget Bundle', quantity: 1, price: 8500 }
    ],
    total: 8500,
    status: 'Delivered',
    canReview: false,
    canRequestInvoice: false,
    reviewSubmitted: false,
  },
];

export default function MobilePurchaseHistory({ onNavigate }: MobilePurchaseHistoryProps) {
  const { theme } = useAppContext();

  const handleWriteReview = (purchase: any) => {
    onNavigate('reviews', { purchase, mode: 'create' });
  };

  const handleRequestInvoice = (purchase: any) => {
    if (!purchase.canRequestInvoice) {
      toast.error('Invoice request period expired', {
        description: 'Tax invoices can only be requested within 1 month of purchase',
      });
      return;
    }
    toast.success('Invoice requested successfully', {
      description: 'Your tax invoice will be sent to your email',
    });
  };

  const handleBuyAgain = (purchase: any) => {
    toast.success('Items added to cart', {
      description: 'Redirecting to checkout...',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'In Transit':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div 
        className="text-white px-6 pt-6 pb-4"
        style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
      >
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-white text-xl">Purchase History</h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 pb-20">
        {purchases.map((purchase) => (
          <Card key={purchase.id} className="mb-4 overflow-hidden">
            <div className="p-4">
              {/* Order Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order #{purchase.orderNumber}</p>
                  <p className="text-xs text-gray-500">{purchase.date}</p>
                </div>
                <Badge className={`${getStatusColor(purchase.status)} border`}>
                  {purchase.status}
                </Badge>
              </div>

              {/* Items */}
              <div className="space-y-2 mb-4">
                {purchase.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex-1">
                      <p className="text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-gray-900">฿{item.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between mb-4 pt-3 border-t border-gray-100">
                <p className="text-gray-900">Total</p>
                <p className="text-xl" style={{ color: theme.primary }}>
                  ฿{purchase.total.toLocaleString()}
                </p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-3 gap-2">
                {purchase.canReview && !purchase.reviewSubmitted && (
                  <Button
                    onClick={() => handleWriteReview(purchase)}
                    variant="outline"
                    size="sm"
                    className="flex flex-col items-center gap-1 h-auto py-3"
                  >
                    <Star className="w-4 h-4" />
                    <span className="text-xs">Review</span>
                  </Button>
                )}
                {purchase.reviewSubmitted && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="flex flex-col items-center gap-1 h-auto py-3"
                  >
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">Reviewed</span>
                  </Button>
                )}
                
                <Button
                  onClick={() => handleRequestInvoice(purchase)}
                  variant="outline"
                  size="sm"
                  disabled={!purchase.canRequestInvoice}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-xs">Invoice</span>
                  {!purchase.canRequestInvoice && (
                    <AlertCircle className="w-3 h-3 text-gray-400 absolute top-1 right-1" />
                  )}
                </Button>
                
                <Button
                  onClick={() => handleBuyAgain(purchase)}
                  variant="outline"
                  size="sm"
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="text-xs">Buy Again</span>
                </Button>
              </div>

              {!purchase.canRequestInvoice && (
                <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Tax invoice request expired (1 month limit)
                </p>
              )}
            </div>
          </Card>
        ))}

        {/* Empty State */}
        {purchases.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">No Purchase History</h3>
            <p className="text-gray-600 text-sm mb-6">
              Your purchase history will appear here
            </p>
            <Button
              onClick={() => onNavigate('promotions')}
              style={{ backgroundColor: theme.primary }}
            >
              Start Shopping
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav
        currentScreen="profile"
        onNavigate={onNavigate}
        primaryColor={theme.primary}
      />
    </div>
  );
}
