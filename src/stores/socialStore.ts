import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  SocialStore, 
  SocialGroup, 
  GroupMember, 
  FriendInvite, 
  FriendConnection,
  InviteStats,
  ProductShare,
  ProductSharingStats,
  ProductReview,
  CommunityPost,
  ViralCampaign,
  ViralLeaderboard,
  SocialBadge,
  SocialAnalytics,
  SocialOverview,
  SocialActivity
} from '../types/social';

// Mock Data
const mockSocialGroups: SocialGroup[] = [
  {
    id: '1',
    name: 'Mua chung 01',
    description: 'Nhóm mua chung sản phẩm chất lượng với giá tốt',
    type: 'group_buying',
    memberCount: 53,
    leaderId: 'user1',
    leaderName: 'LinhD',
    status: 'active',
    interactions7d: 120,
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-12-07T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MB01',
    tags: ['electronics', 'fashion', 'home'],
    settings: {
      isPrivate: false,
      autoApprove: true,
      allowInvites: true,
      maxMembers: 100
    }
  },
  {
    id: '2',
    name: 'Cây Cherry 1',
    description: 'Cộng đồng trồng và chăm sóc cây cherry',
    type: 'tree_planting',
    memberCount: 37,
    leaderId: 'user2',
    leaderName: 'QuangNT',
    status: 'active',
    interactions7d: 99,
    createdAt: '2024-06-11T00:00:00Z',
    updatedAt: '2024-12-06T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CC1',
    tags: ['environment', 'community', 'nature'],
    settings: {
      isPrivate: false,
      autoApprove: false,
      allowInvites: true,
      maxMembers: 50
    }
  },
  {
    id: '3',
    name: 'Fashion Community',
    description: 'Cộng đồng yêu thích thời trang và làm đẹp',
    type: 'community',
    memberCount: 89,
    leaderId: 'user3',
    leaderName: 'MinhA',
    status: 'active',
    interactions7d: 245,
    createdAt: '2024-05-20T00:00:00Z',
    updatedAt: '2024-12-07T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=FC',
    tags: ['fashion', 'beauty', 'lifestyle'],
    settings: {
      isPrivate: false,
      autoApprove: true,
      allowInvites: true,
      maxMembers: 200
    }
  }
];

const mockFriendInvites: FriendInvite[] = [
  {
    id: '1',
    inviterId: 'user1',
    inviterName: 'LinhD',
    inviteeEmail: 'newuser1@example.com',
    inviteeName: 'Ngọc Mai',
    sentAt: '2024-12-07T09:00:00Z',
    status: 'pending',
    hasJoined: false,
    inviteCode: 'INV001',
    inviteSource: 'direct'
  },
  {
    id: '2',
    inviterId: 'user2',
    inviterName: 'QuangNT',
    inviteeEmail: 'newuser2@example.com',
    inviteeName: 'Hoàng Long',
    sentAt: '2024-12-06T14:30:00Z',
    status: 'accepted',
    acceptedAt: '2024-12-06T16:45:00Z',
    hasJoined: true,
    inviteCode: 'INV002',
    inviteSource: 'group'
  },
  {
    id: '3',
    inviterId: 'user3',
    inviterName: 'MinhA',
    inviteeEmail: 'newuser3@example.com',
    sentAt: '2024-12-05T11:20:00Z',
    status: 'declined',
    hasJoined: false,
    inviteCode: 'INV003',
    inviteSource: 'product_share'
  }
];

const mockInviteStats: InviteStats[] = [
  {
    userId: 'user1',
    username: 'LinhD',
    totalInvitesSent: 25,
    invitesAccepted: 18,
    newFriendsCount: 18,
    successRate: 72.0,
    todayInvites: 2,
    weeklyInvites: 8,
    monthlyInvites: 25
  },
  {
    userId: 'user2',
    username: 'QuangNT',
    totalInvitesSent: 15,
    invitesAccepted: 12,
    newFriendsCount: 12,
    successRate: 80.0,
    todayInvites: 1,
    weeklyInvites: 5,
    monthlyInvites: 15
  },
  {
    userId: 'user3',
    username: 'MinhA',
    totalInvitesSent: 30,
    invitesAccepted: 20,
    newFriendsCount: 20,
    successRate: 66.7,
    todayInvites: 3,
    weeklyInvites: 12,
    monthlyInvites: 30
  }
];

