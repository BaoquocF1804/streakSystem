import { create } from 'zustand';
import { GameState, GameEngine, GameSession, GameAchievement, GameMilestone, PlayerLevel, MultiplayerMatch, CommunityTree } from '../types';
import dayjs from 'dayjs';

// Mock Games Data with Multiplayer Support
const mockGames: GameEngine[] = [
  {
    id: 'memory-game',
    name: 'Memory Master',
    description: 'Test your memory by matching pairs of cards',
    type: 'memory',
    difficulty: 'easy',
    pointsReward: 100,
    streakMultiplier: 1.5,
    timeLimit: 60,
    isActive: true,
    playCount: 0,
    bestScore: 0,
    icon: '🧠',
    color: '#3B82F6',
    multiplayerSupport: true,
    multiplayerBonus: 50
  },
  {
    id: 'math-quiz',
    name: 'Quick Math',
    description: 'Solve math problems as fast as you can',
    type: 'quiz',
    difficulty: 'medium',
    pointsReward: 150,
    streakMultiplier: 2.0,
    timeLimit: 30,
    isActive: true,
    playCount: 0,
    bestScore: 0,
    icon: '🔢',
    color: '#10B981',
    multiplayerSupport: true,
    multiplayerBonus: 75
  },
  {
    id: 'color-match',
    name: 'Color Harmony',
    description: 'Match colors and create beautiful patterns',
    type: 'puzzle',
    difficulty: 'medium',
    pointsReward: 120,
    streakMultiplier: 1.8,
    timeLimit: 45,
    isActive: true,
    playCount: 0,
    bestScore: 0,
    icon: '🎨',
    color: '#8B5CF6',
    multiplayerSupport: false,
    multiplayerBonus: 0
  },
  {
    id: 'reaction-time',
    name: 'Lightning Reflexes',
    description: 'Test your reaction speed against others',
    type: 'reaction',
    difficulty: 'hard',
    pointsReward: 200,
    streakMultiplier: 2.5,
    timeLimit: 10,
    isActive: false,
    playCount: 0,
    bestScore: 0,
    requirements: [
      { type: 'streak', value: 5, description: 'Maintain 5-day play streak' }
    ],
    icon: '⚡',
    color: '#F59E0B',
    multiplayerSupport: true,
    multiplayerBonus: 100
  },
  {
    id: 'word-puzzle',
    name: 'Word Wizard',
    description: 'Find words in letter grids',
    type: 'puzzle',
    difficulty: 'expert',
    pointsReward: 300,
    streakMultiplier: 3.0,
    timeLimit: 90,
    isActive: false,
    playCount: 0,
    bestScore: 0,
    requirements: [
      { type: 'level', value: 5, description: 'Reach level 5' }
    ],
    icon: '📝',
    color: '#EF4444',
    multiplayerSupport: true,
    multiplayerBonus: 150
  }
];

// Mock Achievements with Multiplayer
const mockAchievements: GameAchievement[] = [
  {
    id: 'first-game',
    gameId: 'memory-game',
    title: 'First Steps',
    description: 'Play your first game',
    icon: '🎮',
    category: 'gameplay',
    rarity: 'common',
    pointsReward: 50,
    requirements: [
      { type: 'play_count', value: 1, description: 'Play 1 game' }
    ],
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'multiplayer-champion',
    gameId: 'all',
    title: 'Multiplayer Champion',
    description: 'Win 10 multiplayer matches',
    icon: '👑',
    category: 'multiplayer',
    rarity: 'epic',
    pointsReward: 1000,
    requirements: [
      { type: 'multiplayer_wins', value: 10, description: 'Win 10 multiplayer matches' }
    ],
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'tree-guardian',
    gameId: 'all',
    title: 'Tree Guardian',
    description: 'Water community trees 50 times',
    icon: '🌳',
    category: 'social',
    rarity: 'rare',
    pointsReward: 500,
    requirements: [
      { type: 'play_count', value: 50, description: 'Water trees 50 times' }
    ],
    progress: 0,
    maxProgress: 50
  },
  {
    id: 'memory-master',
    gameId: 'memory-game',
    title: 'Memory Master',
    description: 'Complete Memory Game with perfect score',
    icon: '🧠',
    category: 'mastery',
    rarity: 'epic',
    pointsReward: 500,
    requirements: [
      { type: 'perfect_score', value: 1, description: 'Get perfect score' }
    ],
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'streak-warrior',
    gameId: 'all',
    title: 'Streak Warrior',
    description: 'Maintain 7-day gaming streak',
    icon: '🔥',
    category: 'streak',
    rarity: 'rare',
    pointsReward: 300,
    requirements: [
      { type: 'win_streak', value: 7, description: 'Win 7 games in a row' }
    ],
    progress: 0,
    maxProgress: 7
  }
];

