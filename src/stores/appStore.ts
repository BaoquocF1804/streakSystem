import { create } from 'zustand';
import { AppState, User, Product, Order, ShareChain, ReviewChallenge, GroupBuy, SocialCommerceNotification } from '../types';
import dayjs from 'dayjs';

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Áo thun Innovation',
    price: 299000,
    image: 'https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Áo thun chất lượng cao với thiết kế hiện đại',
    category: 'Fashion',
    rating: 4.5
  },
  {
    id: '2',
    name: 'Sách Growth Mindset',
    price: 149000,
    image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Cuốn sách về tư duy phát triển và đổi mới',
    category: 'Books',
    rating: 4.8
  },
  {
    id: '3',
    name: 'Bình nước Teko',
    price: 99000,
    image: 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Bình nước thể thao cao cấp',
    category: 'Accessories',
    rating: 4.3
  },
  {
    id: '4',
    name: 'Laptop Stand',
    price: 450000,
    image: 'https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg?auto=compress&cs=tinysrgb&w=400',
    description: 'Giá đỡ laptop ergonomic',
    category: 'Tech',
    rating: 4.7
  },
  {
    id: '5',
    name: 'Coffee Mug',
    price: 79000,
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Cốc cà phê ceramic cao cấp',
    category: 'Accessories',
    rating: 4.2
  },
  {
    id: '6',
    name: 'Notebook Set',
    price: 120000,
    image: 'https://images.pexels.com/photos/1925536/pexels-photo-1925536.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Bộ sổ tay ghi chú chuyên nghiệp',
    category: 'Stationery',
    rating: 4.4
  }
];

const mockOrders: Order[] = [
  {
    id: 'order-001',
    productId: '1',
    productName: 'Áo thun Innovation',
    price: 299000,
    date: '2025-01-12',
    status: 'completed',
    contributeToStreak: true
  },
  {
    id: 'order-002',
    productId: '3',
    productName: 'Bình nước Teko',
    price: 99000,
    date: '2025-01-11',
    status: 'completed',
    contributeToStreak: true
  }
];

