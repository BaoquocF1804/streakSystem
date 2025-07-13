export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  points?: number;
  badges?: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: 'bronze' | 'silver' | 'gold';
  unlockedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating?: number;
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  price: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
  contributeToStreak: boolean;
}

export interface DailyCheckin {
  currentStreak: number;
  lastCheckin: string | null;
  totalCheckins: number;
  rewards: CheckinReward[];
}

export interface CheckinReward {
  day: number;
  title: string;
  description: string;
  claimed: boolean;
  claimedDate?: string;
}

export interface ShoppingStreak {
  currentStreak: number;
  lastOrder: string | null;
  totalOrders: number;
  rewards: ShoppingReward[];
}

export interface ShoppingReward {
  day: number;
  title: string;
  description: string;
  claimed: boolean;
  claimedDate?: string;
}

export interface WeeklyStreak {
  weekCount: number;
  purchasesThisWeek: number;
  targetPurchases: number;
  badge: boolean;
  rewards: WeeklyReward[];
}

export interface WeeklyReward {
  week: number;
  title: string;
  description: string;
  claimed: boolean;
  claimedDate?: string;
}

// Social Commerce Types
export interface ShareChain {
  id: string;
  product: Product;
  sharedBy: User;
  sharedTo: User[];
  pointsEarned: number;
  status: 'active' | 'completed' | 'expired';
  createdAt: Date;
  actions: ChainAction[];
}

export interface ChainAction {
  id: string;
  type: 'view' | 'add_to_cart' | 'add_to_wishlist' | 'purchase' | 'review';
  user: User;
  pointsEarned: number;
  timestamp: Date;
}

export interface ReviewChallenge {
  id: string;
  product: Product;
  participants: User[];
  status: 'pending' | 'in_progress' | 'completed' | 'expired';
  deadline: Date;
  progress: {
    userId: string;
    reviewCompleted: boolean;
    imagesUploaded: number;
    textLength: number;
  }[];
  rewards: {
    points: number;
    voucher?: string;
    badge?: Badge;
  };
}

export interface GroupBuy {
  id: string;
  product: Product;
  organizer: User;
  participants: User[];
  targetCount: number;
  currentCount: number;
  originalPrice: number;
  discountedPrice: number;
  deadline: Date;
  status: 'recruiting' | 'active' | 'completed' | 'cancelled';
}

export interface SocialCommerceNotification {
  id: string;
  type: 'share_invitation' | 'review_challenge' | 'group_buy' | 'chain_completed';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: Record<string, unknown>;
}

// Game System Types
export interface GameEngine {
  id: string;
  name: string;
  description: string;
  type: 'memory' | 'quiz' | 'puzzle' | 'reaction' | 'strategy';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  pointsReward: number;
  streakMultiplier: number;
  timeLimit?: number;
  isActive: boolean;
  playCount: number;
  bestScore: number;
  unlockedAt?: string;
  requirements?: GameRequirement[];
  icon: string;
  color: string;
  multiplayerSupport: boolean;
  multiplayerBonus: number;
}

export interface GameRequirement {
  type: 'streak' | 'points' | 'level' | 'achievement';
  value: number;
  description: string;
}

export interface GameSession {
  id: string;
  gameId: string;
  userId: string;
  score: number;
  duration: number;
  completed: boolean;
  pointsEarned: number;
  streakContribution: number;
  playedAt: string;
  achievements?: string[];
  isMultiplayer?: boolean;
  opponentId?: string;
  result?: 'win' | 'lose' | 'draw';
  multiplayerBonus?: number;
}

