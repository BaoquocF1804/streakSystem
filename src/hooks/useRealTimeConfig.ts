import { useEffect, useRef, useState } from 'react';
import { useConfigStore, GlobalConfig } from '../stores/configStore';
import { message } from 'antd';

interface ConfigUpdateNotification {
  section: keyof GlobalConfig;
  changes: Partial<GlobalConfig[keyof GlobalConfig]>;
  timestamp: string;
  adminUser?: string;
}

interface UseRealTimeConfigOptions {
  enableNotifications?: boolean;
  pollInterval?: number;
  onConfigUpdate?: (notification: ConfigUpdateNotification) => void;
}

export const useRealTimeConfig = (options: UseRealTimeConfigOptions = {}) => {
  const {
    enableNotifications = true,
    pollInterval = 10000, // 10 seconds
    onConfigUpdate
  } = options;

  const { 
    config, 
    lastUpdated, 
    isLoading, 
    updateConfig, 
    setLoading 
  } = useConfigStore();

  const [isConnected, setIsConnected] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const pollIntervalRef = useRef<NodeJS.Timeout>();
  const lastUpdateRef = useRef<string>(lastUpdated);

  // Simulate WebSocket connection for real-time updates
  useEffect(() => {
    let ws: WebSocket | null = null;
    
    const connectWebSocket = () => {
      try {
        // In a real implementation, this would connect to a WebSocket server
        // For now, we'll simulate with a mock connection
        setIsConnected(true);
        setLastSyncTime(new Date().toISOString());
        
        // Simulate WebSocket message handling
        const handleMessage = (data: any) => {
          if (data.type === 'CONFIG_UPDATE') {
            const notification: ConfigUpdateNotification = {
              section: data.section,
              changes: data.changes,
              timestamp: data.timestamp,
              adminUser: data.adminUser
            };

            // Update config
            updateConfig(data.config);

            // Show notification if enabled
            if (enableNotifications) {
              message.info({
                content: `Configuration updated: ${data.section}`,
                duration: 3,
                key: 'config-update'
              });
            }

            // Call callback if provided
            if (onConfigUpdate) {
              onConfigUpdate(notification);
            }
          }
        };

        // Mock WebSocket for development
        (window as any).__configWebSocket = {
          send: (data: any) => console.log('Sending to WebSocket:', data),
          close: () => setIsConnected(false),
          onMessage: handleMessage
        };

      } catch (error) {
        console.error('Failed to connect to config WebSocket:', error);
        setIsConnected(false);
      }
    };

    // Connect WebSocket
    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
      setIsConnected(false);
    };
  }, [updateConfig, enableNotifications, onConfigUpdate]);

  // Polling fallback for config updates
  useEffect(() => {
    const pollForUpdates = async () => {
      try {
        setLoading(true);
        
        // Simulate API call to check for config updates
        const response = await fetchLatestConfig();
        
        if (response.lastUpdated !== lastUpdateRef.current) {
          // Configuration has been updated
          const oldConfig = config;
          updateConfig(response.config);
          
          // Detect which sections changed
          const changedSections = detectConfigChanges(oldConfig, response.config);
          
          if (changedSections.length > 0 && enableNotifications) {
            message.success({
              content: `Configuration updated: ${changedSections.join(', ')}`,
              duration: 4,
              key: 'config-poll-update'
            });
          }
          
          lastUpdateRef.current = response.lastUpdated;
          setLastSyncTime(new Date().toISOString());
        }
      } catch (error) {
        console.error('Failed to poll for config updates:', error);
      } finally {
        setLoading(false);
      }
    };

    // Set up polling interval
    pollIntervalRef.current = setInterval(pollForUpdates, pollInterval);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [config, updateConfig, enableNotifications, pollInterval, setLoading]);

  // Update last update reference when config changes
  useEffect(() => {
    lastUpdateRef.current = lastUpdated;
  }, [lastUpdated]);

  // Manual sync function
  const syncNow = async () => {
    try {
      setLoading(true);
      const response = await fetchLatestConfig();
      updateConfig(response.config);
      setLastSyncTime(new Date().toISOString());
      
      if (enableNotifications) {
        message.success('Configuration synced successfully');
      }
    } catch (error) {
      console.error('Failed to sync config:', error);
      if (enableNotifications) {
        message.error('Failed to sync configuration');
      }
    } finally {
      setLoading(false);
    }
  };

  // Get specific config value with type safety
  const getConfigValue = <K extends keyof GlobalConfig, T extends keyof GlobalConfig[K]>(
    section: K,
    key: T
  ): GlobalConfig[K][T] => {
    return config[section][key];
  };

  // Check if feature is enabled
  const isFeatureEnabled = (feature: keyof GlobalConfig['features']): boolean => {
    return config.features[feature];
  };

  // Check if user action is allowed based on limits
  const isActionAllowed = (action: string, currentCount: number): boolean => {
    switch (action) {
      case 'daily_games':
        return currentCount < config.games.maxDailyPlays;
      case 'daily_vouchers':
        return currentCount < config.shop.maxDailyVouchers;
      case 'daily_points':
        return currentCount < config.limits.maxPointsPerDay;
      case 'daily_checkins':
        return currentCount < config.limits.maxDailyCheckIns;
      default:
        return true;
    }
  };

  // Get remaining limit for an action
  const getRemainingLimit = (action: string, currentCount: number): number => {
    switch (action) {
      case 'daily_games':
        return Math.max(0, config.games.maxDailyPlays - currentCount);
      case 'daily_vouchers':
        return Math.max(0, config.shop.maxDailyVouchers - currentCount);
      case 'daily_points':
        return Math.max(0, config.limits.maxPointsPerDay - currentCount);
      case 'daily_checkins':
        return Math.max(0, config.limits.maxDailyCheckIns - currentCount);
      default:
        return 0;
    }
  };

  return {
    config,
    lastUpdated,
    isLoading,
    isConnected,
    lastSyncTime,
    syncNow,
    getConfigValue,
    isFeatureEnabled,
    isActionAllowed,
    getRemainingLimit
  };
};