const mockProductShares: ProductShare[] = [
  {
    id: '1',
    productId: 'prod1',
    productName: 'Áo thun GenZ',
    productImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300',
    sharerId: 'user1',
    sharerName: 'LinhD',
    shareChannel: 'group',
    shareContent: 'Áo này đẹp quá, mọi người mua chung nha!',
    sharedAt: '2024-12-07T08:00:00Z',
    clickCount: 40,
    viewCount: 120,
    purchaseCount: 12,
    conversionRate: 30.0,
    earnings: 120000
  },
  {
    id: '2',
    productId: 'prod2',
    productName: 'Giày casual',
    productImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300',
    sharerId: 'user2',
    sharerName: 'QuangNT',
    shareChannel: 'friend',
    shareContent: 'Giày này đi rất êm chân!',
    sharedAt: '2024-12-06T15:30:00Z',
    clickCount: 33,
    viewCount: 89,
    purchaseCount: 6,
    conversionRate: 18.0,
    earnings: 180000
  }
];

const mockProductSharingStats: ProductSharingStats[] = [
  {
    productId: 'prod1',
    productName: 'Áo thun GenZ',
    totalShares: 55,
    topSharer: 'LinhD',
    totalClicks: 180,
    totalViews: 420,
    totalPurchases: 35,
    conversionRate: 19.4,
    totalEarnings: 350000,
    weeklyShares: 15,
    monthlyShares: 55
  },
  {
    productId: 'prod2',
    productName: 'Giày casual',
    totalShares: 41,
    topSharer: 'QuangNT',
    totalClicks: 150,
    totalViews: 350,
    totalPurchases: 28,
    conversionRate: 18.7,
    totalEarnings: 840000,
    weeklyShares: 12,
    monthlyShares: 41
  }
];

const mockProductReviews: ProductReview[] = [
  {
    id: '1',
    userId: 'user1',
    username: 'LinhD',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=linh',
    productId: 'prod1',
    productName: 'Áo thun GenZ',
    productImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300',
    rating: 5,
    title: 'Sản phẩm tuyệt vời',
    content: 'Áo đẹp, chất liệu tốt, vừa form. Rất hài lòng với sản phẩm này!',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300'],
    createdAt: '2024-12-06T10:00:00Z',
    updatedAt: '2024-12-06T10:00:00Z',
    status: 'active',
    likes: 15,
    dislikes: 0,
    helpfulCount: 12,
    reportCount: 0
  },
  {
    id: '2',
    userId: 'user4',
    username: 'HoaiTT',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hoai',
    productId: 'prod2',
    productName: 'Giày casual',
    productImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300',
    rating: 1,
    title: 'Sản phẩm có vấn đề',
    content: 'Giày bị lỗi, không đúng như mô tả. Rất thất vọng!',
    images: [],
    createdAt: '2024-12-05T14:30:00Z',
    updatedAt: '2024-12-05T14:30:00Z',
    status: 'reported',
    likes: 2,
    dislikes: 8,
    helpfulCount: 3,
    reportCount: 5,
    adminNotes: 'Cần kiểm tra lại sản phẩm'
  }
];

const mockViralCampaigns: ViralCampaign[] = [
  {
    id: '1',
    name: 'Mời bạn nhận quà',
    description: 'Mời bạn bè tham gia và nhận voucher 50k',
    type: 'referral',
    startDate: '2024-12-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    status: 'active',
    targetMetric: 'referrals',
    targetValue: 1000,
    currentValue: 245,
    participantCount: 156,
    rewards: [
      { type: 'voucher', value: 50000, description: 'Voucher 50k cho mỗi lời mời thành công' },
      { type: 'points', value: 100, description: '100 điểm thưởng' }
    ],
    rules: [
      'Mời tối thiểu 3 bạn bè',
      'Bạn bè phải đăng ký thành công',
      'Áp dụng trong tháng 12/2024'
    ],
    createdAt: '2024-11-25T00:00:00Z'
  }
];

