import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GlobalConfig {
  // Game Configuration
  games: {
    maxDailyPlays: number;
    enableMultiplayer: boolean;
    streakBonusMultiplier: number;
    timeouts: {
      memoryGame: number;
      mathQuiz: number;
    };
    pointsPerGame: number;
    experiencePerGame: number;
    achievementMultiplier: number;
  };
  
  // Shop Configuration
  shop: {
    maxDailyVouchers: number;
    streakRequiredForDiscounts: number;
    enableGroupBuy: boolean;
    minimumGroupSize: number;
    maxGroupSize: number;
    discountPercentage: number;
    freeShippingThreshold: number;
  };
  
  // User Limits
  limits: {
    maxDailyCheckIns: number;
    maxPointsPerDay: number;
    maxStreakBonus: number;
    maxVouchersPerUser: number;
    maxGamesPerSession: number;
  };
  
  // Features Toggle
  features: {
    socialCommerce: boolean;
    communityTrees: boolean;
    weeklyStreaks: boolean;
    reviewChallenges: boolean;
    friendInvites: boolean;
    productSharing: boolean;
    multiplayerGames: boolean;
  };
  
  // Streak Configuration
  streaks: {
    dailyCheckinBonus: number;
    weeklyStreakBonus: number;
    monthlyStreakBonus: number;
    maxStreakMultiplier: number;
    resetGracePeriod: number; // hours
  };
  
  // Notifications
  notifications: {
    enablePush: boolean;
    enableEmail: boolean;
    streakReminders: boolean;
    gameInvites: boolean;
    voucherExpiry: boolean;
    newProductAlerts: boolean;
  };
  
  // System Settings
  system: {
    maintenanceMode: boolean;
    allowNewRegistrations: boolean;
    sessionTimeout: number; // minutes
    autoSaveInterval: number; // seconds
  };
}

interface ConfigStore {
  config: GlobalConfig;
  lastUpdated: string;
  isLoading: boolean;
  updateConfig: (newConfig: Partial<GlobalConfig>) => void;
  updateConfigSection: <K extends keyof GlobalConfig>(
    section: K, 
    sectionConfig: Partial<GlobalConfig[K]>
  ) => void;
  resetConfig: () => void;
  resetConfigSection: <K extends keyof GlobalConfig>(section: K) => void;
  getConfigValue: <K extends keyof GlobalConfig, T extends keyof GlobalConfig[K]>(
    section: K, 
    key: T
  ) => GlobalConfig[K][T];
  setLoading: (loading: boolean) => void;
}

const defaultConfig: GlobalConfig = {
  games: {
    maxDailyPlays: 10,
    enableMultiplayer: true,
    streakBonusMultiplier: 1.5,
    timeouts: {
      memoryGame: 60,
      mathQuiz: 30,
    },
    pointsPerGame: 100,
    experiencePerGame: 50,
    achievementMultiplier: 2,
  },
  shop: {
    maxDailyVouchers: 5,
    streakRequiredForDiscounts: 3,
    enableGroupBuy: true,
    minimumGroupSize: 3,
    maxGroupSize: 10,
    discountPercentage: 15,
    freeShippingThreshold: 500000,
  },
  limits: {
    maxDailyCheckIns: 1,
    maxPointsPerDay: 1000,
    maxStreakBonus: 500,
    maxVouchersPerUser: 20,
    maxGamesPerSession: 5,
  },
  features: {
    socialCommerce: true,
    communityTrees: true,
    weeklyStreaks: true,
    reviewChallenges: true,
    friendInvites: true,
    productSharing: true,
    multiplayerGames: true,
  },
  streaks: {
    dailyCheckinBonus: 10,
    weeklyStreakBonus: 100,
    monthlyStreakBonus: 500,
    maxStreakMultiplier: 3,
    resetGracePeriod: 24,
  },
  notifications: {
    enablePush: true,
    enableEmail: true,
    streakReminders: true,
    gameInvites: true,
    voucherExpiry: true,
    newProductAlerts: true,
  },
  system: {
    maintenanceMode: false,
    allowNewRegistrations: true,
    sessionTimeout: 60,
    autoSaveInterval: 30,
  },
};

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set, get) => ({
      config: defaultConfig,
      lastUpdated: new Date().toISOString(),
      isLoading: false,
      
      updateConfig: (newConfig: Partial<GlobalConfig>) => {
        set((state) => ({
          config: {
            ...state.config,
            ...newConfig,
          },
          lastUpdated: new Date().toISOString(),
        }));
      },
      
      updateConfigSection: <K extends keyof GlobalConfig>(
        section: K, 
        sectionConfig: Partial<GlobalConfig[K]>
      ) => {
        set((state) => ({
          config: {
            ...state.config,
            [section]: {
              ...state.config[section],
              ...sectionConfig,
            },
          },
          lastUpdated: new Date().toISOString(),
        }));
      },
      
      resetConfig: () => {
        set({ 
          config: defaultConfig,
          lastUpdated: new Date().toISOString(),
        });
      },
      
      resetConfigSection: <K extends keyof GlobalConfig>(section: K) => {
        set((state) => ({
          config: {
            ...state.config,
            [section]: defaultConfig[section],
          },
          lastUpdated: new Date().toISOString(),
        }));
      },
      
      getConfigValue: <K extends keyof GlobalConfig, T extends keyof GlobalConfig[K]>(
        section: K, 
        key: T
      ): GlobalConfig[K][T] => {
        return get().config[section][key];
      },
      
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'global-config',
      version: 1,
    }
  )
);

// Export helper functions
export const getConfig = () => useConfigStore.getState().config;
export const updateGlobalConfig = (newConfig: Partial<GlobalConfig>) => 
  useConfigStore.getState().updateConfig(newConfig);
export const updateConfigSection = <K extends keyof GlobalConfig>(
  section: K, 
  sectionConfig: Partial<GlobalConfig[K]>
) => useConfigStore.getState().updateConfigSection(section, sectionConfig); 