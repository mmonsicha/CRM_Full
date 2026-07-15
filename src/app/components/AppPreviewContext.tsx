import { createContext, useContext, useState, ReactNode } from 'react';

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  enabled: boolean;
  order: number;
}

export interface Banner {
  id: string;
  image: string;
  title: string;
  linkType: 'event' | 'promotion' | 'external';
  linkId?: string;
  order: number;
  enabled: boolean;
}

export interface BottomNavItem {
  id: string;
  label: string;
  icon: string;
  enabled: boolean;
  order: number;
  hidden?: boolean; // For demo purposes
}

export interface LandingSection {
  id: string;
  type: 'banner' | 'quickActions' | 'promotions' | 'featuredEvents' | 'buttons' | 'cardContent';
  label: string;
  enabled: boolean;
  order: number;
}

export interface ThemeConfig {
  preset: 'default' | 'festival' | 'minimal' | 'premium';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  cardBackground: string;
  textColor: string;
  iconStyle: 'filled' | 'outlined';
}

export interface CampaignVisibilityRule {
  campaignId: string;
  visibilityMode: 'all' | 'segments' | 'exclude';
  segments: string[];
  startDate?: string;
  endDate?: string;
}

interface AppPreviewContextType {
  // Theme
  theme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
  
  // Landing Page
  landingSections: LandingSection[];
  setLandingSections: (sections: LandingSection[]) => void;
  reorderLandingSections: (startIndex: number, endIndex: number) => void;
  toggleLandingSection: (id: string) => void;
  
  // Bottom Navigation
  bottomNav: BottomNavItem[];
  setBottomNav: (nav: BottomNavItem[]) => void;
  activeBottomTab: string;
  setActiveBottomTab: (tab: string) => void;
  
  // Quick Actions
  quickActions: QuickAction[];
  setQuickActions: (actions: QuickAction[]) => void;
  reorderQuickActions: (startIndex: number, endIndex: number) => void;
  toggleQuickAction: (id: string) => void;
  
  // Banners
  banners: Banner[];
  setBanners: (banners: Banner[]) => void;
  currentBannerIndex: number;
  setCurrentBannerIndex: (index: number) => void;
  
  // Campaign Visibility
  campaignVisibility: CampaignVisibilityRule[];
  setCampaignVisibility: (rules: CampaignVisibilityRule[]) => void;
  
  // Current User Segment (for preview)
  currentUserSegment: string;
  setCurrentUserSegment: (segment: string) => void;
  
  // Current User Tier (for preview)
  currentUserTier: string;
  setCurrentUserTier: (tier: string) => void;
  
  // Preview Mode
  previewMode: boolean;
  setPreviewMode: (mode: boolean) => void;
  
  // Mobile Navigation
  currentMobileScreen: string;
  setCurrentMobileScreen: (screen: string) => void;
  mobileScreenStack: string[];
  pushMobileScreen: (screen: string) => void;
  popMobileScreen: () => void;
}

const AppPreviewContext = createContext<AppPreviewContextType | undefined>(undefined);

export const useAppPreview = () => {
  const context = useContext(AppPreviewContext);
  if (!context) {
    throw new Error('useAppPreview must be used within AppPreviewProvider');
  }
  return context;
};