// Mock Milestones with Tree Rewards
const mockMilestones: GameMilestone[] = [
  {
    id: 'milestone-1',
    title: 'First Victory',
    description: 'Win your first multiplayer match',
    type: 'multiplayer',
    requirement: 1,
    rewards: [
      { type: 'points', value: 200, description: 'Bonus 200 points' },
      { type: 'tree_seeds', value: 5, description: '5 tree seeds' }
    ],
    unlocked: false,
    progress: 0,
    icon: '🥇',
    rarity: 'common'
  },
  {
    id: 'milestone-2',
    title: 'Tree Planter',
    description: 'Plant your first community tree',
    type: 'achievement',
    requirement: 1,
    rewards: [
      { type: 'points', value: 500, description: 'Bonus 500 points' },
      { type: 'game_unlock', value: 'reaction-time', description: 'Unlock Lightning Reflexes' }
    ],
    unlocked: false,
    progress: 0,
    icon: '🌱',
    rarity: 'rare'
  },
  {
    id: 'milestone-3',
    title: 'Game Master',
    description: 'Play 50 games',
    type: 'play_count',
    requirement: 50,
    rewards: [
      { type: 'game_unlock', value: 'word-puzzle', description: 'Unlock Word Wizard' },
      { type: 'points', value: 1000, description: 'Bonus 1000 points' }
    ],
    unlocked: false,
    progress: 0,
    icon: '👑',
    rarity: 'epic'
  },
  {
    id: 'milestone-4',
    title: 'Forest Guardian',
    description: 'Grow a tree to Ancient stage',
    type: 'achievement',
    requirement: 1,
    rewards: [
      { type: 'special', value: 'golden-watering-can', description: 'Golden Watering Can' },
      { type: 'points', value: 5000, description: 'Bonus 5000 points' }
    ],
    unlocked: false,
    progress: 0,
    icon: '🌟',
    rarity: 'legendary'
  }
];

