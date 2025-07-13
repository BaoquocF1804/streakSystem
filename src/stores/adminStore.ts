import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  AdminStore, 
  AdminUser, 
  AdminGameConfig, 
  AdminVoucher, 
  AdminAnalytics, 
  AdminDashboardStats, 
  AdminUserDetail, 
  AdminFilter,
  AdminNotification,
  AdminSettings,
  AdminGameSession,
  AdminVoucherUsage,
  AdminAchievementProgress,
  AdminLoginHistory,
  AdminPointsHistory,
  AdminActivity
} from '../types/admin';

// Mock Admin Data
const mockAdminUsers: AdminUser[] = [
  {
    id: '1',
    username: 'LinhD',
    email: 'linh@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=linh',
    level: 'Expert',
    experience: 5200,
    totalPoints: 12500,
    currentStreak: 15,
    maxStreak: 25,
    status: 'active',
    role: 'user',
    createdAt: '2024-01-15T00:00:00Z',
    lastActive: '2024-12-07T10:30:00Z',
    loginCount: 45,
    achievements: ['streak_master', 'game_expert', 'community_helper'],
    gamesPlayed: 156,
    vouchersReceived: 12,
    vouchersUsed: 8
  },
  {
    id: '2',
    username: 'MinhT',
    email: 'minh@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=minh',
    level: 'Advanced',
    experience: 3800,
    totalPoints: 8900,
    currentStreak: 8,
    maxStreak: 18,
    status: 'active',
    role: 'user',
    createdAt: '2024-02-01T00:00:00Z',
    lastActive: '2024-12-07T09:15:00Z',
    loginCount: 32,
    achievements: ['memory_master', 'math_wizard'],
    gamesPlayed: 98,
    vouchersReceived: 7,
    vouchersUsed: 5
  },
  {
    id: '3',
    username: 'AnhN',
    email: 'anh@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anh',
    level: 'Intermediate',
    experience: 2100,
    totalPoints: 4200,
    currentStreak: 3,
    maxStreak: 12,
    status: 'inactive',
    role: 'user',
    createdAt: '2024-03-10T00:00:00Z',
    lastActive: '2024-12-05T14:20:00Z',
    loginCount: 18,
    achievements: ['first_game', 'streak_keeper'],
    gamesPlayed: 45,
    vouchersReceived: 3,
    vouchersUsed: 2
  }
];

const mockAdminGames: AdminGameConfig[] = [
  {
    id: 'memory',
    code: 'MEMORY',
    name: 'Memory Game',
    description: 'Test your memory with card matching',
    icon: '🧠',
    coverImage: '/images/memory-game.jpg',
    status: 'active',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    dailyPlayLimit: 5,
    timeLimit: 300,
    difficulty: 'medium',
    basePoints: 10,
    bonusMultiplier: 1.5,
    requirements: {
      minLevel: 1,
      minStreak: 0
    },
    rewards: {
      points: 50,
      experience: 25,
      achievements: ['memory_master']
    },
    playCount: 2847,
    highScore: 2500,
    averageScore: 850,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'math',
    code: 'MATH',
    name: 'Math Quiz',
    description: 'Solve math problems quickly',
    icon: '🔢',
    coverImage: '/images/math-game.jpg',
    status: 'active',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    dailyPlayLimit: 3,
    timeLimit: 240,
    difficulty: 'hard',
    basePoints: 15,
    bonusMultiplier: 2.0,
    requirements: {
      minLevel: 3,
      minStreak: 5
    },
    rewards: {
      points: 75,
      experience: 40,
      achievements: ['math_wizard']
    },
    playCount: 1892,
    highScore: 1800,
    averageScore: 650,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  }
];