// Mock social commerce data
const mockShareChains: ShareChain[] = [
  {
    id: 'share-001',
    product: mockProducts[0],
    sharedBy: {
      id: '1',
      name: 'Nguyễn Văn A',
      email: 'a@example.com',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    sharedTo: [
      {
        id: '2',
        name: 'Trần Thị B',
        email: 'b@example.com',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
      }
    ],
    pointsEarned: 100,
    status: 'active',
    createdAt: new Date(),
    actions: []
  }
];

const mockReviewChallenges: ReviewChallenge[] = [
  {
    id: 'review-001',
    product: mockProducts[1],
    participants: [
      {
        id: '1',
        name: 'Nguyễn Văn A',
        email: 'a@example.com',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      {
        id: '2',
        name: 'Trần Thị B',
        email: 'b@example.com',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
      }
    ],
    status: 'in_progress',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    progress: [
      { userId: '1', reviewCompleted: false, imagesUploaded: 2, textLength: 150 },
      { userId: '2', reviewCompleted: true, imagesUploaded: 5, textLength: 300 }
    ],
    rewards: {
      points: 500,
      voucher: 'REVIEW20'
    }
  }
];

const mockGroupBuys: GroupBuy[] = [
  {
    id: 'group-001',
    product: mockProducts[3],
    organizer: {
      id: '1',
      name: 'Nguyễn Văn A',
      email: 'a@example.com',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    participants: [
      {
        id: '2',
        name: 'Trần Thị B',
        email: 'b@example.com',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
      }
    ],
    targetCount: 5,
    currentCount: 2,
    originalPrice: 450000,
    discountedPrice: 380000,
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: 'recruiting'
  }
];

const mockSocialNotifications: SocialCommerceNotification[] = [
  {
    id: 'notif-001',
    type: 'share_invitation',
    title: 'Lời mời chia sẻ sản phẩm',
    message: 'Bạn có lời mời chia sẻ sản phẩm mới',
    timestamp: new Date(),
    read: false
  }
];

interface AppStore extends AppState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  checkinToday: () => void;
  placeOrder: (productId: string) => void;
  claimCheckinReward: (day: number) => void;
  claimShoppingReward: (day: number) => void;
  claimWeeklyReward: (week: number) => void;
  setShowCheckinModal: (show: boolean) => void;
  checkShouldShowCheckinModal: () => boolean;
  // Social Commerce Actions
  createShareChain: (productId: string, sharedTo: string[]) => void;
  joinGroupBuy: (groupBuyId: string) => void;
  createReviewChallenge: (productId: string, participants: string[]) => void;
  markNotificationAsRead: (notificationId: string) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  products: mockProducts,
  orders: mockOrders,
  dailyCheckin: {
    currentStreak: 3,
    lastCheckin: '2025-01-12',
    totalCheckins: 15,
    rewards: [
      { day: 3, title: 'Bronze Badge', description: 'Điểm danh 3 ngày liên tiếp', claimed: true, claimedDate: '2025-01-10' },
      { day: 7, title: 'Silver Badge + Voucher 10%', description: 'Điểm danh 7 ngày liên tiếp', claimed: false },
      { day: 14, title: 'Gold Badge + Voucher 20%', description: 'Điểm danh 14 ngày liên tiếp', claimed: false },
      { day: 30, title: 'Diamond Badge + Mystery Box', description: 'Điểm danh 30 ngày liên tiếp', claimed: false }
    ]
  },
  shoppingStreak: {
    currentStreak: 2,
    lastOrder: '2025-01-12',
    totalOrders: 8,
    rewards: [
      { day: 3, title: 'Shopping Master', description: 'Mua hàng 3 ngày liên tiếp - Voucher 15%', claimed: false },
      { day: 5, title: 'Shopping Champion', description: 'Mua hàng 5 ngày liên tiếp - Free shipping', claimed: false },
      { day: 7, title: 'Shopping Legend', description: 'Mua hàng 7 ngày liên tiếp - Mystery Box', claimed: false }
    ]
  },
  weeklyStreak: {
    weekCount: 2,
    purchasesThisWeek: 2,
    targetPurchases: 3,
    badge: false,
    rewards: [
      { week: 1, title: 'Weekly Warrior', description: 'Hoàn thành mục tiêu tuần đầu', claimed: true, claimedDate: '2025-01-07' },
      { week: 2, title: 'Weekly Champion', description: 'Hoàn thành mục tiêu 2 tuần liên tiếp', claimed: false },
      { week: 4, title: 'Monthly Master', description: 'Hoàn thành mục tiêu 4 tuần liên tiếp', claimed: false }
    ]
  },
  showCheckinModal: false,
  // Social Commerce State
  shareChains: mockShareChains,
  reviewChallenges: mockReviewChallenges,
  groupBuys: mockGroupBuys,
  socialNotifications: mockSocialNotifications,
  // Game State - Will be managed by separate GameStore
  gameState: {
    games: [],
    sessions: [],
    achievements: [],
    streaks: [],
    milestones: [],
    playerLevel: {
      level: 1,
      title: 'Novice',
      description: 'Starting player',
      pointsRequired: 500,
      currentPoints: 0,
      rewards: [],
      gameUnlocks: [],
      bonusUnlocks: [],
      icon: '🌱',
      color: '#10B981'
    },
    totalPoints: 0,
    totalPlayTime: 0,
    gamesUnlocked: [],
    achievementsUnlocked: [],
    bonusesActive: [],
    currentGameStreak: 0,
    longestGameStreak: 0,
    lastActivity: '',
    multiplayerMatches: [],
    communityTrees: [],
    myTreeContributions: [],
    dailyWaterUsed: 0,
    maxDailyWater: 20
  },

  login: async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
      points: 1250,
      badges: []
    };
    
    set({ user, isAuthenticated: true });
    return true;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  register: async (email: string, password: string, name: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: '1',
      email,
      name,
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
      points: 0,
      badges: []
    };
    
    set({ user, isAuthenticated: true });
    return true;
  },

  checkinToday: () => {
    const state = get();
    const today = dayjs().format('YYYY-MM-DD');
    const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    
    let newStreak = 1;
    if (state.dailyCheckin.lastCheckin === yesterday) {
      newStreak = state.dailyCheckin.currentStreak + 1;
    } else if (state.dailyCheckin.lastCheckin === today) {
      return; // Already checked in today
    }

    set({
      dailyCheckin: {
        ...state.dailyCheckin,
        currentStreak: newStreak,
        lastCheckin: today,
        totalCheckins: state.dailyCheckin.totalCheckins + 1
      }
    });
  },

  placeOrder: (productId: string) => {
    const state = get();
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      productId,
      productName: product.name,
      price: product.price,
      date: dayjs().format('YYYY-MM-DD'),
      status: 'completed',
      contributeToStreak: true
    };

    const today = dayjs().format('YYYY-MM-DD');
    const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    
    let newShoppingStreak = 1;
    if (state.shoppingStreak.lastOrder === yesterday) {
      newShoppingStreak = state.shoppingStreak.currentStreak + 1;
    } else if (state.shoppingStreak.lastOrder === today) {
      newShoppingStreak = state.shoppingStreak.currentStreak;
    }

    set({
      orders: [newOrder, ...state.orders],
      shoppingStreak: {
        ...state.shoppingStreak,
        currentStreak: newShoppingStreak,
        lastOrder: today,
        totalOrders: state.shoppingStreak.totalOrders + 1
      },
      weeklyStreak: {
        ...state.weeklyStreak,
        purchasesThisWeek: state.weeklyStreak.purchasesThisWeek + 1
      }
    });
  },

  claimCheckinReward: (day: number) => {
    const state = get();
    set({
      dailyCheckin: {
        ...state.dailyCheckin,
        rewards: state.dailyCheckin.rewards.map(reward =>
          reward.day === day
            ? { ...reward, claimed: true, claimedDate: dayjs().format('YYYY-MM-DD') }
            : reward
        )
      }
    });
  },

  claimShoppingReward: (day: number) => {
    const state = get();
    set({
      shoppingStreak: {
        ...state.shoppingStreak,
        rewards: state.shoppingStreak.rewards.map(reward =>
          reward.day === day
            ? { ...reward, claimed: true, claimedDate: dayjs().format('YYYY-MM-DD') }
            : reward
        )
      }
    });
  },

  claimWeeklyReward: (week: number) => {
    const state = get();
    set({
      weeklyStreak: {
        ...state.weeklyStreak,
        rewards: state.weeklyStreak.rewards.map(reward =>
          reward.week === week
            ? { ...reward, claimed: true, claimedDate: dayjs().format('YYYY-MM-DD') }
            : reward
        )
      }
    });
  },

  setShowCheckinModal: (show: boolean) => {
    set({ showCheckinModal: show });
  },

  checkShouldShowCheckinModal: () => {
    const state = get();
    const today = dayjs().format('YYYY-MM-DD');
    return state.dailyCheckin.lastCheckin !== today;
  },

  // Social Commerce Actions
  createShareChain: (productId: string, sharedTo: string[]) => {
    const state = get();
    const product = state.products.find(p => p.id === productId);
    if (!product || !state.user) return;

    const newShareChain: ShareChain = {
      id: `share-${Date.now()}`,
      product,
      sharedBy: state.user,
      sharedTo: sharedTo.map(id => ({ id, name: 'Friend', email: 'friend@example.com' })),
      pointsEarned: 0,
      status: 'active',
      createdAt: new Date(),
      actions: []
    };

    set({
      shareChains: [...state.shareChains, newShareChain]
    });
  },

  joinGroupBuy: (groupBuyId: string) => {
    const state = get();
    if (!state.user) return;

    set({
      groupBuys: state.groupBuys.map(gb =>
        gb.id === groupBuyId
          ? {
              ...gb,
              participants: [...gb.participants, state.user!],
              currentCount: gb.currentCount + 1
            }
          : gb
      )
    });
  },

  createReviewChallenge: (productId: string, participants: string[]) => {
    const state = get();
    const product = state.products.find(p => p.id === productId);
    if (!product || !state.user) return;

    const newReviewChallenge: ReviewChallenge = {
      id: `review-${Date.now()}`,
      product,
      participants: participants.map(id => ({ 
        id, 
        name: 'Participant', 
        email: 'participant@example.com' 
      })),
      status: 'pending',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      progress: [],
      rewards: {
        points: 300,
        voucher: 'REVIEW15'
      }
    };

    set({
      reviewChallenges: [...state.reviewChallenges, newReviewChallenge]
    });
  },

  markNotificationAsRead: (notificationId: string) => {
    const state = get();
    set({
      socialNotifications: state.socialNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    });
  }
}));