# 🎛️ Global Configuration System Guide

## 📋 Tổng quan

Hệ thống Global Configuration cho phép admin cấu hình các thông số hệ thống một cách tập trung và user sẽ nhận được cập nhật real-time mà không cần refresh trang.

## 🎯 Tính năng chính

### ✅ Đã triển khai
- **Shared Configuration Store**: Lưu trữ tập trung tất cả cấu hình
- **Real-time Updates**: User nhận cập nhật ngay lập tức khi admin thay đổi
- **Admin Interface**: Giao diện quản lý cấu hình toàn diện
- **Type Safety**: Full TypeScript support
- **Persistent Storage**: Lưu trữ local và sync với server
- **Feature Toggles**: Bật/tắt tính năng theo thời gian thực

## 🚀 Cách sử dụng

### 👨‍💼 Cho Admin

#### 1. Truy cập Admin Panel
```
URL: /admin/config
```

#### 2. Các Tab cấu hình
- **Games**: Cấu hình trò chơi (giới hạn daily, multiplayer, điểm số)
- **Shop**: Cấu hình shop (voucher, group buy, free shipping)
- **User Limits**: Giới hạn người dùng (check-in, điểm số, voucher)
- **Features**: Bật/tắt tính năng (social commerce, community trees)
- **Streaks**: Cấu hình streak system (bonus, multiplier)
- **Notifications**: Cài đặt thông báo
- **System**: Cài đặt hệ thống (maintenance mode, session timeout)

#### 3. Các thao tác
- **Save Configuration**: Lưu cấu hình và apply system-wide
- **Sync to Users**: Đồng bộ cấu hình đến tất cả user
- **Reset**: Reset về default values
- **Real-time preview**: Xem thống kê cấu hình hiện tại

### 👨‍💻 Cho Developers

#### 1. Sử dụng Real-time Config Hooks

```typescript
// Import hooks
import { 
  useRealTimeConfig, 
  useGameConfig, 
  useShopConfig, 
  useFeatureConfig, 
  useUserLimits 
} from '../hooks/useRealTimeConfig';

// Sử dụng trong component
const MyComponent = () => {
  // Hook tổng quát
  const { config, isLoading, syncNow } = useRealTimeConfig();
  
  // Hook chuyên biệt
  const { maxDailyPlays, enableMultiplayer } = useGameConfig();
  const { maxDailyVouchers, enableGroupBuy } = useShopConfig();
  const { socialCommerce, communityTrees } = useFeatureConfig();
  const { isActionAllowed, getRemainingLimit } = useUserLimits();
  
  // Kiểm tra giới hạn
  const canPlayGame = isActionAllowed('daily_games', currentGameCount);
  const remainingGames = getRemainingLimit('daily_games', currentGameCount);
  
  return (
    <div>
      {enableMultiplayer && <MultiplayerButton />}
      {socialCommerce && <SocialFeatures />}
      <p>Remaining games: {remainingGames}</p>
    </div>
  );
};
```

#### 2. Cấu hình Notifications

```typescript
const { config } = useRealTimeConfig({
  enableNotifications: true,
  pollInterval: 5000,
  onConfigUpdate: (notification) => {
    console.log('Config updated:', notification);
    // Handle config changes
  }
});
```

#### 3. Truy cập Config Store trực tiếp

```typescript
import { useConfigStore } from '../stores/configStore';

const { config, updateConfig, resetConfig } = useConfigStore();

// Update config
updateConfig({ games: { maxDailyPlays: 20 } });

// Reset config
resetConfig();
```

## 📊 Cấu trúc Config

### Games Configuration
```typescript
games: {
  maxDailyPlays: number;           // Giới hạn game/ngày
  enableMultiplayer: boolean;      // Bật/tắt multiplayer
  streakBonusMultiplier: number;   // Hệ số bonus streak
  timeouts: {
    memoryGame: number;            // Timeout memory game
    mathQuiz: number;              // Timeout math quiz
  };
  pointsPerGame: number;           // Điểm/game
  experiencePerGame: number;       // Kinh nghiệm/game
  achievementMultiplier: number;   // Hệ số achievement
}
```