const mockAdminVouchers: AdminVoucher[] = [
  {
    id: '1',
    code: 'TEKO100',
    name: 'Giảm 100k',
    description: 'Giảm 100.000đ cho đơn hàng từ 500.000đ',
    type: 'discount',
    value: 100000,
    valueType: 'fixed',
    maxUses: 200,
    usedCount: 87,
    status: 'active',
    startDate: '2024-07-01T00:00:00Z',
    endDate: '2024-07-31T23:59:59Z',
    conditions: {
      minPurchase: 500000,
      userLevel: ['Advanced', 'Expert'],
      streakRequired: 7
    },
    distributionType: 'auto',
    targetUsers: [],
    createdAt: '2024-06-25T00:00:00Z',
    updatedAt: '2024-07-01T00:00:00Z'
  },
  {
    id: '2',
    code: 'STREAK15',
    name: 'Streak Reward',
    description: 'Phần thưởng cho streak 15 ngày',
    type: 'points',
    value: 500,
    valueType: 'fixed',
    maxUses: 50,
    usedCount: 23,
    status: 'active',
    startDate: '2024-07-01T00:00:00Z',
    endDate: '2024-08-31T23:59:59Z',
    conditions: {
      streakRequired: 15
    },
    distributionType: 'streak_reward',
    targetUsers: [],
    createdAt: '2024-06-20T00:00:00Z',
    updatedAt: '2024-07-01T00:00:00Z'
  }
];

const mockAnalytics: AdminAnalytics = {
  users: {
    total: 1250,
    active: 892,
    new: 45,
    banned: 12,
    dau: 345,
    mau: 1089
  },
  games: {
    totalPlays: 4739,
    dailyPlays: 167,
    uniquePlayers: 543,
    averageScore: 750,
    averagePlayTime: 180
  },
  vouchers: {
    total: 15,
    active: 8,
    expired: 3,
    distributed: 1250,
    used: 410,
    usageRate: 32.8
  },
  engagement: {
    averageStreak: 8.5,
    achievementsUnlocked: 256,
    multiplayerMatches: 89,
    communityTreesWatered: 1234
  }
};

const mockRecentActivities: AdminActivity[] = [
  {
    id: '1',
    type: 'user_register',
    userId: '4',
    username: 'NewUser',
    description: 'Người dùng mới đăng ký',
    timestamp: '2024-12-07T10:30:00Z'
  },
  {
    id: '2',
    type: 'game_played',
    userId: '1',
    username: 'LinhD',
    description: 'Chơi Memory Game - Điểm: 1250',
    timestamp: '2024-12-07T10:15:00Z'
  },
  {
    id: '3',
    type: 'voucher_used',
    userId: '2',
    username: 'MinhT',
    description: 'Sử dụng voucher TEKO100',
    timestamp: '2024-12-07T09:45:00Z'
  }
];

const mockDashboardStats: AdminDashboardStats = {
  todayStats: {
    newUsers: 12,
    activeUsers: 345,
    gamesPlayed: 167,
    vouchersUsed: 23,
    revenue: 2500000
  },
  topUsers: {
    byPoints: mockAdminUsers.slice(0, 5),
    byStreak: mockAdminUsers.slice(0, 5),
    byGamesPlayed: mockAdminUsers.slice(0, 5)
  },
  topGames: {
    byPlays: mockAdminGames.slice(0, 5),
    byScore: mockAdminGames.slice(0, 5),
    byEngagement: mockAdminGames.slice(0, 5)
  },
  recentActivities: mockRecentActivities
};

