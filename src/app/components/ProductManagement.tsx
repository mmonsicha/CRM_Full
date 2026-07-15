import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Package, Plus, AlertCircle, TrendingUp, DollarSign } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const products = [
  { id: 1, name: 'Premium Coffee Beans', sku: 'PRD-001', category: 'Food & Beverage', stock: 245, sales: 1847, price: 29.99, status: 'Active', reward: true },
  { id: 2, name: 'Eco-Friendly Tote Bag', sku: 'PRD-002', category: 'Accessories', stock: 12, sales: 523, price: 15.99, status: 'Low Stock', reward: true },
  { id: 3, name: 'Wireless Earbuds', sku: 'PRD-003', category: 'Electronics', stock: 0, sales: 2156, price: 89.99, status: 'Out of Stock', reward: false },
  { id: 4, name: 'Organic Green Tea', sku: 'PRD-004', category: 'Food & Beverage', stock: 567, sales: 3421, price: 12.99, status: 'Active', reward: true },
  { id: 5, name: 'Yoga Mat Premium', sku: 'PRD-005', category: 'Sports', stock: 198, sales: 892, price: 45.99, status: 'Active', reward: false },
  { id: 6, name: 'Skincare Gift Set', sku: 'PRD-006', category: 'Beauty', stock: 89, sales: 1234, price: 79.99, status: 'Active', reward: true },
];

export default function ProductManagement() {
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<typeof products[0] | null>(null);
  const [useAsReward, setUseAsReward] = useState(false);
  const [taxInvoice, setTaxInvoice] = useState(false);

  const handleSaveProduct = () => {
    toast.success(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
    setShowProductDialog(false);
    setEditingProduct(null);
    setUseAsReward(false);
    setTaxInvoice(false);
  };

  const handleEditProduct = (product: typeof products[0]) => {
    setEditingProduct(product);
    setUseAsReward(product.reward);
    setShowProductDialog(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-gray-900">Product Management</h2>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <Button onClick={() => setShowProductDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{products.length}</div>
            <div className="text-gray-500 mt-1">In inventory</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{products.filter(p => p.status === 'Low Stock').length}</div>
            <div className="text-orange-600 mt-1">Need reorder</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{products.reduce((sum, p) => sum + p.sales, 0).toLocaleString()}</div>
            <div className="text-green-600 mt-1">+12% this month</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">
              ${(products.reduce((sum, p) => sum + (p.sales * p.price), 0) / 1000).toFixed(1)}K
            </div>
            <div className="text-gray-500 mt-1">Total value</div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Stock Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {products.filter(p => p.stock < 50).map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg"
              >
                <div className="flex-1">
                  <div className="text-gray-900">{product.name}</div>
                  <div className="text-gray-600 mt-1">
                    SKU: {product.sku} • Stock: {product.stock} units
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Reorder
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Products</CardTitle>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                  <SelectItem value="reward">Reward Items</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Reward Item</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50">
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    <code className="bg-gray-100 px-2 py-1 rounded text-gray-900">
                      {product.sku}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        product.stock === 0
                          ? 'text-red-600'
                          : product.stock < 50
                          ? 'text-orange-600'
                          : 'text-gray-900'
                      }
                    >
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-900">${product.price}</TableCell>
                  <TableCell className="text-gray-600">{product.sales.toLocaleString()}</TableCell>
                  <TableCell>
                    {product.reward ? (
                      <Badge variant="default">Yes</Badge>
                    ) : (
                      <Badge variant="secondary">No</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === 'Active'
                          ? 'default'
                          : product.status === 'Low Stock'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditProduct(product)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Product Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Product Name</Label>
                <Input
                  placeholder="e.g., Premium Coffee Beans"
                  defaultValue={editingProduct?.name}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>SKU</Label>
                <Input
                  placeholder="e.g., PRD-001"
                  defaultValue={editingProduct?.sku}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Describe your product..."
                rows={3}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Product Image</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <div className="text-gray-600">Click to upload or drag and drop</div>
                <div className="text-gray-500 mt-1">PNG, JPG up to 5MB</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select defaultValue={editingProduct?.category}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Beauty">Beauty</SelectItem>
                    <SelectItem value="Home">Home</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Stock</Label>
                <Input
                  type="number"
                  placeholder="e.g., 100"
                  defaultValue={editingProduct?.stock}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 29.99"
                  defaultValue={editingProduct?.price}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Points Required (if reward)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 500"
                  className="mt-2"
                />
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Use as Reward</Label>
                  <p className="text-gray-500 mt-1">Allow members to redeem with points</p>
                </div>
                <Switch checked={useAsReward} onCheckedChange={setUseAsReward} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Tax Invoice Available</Label>
                  <p className="text-gray-500 mt-1">Provide tax invoice for purchases</p>
                </div>
                <Switch checked={taxInvoice} onCheckedChange={setTaxInvoice} />
              </div>
            </div>

            <div>
              <Label>Stock Alert Threshold</Label>
              <Input type="number" placeholder="e.g., 20" className="mt-2" />
              <p className="text-gray-500 mt-1">Get notified when stock falls below this amount</p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowProductDialog(false);
                  setEditingProduct(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleSaveProduct} className="flex-1">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