const mockLeaderboards: ViralLeaderboard[] = [
  {
    rank: 1,
    userId: 'user1',
    username: 'LinhD',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=linh',
    score: 25,
    metric: 'invites',
    period: 'monthly',
    category: 'invites',
    badge: 'Invite Master',
    rewards: 500000
  },
  {
    rank: 2,
    userId: 'user3',
    username: 'MinhA',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=minh',
    score: 55,
    metric: 'shares',
    period: 'monthly',
    category: 'shares',
    badge: 'Share Champion',
    rewards: 300000
  }
];

const mockSocialAnalytics: SocialAnalytics = {
  groups: {
    total: 156,
    active: 134,
    inactive: 22,
    newToday: 3,
    newWeek: 12,
    totalMembers: 2340,
    averageMembers: 15,
    topGroup: mockSocialGroups[2]
  },
  friends: {
    totalConnections: 4567,
    newConnectionsToday: 23,
    newConnectionsWeek: 156,
    invitesSentToday: 45,
    invitesAcceptedToday: 32,
    acceptanceRate: 71.1,
    averageInvitesPerUser: 3.2
  },
  sharing: {
    totalShares: 1234,
    sharesToday: 67,
    sharesWeek: 445,
    totalClicks: 5678,
    clicksToday: 234,
    conversionRate: 22.5,
    topProduct: mockProductSharingStats[0],
    topSharer: mockInviteStats[0]
  },
  reviews: {
    total: 890,
    newToday: 12,
    newWeek: 89,
    averageRating: 4.2,
    pending: 23,
    reported: 8,
    averageReviewLength: 156
  },
  engagement: {
    dailyActiveUsers: 456,
    weeklyActiveUsers: 1234,
    monthlyActiveUsers: 3456,
    averageSessionTime: 1847,
    totalInteractions: 12890,
    interactionsToday: 567
  }
};

const mockRecentActivities: SocialActivity[] = [
  {
    id: '1',
    type: 'group_created',
    userId: 'user1',
    username: 'LinhD',
    description: 'Tạo nhóm mua chung mới "Tech Lovers"',
    timestamp: '2024-12-07T10:30:00Z',
    groupId: '4'
  },
  {
    id: '2',
    type: 'product_shared',
    userId: 'user2',
    username: 'QuangNT',
    description: 'Chia sẻ sản phẩm "Laptop Gaming" trong nhóm',
    timestamp: '2024-12-07T09:15:00Z',
    productId: 'prod3'
  },
  {
    id: '3',
    type: 'review_posted',
    userId: 'user3',
    username: 'MinhA',
    description: 'Đăng review 5 sao cho "Áo khoác đông"',
    timestamp: '2024-12-07T08:45:00Z',
    productId: 'prod4'
  }
];