export const AppPreviewProvider = ({ children }: { children: ReactNode }) => {
  // Theme State
  const [theme, setTheme] = useState<ThemeConfig>({
    preset: 'default',
    primaryColor: '#007AFF',
    secondaryColor: '#0051D5',
    accentColor: '#FF9500',
    backgroundColor: '#F5F5F7',
    cardBackground: '#FFFFFF',
    textColor: '#1C1C1E',
    iconStyle: 'filled',
  });

  // Landing Page Sections
  const [landingSections, setLandingSections] = useState<LandingSection[]>([
    { id: 'banner', type: 'banner', label: 'Hero Banner', enabled: true, order: 0 },
    { id: 'quickActions', type: 'quickActions', label: 'Quick Actions', enabled: true, order: 1 },
    { id: 'promotions', type: 'promotions', label: 'Promotions', enabled: true, order: 2 },
    { id: 'featuredEvents', type: 'featuredEvents', label: 'Featured Events', enabled: true, order: 3 },
    { id: 'buttons', type: 'buttons', label: 'Action Buttons', enabled: true, order: 4 },
    { id: 'cardContent', type: 'cardContent', label: 'Card Content', enabled: true, order: 5 },
  ]);

  // Bottom Navigation
  const [bottomNav, setBottomNav] = useState<BottomNavItem[]>([
    { id: 'home', label: 'Home', icon: 'Home', enabled: true, order: 0 },
    { id: 'events', label: 'Events', icon: 'Calendar', enabled: true, order: 1 },
    { id: 'scan', label: 'Scan', icon: 'ScanLine', enabled: true, order: 2 },
    { id: 'redeem', label: 'Redeem', icon: 'Gift', enabled: true, order: 3 },
    { id: 'profile', label: 'Profile', icon: 'User', enabled: true, order: 4 },
  ]);
  const [activeBottomTab, setActiveBottomTab] = useState('home');

  // Quick Actions
  const [quickActions, setQuickActions] = useState<QuickAction[]>([
    { id: 'qr', label: 'QR Code', icon: 'QrCode', enabled: true, order: 0 },
    { id: 'points', label: 'Points', icon: 'Coins', enabled: true, order: 1 },
    { id: 'rewards', label: 'Rewards', icon: 'Gift', enabled: true, order: 2 },
    { id: 'events', label: 'Events', icon: 'Calendar', enabled: true, order: 3 },
  ]);

  // Banners
  const [banners, setBanners] = useState<Banner[]>([
    {
      id: 'banner1',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
      title: 'Summer Shopping Festival',
      linkType: 'event',
      linkId: 'event1',
      order: 0,
      enabled: true,
    },
    {
      id: 'banner2',
      image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800',
      title: 'VIP Exclusive Rewards',
      linkType: 'promotion',
      linkId: 'promo1',
      order: 1,
      enabled: true,
    },
    {
      id: 'banner3',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800',
      title: 'Flash Sale - 50% OFF',
      linkType: 'event',
      linkId: 'event2',
      order: 2,
      enabled: true,
    },
  ]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Campaign Visibility
  const [campaignVisibility, setCampaignVisibility] = useState<CampaignVisibilityRule[]>([]);

  // Current User State (for preview)
  const [currentUserSegment, setCurrentUserSegment] = useState('SEG001'); // VIP Customers
  const [currentUserTier, setCurrentUserTier] = useState('GOLD');

  // Preview Mode
  const [previewMode, setPreviewMode] = useState(false);

  // Mobile Navigation
  const [currentMobileScreen, setCurrentMobileScreen] = useState('home');
  const [mobileScreenStack, setMobileScreenStack] = useState<string[]>(['home']);

  const reorderLandingSections = (startIndex: number, endIndex: number) => {
    const result = Array.from(landingSections);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    
    const reordered = result.map((section, index) => ({
      ...section,
      order: index,
    }));
    
    setLandingSections(reordered);
  };

  const toggleLandingSection = (id: string) => {
    setLandingSections(
      landingSections.map(section =>
        section.id === id ? { ...section, enabled: !section.enabled } : section
      )
    );
  };

  const reorderQuickActions = (startIndex: number, endIndex: number) => {
    const result = Array.from(quickActions);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    
    const reordered = result.map((action, index) => ({
      ...action,
      order: index,
    }));
    
    setQuickActions(reordered);
  };

  const toggleQuickAction = (id: string) => {
    setQuickActions(
      quickActions.map(action =>
        action.id === id ? { ...action, enabled: !action.enabled } : action
      )
    );
  };

  const pushMobileScreen = (screen: string) => {
    setMobileScreenStack([...mobileScreenStack, screen]);
    setCurrentMobileScreen(screen);
  };

  const popMobileScreen = () => {
    if (mobileScreenStack.length > 1) {
      const newStack = [...mobileScreenStack];
      newStack.pop();
      setMobileScreenStack(newStack);
      setCurrentMobileScreen(newStack[newStack.length - 1]);
    }
  };

  return (
    <AppPreviewContext.Provider
      value={{
        theme,
        setTheme,
        landingSections,
        setLandingSections,
        reorderLandingSections,
        toggleLandingSection,
        bottomNav,
        setBottomNav,
        activeBottomTab,
        setActiveBottomTab,
        quickActions,
        setQuickActions,
        reorderQuickActions,
        toggleQuickAction,
        banners,
        setBanners,
        currentBannerIndex,
        setCurrentBannerIndex,
        campaignVisibility,
        setCampaignVisibility,
        currentUserSegment,
        setCurrentUserSegment,
        currentUserTier,
        setCurrentUserTier,
        previewMode,
        setPreviewMode,
        currentMobileScreen,
        setCurrentMobileScreen,
        mobileScreenStack,
        pushMobileScreen,
        popMobileScreen,
      }}
    >
      {children}
    </AppPreviewContext.Provider>
  );
};