import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { 
  MessageCircle, Send, Smile, Paperclip, Search, Download,
  UserX, CheckCircle, Clock, Minus
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';

interface Customer {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  status: 'online' | 'offline';
  unread: number;
  rank: string;
  rankColor: string;
  channel: 'LINE' | 'Facebook' | 'Website';
  channelIcon: string;
}

interface Message {
  id: string;
  sender: 'agent' | 'customer';
  text: string;
  timestamp: string;
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: 'SC',
    lastMessage: 'Thank you for the help!',
    timestamp: '2 min ago',
    status: 'online',
    unread: 2,
    rank: 'Platinum',
    rankColor: '#E5E7EB',
    channel: 'LINE',
    channelIcon: '💚'
  },
  {
    id: '2',
    name: 'John Smith',
    avatar: 'JS',
    lastMessage: 'Is my order ready for pickup?',
    timestamp: '15 min ago',
    status: 'online',
    unread: 1,
    rank: 'Gold',
    rankColor: '#FBBF24',
    channel: 'Facebook',
    channelIcon: '👤'
  },
  {
    id: '3',
    name: 'Emma Wilson',
    avatar: 'EW',
    lastMessage: 'Great! I received my reward.',
    timestamp: '1 hour ago',
    status: 'offline',
    unread: 0,
    rank: 'Silver',
    rankColor: '#9CA3AF',
    channel: 'Website',
    channelIcon: '🌐'
  },
  {
    id: '4',
    name: 'Michael Brown',
    avatar: 'MB',
    lastMessage: 'How do I redeem my points?',
    timestamp: '2 hours ago',
    status: 'offline',
    unread: 0,
    rank: 'Bronze',
    rankColor: '#CD7F32',
    channel: 'LINE',
    channelIcon: '💚'
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    avatar: 'LA',
    lastMessage: 'Thank you so much!',
    timestamp: '3 hours ago',
    status: 'offline',
    unread: 0,
    rank: 'Gold',
    rankColor: '#FBBF24',
    channel: 'Facebook',
    channelIcon: '👤'
  },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    { id: 'm1', sender: 'customer', text: 'Hello! I have a question about my points.', timestamp: '10:30 AM' },
    { id: 'm2', sender: 'agent', text: 'Hello Sarah! I\'d be happy to help you with that.', timestamp: '10:31 AM' },
    { id: 'm3', sender: 'customer', text: 'How can I redeem my points?', timestamp: '10:32 AM' },
    { id: 'm4', sender: 'agent', text: 'You can redeem your points in the Rewards section of the app. Just select the reward you want and click redeem!', timestamp: '10:33 AM' },
    { id: 'm5', sender: 'customer', text: 'Thank you for the help!', timestamp: '10:35 AM' },
  ],
  '2': [
    { id: 'm6', sender: 'customer', text: 'Hi, I placed an order yesterday.', timestamp: '9:45 AM' },
    { id: 'm7', sender: 'agent', text: 'Hello John! Let me check the status for you.', timestamp: '9:46 AM' },
    { id: 'm8', sender: 'customer', text: 'Is my order ready for pickup?', timestamp: '10:00 AM' },
  ],
};

