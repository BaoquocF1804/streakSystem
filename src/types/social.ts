// Social Group/Community Types
export interface SocialGroup {
  id: string;
  name: string;
  description: string;
  type: 'group_buying' | 'community' | 'tree_planting' | 'general';
  memberCount: number;
  leaderId: string;
  leaderName: string;
  status: 'active' | 'inactive' | 'suspended';
  interactions7d: number;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  tags: string[];
  settings: {
    isPrivate: boolean;
    autoApprove: boolean;
    allowInvites: boolean;
    maxMembers: number;
  };
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  username: string;
  email: string;
  avatar?: string;
  role: 'leader' | 'admin' | 'member';
  joinedAt: string;
  lastActive: string;
  contributions: number;
  status: 'active' | 'inactive';
}

// Friend & Invite Types
export interface FriendInvite {
  id: string;
  inviterId: string;
  inviterName: string;
  inviteeEmail: string;
  inviteeName?: string;
  sentAt: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  acceptedAt?: string;
  hasJoined: boolean;
  inviteCode: string;
  inviteSource: 'direct' | 'group' | 'product_share' | 'referral';
}

export interface FriendConnection {
  id: string;
  userId1: string;
  userId2: string;
  user1Name: string;
  user2Name: string;
  connectionDate: string;
  mutualFriends: number;
  interactions: number;
  status: 'active' | 'blocked';
}

export interface InviteStats {
  userId: string;
  username: string;
  totalInvitesSent: number;
  invitesAccepted: number;
  newFriendsCount: number;
  successRate: number;
  todayInvites: number;
  weeklyInvites: number;
  monthlyInvites: number;
}

// Product Sharing Types
export interface ProductShare {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  sharerId: string;
  sharerName: string;
  shareChannel: 'group' | 'friend' | 'social_media' | 'direct_link';
  shareContent: string;
  sharedAt: string;
  clickCount: number;
  viewCount: number;
  purchaseCount: number;
  conversionRate: number;
  earnings: number;
}

export interface ProductSharingStats {
  productId: string;
  productName: string;
  totalShares: number;
  topSharer: string;
  totalClicks: number;
  totalViews: number;
  totalPurchases: number;
  conversionRate: number;
  totalEarnings: number;
  weeklyShares: number;
  monthlyShares: number;
}

// Review & Content Types
export interface ProductReview {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  productId: string;
  productName: string;
  productImage?: string;
  rating: number;
  title: string;
  content: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'hidden' | 'reported' | 'pending';
  likes: number;
  dislikes: number;
  helpfulCount: number;
  reportCount: number;
  adminNotes?: string;
  moderatedBy?: string;
  moderatedAt?: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  groupId: string;
  groupName: string;
  content: string;
  images: string[];
  type: 'text' | 'image' | 'product_share' | 'poll' | 'event';
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'hidden' | 'reported' | 'pending';
  likes: number;
  comments: number;
  shares: number;
  reportCount: number;
  tags: string[];
}

// Viral Campaign Types
export interface ViralCampaign {
  id: string;
  name: string;
  description: string;
  type: 'referral' | 'sharing' | 'group_challenge' | 'invite_contest';
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'completed';
  targetMetric: string;
  targetValue: number;
  currentValue: number;
  participantCount: number;
  rewards: {
    type: 'points' | 'voucher' | 'product' | 'cash';
    value: number;
    description: string;
  }[];
  rules: string[];
  createdAt: string;
}

export interface ViralLeaderboard {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  score: number;
  metric: string;
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  category: 'invites' | 'shares' | 'group_activity' | 'reviews' | 'overall';
  badge?: string;
  rewards: number;
}

export interface SocialBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'social' | 'sharing' | 'community' | 'achievement';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: {
    type: string;
    value: number;
    description: string;
  }[];
  unlockedBy: number;
  rewardPoints: number;
}

// Social Analytics Types
export interface SocialAnalytics {
  groups: {
    total: number;
    active: number;
    inactive: number;
    newToday: number;
    newWeek: number;
    totalMembers: number;
    averageMembers: number;
    topGroup: SocialGroup;
  };
  
  friends: {
    totalConnections: number;
    newConnectionsToday: number;
    newConnectionsWeek: number;
    invitesSentToday: number;
    invitesAcceptedToday: number;
    acceptanceRate: number;
    averageInvitesPerUser: number;
  };
  
  sharing: {
    totalShares: number;
    sharesToday: number;
    sharesWeek: number;
    totalClicks: number;
    clicksToday: number;
    conversionRate: number;
    topProduct: ProductSharingStats;
    topSharer: InviteStats;
  };
  
  reviews: {
    total: number;
    newToday: number;
    newWeek: number;
    averageRating: number;
    pending: number;
    reported: number;
    averageReviewLength: number;
  };
  