// Helper function to simulate API call
const fetchLatestConfig = async (): Promise<{
  config: GlobalConfig;
  lastUpdated: string;
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Get current config from store
  const configStore = useConfigStore.getState();
  
  return {
    config: configStore.config,
    lastUpdated: configStore.lastUpdated
  };
};

// Helper function to detect config changes
const detectConfigChanges = (oldConfig: GlobalConfig, newConfig: GlobalConfig): string[] => {
  const changes: string[] = [];
  
  for (const section in newConfig) {
    const sectionKey = section as keyof GlobalConfig;
    if (JSON.stringify(oldConfig[sectionKey]) !== JSON.stringify(newConfig[sectionKey])) {
      changes.push(section);
    }
  }
  
  return changes;
};

// Hook for specific config sections
export const useGameConfig = () => {
  const { config, getConfigValue, isFeatureEnabled } = useRealTimeConfig();
  
  return {
    gameConfig: config.games,
    maxDailyPlays: getConfigValue('games', 'maxDailyPlays'),
    enableMultiplayer: getConfigValue('games', 'enableMultiplayer'),
    streakBonusMultiplier: getConfigValue('games', 'streakBonusMultiplier'),
    isMultiplayerEnabled: isFeatureEnabled('multiplayerGames'),
    timeouts: config.games.timeouts,
    pointsPerGame: getConfigValue('games', 'pointsPerGame'),
    experiencePerGame: getConfigValue('games', 'experiencePerGame')
  };
};

export const useShopConfig = () => {
  const { config, getConfigValue, isFeatureEnabled } = useRealTimeConfig();
  
  return {
    shopConfig: config.shop,
    maxDailyVouchers: getConfigValue('shop', 'maxDailyVouchers'),
    streakRequiredForDiscounts: getConfigValue('shop', 'streakRequiredForDiscounts'),
    enableGroupBuy: getConfigValue('shop', 'enableGroupBuy'),
    isGroupBuyEnabled: isFeatureEnabled('socialCommerce'),
    minimumGroupSize: getConfigValue('shop', 'minimumGroupSize'),
    maxGroupSize: getConfigValue('shop', 'maxGroupSize'),
    discountPercentage: getConfigValue('shop', 'discountPercentage'),
    freeShippingThreshold: getConfigValue('shop', 'freeShippingThreshold')
  };
};

export const useFeatureConfig = () => {
  const { config, isFeatureEnabled } = useRealTimeConfig();
  
  return {
    features: config.features,
    isFeatureEnabled,
    socialCommerce: isFeatureEnabled('socialCommerce'),
    communityTrees: isFeatureEnabled('communityTrees'),
    weeklyStreaks: isFeatureEnabled('weeklyStreaks'),
    reviewChallenges: isFeatureEnabled('reviewChallenges'),
    friendInvites: isFeatureEnabled('friendInvites'),
    productSharing: isFeatureEnabled('productSharing'),
    multiplayerGames: isFeatureEnabled('multiplayerGames')
  };
};

export const useUserLimits = () => {
  const { config, isActionAllowed, getRemainingLimit } = useRealTimeConfig();
  
  return {
    limits: config.limits,
    isActionAllowed,
    getRemainingLimit,
    maxDailyCheckIns: config.limits.maxDailyCheckIns,
    maxPointsPerDay: config.limits.maxPointsPerDay,
    maxStreakBonus: config.limits.maxStreakBonus,
    maxVouchersPerUser: config.limits.maxVouchersPerUser,
    maxGamesPerSession: config.limits.maxGamesPerSession
  };
}; 