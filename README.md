# Teko Social Shop

![React](https://img.shields.io/badge/React-18.x-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![Ant Design](https://img.shields.io/badge/Ant%20Design-5.x-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.x-purple.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-cyan.svg)

Một nền tảng mua sắm xã hội hiện đại với hệ thống quản lý admin toàn diện, tích hợp các tính năng game hóa, streak shopping, và cộng đồng xã hội.

## 🚀 Tính năng chính

### 🛒 Nền tảng mua sắm
- **Shop Interface**: Giao diện mua sắm trực quan với danh sách sản phẩm
- **Shopping Streak**: Hệ thống streak khuyến khích mua sắm thường xuyên
- **Group Buy**: Tính năng mua chung với giá ưu đãi
- **Voucher System**: Hệ thống voucher và khuyến mãi

### 🎮 Game hóa
- **Daily Check-in**: Điểm danh hàng ngày với phần thưởng
- **Mini Games**: Các trò chơi nhỏ (Memory Game, Math Quiz)
- **Community Trees**: Trò chơi cộng đồng trồng cây
- **Multiplayer Lobby**: Phòng chơi nhiều người

### 👥 Tính năng xã hội
- **Social Dashboard**: Bảng điều khiển xã hội
- **Product Sharing**: Chia sẻ sản phẩm
- **Review System**: Hệ thống đánh giá và nhận xét
- **Group Management**: Quản lý nhóm và cộng đồng

### 🔧 Admin Panel
- **User Management**: Quản lý người dùng
- **Game Configuration**: Cấu hình trò chơi
- **Voucher Management**: Quản lý voucher
- **Analytics**: Báo cáo và thống kê
- **Social Hub Management**: Quản lý tính năng xã hội

## 🛠️ Công nghệ sử dụng

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: Ant Design 5.x
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **Animation**: Framer Motion
- **Icons**: Ant Design Icons

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js >= 18.0.0
- npm hoặc yarn

### Cài đặt dependencies
```bash
# Clone repository
git clone <repository-url>
cd project

# Cài đặt dependencies
npm install
# hoặc
yarn install
```

### Chạy ứng dụng
```bash
# Development mode
npm run dev
# hoặc
yarn dev

# Build for production
npm run build
# hoặc
yarn build

# Preview production build
npm run preview
# hoặc
yarn preview
```

## 📁 Cấu trúc dự án

```
project/
├── src/
│   ├── components/          # React components
│   │   ├── admin/          # Admin panel components
│   │   │   ├── layout/     # Admin layout components
│   │   │   └── social/     # Social management components
│   │   ├── auth/           # Authentication components
│   │   ├── games/          # Game components
│   │   ├── shop/           # Shopping components
│   │   └── streak/         # Streak system components
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin pages
│   │   └── [other-pages]   # User pages
│   ├── stores/             # Zustand stores
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
└── [config files]         # Configuration files
```

## 🎯 Hướng dẫn sử dụng

### Đăng nhập
1. Truy cập `/auth` để đăng nhập với tài khoản người dùng
2. Truy cập `/admin/login` để đăng nhập admin

### Người dùng
- **Shop**: Duyệt và mua sắm sản phẩm
- **Check-in**: Điểm danh hàng ngày
- **Games**: Tham gia các trò chơi
- **Social**: Tương tác xã hội và chia sẻ

### Admin
- **Dashboard**: Tổng quan hệ thống
- **Users**: Quản lý người dùng
- **Games**: Cấu hình trò chơi
- **Vouchers**: Quản lý voucher
- **Social Hub**: Quản lý tính năng xã hội

## 🔧 Cấu hình

### Environment Variables
Tạo file `.env` với các biến môi trường cần thiết:
```env
VITE_API_URL=your_api_url
VITE_APP_NAME=Teko Social Shop
```

### Customization
- **Theme**: Chỉnh sửa trong `App.tsx` (Ant Design theme)
- **Colors**: Cấu hình trong `tailwind.config.js`
- **Routes**: Quản lý trong `App.tsx`

## 🚀 Deployment

### Build Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Mở Pull Request

## 📝 Code Style

- Sử dụng TypeScript cho type safety
- Follow ESLint rules
- Sử dụng Prettier cho code formatting
- Component naming: PascalCase
- File naming: camelCase

## 🐛 Troubleshooting

### Common Issues

1. **Import errors**: Kiểm tra đường dẫn import
2. **Build errors**: Xóa `node_modules` và reinstall
3. **TypeScript errors**: Kiểm tra type definitions

### Debug Mode
```bash
npm run dev -- --debug
```

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Development Team** - Teko Social Shop

## 📞 Support

Nếu bạn gặp vấn đề hoặc có câu hỏi, vui lòng tạo issue trên GitHub repository.

---

**Happy Coding! 🎉** 