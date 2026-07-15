export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
  joinDate: string;
  platform: 'LINE' | 'Facebook' | 'Instagram' | 'TikTok' | 'In-store';
  points: number;
  status: 'Active' | 'Inactive';
  address?: string;
  campaigns: Array<{ id: number; name: string; joinDate: string; status: string; points: number }>;
  rewards: Array<{ id: number; name: string; points: number; date: string; status: string }>;
  feedbacks: Array<{ id: number; campaign: string; rating: number; text: string; date: string }>;
  activity: Array<{ month: string; points: number }>;
  totalEarned: number;
  totalUsed: number;
  totalExpired: number;
}

export const mockMembers: Member[] = [
  { 
    id: 'M001234', 
    name: 'Sarah Chen', 
    email: 'sarah.chen@email.com',
    phone: '+66 81-234-5678', 
    points: 15420, 
    tier: 'Platinum', 
    joinDate: '2023-01-15',
    platform: 'LINE',
    status: 'Active',
    address: '123 Sukhumvit Rd, Khlong Toei, Bangkok 10110',
    campaigns: [
      { id: 1, name: 'Summer Campaign 2024', joinDate: '2024-06-01', status: 'Active', points: 500 },
      { id: 2, name: 'Point Booster Q4', joinDate: '2024-10-01', status: 'Active', points: 300 },
    ],
    rewards: [
      { id: 1, name: 'iPhone 15 Pro Max', points: 5000, date: '2024-10-28', status: 'Pending' },
      { id: 2, name: 'AirPods Pro 2', points: 2500, date: '2024-09-15', status: 'Completed' },
    ],
    feedbacks: [
      { id: 1, campaign: 'Summer Campaign 2024', rating: 5, text: 'Great rewards and easy to participate!', date: '2024-10-20' },
    ],
    activity: [
      { month: 'May', points: 850 },
      { month: 'Jun', points: 1200 },
      { month: 'Jul', points: 980 },
      { month: 'Aug', points: 1500 },
      { month: 'Sep', points: 1100 },
      { month: 'Oct', points: 1350 },
    ],
    totalEarned: 25890,
    totalUsed: 10470,
    totalExpired: 0
  },
  { 
    id: 'M001235', 
    name: 'John Smith', 
    email: 'john.smith@email.com',
    phone: '+66 82-345-6789', 
    points: 8750, 
    tier: 'Gold', 
    joinDate: '2023-03-22',
    platform: 'Facebook',
    status: 'Active',
    address: '456 Rama IV Rd, Pathum Wan, Bangkok 10330',
    campaigns: [
      { id: 1, name: 'Summer Campaign 2024', joinDate: '2024-06-15', status: 'Active', points: 400 },
    ],
    rewards: [
      { id: 1, name: 'Premium Headphones', points: 3000, date: '2024-09-10', status: 'Completed' },
    ],
    feedbacks: [
      { id: 1, campaign: 'Summer Campaign 2024', rating: 4, text: 'Good experience overall', date: '2024-09-25' },
    ],
    activity: [
      { month: 'May', points: 650 },
      { month: 'Jun', points: 900 },
      { month: 'Jul', points: 750 },
      { month: 'Aug', points: 1100 },
      { month: 'Sep', points: 950 },
      { month: 'Oct', points: 1200 },
    ],
    totalEarned: 18750,
    totalUsed: 10000,
    totalExpired: 0
  },
  { 
    id: 'M001236', 
    name: 'Emily Wong', 
    email: 'emily.wong@email.com',
    phone: '+66 83-456-7890', 
    points: 5230, 
    tier: 'Silver', 
    joinDate: '2023-06-10',
    platform: 'Instagram',
    status: 'Active',
    address: '789 Silom Rd, Bang Rak, Bangkok 10500',
    campaigns: [
      { id: 1, name: 'Holiday Lucky Draw', joinDate: '2024-08-01', status: 'Active', points: 250 },
    ],
    rewards: [
      { id: 1, name: 'Shopping Voucher', points: 1500, date: '2024-08-15', status: 'Completed' },
    ],
    feedbacks: [],
    activity: [
      { month: 'May', points: 450 },
      { month: 'Jun', points: 600 },
      { month: 'Jul', points: 550 },
      { month: 'Aug', points: 800 },
      { month: 'Sep', points: 650 },
      { month: 'Oct', points: 750 },
    ],
    totalEarned: 12500,
    totalUsed: 7270,
    totalExpired: 0
  },
  { 
    id: 'M001237', 
    name: 'Michael Lee', 
    email: 'michael.lee@email.com',
    phone: '+66 84-567-8901', 
    points: 12890, 
    tier: 'Gold', 
    joinDate: '2023-02-28',
    platform: 'TikTok',
    status: 'Active',
    address: '321 Asoke Rd, Watthana, Bangkok 10110',
    campaigns: [
      { id: 1, name: 'Summer Campaign 2024', joinDate: '2024-06-10', status: 'Active', points: 600 },
      { id: 2, name: 'VIP Exclusive Rewards', joinDate: '2024-09-01', status: 'Active', points: 450 },
    ],
    rewards: [
      { id: 1, name: 'Smart Watch', points: 4000, date: '2024-07-20', status: 'Completed' },
      { id: 2, name: 'Dining Voucher', points: 800, date: '2024-09-05', status: 'Completed' },
    ],
    feedbacks: [
      { id: 1, campaign: 'Summer Campaign 2024', rating: 5, text: 'Excellent campaign with great rewards!', date: '2024-07-25' },
    ],
    activity: [
      { month: 'May', points: 1050 },
      { month: 'Jun', points: 1350 },
      { month: 'Jul', points: 1220 },
      { month: 'Aug', points: 1580 },
      { month: 'Sep', points: 1450 },
      { month: 'Oct', points: 1680 },
    ],
    totalEarned: 32150,
    totalUsed: 19260,
    totalExpired: 0
  },
  { 
    id: 'M001238', 
    name: 'Lisa Anderson', 
    email: 'lisa.anderson@email.com',
    phone: '+66 85-678-9012', 
    points: 3150, 
    tier: 'Bronze', 
    joinDate: '2024-05-18',
    platform: 'LINE',
    status: 'Active',
    address: '654 Phaya Thai Rd, Ratchathewi, Bangkok 10400',
    campaigns: [
      { id: 1, name: 'New Member Welcome', joinDate: '2024-05-18', status: 'Completed', points: 200 },
    ],
    rewards: [
      { id: 1, name: 'Welcome Gift', points: 500, date: '2024-05-20', status: 'Completed' },
    ],
    feedbacks: [],
    activity: [
      { month: 'May', points: 300 },
      { month: 'Jun', points: 450 },
      { month: 'Jul', points: 400 },
      { month: 'Aug', points: 550 },
      { month: 'Sep', points: 500 },
      { month: 'Oct', points: 600 },
    ],
    totalEarned: 4500,
    totalUsed: 1350,
    totalExpired: 0
  },
  { 
    id: 'M001239', 
    name: 'David Kim', 
    email: 'david.kim@email.com',
    phone: '+66 86-789-0123', 
    points: 950, 
    tier: 'Bronze', 
    joinDate: '2024-09-12',
    platform: 'In-store',
    status: 'Inactive',
    address: '987 Vibhavadi Rangsit Rd, Chatuchak, Bangkok 10900',
    campaigns: [],
    rewards: [],
    feedbacks: [],
    activity: [
      { month: 'Sep', points: 150 },
      { month: 'Oct', points: 180 },
    ],
    totalEarned: 1250,
    totalUsed: 300,
    totalExpired: 0
  },
];

export const getMemberById = (id: string | null): Member | null => {
  if (!id) return null;
  return mockMembers.find(member => member.id === id) || null;
};
