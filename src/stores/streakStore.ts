import { create } from 'zustand';
import { StreakData, Reward, ShoppingOrder, WeeklyChallenge } from '../types';
import dayjs from 'dayjs';

interface StreakStore {
  streakData: StreakData;
  shoppingOrders: ShoppingOrder[];
  weeklyChallenges: WeeklyChallenge[];
  checkIn: () => void;
  claimReward: (rewardId: string) => void;
  addShoppingOrder: (order: Omit<ShoppingOrder, 'id'>) => void;
  updateWeeklyProgress: (challengeId: string, progress: number) => void;
}

// Mock rewards data
const mockRewards: Reward[] = [
  {
    id: '1',
    title: 'First Check-in',
    description: 'Complete your first daily check-in',
    icon: '🎯',
    type: 'daily',
    requiredStreak: 1,
    earned: true,
    earnedDate: '2025-01-13'
  },
  {
    id: '2',
    title: 'Week Warrior',
    description: 'Maintain 7-day streak',
    icon: '🔥',
    type: 'milestone',
    requiredStreak: 7,
    earned: false
  },
  {
    id: '3',
    title: 'Shopping Master',
    description: 'Complete 5 shopping days in a row',
    icon: '🛍️',
    type: 'weekly',
    requiredStreak: 5,
    earned: true,
    earnedDate: '2025-01-12'
  },
  {
    id: '4',
    title: 'Innovation Champion',
    description: 'Reach 14-day streak',
    icon: '👑',
    type: 'milestone',
    requiredStreak: 14,
    earned: false
  }
];

// Mock shopping orders
const mockShoppingOrders: ShoppingOrder[] = [
  {
    id: '1',
    date: '2025-01-13',
    amount: 150000,
    items: ['Laptop Accessories', 'Coffee'],
    contributeToStreak: true
  },
  {
    id: '2',
    date: '2025-01-12',
    amount: 89000,
    items: ['Book', 'Stationery'],
    contributeToStreak: true
  },
  {
    id: '3',
    date: '2025-01-11',
    amount: 250000,
    items: ['Team Lunch'],
    contributeToStreak: true
  }
];

// Mock weekly challenges
const mockWeeklyChallenges: WeeklyChallenge[] = [
  {
    id: '1',
    title: 'Daily Innovation',
    description: 'Check-in for 7 consecutive days',
    progress: 5,
    target: 7,
    completed: false,
    reward: 'Premium Badge + Mentor Session'
  },
  {
    id: '2',
    title: 'Team Collaboration',
    description: 'Comment on 10 projects this week',
    progress: 8,
    target: 10,
    completed: false,
    reward: 'Team Building Voucher'
  },
  {
    id: '3',
    title: 'Shopping Streak',
    description: 'Make purchases for 3 consecutive days',
    progress: 3,
    target: 3,
    completed: true,
    reward: 'Shopping Discount 20%'
  }
];

export const useStreakStore = create<StreakStore>((set) => ({
  streakData: {
    currentStreak: 5,
    longestStreak: 12,
    lastCheckIn: '2025-01-13',
    totalCheckIns: 28,
    rewardsEarned: mockRewards,
    weeklyProgress: 5,
    monthlyGoal: 20
  },
  shoppingOrders: mockShoppingOrders,
  weeklyChallenges: mockWeeklyChallenges,

  checkIn: () => set((state) => {
    const today = dayjs().format('YYYY-MM-DD');
    const lastCheckIn = state.streakData.lastCheckIn;
    const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    
    let newStreak = 1;
    if (lastCheckIn === yesterday) {
      newStreak = state.streakData.currentStreak + 1;
    } else if (lastCheckIn === today) {
      return state; // Already checked in today
    }

    return {
      streakData: {
        ...state.streakData,
        currentStreak: newStreak,
        longestStreak: Math.max(state.streakData.longestStreak, newStreak),
        lastCheckIn: today,
        totalCheckIns: state.streakData.totalCheckIns + 1,
        weeklyProgress: state.streakData.weeklyProgress + 1
      }
    };
  }),

  claimReward: (rewardId: string) => set((state) => ({
    streakData: {
      ...state.streakData,
      rewardsEarned: state.streakData.rewardsEarned.map(reward =>
        reward.id === rewardId 
          ? { ...reward, earned: true, earnedDate: dayjs().format('YYYY-MM-DD') }
          : reward
      )
    }
  })),

  addShoppingOrder: (order) => set((state) => ({
    shoppingOrders: [
      { ...order, id: Date.now().toString() },
      ...state.shoppingOrders
    ]
  })),

  updateWeeklyProgress: (challengeId: string, progress: number) => set((state) => ({
    weeklyChallenges: state.weeklyChallenges.map(challenge =>
      challenge.id === challengeId
        ? { ...challenge, progress, completed: progress >= challenge.target }
        : challenge
    )
  }))
}));