const defaultSettings: AdminSettings = {
  general: {
    siteName: 'Teko Social Shop',
    maintenanceMode: false,
    allowRegistration: true,
    maxDailyGames: 10,
    maxDailyVouchers: 5
  },
  notifications: {
    emailEnabled: true,
    pushEnabled: true,
    adminAlerts: true,
    userAlerts: true
  },
  security: {
    sessionTimeout: 3600,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireEmailVerification: true
  }
};

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      // Initial State
      isAuthenticated: false,
      adminUser: null,
      users: mockAdminUsers,
      games: mockAdminGames,
      vouchers: mockAdminVouchers,
      analytics: mockAnalytics,
      dashboardStats: mockDashboardStats,
      loading: false,
      selectedUser: null,
      selectedGame: null,
      selectedVoucher: null,
      filters: {
        page: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      },
      notifications: [],
      settings: defaultSettings,

      // Auth Actions
      login: async (username: string, password: string) => {
        set({ loading: true });
        
        // Mock authentication
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (username === 'admin' && password === 'admin123') {
          const adminUser: AdminUser = {
            id: 'admin',
            username: 'admin',
            email: 'admin@teko.vn',
            level: 'Admin',
            experience: 0,
            totalPoints: 0,
            currentStreak: 0,
            maxStreak: 0,
            status: 'active',
            role: 'admin',
            createdAt: '2024-01-01T00:00:00Z',
            lastActive: new Date().toISOString(),
            loginCount: 1,
            achievements: [],
            gamesPlayed: 0,
            vouchersReceived: 0,
            vouchersUsed: 0
          };
          
          set({ 
            isAuthenticated: true, 
            adminUser,
            loading: false 
          });
          return true;
        }
        
        set({ loading: false });
        return false;
      },

      logout: () => {
        set({ 
          isAuthenticated: false, 
          adminUser: null,
          selectedUser: null,
          selectedGame: null,
          selectedVoucher: null
        });
      },

      // User Management
      fetchUsers: async (filter?: AdminFilter) => {
        set({ loading: true });
        
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let filteredUsers = [...mockAdminUsers];
        
        if (filter?.search) {
          filteredUsers = filteredUsers.filter(user => 
            user.username.toLowerCase().includes(filter.search!.toLowerCase()) ||
            user.email.toLowerCase().includes(filter.search!.toLowerCase())
          );
        }
        
        if (filter?.status) {
          filteredUsers = filteredUsers.filter(user => user.status === filter.status);
        }
        
        if (filter?.level) {
          filteredUsers = filteredUsers.filter(user => user.level === filter.level);
        }
        
        set({ users: filteredUsers, loading: false });
      },

      getUserDetail: async (userId: string) => {
        set({ loading: true });
        
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const user = mockAdminUsers.find(u => u.id === userId);
        if (!user) {
          set({ loading: false });
          throw new Error('User not found');
        }
        
        const userDetail: AdminUserDetail = {
          ...user,
          gameHistory: [],
          voucherHistory: [],
          achievements: [],
          loginHistory: [],
          pointsHistory: []
        };
        
        set({ selectedUser: userDetail, loading: false });
        return userDetail;
      },

      updateUserStatus: async (userId: string, status: AdminUser['status']) => {
        set({ loading: true });
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const users = get().users.map(user => 
          user.id === userId ? { ...user, status } : user
        );
        
        set({ users, loading: false });
        
        get().addNotification({
          type: 'success',
          title: 'User Updated',
          message: `User status updated to ${status}`,
          isRead: false
        });
      },

      resetUserStreak: async (userId: string) => {
        set({ loading: true });
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const users = get().users.map(user => 
          user.id === userId ? { ...user, currentStreak: 0 } : user
        );
        
        set({ users, loading: false });
        
        get().addNotification({
          type: 'success',
          title: 'Streak Reset',
          message: 'User streak has been reset',
          isRead: false
        });
      },

      addUserPoints: async (userId: string, points: number, reason: string) => {
        set({ loading: true });
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const users = get().users.map(user => 
          user.id === userId ? { ...user, totalPoints: user.totalPoints + points } : user
        );
        
        set({ users, loading: false });
        
        get().addNotification({
          type: 'success',
          title: 'Points Added',
          message: `Added ${points} points to user`,
          isRead: false
        });
      },

      sendVoucherToUser: async (userId: string, voucherId: string) => {
        set({ loading: true });
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const users = get().users.map(user => 
          user.id === userId ? { ...user, vouchersReceived: user.vouchersReceived + 1 } : user
        );
        
        set({ users, loading: false });
        
        get().addNotification({
          type: 'success',
          title: 'Voucher Sent',
          message: 'Voucher has been sent to user',
          isRead: false
        });
      },

      // Game Management
      fetchGames: async (filter?: AdminFilter) => {
        set({ loading: true });
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let filteredGames = [...mockAdminGames];
        
        if (filter?.search) {
          filteredGames = filteredGames.filter(game => 
            game.name.toLowerCase().includes(filter.search!.toLowerCase()) ||
            game.code.toLowerCase().includes(filter.search!.toLowerCase())
          );
        }
        
        if (filter?.status) {
          filteredGames = filteredGames.filter(game => game.status === filter.status);
        }
        
        set({ games: filteredGames, loading: false });
      },

      createGame: async (gameData: Partial<AdminGameConfig>) => {
        set({ loading: true });
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const newGame: AdminGameConfig = {
          id: Date.now().toString(),
          code: gameData.code || 'NEW_GAME',
          name: gameData.name || 'New Game',
          description: gameData.description || '',
          status: gameData.status || 'inactive',
          dailyPlayLimit: gameData.dailyPlayLimit || 3,
          timeLimit: gameData.timeLimit || 300,
          difficulty: gameData.difficulty || 'medium',
          basePoints: gameData.basePoints || 10,
          bonusMultiplier: gameData.bonusMultiplier || 1.0,
          requirements: gameData.requirements || {},
          rewards: gameData.rewards || { points: 0, experience: 0 },
          playCount: 0,
          highScore: 0,
          averageScore: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const games = [...get().games, newGame];
        set({ games, loading: false });
        
        get().addNotification({
          type: 'success',
          title: 'Game Created',
          message: `Game "${newGame.name}" has been created`,
          isRead: false
        });
      },

      updateGame: async (gameId: string, gameData: Partial<AdminGameConfig>) => {
        set({ loading: true });
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const games = get().games.map(game => 
          game.id === gameId ? { ...game, ...gameData, updatedAt: new Date().toISOString() } : game
        );
        
        set({ games, loading: false });
        
        get().addNotification({
          type: 'success',
          title: 'Game Updated',
          message: 'Game has been updated successfully',
          isRead: false
        });
      },

      deleteGame: async (gameId: string) => {
        set({ loading: true });
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const games = get().games.filter(game => game.id !== gameId);
        set({ games, loading: false });
        
        get().addNotification({
          type: 'success',
          title: 'Game Deleted',
          message: 'Game has been deleted',
          isRead: false
        });
      },

      toggleGameStatus: async (gameId: string, status: AdminGameConfig['status']) => {
        set({ loading: true });
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const games = get().games.map(game => 
          game.id === gameId ? { ...game, status, updatedAt: new Date().toISOString() } : game
        );
        
        set({ games, loading: false });
        
        get().addNotification({
          type: 'success',
          title: 'Game Status Updated',
          message: `Game status changed to ${status}`,
          isRead: false
        });
      },

      // Voucher Management
      fetchVouchers: async (filter?: AdminFilter) => {
        set({ loading: true });
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let filteredVouchers = [...mockAdminVouchers];
        
        if (filter?.search) {
          filteredVouchers = filteredVouchers.filter(voucher => 
            voucher.name.toLowerCase().includes(filter.search!.toLowerCase()) ||
            voucher.code.toLowerCase().includes(filter.search!.toLowerCase())
          );
        }
        
        if (filter?.status) {
          filteredVouchers = filteredVouchers.filter(voucher => voucher.status === filter.status);
        }
        
        set({ vouchers: filteredVouchers, loading: false });
      },

      createVoucher: async (voucherData: Partial<AdminVoucher>) => {
        set({ loading: true });
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const newVoucher: AdminVoucher = {
          id: Date.now().toString(),
          code: voucherData.code || 'NEW_VOUCHER',
          name: voucherData.name || 'New Voucher',
          description: voucherData.description || '',
          type: voucherData.type || 'discount',
          value: voucherData.value || 0,
          valueType: voucherData.valueType || 'fixed',
          maxUses: voucherData.maxUses || 100,
          usedCount: 0,
          status: voucherData.status || 'inactive',
          startDate: voucherData.startDate || new Date().toISOString(),
          endDate: voucherData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          conditions: voucherData.conditions || {},
          distributionType: voucherData.distributionType || 'manual',
          targetUsers: voucherData.targetUsers || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const vouchers = [...get().vouchers, newVoucher];
        set({ vouchers, loading: false });
        
        get().addNotification({
          type: 'success',
          title: 'Voucher Created',
          message: `Voucher "${newVoucher.name}" has been created`,
          isRead: false
        });
      },

      updateVoucher: async (voucherId: string, voucherData: Partial<AdminVoucher>) => {
        set({ loading: true });
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const vouchers = get().vouchers.map(voucher => 
          voucher.id === voucherId ? { ...voucher, ...voucherData, updatedAt: new Date().toISOString() } : voucher
        );
        
        set({ vouchers, loading: false });
        
        get().addNotification({
          type: 'success',
          title: 'Voucher Updated',
          message: 'Voucher has been updated successfully',
          isRead: false
        });
      },

      deleteVoucher: async (voucherId: string) => {
        set({ loading: true });
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const vouchers = get().vouchers.filter(voucher => voucher.id !== voucherId);
        set({ vouchers, loading: false });
        
        get().addNotification({
          type: 'success',
          title: 'Voucher Deleted',
          message: 'Voucher has been deleted',
          isRead: false
        });
      },

      distributeVoucher: async (voucherId: string, userIds: string[]) => {
        set({ loading: true });
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const vouchers = get().vouchers.map(voucher => 
          voucher.id === voucherId ? { ...voucher, targetUsers: [...voucher.targetUsers, ...userIds] } : voucher
        );
        
        set({ vouchers, loading: false });
        
        get().addNotification({
          type: 'success',
          title: 'Voucher Distributed',
          message: `Voucher distributed to ${userIds.length} users`,
          isRead: false
        });
      },

      // Analytics
      fetchAnalytics: async () => {
        set({ loading: true });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        set({ analytics: mockAnalytics, loading: false });
      },

      fetchDashboardStats: async () => {
        set({ loading: true });
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        set({ dashboardStats: mockDashboardStats, loading: false });
      },

      // Utilities
      setFilter: (filter: Partial<AdminFilter>) => {
        const currentFilter = get().filters;
        set({ filters: { ...currentFilter, ...filter } });
      },

      clearFilter: () => {
        set({ 
          filters: {
            page: 1,
            pageSize: 10,
            sortBy: 'createdAt',
            sortOrder: 'desc'
          }
        });
      },

      addNotification: (notification: Omit<AdminNotification, 'id' | 'timestamp'>) => {
        const newNotification: AdminNotification = {
          ...notification,
          id: Date.now().toString(),
          timestamp: new Date().toISOString()
        };
        
        const notifications = [newNotification, ...get().notifications];
        set({ notifications });
      },

      markNotificationRead: (notificationId: string) => {
        const notifications = get().notifications.map(notif => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        );
        set({ notifications });
      },

      updateSettings: async (settings: Partial<AdminSettings>) => {
        set({ loading: true });
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const currentSettings = get().settings;
        const newSettings = {
          ...currentSettings,
          ...settings
        };
        
        set({ settings: newSettings, loading: false });
        
        get().addNotification({
          type: 'success',
          title: 'Settings Updated',
          message: 'Settings have been updated successfully',
          isRead: false
        });
      }
    }),
    {
      name: 'admin-store',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        adminUser: state.adminUser,
        settings: state.settings
      })
    }
  )
); 