// Mock Community Trees
const mockCommunityTrees: CommunityTree[] = [
  {
    id: 'oak-tree-1',
    name: 'Community Oak',
    description: 'A mighty oak tree that grows with our collective effort',
    type: 'oak',
    level: 3,
    health: 75,
    maxHealth: 100,
    growthStage: 'young',
    totalWater: 150,
    waterToday: 25,
    lastWatered: dayjs().format('YYYY-MM-DD'),
    contributors: [
      {
        userId: '1',
        username: 'TreeLover',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100&h=100&fit=crop',
        waterContributed: 45,
        pointsEarned: 225,
        lastContribution: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
    ],
    rewards: [
      { level: 1, points: 50, description: 'Tree sprouted!', badge: 'tree-sprouter' },
      { level: 5, points: 200, description: 'Tree matured!', gameUnlock: 'nature-quiz' },
      { level: 10, points: 500, description: 'Ancient tree!', specialItem: 'mystical-seed' }
    ],
    unlockRequirement: {
      type: 'level',
      value: 1,
      description: 'Reach level 1'
    },
    isUnlocked: true,
    plantedAt: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
    specialEffects: [],
    rarity: 'common'
  },
  {
    id: 'cherry-tree-1',
    name: 'Cherry Blossom',
    description: 'Beautiful cherry tree that blooms with friendship',
    type: 'cherry',
    level: 1,
    health: 100,
    maxHealth: 100,
    growthStage: 'sprout',
    totalWater: 30,
    waterToday: 5,
    lastWatered: dayjs().format('YYYY-MM-DD'),
    contributors: [],
    rewards: [
      { level: 1, points: 100, description: 'Cherry sprouted!', badge: 'cherry-guardian' },
      { level: 3, points: 300, description: 'First blossoms!', specialItem: 'cherry-essence' },
      { level: 7, points: 700, description: 'Full bloom!', gameUnlock: 'zen-garden' }
    ],
    unlockRequirement: {
      type: 'multiplayer_wins',
      value: 5,
      description: 'Win 5 multiplayer matches'
    },
    isUnlocked: false,
    plantedAt: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
    specialEffects: ['seasonal_bonus'],
    rarity: 'rare'
  },
  {
    id: 'magic-tree-1',
    name: 'Mystic Willow',
    description: 'Legendary tree with magical properties',
    type: 'magic',
    level: 0,
    health: 50,
    maxHealth: 150,
    growthStage: 'seed',
    totalWater: 0,
    waterToday: 0,
    lastWatered: '',
    contributors: [],
    rewards: [
      { level: 1, points: 500, description: 'Magic awakened!', badge: 'mystic-gardener' },
      { level: 5, points: 2000, description: 'Ancient wisdom!', gameUnlock: 'mystic-puzzle' },
      { level: 10, points: 10000, description: 'World Tree!', specialItem: 'world-seed' }
    ],
    unlockRequirement: {
      type: 'achievements',
      value: 10,
      description: 'Unlock 10 achievements'
    },
    isUnlocked: false,
    plantedAt: '',
    specialEffects: ['point_multiplier', 'rare_rewards'],
    rarity: 'mythic'
  }
];

// Mock Player Level
const mockPlayerLevel: PlayerLevel = {
  level: 1,
  title: 'Novice Gamer',
  description: 'Just getting started on your gaming journey',
  pointsRequired: 500,
  currentPoints: 0,
  rewards: [
    { type: 'game', value: 'color-match', description: 'Unlock Color Harmony' },
    { type: 'tree_unlock', value: 'oak-tree-1', description: 'Unlock Community Oak' }
  ],
  gameUnlocks: ['memory-game', 'math-quiz'],
  bonusUnlocks: [],
  icon: '🌱',
  color: '#10B981'
};

interface GameStore extends GameState {
  // Game Actions
  playGame: (gameId: string, isMultiplayer?: boolean, opponentId?: string) => void;
  completeGame: (gameId: string, score: number, duration: number, isMultiplayer?: boolean, result?: 'win' | 'lose' | 'draw') => void;
  unlockGame: (gameId: string) => void;
  
  // Multiplayer Actions
  createMultiplayerMatch: (gameId: string) => string; // Returns room code
  joinMultiplayerMatch: (roomCode: string) => boolean;
  startMultiplayerMatch: (matchId: string) => void;
  completeMultiplayerMatch: (matchId: string, scores: { userId: string; score: number }[]) => void;
  
  // Achievement Actions
  checkAchievements: (gameId: string, score: number, isMultiplayer?: boolean, result?: string) => void;
  unlockAchievement: (achievementId: string) => void;
  
  // Streak Actions
  updateGameStreak: () => void;
  updateMultiplayerStreak: (result: 'win' | 'lose' | 'draw') => void;
  
  // Milestone Actions
  checkMilestones: () => void;
  unlockMilestone: (milestoneId: string) => void;
  
  // Level Actions
  checkLevelUp: () => void;
  levelUp: () => void;
  
  // Community Tree Actions
  waterTree: (treeId: string, amount: number) => boolean;
  unlockTree: (treeId: string) => void;
  checkTreeGrowth: (treeId: string) => void;
  getTreeStats: (treeId: string) => { totalWater: number; contributors: number; level: number } | null;
  
  // Stats
  getGameStats: (gameId: string) => { playCount: number; bestScore: number; averageScore: number } | null;
  getPlayerStats: () => { gamesPlayed: number; totalPoints: number; averageScore: number };
  getMultiplayerStats: () => { wins: number; losses: number; draws: number; totalMatches: number };
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial State
  games: mockGames,
  sessions: [],
  achievements: mockAchievements,
  streaks: [
    {
      id: 'daily-play',
      type: 'daily_play',
      currentStreak: 0,
      longestStreak: 0,
      lastActivity: '',
      multiplier: 1.0,
      bonusActive: false
    },
    {
      id: 'multiplayer-streak',
      type: 'multiplayer_streak',
      currentStreak: 0,
      longestStreak: 0,
      lastActivity: '',
      multiplier: 1.5,
      bonusActive: false
    }
  ],
  milestones: mockMilestones,
  playerLevel: mockPlayerLevel,
  totalPoints: 0,
  totalPlayTime: 0,
  gamesUnlocked: ['memory-game', 'math-quiz'],
  achievementsUnlocked: [],
  bonusesActive: [],
  currentGameStreak: 0,
  longestGameStreak: 0,
  lastActivity: '',
  // Multiplayer State
  multiplayerMatches: [],
  currentMatch: undefined,
  // Community Tree State
  communityTrees: mockCommunityTrees,
  myTreeContributions: [],
  dailyWaterUsed: 0,
  maxDailyWater: 20,

  // Game Actions
  playGame: (gameId: string, isMultiplayer = false, opponentId = '') => {
    const state = get();
    const game = state.games.find(g => g.id === gameId);
    if (!game) return;

    set({
      games: state.games.map(g => 
        g.id === gameId 
          ? { ...g, playCount: g.playCount + 1 }
          : g
      )
    });

    // If multiplayer, create or join match
    if (isMultiplayer && game.multiplayerSupport) {
      if (opponentId) {
        // Join existing match logic
      } else {
        // Create new match
        get().createMultiplayerMatch(gameId);
      }
    }
  },

  completeGame: (gameId: string, score: number, duration: number, isMultiplayer = false, result = 'win') => {
    const state = get();
    const game = state.games.find(g => g.id === gameId);
    if (!game) return;

    let pointsEarned = Math.floor(score * game.streakMultiplier);
    
    // Multiplayer bonus
    if (isMultiplayer && result === 'win') {
      pointsEarned += game.multiplayerBonus;
    }

    // Create game session
    const session: GameSession = {
      id: `session-${Date.now()}`,
      gameId,
      userId: 'current-user',
      score,
      duration,
      completed: true,
      pointsEarned,
      streakContribution: 1,
      playedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      achievements: [],
      isMultiplayer,
      result: isMultiplayer ? result : undefined,
      multiplayerBonus: isMultiplayer && result === 'win' ? game.multiplayerBonus : 0
    };

    // Update game best score
    const updatedGames = state.games.map(g => 
      g.id === gameId 
        ? { ...g, bestScore: Math.max(g.bestScore, score) }
        : g
    );

    // Update total points
    const newTotalPoints = state.totalPoints + pointsEarned;
    const newTotalPlayTime = state.totalPlayTime + duration;

    set({
      games: updatedGames,
      sessions: [session, ...state.sessions],
      totalPoints: newTotalPoints,
      totalPlayTime: newTotalPlayTime,
      lastActivity: dayjs().format('YYYY-MM-DD HH:mm:ss')
    });

    // Check for achievements and milestones
    get().checkAchievements(gameId, score, isMultiplayer, result);
    get().checkMilestones();
    get().checkLevelUp();
    get().updateGameStreak();
    
    if (isMultiplayer) {
      get().updateMultiplayerStreak(result as 'win' | 'lose' | 'draw');
    }
  },

  unlockGame: (gameId: string) => {
    const state = get();
    set({
      gamesUnlocked: [...state.gamesUnlocked, gameId],
      games: state.games.map(g => 
        g.id === gameId 
          ? { ...g, isActive: true }
          : g
      )
    });
  },

  // Multiplayer Actions
  createMultiplayerMatch: (gameId: string) => {
    const state = get();
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const match: MultiplayerMatch = {
      id: `match-${Date.now()}`,
      gameId,
      players: [state.playerLevel], // Current user
      status: 'waiting',
      scores: [],
      bonusPoints: state.games.find(g => g.id === gameId)?.multiplayerBonus || 0,
      roomCode
    };

    set({
      multiplayerMatches: [...state.multiplayerMatches, match],
      currentMatch: match
    });

    return roomCode;
  },

  joinMultiplayerMatch: (roomCode: string) => {
    const state = get();
    const match = state.multiplayerMatches.find(m => m.roomCode === roomCode && m.status === 'waiting');
    
    if (match && match.players.length < 2) {
      const updatedMatch = {
        ...match,
        players: [...match.players, state.playerLevel],
        status: 'in_progress' as const,
        startedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
      };

      set({
        multiplayerMatches: state.multiplayerMatches.map(m => 
          m.id === match.id ? updatedMatch : m
        ),
        currentMatch: updatedMatch
      });
      
      return true;
    }
    
    return false;
  },

  startMultiplayerMatch: (matchId: string) => {
    const state = get();
    set({
      multiplayerMatches: state.multiplayerMatches.map(m => 
        m.id === matchId 
          ? { ...m, status: 'in_progress', startedAt: dayjs().format('YYYY-MM-DD HH:mm:ss') }
          : m
      )
    });
  },

  completeMultiplayerMatch: (matchId: string, scores: { userId: string; score: number }[]) => {
    const state = get();
    const match = state.multiplayerMatches.find(m => m.id === matchId);
    if (!match) return;

    const winner = scores.reduce((prev, current) => 
      prev.score > current.score ? prev : current
    );

    set({
      multiplayerMatches: state.multiplayerMatches.map(m => 
        m.id === matchId 
          ? { 
              ...m, 
              status: 'completed', 
              completedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              winner: winner.userId,
              scores: scores.map((s, index) => ({ 
                userId: s.userId, 
                score: s.score, 
                pointsEarned: s.score * 10, 
                position: index + 1 
              }))
            }
          : m
      ),
      currentMatch: undefined
    });
  },

  // Achievement Actions
  checkAchievements: (gameId: string, score: number, isMultiplayer = false, result = 'win') => {
    const state = get();
    const gameAchievements = state.achievements.filter(a => 
      a.gameId === gameId || a.gameId === 'all'
    );

    gameAchievements.forEach(achievement => {
      if (achievement.unlockedAt) return; // Already unlocked

      let shouldUnlock = false;
      const requirement = achievement.requirements[0];

      switch (requirement.type) {
        case 'play_count': {
          const playCount = state.sessions.filter(s => s.gameId === gameId).length;
          achievement.progress = playCount;
          shouldUnlock = playCount >= requirement.value;
          break;
        }
        case 'high_score': {
          achievement.progress = score;
          shouldUnlock = score >= requirement.value;
          break;
        }
        case 'multiplayer_wins': {
          const wins = state.sessions.filter(s => s.isMultiplayer && s.result === 'win').length;
          achievement.progress = wins;
          shouldUnlock = wins >= requirement.value;
          break;
        }
        case 'perfect_score':
          // Perfect score logic
          break;
        case 'win_streak':
          // Win streak logic
          break;
      }

      if (shouldUnlock) {
        get().unlockAchievement(achievement.id);
      }
    });
  },

  unlockAchievement: (achievementId: string) => {
    const state = get();
    const achievement = state.achievements.find(a => a.id === achievementId);
    if (!achievement) return;

    set({
      achievements: state.achievements.map(a => 
        a.id === achievementId 
          ? { ...a, unlockedAt: dayjs().format('YYYY-MM-DD HH:mm:ss') }
          : a
      ),
      achievementsUnlocked: [...state.achievementsUnlocked, achievementId],
      totalPoints: state.totalPoints + achievement.pointsReward
    });
  },

  // Streak Actions
  updateGameStreak: () => {
    const state = get();
    const today = dayjs().format('YYYY-MM-DD');
    const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

    const dailyStreak = state.streaks.find(s => s.type === 'daily_play');
    if (!dailyStreak) return;

    const lastPlayDate = dailyStreak.lastActivity.split(' ')[0];
    let newStreak = 1;

    if (lastPlayDate === yesterday) {
      newStreak = dailyStreak.currentStreak + 1;
    } else if (lastPlayDate === today) {
      newStreak = dailyStreak.currentStreak;
    }

    set({
      streaks: state.streaks.map(s => 
        s.type === 'daily_play' 
          ? { 
              ...s, 
              currentStreak: newStreak,
              longestStreak: Math.max(s.longestStreak, newStreak),
              lastActivity: dayjs().format('YYYY-MM-DD HH:mm:ss')
            }
          : s
      ),
      currentGameStreak: newStreak,
      longestGameStreak: Math.max(state.longestGameStreak, newStreak)
    });
  },

  updateMultiplayerStreak: (result: 'win' | 'lose' | 'draw') => {
    const state = get();
    const multiplayerStreak = state.streaks.find(s => s.type === 'multiplayer_streak');
    if (!multiplayerStreak) return;

    const newStreak = result === 'win' ? multiplayerStreak.currentStreak + 1 : 0;

    set({
      streaks: state.streaks.map(s => 
        s.type === 'multiplayer_streak' 
          ? { 
              ...s, 
              currentStreak: newStreak,
              longestStreak: Math.max(s.longestStreak, newStreak),
              lastActivity: dayjs().format('YYYY-MM-DD HH:mm:ss')
            }
          : s
      )
    });
  },

  // Milestone Actions
  checkMilestones: () => {
    const state = get();
    
    state.milestones.forEach(milestone => {
      if (milestone.unlocked) return;

      let progress = 0;
      let shouldUnlock = false;

      switch (milestone.type) {
        case 'score':
          progress = state.totalPoints;
          shouldUnlock = progress >= milestone.requirement;
          break;
        case 'play_count':
          progress = state.sessions.length;
          shouldUnlock = progress >= milestone.requirement;
          break;
        case 'streak':
          progress = state.currentGameStreak;
          shouldUnlock = progress >= milestone.requirement;
          break;
        case 'multiplayer':
          progress = state.sessions.filter(s => s.isMultiplayer && s.result === 'win').length;
          shouldUnlock = progress >= milestone.requirement;
          break;
        case 'time':
          progress = state.totalPlayTime;
          shouldUnlock = progress >= milestone.requirement;
          break;
      }

      if (shouldUnlock) {
        get().unlockMilestone(milestone.id);
      } else {
        // Update progress
        set({
          milestones: state.milestones.map(m => 
            m.id === milestone.id 
              ? { ...m, progress }
              : m
          )
        });
      }
    });
  },

  unlockMilestone: (milestoneId: string) => {
    const state = get();
    const milestone = state.milestones.find(m => m.id === milestoneId);
    if (!milestone) return;

    // Process rewards
    milestone.rewards.forEach(reward => {
      switch (reward.type) {
        case 'game_unlock':
          get().unlockGame(reward.value as string);
          break;
        case 'points':
          set({ totalPoints: state.totalPoints + (reward.value as number) });
          break;
        case 'tree_seeds':
          // Add tree seeds logic
          break;
      }
    });

    set({
      milestones: state.milestones.map(m => 
        m.id === milestoneId 
          ? { ...m, unlocked: true, unlockedAt: dayjs().format('YYYY-MM-DD HH:mm:ss') }
          : m
      )
    });
  },

  // Level Actions
  checkLevelUp: () => {
    const state = get();
    if (state.totalPoints >= state.playerLevel.pointsRequired) {
      get().levelUp();
    }
  },

  levelUp: () => {
    const state = get();
    const newLevel = state.playerLevel.level + 1;
    const newPointsRequired = newLevel * 500; // 500 points per level

    // Level titles
    const levelTitles = [
      { level: 1, title: 'Novice Gamer', description: 'Just getting started', icon: '🌱' },
      { level: 2, title: 'Casual Player', description: 'Getting the hang of it', icon: '🎮' },
      { level: 3, title: 'Dedicated Gamer', description: 'Playing regularly', icon: '🎯' },
      { level: 4, title: 'Skilled Player', description: 'Showing real skill', icon: '⭐' },
      { level: 5, title: 'Expert Gamer', description: 'Master of games', icon: '👑' },
      { level: 6, title: 'Game Master', description: 'Elite player', icon: '🏆' },
      { level: 7, title: 'Legend', description: 'Gaming legend', icon: '🌟' }
    ];

    const levelInfo = levelTitles.find(l => l.level === newLevel) || levelTitles[levelTitles.length - 1];

    set({
      playerLevel: {
        ...state.playerLevel,
        level: newLevel,
        title: levelInfo.title,
        description: levelInfo.description,
        pointsRequired: newPointsRequired,
        currentPoints: state.totalPoints,
        icon: levelInfo.icon,
        color: '#3B82F6'
      }
    });
  },

  // Community Tree Actions
  waterTree: (treeId: string, amount: number = 1) => {
    const state = get();
    
    // Check daily water limit
    if (state.dailyWaterUsed >= state.maxDailyWater) {
      return false;
    }

    const tree = state.communityTrees.find(t => t.id === treeId);
    if (!tree || !tree.isUnlocked) return false;

    const today = dayjs().format('YYYY-MM-DD');
    const pointsEarned = amount * 5; // 5 points per water

    // Update tree
    const updatedTree = {
      ...tree,
      totalWater: tree.totalWater + amount,
      waterToday: tree.lastWatered === today ? tree.waterToday + amount : amount,
      lastWatered: today,
      health: Math.min(tree.maxHealth, tree.health + amount * 2)
    };

    // Update contributor
    const existingContributor = updatedTree.contributors.find(c => c.userId === 'current-user');
    if (existingContributor) {
      existingContributor.waterContributed += amount;
      existingContributor.pointsEarned += pointsEarned;
      existingContributor.lastContribution = dayjs().format('YYYY-MM-DD HH:mm:ss');
    } else {
      updatedTree.contributors.push({
        userId: 'current-user',
        username: 'Player',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100&h=100&fit=crop',
        waterContributed: amount,
        pointsEarned,
        lastContribution: dayjs().format('YYYY-MM-DD HH:mm:ss')
      });
    }

    set({
      communityTrees: state.communityTrees.map(t => 
        t.id === treeId ? updatedTree : t
      ),
      dailyWaterUsed: state.dailyWaterUsed + amount,
      totalPoints: state.totalPoints + pointsEarned
    });

    // Check tree growth
    get().checkTreeGrowth(treeId);
    
    return true;
  },

  unlockTree: (treeId: string) => {
    const state = get();
    set({
      communityTrees: state.communityTrees.map(t => 
        t.id === treeId 
          ? { ...t, isUnlocked: true, plantedAt: dayjs().format('YYYY-MM-DD') }
          : t
      )
    });
  },

  checkTreeGrowth: (treeId: string) => {
    const state = get();
    const tree = state.communityTrees.find(t => t.id === treeId);
    if (!tree) return;

    const growthThresholds = {
      'seed': 0,
      'sprout': 20,
      'sapling': 50,
      'young': 100,
      'mature': 200,
      'ancient': 500
    };

    let newStage = tree.growthStage;
    let newLevel = tree.level;

    // Check for growth
    if (tree.totalWater >= growthThresholds.ancient && tree.growthStage !== 'ancient') {
      newStage = 'ancient';
      newLevel = Math.max(10, newLevel);
    } else if (tree.totalWater >= growthThresholds.mature && tree.growthStage !== 'mature') {
      newStage = 'mature';
      newLevel = Math.max(7, newLevel);
    } else if (tree.totalWater >= growthThresholds.young && tree.growthStage !== 'young') {
      newStage = 'young';
      newLevel = Math.max(5, newLevel);
    } else if (tree.totalWater >= growthThresholds.sapling && tree.growthStage !== 'sapling') {
      newStage = 'sapling';
      newLevel = Math.max(3, newLevel);
    } else if (tree.totalWater >= growthThresholds.sprout && tree.growthStage !== 'sprout') {
      newStage = 'sprout';
      newLevel = Math.max(1, newLevel);
    }

    if (newStage !== tree.growthStage || newLevel !== tree.level) {
      set({
        communityTrees: state.communityTrees.map(t => 
          t.id === treeId 
            ? { ...t, growthStage: newStage, level: newLevel }
            : t
        )
      });

      // Award growth rewards
      const reward = tree.rewards.find(r => r.level === newLevel);
      if (reward) {
        set({ totalPoints: state.totalPoints + reward.points });
      }
    }
  },

  getTreeStats: (treeId: string) => {
    const state = get();
    const tree = state.communityTrees.find(t => t.id === treeId);
    
    if (!tree) return null;
    
    return {
      totalWater: tree.totalWater,
      contributors: tree.contributors.length,
      level: tree.level
    };
  },

  // Stats
  getGameStats: (gameId: string) => {
    const state = get();
    const game = state.games.find(g => g.id === gameId);
    const sessions = state.sessions.filter(s => s.gameId === gameId);
    
    if (!game) return null;
    
    return {
      playCount: sessions.length,
      bestScore: game.bestScore,
      averageScore: sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length || 0
    };
  },

  getPlayerStats: () => {
    const state = get();
    
    return {
      gamesPlayed: state.sessions.length,
      totalPoints: state.totalPoints,
      averageScore: state.sessions.reduce((sum, s) => sum + s.score, 0) / state.sessions.length || 0
    };
  },

  getMultiplayerStats: () => {
    const state = get();
    const multiplayerSessions = state.sessions.filter(s => s.isMultiplayer);
    const wins = multiplayerSessions.filter(s => s.result === 'win').length;
    const losses = multiplayerSessions.filter(s => s.result === 'lose').length;
    const draws = multiplayerSessions.filter(s => s.result === 'draw').length;
    
    return {
      wins,
      losses,
      draws,
      totalMatches: multiplayerSessions.length
    };
  }
})); 