export interface GameAchievement {
  id: string;
  gameId: string;
  title: string;
  description: string;
  icon: string;
  category: 'gameplay' | 'streak' | 'social' | 'mastery' | 'multiplayer';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  pointsReward: number;
  requirements: AchievementRequirement[];
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface AchievementRequirement {
  type: 'play_count' | 'high_score' | 'win_streak' | 'time_limit' | 'perfect_score' | 'multiplayer_wins';
  value: number;
  description: string;
}

export interface GameStreak {
  id: string;
  type: 'daily_play' | 'win_streak' | 'perfect_streak' | 'multiplayer_streak';
  currentStreak: number;
  longestStreak: number;
  lastActivity: string;
  multiplier: number;
  bonusActive: boolean;
  bonusEndsAt?: string;
}

export interface GameMilestone {
  id: string;
  title: string;
  description: string;
  type: 'play_count' | 'score' | 'streak' | 'time' | 'achievement' | 'multiplayer';
  requirement: number;
  rewards: MilestoneReward[];
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface MilestoneReward {
  type: 'points' | 'game_unlock' | 'achievement' | 'bonus' | 'cosmetic' | 'tree_seeds';
  value: string | number;
  description: string;
}

export interface PlayerLevel {
  level: number;
  title: string;
  description: string;
  pointsRequired: number;
  currentPoints: number;
  rewards: LevelReward[];
  gameUnlocks: string[];
  bonusUnlocks: string[];
  icon: string;
  color: string;
}

export interface LevelReward {
  type: 'points' | 'game' | 'achievement' | 'cosmetic' | 'special' | 'tree_unlock';
  value: string | number;
  description: string;
}

// Multiplayer System
export interface MultiplayerMatch {
  id: string;
  gameId: string;
  players: User[];
  status: 'waiting' | 'in_progress' | 'completed' | 'cancelled';
  startedAt?: string;
  completedAt?: string;
  winner?: string;
  scores: MatchScore[];
  bonusPoints: number;
  roomCode?: string;
}

export interface MatchScore {
  userId: string;
  score: number;
  pointsEarned: number;
  position: number;
}

// Community Tree System
export interface CommunityTree {
  id: string;
  name: string;
  description: string;
  type: 'oak' | 'pine' | 'cherry' | 'bamboo' | 'magic';
  level: number;
  health: number;
  maxHealth: number;
  growthStage: 'seed' | 'sprout' | 'sapling' | 'young' | 'mature' | 'ancient';
  totalWater: number;
  waterToday: number;
  lastWatered: string;
  contributors: TreeContributor[];
  rewards: TreeReward[];
  unlockRequirement: TreeRequirement;
  isUnlocked: boolean;
  plantedAt: string;
  specialEffects: string[];
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
}

export interface TreeContributor {
  userId: string;
  username: string;
  avatar: string;
  waterContributed: number;
  pointsEarned: number;
  lastContribution: string;
}

export interface TreeReward {
  level: number;
  points: number;
  badge?: string;
  gameUnlock?: string;
  specialItem?: string;
  description: string;
}

export interface TreeRequirement {
  type: 'level' | 'points' | 'games_played' | 'achievements' | 'multiplayer_wins';
  value: number;
  description: string;
}

// Game State
export interface GameState {
  games: GameEngine[];
  sessions: GameSession[];
  achievements: GameAchievement[];
  streaks: GameStreak[];
  milestones: GameMilestone[];
  playerLevel: PlayerLevel;
  totalPoints: number;
  totalPlayTime: number;
  gamesUnlocked: string[];
  achievementsUnlocked: string[];
  bonusesActive: string[];
  currentGameStreak: number;
  longestGameStreak: number;
  lastActivity: string;
  // Multiplayer State
  multiplayerMatches: MultiplayerMatch[];
  currentMatch?: MultiplayerMatch;
  // Community Tree State
  communityTrees: CommunityTree[];
  myTreeContributions: TreeContributor[];
  dailyWaterUsed: number;
  maxDailyWater: number;
}

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  products: Product[];
  orders: Order[];
  dailyCheckin: DailyCheckin;
  shoppingStreak: ShoppingStreak;
  weeklyStreak: WeeklyStreak;
  showCheckinModal: boolean;
  // Social Commerce State
  shareChains: ShareChain[];
  reviewChallenges: ReviewChallenge[];
  groupBuys: GroupBuy[];
  socialNotifications: SocialCommerceNotification[];
  // Game State
  gameState: GameState;
}