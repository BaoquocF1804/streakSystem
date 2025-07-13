import React from 'react';
import { Share2, MessageSquare, ShoppingCart, TrendingUp, Users, Award, Clock, Target } from 'lucide-react';

interface DashboardProps {
  stats: {
    totalShares: number;
    completedReviews: number;
    groupBuysJoined: number;
    pointsEarned: number;
    friendsConnected: number;
    badgesEarned: number;
  };
}

export default function Dashboard({ stats }: DashboardProps) {
  const cards = [
    {
      title: 'Sản phẩm đã chia sẻ',
      value: stats.totalShares,
      icon: Share2,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-700'
    },
    {
      title: 'Review song hành',
      value: stats.completedReviews,
      icon: MessageSquare,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      textColor: 'text-green-700'
    },
    {
      title: 'Nhóm mua tham gia',
      value: stats.groupBuysJoined,
      icon: ShoppingCart,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-700'
    },
    {
      title: 'Điểm tích lũy',
      value: stats.pointsEarned.toLocaleString(),
      icon: TrendingUp,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-100',
      textColor: 'text-orange-700'
    },
    {
      title: 'Bạn bè kết nối',
      value: stats.friendsConnected,
      icon: Users,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'from-pink-50 to-rose-100',
      textColor: 'text-rose-700'
    },
    {
      title: 'Huy hiệu đạt được',
      value: stats.badgesEarned,
      icon: Award,
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'from-indigo-50 to-purple-100',
      textColor: 'text-indigo-700'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-4">Chào mừng trở lại! 🎉</h2>
        <p className="text-lg opacity-90 mb-6">
          Khám phá những cơ hội kết nối mới và nhận thưởng hấp dẫn cùng bạn bè
        </p>
        <div className="flex flex-wrap gap-4">
          <button className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
            Chia sẻ sản phẩm mới
          </button>
          <button className="bg-purple-500 bg-opacity-20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-opacity-30 transition-colors border border-white border-opacity-20">
            Mời bạn bè tham gia
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${card.bgColor} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 border border-white border-opacity-50`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
              <p className={`font-medium ${card.textColor}`}>{card.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Hoạt động gần đây</h3>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {[
              { action: 'Chia sẻ iPhone 15 Pro', points: '+150 điểm', time: '2 giờ trước', type: 'share' },
              { action: 'Hoàn thành review song hành', points: '+300 điểm', time: '1 ngày trước', type: 'review' },
              { action: 'Tham gia nhóm mua AirPods', points: '+100 điểm', time: '3 ngày trước', type: 'group' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
                <div className="text-green-600 font-semibold">{activity.points}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Mục tiêu tuần này</h3>
            <Target className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Chia sẻ sản phẩm</span>
                <span className="text-sm text-gray-500">7/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Review sản phẩm</span>
                <span className="text-sm text-gray-500">3/5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Kết nối bạn bè</span>
                <span className="text-sm text-gray-500">4/8</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}