  engagement: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    averageSessionTime: number;
    totalInteractions: number;
    interactionsToday: number;
  };
}

export interface SocialOverview {
  stats: SocialAnalytics;
  topGroups: SocialGroup[];
  topInviteUsers: InviteStats[];
  topSharedProducts: ProductSharingStats[];
  recentActivities: SocialActivity[];
  viralCampaigns: ViralCampaign[];
  leaderboards: ViralLeaderboard[];
}

export interface SocialActivity {
  id: string;
  type: 'group_created' | 'member_joined' | 'product_shared' | 'review_posted' | 'invite_sent' | 'friend_connected';
  userId: string;
  username: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
  groupId?: string;
  productId?: string;
}

// Social Store State
export interface SocialState {
  // Data
  groups: SocialGroup[];
  groupMembers: Record<string, GroupMember[]>;
  invites: FriendInvite[];
  friendConnections: FriendConnection[];
  inviteStats: InviteStats[];
  productShares: ProductShare[];
  productSharingStats: ProductSharingStats[];
  reviews: ProductReview[];
  communityPosts: CommunityPost[];
  viralCampaigns: ViralCampaign[];
  leaderboards: ViralLeaderboard[];
  socialBadges: SocialBadge[];
  analytics: SocialAnalytics | null;
  overview: SocialOverview | null;
  recentActivities: SocialActivity[];

  // UI State
  loading: boolean;
  selectedGroup: SocialGroup | null;
  selectedReview: ProductReview | null;
  selectedPost: CommunityPost | null;
  selectedCampaign: ViralCampaign | null;
  
  // Filters
  groupFilter: {
    type?: string;
    status?: string;
    search?: string;
    dateRange?: [string, string];
  };
  
  reviewFilter: {
    rating?: number;
    status?: string;
    search?: string;
    dateRange?: [string, string];
  };
  
  inviteFilter: {
    status?: string;
    search?: string;
    dateRange?: [string, string];
  };
}

// Social Store Actions
export interface SocialStore extends SocialState {
  // Group Management
  fetchGroups: (filter?: any) => Promise<void>;
  getGroupDetail: (groupId: string) => Promise<SocialGroup>;
  getGroupMembers: (groupId: string) => Promise<GroupMember[]>;
  updateGroupStatus: (groupId: string, status: SocialGroup['status']) => Promise<void>;
  transferGroupLeader: (groupId: string, newLeaderId: string) => Promise<void>;
  removeGroupMember: (groupId: string, userId: string) => Promise<void>;
  deleteGroup: (groupId: string) => Promise<void>;
  sendGroupNotification: (groupId: string, message: string) => Promise<void>;

  // Friend & Invite Management
  fetchInvites: (filter?: any) => Promise<void>;
  fetchInviteStats: () => Promise<void>;
  updateInviteLimit: (userId: string, limit: number) => Promise<void>;
  blockUser: (userId: string) => Promise<void>;

  // Product Sharing
  fetchProductShares: (filter?: any) => Promise<void>;
  fetchSharingStats: () => Promise<void>;
  getShareAnalytics: (productId: string) => Promise<ProductSharingStats>;

  // Review Management
  fetchReviews: (filter?: any) => Promise<void>;
  updateReviewStatus: (reviewId: string, status: ProductReview['status'], notes?: string) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  bulkUpdateReviews: (reviewIds: string[], status: ProductReview['status']) => Promise<void>;

  // Community Content
  fetchCommunityPosts: (filter?: any) => Promise<void>;
  updatePostStatus: (postId: string, status: CommunityPost['status']) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;

  // Viral Campaigns
  fetchViralCampaigns: () => Promise<void>;
  createViralCampaign: (campaign: Partial<ViralCampaign>) => Promise<void>;
  updateViralCampaign: (campaignId: string, campaign: Partial<ViralCampaign>) => Promise<void>;
  deleteViralCampaign: (campaignId: string) => Promise<void>;

  // Leaderboards & Badges
  fetchLeaderboards: (category: string, period: string) => Promise<void>;
  fetchSocialBadges: () => Promise<void>;
  createSocialBadge: (badge: Partial<SocialBadge>) => Promise<void>;

  // Analytics
  fetchSocialAnalytics: () => Promise<void>;
  fetchSocialOverview: () => Promise<void>;
  exportSocialData: (type: string, filter?: any) => Promise<void>;

  // Utilities
  setGroupFilter: (filter: Partial<SocialState['groupFilter']>) => void;
  setReviewFilter: (filter: Partial<SocialState['reviewFilter']>) => void;
  setInviteFilter: (filter: Partial<SocialState['inviteFilter']>) => void;
  clearFilters: () => void;
} 