export const useSocialStore = create<SocialStore>()(
  persist(
    (set, get) => ({
      // Initial State
      groups: mockSocialGroups,
      groupMembers: {},
      invites: mockFriendInvites,
      friendConnections: [],
      inviteStats: mockInviteStats,
      productShares: mockProductShares,
      productSharingStats: mockProductSharingStats,
      reviews: mockProductReviews,
      communityPosts: [],
      viralCampaigns: mockViralCampaigns,
      leaderboards: mockLeaderboards,
      socialBadges: [],
      analytics: mockSocialAnalytics,
      overview: null,
      recentActivities: mockRecentActivities,

      // UI State
      loading: false,
      selectedGroup: null,
      selectedReview: null,
      selectedPost: null,
      selectedCampaign: null,

      // Filters
      groupFilter: {},
      reviewFilter: {},
      inviteFilter: {},

      // Group Management Actions
      fetchGroups: async (filter?: any) => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let filteredGroups = [...mockSocialGroups];
        
        if (filter?.type) {
          filteredGroups = filteredGroups.filter(g => g.type === filter.type);
        }
        if (filter?.status) {
          filteredGroups = filteredGroups.filter(g => g.status === filter.status);
        }
        if (filter?.search) {
          filteredGroups = filteredGroups.filter(g => 
            g.name.toLowerCase().includes(filter.search.toLowerCase()) ||
            g.description.toLowerCase().includes(filter.search.toLowerCase())
          );
        }
        
        set({ groups: filteredGroups, loading: false });
      },

      getGroupDetail: async (groupId: string) => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const group = mockSocialGroups.find(g => g.id === groupId);
        if (!group) throw new Error('Group not found');
        
        set({ selectedGroup: group, loading: false });
        return group;
      },

      getGroupMembers: async (groupId: string) => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Mock group members
        const members: GroupMember[] = [
          {
            id: '1',
            groupId,
            userId: 'user1',
            username: 'LinhD',
            email: 'linh@example.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=linh',
            role: 'leader',
            joinedAt: '2024-06-01T00:00:00Z',
            lastActive: '2024-12-07T10:00:00Z',
            contributions: 45,
            status: 'active'
          }
        ];
        
        const currentMembers = get().groupMembers;
        set({ 
          groupMembers: { ...currentMembers, [groupId]: members },
          loading: false 
        });
        return members;
      },

      updateGroupStatus: async (groupId: string, status: SocialGroup['status']) => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const groups = get().groups.map(group => 
          group.id === groupId ? { ...group, status } : group
        );
        
        set({ groups, loading: false });
      },

      transferGroupLeader: async (groupId: string, newLeaderId: string) => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const groups = get().groups.map(group => 
          group.id === groupId ? { ...group, leaderId: newLeaderId } : group
        );
        
        set({ groups, loading: false });
      },

      removeGroupMember: async (groupId: string, userId: string) => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const currentMembers = get().groupMembers;
        const groupMembers = currentMembers[groupId]?.filter(m => m.userId !== userId) || [];
        
        set({ 
          groupMembers: { ...currentMembers, [groupId]: groupMembers },
          loading: false 
        });
      },

      deleteGroup: async (groupId: string) => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const groups = get().groups.filter(g => g.id !== groupId);
        set({ groups, loading: false });
      },

      sendGroupNotification: async (groupId: string, message: string) => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        set({ loading: false });
      },

      // Friend & Invite Management
      fetchInvites: async (filter?: any) => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let filteredInvites = [...mockFriendInvites];
        
        if (filter?.status) {
          filteredInvites = filteredInvites.filter(i => i.status === filter.status);
        }
        
        set({ invites: filteredInvites, loading: false });
      },

      fetchInviteStats: async () => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        set({ inviteStats: mockInviteStats, loading: false });
      },

      updateInviteLimit: async (userId: string, limit: number) => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        set({ loading: false });
      },

      blockUser: async (userId: string) => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        set({ loading: false });
      },

      // Product Sharing
      fetchProductShares: async (filter?: any) => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        set({ productShares: mockProductShares, loading: false });
      },

      fetchSharingStats: async () => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        set({ productSharingStats: mockProductSharingStats, loading: false });
      },

      getShareAnalytics: async (productId: string) => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const stats = mockProductSharingStats.find(s => s.productId === productId);
        if (!stats) throw new Error('Product stats not found');
        
        set({ loading: false });
        return stats;
      },

      // Review Management
      fetchReviews: async (filter?: any) => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let filteredReviews = [...mockProductReviews];
        
        if (filter?.status) {
          filteredReviews = filteredReviews.filter(r => r.status === filter.status);
        }
        if (filter?.rating) {
          filteredReviews = filteredReviews.filter(r => r.rating === filter.rating);
        }
        
        set({ reviews: filteredReviews, loading: false });
      },

      updateReviewStatus: async (reviewId: string, status: ProductReview['status'], notes?: string) => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const reviews = get().reviews.map(review => 
          review.id === reviewId ? { 
            ...review, 
            status, 
            adminNotes: notes,
            moderatedAt: new Date().toISOString() 
          } : review
        );
        
        set({ reviews, loading: false });
      },

      deleteReview: async (reviewId: string) => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const reviews = get().reviews.filter(r => r.id !== reviewId);
        set({ reviews, loading: false });
      },

      bulkUpdateReviews: async (reviewIds: string[], status: ProductReview['status']) => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const reviews = get().reviews.map(review => 
          reviewIds.includes(review.id) ? { 
            ...review, 
            status,
            moderatedAt: new Date().toISOString() 
          } : review
        );
        
        set({ reviews, loading: false });
      },

      // Community Content
      fetchCommunityPosts: async (filter?: any) => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        set({ communityPosts: [], loading: false });
      },

      updatePostStatus: async (postId: string, status: CommunityPost['status']) => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        set({ loading: false });
      },

      deletePost: async (postId: string) => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        set({ loading: false });
      },

      // Viral Campaigns
      fetchViralCampaigns: async () => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        set({ viralCampaigns: mockViralCampaigns, loading: false });
      },

      createViralCampaign: async (campaign: Partial<ViralCampaign>) => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const newCampaign: ViralCampaign = {
          id: Date.now().toString(),
          name: campaign.name || 'New Campaign',
          description: campaign.description || '',
          type: campaign.type || 'referral',
          startDate: campaign.startDate || new Date().toISOString(),
          endDate: campaign.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: campaign.status || 'inactive',
          targetMetric: campaign.targetMetric || 'referrals',
          targetValue: campaign.targetValue || 100,
          currentValue: 0,
          participantCount: 0,
          rewards: campaign.rewards || [],
          rules: campaign.rules || [],
          createdAt: new Date().toISOString()
        };
        
        const campaigns = [...get().viralCampaigns, newCampaign];
        set({ viralCampaigns: campaigns, loading: false });
      },

      updateViralCampaign: async (campaignId: string, campaign: Partial<ViralCampaign>) => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const campaigns = get().viralCampaigns.map(c => 
          c.id === campaignId ? { ...c, ...campaign } : c
        );
        
        set({ viralCampaigns: campaigns, loading: false });
      },

      deleteViralCampaign: async (campaignId: string) => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const campaigns = get().viralCampaigns.filter(c => c.id !== campaignId);
        set({ viralCampaigns: campaigns, loading: false });
      },

      // Leaderboards & Badges
      fetchLeaderboards: async (category: string, period: string) => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        set({ leaderboards: mockLeaderboards, loading: false });
      },

      fetchSocialBadges: async () => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        set({ socialBadges: [], loading: false });
      },

      createSocialBadge: async (badge: Partial<SocialBadge>) => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        set({ loading: false });
      },

      // Analytics
      fetchSocialAnalytics: async () => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 800));
        set({ analytics: mockSocialAnalytics, loading: false });
      },

      fetchSocialOverview: async () => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const overview: SocialOverview = {
          stats: mockSocialAnalytics,
          topGroups: mockSocialGroups.slice(0, 3),
          topInviteUsers: mockInviteStats.slice(0, 5),
          topSharedProducts: mockProductSharingStats.slice(0, 5),
          recentActivities: mockRecentActivities,
          viralCampaigns: mockViralCampaigns.filter(c => c.status === 'active'),
          leaderboards: mockLeaderboards.slice(0, 10)
        };
        
        set({ overview, loading: false });
      },

      exportSocialData: async (type: string, filter?: any) => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        set({ loading: false });
      },

      // Utilities
      setGroupFilter: (filter) => {
        const currentFilter = get().groupFilter;
        set({ groupFilter: { ...currentFilter, ...filter } });
      },

      setReviewFilter: (filter) => {
        const currentFilter = get().reviewFilter;
        set({ reviewFilter: { ...currentFilter, ...filter } });
      },

      setInviteFilter: (filter) => {
        const currentFilter = get().inviteFilter;
        set({ inviteFilter: { ...currentFilter, ...filter } });
      },

      clearFilters: () => {
        set({ 
          groupFilter: {},
          reviewFilter: {},
          inviteFilter: {}
        });
      }
    }),
    {
      name: 'social-store',
      partialize: (state) => ({
        groupFilter: state.groupFilter,
        reviewFilter: state.reviewFilter,
        inviteFilter: state.inviteFilter
      })
    }
  )
); 