export default function ChatCenter() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(mockCustomers[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages['1']);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline'>('all');
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [customerToBlock, setCustomerToBlock] = useState<Customer | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setMessages(mockMessages[customer.id] || []);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedCustomer) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'agent',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, message]);
    setNewMessage('');
    scrollToBottom();
  };

  const handleExportChat = () => {
    toast.success('Chat exported successfully!', {
      description: 'CSV file has been downloaded'
    });
  };

  const handleBlockAccount = (customer: Customer) => {
    setCustomerToBlock(customer);
    setShowBlockDialog(true);
  };

  const confirmBlockAccount = () => {
    if (customerToBlock) {
      toast.success(`${customerToBlock.name} has been blocked`, {
        description: 'User will no longer be able to send messages'
      });
      setShowBlockDialog(false);
      setCustomerToBlock(null);
    }
  };

  const handleMarkAsSolved = () => {
    if (selectedCustomer) {
      toast.success('Conversation marked as solved!', {
        description: 'Chat has been archived'
      });
    }
  };

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#007AFF] to-[#0051D5] rounded-xl p-6 text-white shadow-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <MessageCircle className="w-6 h-6" />
              <h2 className="text-white">Chat Center</h2>
            </div>
            <p className="text-blue-50">Manage customer conversations and support inquiries</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleExportChat}
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Chat
            </Button>
          </div>
        </div>
      </div>

      {/* Split View */}
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-280px)]">
        {/* Left Panel - Customer List */}
        <div className="col-span-4">
          <Card className="h-full flex flex-col">
            <CardHeader className="border-b">
              <div className="space-y-4">
                <CardTitle>Conversations</CardTitle>
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search customers..."
                    className="pl-10"
                  />
                </div>

                {/* Filter */}
                <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="online">Online Only</SelectItem>
                    <SelectItem value="offline">Offline Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {filteredCustomers.map((customer) => (
                  <motion.div
                    key={customer.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => handleSelectCustomer(customer)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedCustomer?.id === customer.id
                        ? 'bg-blue-50 border-2 border-[#007AFF]'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-400 text-white">
                            {customer.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          customer.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-gray-900 truncate">{customer.name}</p>
                          <span className="text-xs text-gray-500">{customer.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate mb-2">{customer.lastMessage}</p>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className="text-xs"
                            style={{ backgroundColor: customer.rankColor + '20', borderColor: customer.rankColor }}
                          >
                            {customer.rank}
                          </Badge>
                          <span className="text-xs">{customer.channelIcon} {customer.channel}</span>
                        </div>
                      </div>
                      
                      {customer.unread > 0 && (
                        <Badge className="bg-red-500">{customer.unread}</Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Right Panel - Chat Window */}
        <div className="col-span-8">
          <Card className="h-full flex flex-col">
            {selectedCustomer ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-400 text-white">
                            {selectedCustomer.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          selectedCustomer.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-gray-900">{selectedCustomer.name}</h3>
                          <Badge variant="outline" style={{ backgroundColor: selectedCustomer.rankColor + '20' }}>
                            {selectedCustomer.rank}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-500">{selectedCustomer.channelIcon} {selectedCustomer.channel}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className={`text-xs ${selectedCustomer.status === 'online' ? 'text-green-600' : 'text-gray-400'}`}>
                            {selectedCustomer.status === 'online' ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleMarkAsSolved}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Solved
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBlockAccount(selectedCustomer)}
                      >
                        <UserX className="w-4 h-4 mr-2 text-red-600" />
                        Block Account
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Chat Messages */}
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-4">
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex ${message.sender === 'agent' ? 'justify-start' : 'justify-end'}`}
                        >
                          <div className={`flex gap-3 max-w-[70%] ${message.sender === 'customer' ? 'flex-row-reverse' : ''}`}>
                            {message.sender === 'agent' && (
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-[#007AFF] text-white text-xs">
                                  AD
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div>
                              <div
                                className={`p-3 rounded-lg ${
                                  message.sender === 'agent'
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'bg-[#007AFF] text-white'
                                }`}
                              >
                                <p className="text-sm">{message.text}</p>
                              </div>
                              <p className={`text-xs text-gray-400 mt-1 ${message.sender === 'customer' ? 'text-right' : ''}`}>
                                {message.timestamp}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex items-end gap-2">
                    <Button variant="outline" size="icon">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Smile className="w-4 h-4" />
                    </Button>
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="bg-[#007AFF] hover:bg-[#0051D5]"
                      disabled={!newMessage.trim()}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600">Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Block Account Dialog */}
      <AlertDialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Block this user?</AlertDialogTitle>
            <AlertDialogDescription>
              {customerToBlock && (
                <>
                  Are you sure you want to block <strong>{customerToBlock.name}</strong>? 
                  This user will no longer be able to send messages or interact with your support team.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBlockAccount} className="bg-red-600 hover:bg-red-700">
              Block User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
