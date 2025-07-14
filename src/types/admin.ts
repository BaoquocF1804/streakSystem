export interface AdminUser {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  level: string;
  experience: number;
  totalPoints: number;
  currentStreak: number;
  maxStreak: number;
  status: 'active' | 'inactive' | 'banned';
  role: 'user' | 'admin';
  createdAt: string;
  lastActive: string;
  loginCount: number;
  achievements: string[];
  gamesPlayed: number;
  vouchersReceived: number;
  vouchersUsed: number;
}

export interface AdminGameSession {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  duration: number;
  isCompleted: boolean;
  isMultiplayer: boolean;
  result?: 'win' | 'lose' | 'draw';
  playedAt: string;
  bonusPoints: number;
}

export interface AdminGameConfig {
  id: string;
  code: string;
  name: string;
  description: string;
  icon?: string;
  coverImage?: string;
  status: 'active' | 'inactive' | 'scheduled';
  startDate?: string;
  endDate?: string;
  dailyPlayLimit: number;
  timeLimit: number; // seconds
  difficulty: 'easy' | 'medium' | 'hard';
  basePoints: number;
  bonusMultiplier: number;
  requirements: {
    minLevel?: number;
    minStreak?: number;
    achievements?: string[];
  };
  rewards: {
    points: number;
    experience: number;
    vouchers?: string[];
    achievements?: string[];
  };
  playCount: number;
  highScore: number;
  averageScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminVoucher {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'discount' | 'cashback' | 'freebie' | 'points';
  value: number;
  valueType: 'fixed' | 'percentage';
  maxUses: number;
  usedCount: number;
  status: 'active' | 'inactive' | 'expired';
  startDate: string;
  endDate: string;
  conditions: {
    minPurchase?: number;
    userLevel?: string[];
    gameRequired?: string[];
    streakRequired?: number;
  };
  distributionType: 'manual' | 'auto' | 'game_reward' | 'streak_reward';
  targetUsers: string[]; // user IDs
  createdAt: string;
  updatedAt: string;
}

export interface AdminVoucherUsage {
  id: string;
  voucherId: string;
  userId: string;
  usedAt: string;
  orderValue?: number;
  discountApplied: number;
}

export interface AdminAnalytics {
  users: {
    total: number;
    active: number;
    new: number;
    banned: number;
    dau: number; // daily active users
    mau: number; // monthly active users
  };
  games: {
    totalPlays: number;
    dailyPlays: number;
    uniquePlayers: number;
    averageScore: number;
    averagePlayTime: number;
  };
  vouchers: {
    total: number;
    active: number;
    expired: number;
    distributed: number;
    used: number;
    usageRate: number;
  };
  engagement: {
    averageStreak: number;
    achievementsUnlocked: number;
    multiplayerMatches: number;
    communityTreesWatered: number;
  };
}

export interface AdminDashboardStats {
  todayStats: {
    newUsers: number;
    activeUsers: number;
    gamesPlayed: number;
    vouchersUsed: number;
    revenue: number;
  };
  topUsers: {
    byPoints: AdminUser[];
    byStreak: AdminUser[];
    byGamesPlayed: AdminUser[];
  };
  topGames: {
    byPlays: AdminGameConfig[];
    byScore: AdminGameConfig[];
    byEngagement: AdminGameConfig[];
  };
  recentActivities: AdminActivity[];
}

export interface AdminActivity {
  id: string;
  type: 'user_register' | 'game_played' | 'voucher_used' | 'achievement_unlocked' | 'level_up';
  userId: string;
  username: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AdminUserDetail extends AdminUser {
  gameHistory: AdminGameSession[];
  voucherHistory: AdminVoucherUsage[];
  achievements: AdminAchievementProgress[];
  loginHistory: AdminLoginHistory[];
  pointsHistory: AdminPointsHistory[];
}

export interface AdminAchievementProgress {
  achievementId: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface AdminLoginHistory {
  id: string;
  userId: string;
  loginAt: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
}

export interface AdminPointsHistory {
  id: string;
  userId: string;
  type: 'earned' | 'spent' | 'bonus' | 'penalty';
  amount: number;
  source: 'game' | 'streak' | 'voucher' | 'admin' | 'purchase';
  description: string;
  timestamp: string;
  gameId?: string;
  voucherId?: string;
}

export interface AdminFilter {
  search?: string;
  status?: string;
  level?: string;
  dateRange?: [string, string];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface AdminAction {
  type: 'view' | 'edit' | 'delete' | 'ban' | 'unban' | 'reset_streak' | 'add_points' | 'send_voucher';
  targetId: string;
  targetType: 'user' | 'game' | 'voucher';
  payload?: Record<string, any>;
}

export interface AdminNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  action?: AdminAction;
}

export interface AdminSettings {
  general: {
    siteName: string;
    maintenanceMode: boolean;
    allowRegistration: boolean;
    maxDailyGames: number;
    maxDailyVouchers: number;
  };
  notifications: {
    emailEnabled: boolean;
    pushEnabled: boolean;
    adminAlerts: boolean;
    userAlerts: boolean;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireEmailVerification: boolean;
  };
}

export interface AdminState {
  // Auth
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  
  // Data
  users: AdminUser[];
  games: AdminGameConfig[];
  vouchers: AdminVoucher[];
  analytics: AdminAnalytics | null;
  dashboardStats: AdminDashboardStats | null;
  
