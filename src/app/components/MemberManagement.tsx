import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Search, Download, Upload, Eye, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { mockMembers, type Member } from './memberData';

const tierColors = {
  Platinum: 'bg-gradient-to-r from-gray-400 to-gray-600 text-white',
  Gold: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
  Silver: 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900',
  Bronze: 'bg-gradient-to-r from-orange-400 to-orange-600 text-white',
};

const platformIcons = {
  LINE: '💬',
  Facebook: '👤',
  Instagram: '📷',
  TikTok: '🎵',
  'In-store': '🏪'
};

const ITEMS_PER_PAGE = 10;

interface MemberManagementProps {
  onViewDetail: (memberId: string) => void;
}

export default function MemberManagement({ onViewDetail }: MemberManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<keyof Member | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Filter members
  const filteredMembers = mockMembers.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm) ||
      member.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = tierFilter === 'all' || member.tier === tierFilter;
    const matchesPlatform = platformFilter === 'all' || member.platform === platformFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const joinDate = new Date(member.joinDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - joinDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (dateFilter === 'week' && diffDays > 7) matchesDate = false;
      if (dateFilter === 'month' && diffDays > 30) matchesDate = false;
      if (dateFilter === 'quarter' && diffDays > 90) matchesDate = false;
    }
    
    return matchesSearch && matchesTier && matchesPlatform && matchesDate;
  });

  // Sort members
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedMembers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMembers = sortedMembers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSort = (column: keyof Member) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleExport = () => {
    setShowExportDialog(true);
    setTimeout(() => {
      setShowExportDialog(false);
      toast.success(`Exported ${filteredMembers.length} members to CSV`);
    }, 1500);
  };

  const handleImport = () => {
    setShowImportDialog(true);
  };

  const confirmImport = () => {
    setShowImportDialog(false);
    toast.success('Successfully imported 150 new members from Excel file');
  };

  const handleViewMember = (member: Member) => {
    onViewDetail(member.id);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-[#007AFF] to-[#0051D5] rounded-xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-white">Member Management</h2>
            <p className="text-blue-50 mt-1">Manage all members, view details, and analyze member data</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleExport}
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={handleImport}
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, phone, or ID..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            
            <Select value={tierFilter} onValueChange={(value) => {
              setTierFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="Platinum">Platinum</SelectItem>
                <SelectItem value="Gold">Gold</SelectItem>
                <SelectItem value="Silver">Silver</SelectItem>
                <SelectItem value="Bronze">Bronze</SelectItem>
              </SelectContent>
            </Select>

            <Select value={platformFilter} onValueChange={(value) => {
              setPlatformFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="LINE">LINE</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="TikTok">TikTok</SelectItem>
                <SelectItem value="In-store">In-store</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={(value) => {
              setDateFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Join Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="quarter">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center gap-2">
                      Member ID
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Name
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('tier')}
                  >
                    <div className="flex items-center gap-2">
                      Tier
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('joinDate')}
                  >
                    <div className="flex items-center gap-2">
                      Join Date
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('points')}
                  >
                    <div className="flex items-center gap-2">
                      Points
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {paginatedMembers.map((member) => (
                    <motion.tr
                      key={member.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleViewMember(member)}
                    >
                      <TableCell>
                        <span className="text-[#007AFF]">{member.id}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gradient-to-br from-[#007AFF] to-[#0051D5] text-white text-xs">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-gray-900">{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{member.email}</TableCell>
                      <TableCell className="text-gray-600">{member.phone}</TableCell>
                      <TableCell>
                        <Badge className={`${tierColors[member.tier]} border-0`}>
                          {member.tier}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">{member.joinDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          <span>{platformIcons[member.platform]}</span>
                          {member.platform}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-[#FBBF24]">{member.points.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewMember(member);
                          }}
                          className="hover:bg-[#007AFF] hover:text-white hover:border-[#007AFF]"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-6">
              <p className="text-gray-600">
                Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredMembers.length)} of {filteredMembers.length} members
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={i}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={currentPage === pageNum ? 'bg-[#007AFF] hover:bg-[#0051D5]' : ''}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exporting Members</DialogTitle>
            <DialogDescription>
              Please wait while we prepare your CSV file...
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Download className="w-12 h-12 text-[#007AFF]" />
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Members from Excel</DialogTitle>
            <DialogDescription>
              Upload an Excel file containing member information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#007AFF] transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-900">Click to upload or drag and drop</p>
              <p className="text-gray-500 text-sm mt-1">Excel files (.xlsx, .xls)</p>
            </div>
            <p className="text-gray-500 text-sm">
              Sample file format: Member ID, Name, Email, Phone, Tier, Platform
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmImport} className="bg-[#007AFF] hover:bg-[#0051D5]">
              Import Members
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