### Shop Configuration
```typescript
shop: {
  maxDailyVouchers: number;        // Giới hạn voucher/ngày
  streakRequiredForDiscounts: number; // Streak cần cho discount
  enableGroupBuy: boolean;         // Bật/tắt group buy
  minimumGroupSize: number;        // Số người tối thiểu group
  maxGroupSize: number;            // Số người tối đa group
  discountPercentage: number;      // % discount
  freeShippingThreshold: number;   // Ngưỡng free shipping
}
```

### User Limits
```typescript
limits: {
  maxDailyCheckIns: number;        // Giới hạn check-in/ngày
  maxPointsPerDay: number;         // Giới hạn điểm/ngày
  maxStreakBonus: number;          // Bonus streak tối đa
  maxVouchersPerUser: number;      // Voucher tối đa/user
  maxGamesPerSession: number;      // Game tối đa/session
}
```

### Features Toggle
```typescript
features: {
  socialCommerce: boolean;         // Tính năng social commerce
  communityTrees: boolean;         // Community trees game
  weeklyStreaks: boolean;          // Weekly streak challenges
  reviewChallenges: boolean;       // Review challenges
  friendInvites: boolean;          // Friend invitation system
  productSharing: boolean;         // Product sharing
  multiplayerGames: boolean;       // Multiplayer games
}
```

## 🔧 API Reference

### useRealTimeConfig Hook
```typescript
const {
  config,                          // Toàn bộ config
  lastUpdated,                     // Thời gian cập nhật cuối
  isLoading,                       // Trạng thái loading
  isConnected,                     // Trạng thái kết nối WebSocket
  lastSyncTime,                    // Thời gian sync cuối
  syncNow,                         // Function sync manual
  getConfigValue,                  // Get value từ config
  isFeatureEnabled,                // Kiểm tra feature enabled
  isActionAllowed,                 // Kiểm tra action allowed
  getRemainingLimit                // Get remaining limit
} = useRealTimeConfig(options);
```

### Admin Store Methods
```typescript
const {
  updateGlobalConfig,              // Cập nhật config
  syncConfigToUsers,               // Sync config đến users
  resetGlobalConfig,               // Reset config
  getGlobalConfigStats             // Get stats
} = useAdminStore();
```

## 🛠️ Troubleshooting

### 1. Config không cập nhật
```typescript
// Force sync
const { syncNow } = useRealTimeConfig();
syncNow();

// Hoặc restart polling
const { config } = useRealTimeConfig({ pollInterval: 5000 });
```

### 2. Feature không hoạt động
```typescript
// Kiểm tra feature enabled
const { isFeatureEnabled } = useFeatureConfig();
if (!isFeatureEnabled('socialCommerce')) {
  // Feature bị disabled
}
```

### 3. Limit không đúng
```typescript
// Kiểm tra limit
const { isActionAllowed, getRemainingLimit } = useUserLimits();
const canPlay = isActionAllowed('daily_games', currentCount);
const remaining = getRemainingLimit('daily_games', currentCount);
```

## 🎨 Best Practices

### 1. Sử dụng chuyên biệt hooks
```typescript
// ❌ Không nên
const { config } = useRealTimeConfig();
const maxGames = config.games.maxDailyPlays;

// ✅ Nên
const { maxDailyPlays } = useGameConfig();
```

### 2. Kiểm tra limits trước khi action
```typescript
// ✅ Luôn kiểm tra limits
const { isActionAllowed } = useUserLimits();
const handlePlayGame = () => {
  if (!isActionAllowed('daily_games', currentCount)) {
    message.error('Reached daily limit');
    return;
  }
  // Proceed with game
};
```

### 3. Handle config updates
```typescript
// ✅ Handle config changes
const { config } = useRealTimeConfig({
  onConfigUpdate: (notification) => {
    if (notification.section === 'games') {
      // Reload game settings
      refreshGameSettings();
    }
  }
});
```

## 🔄 Luồng hoạt động

1. **Admin thay đổi config** → Global Config Page
2. **Config được lưu** → Config Store
3. **Real-time notification** → WebSocket/Polling
4. **User components cập nhật** → Hooks
5. **UI reflects changes** → Automatic re-render

## 📈 Monitoring

Admin có thể theo dõi:
- Số lượng features active
- Thời gian cập nhật cuối
- Trạng thái sync
- Usage statistics

## 🔒 Security

- Config changes được log
- Admin authentication required
- Validation cho tất cả config values
- Rollback capability

---

**🎉 Hệ thống configuration đã sẵn sàng sử dụng!** 