  // UI State
  loading: boolean;
  selectedUser: AdminUserDetail | null;
  selectedGame: AdminGameConfig | null;
  selectedVoucher: AdminVoucher | null;
  filters: AdminFilter;
  notifications: AdminNotification[];
  
  // Settings
  settings: AdminSettings;
}

export interface AdminStore extends AdminState {
  // Auth Actions
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  // User Management
  fetchUsers: (filter?: AdminFilter) => Promise<void>;
  getUserDetail: (userId: string) => Promise<AdminUserDetail>;
  updateUserStatus: (userId: string, status: AdminUser['status']) => Promise<void>;
  resetUserStreak: (userId: string) => Promise<void>;
  addUserPoints: (userId: string, points: number, reason: string) => Promise<void>;
  sendVoucherToUser: (userId: string, voucherId: string) => Promise<void>;
  
  // Game Management
  fetchGames: (filter?: AdminFilter) => Promise<void>;
  createGame: (gameData: Partial<AdminGameConfig>) => Promise<void>;
  updateGame: (gameId: string, gameData: Partial<AdminGameConfig>) => Promise<void>;
  deleteGame: (gameId: string) => Promise<void>;
  toggleGameStatus: (gameId: string, status: AdminGameConfig['status']) => Promise<void>;
  
  // Voucher Management
  fetchVouchers: (filter?: AdminFilter) => Promise<void>;
  createVoucher: (voucherData: Partial<AdminVoucher>) => Promise<void>;
  updateVoucher: (voucherId: string, voucherData: Partial<AdminVoucher>) => Promise<void>;
  deleteVoucher: (voucherId: string) => Promise<void>;
  distributeVoucher: (voucherId: string, userIds: string[]) => Promise<void>;
  
  // Analytics
  fetchAnalytics: () => Promise<void>;
  fetchDashboardStats: () => Promise<void>;
  
  // Utilities
  setFilter: (filter: Partial<AdminFilter>) => void;
  clearFilter: () => void;
  addNotification: (notification: Omit<AdminNotification, 'id' | 'timestamp'>) => void;
  markNotificationRead: (notificationId: string) => void;
  updateSettings: (settings: Partial<AdminSettings>) => Promise<void>;
  
  // Global Configuration Management
  updateGlobalConfig: (config: any) => Promise<boolean>;
  syncConfigToUsers: () => Promise<boolean>;
  resetGlobalConfig: (section?: string) => Promise<boolean>;
  getGlobalConfigStats: () => Promise<{
    activeFeatures: number;
    totalFeatures: number;
    maxDailyGames: number;
    maxDailyVouchers: number;
    maxDailyPoints: number;
    lastUpdated: string;
    maintenanceMode: boolean;
    registrationAllowed: boolean;
  }>;
} 