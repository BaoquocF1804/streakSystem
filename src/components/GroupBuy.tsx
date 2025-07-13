import React, { useState } from 'react';
import { ShoppingCart, Users, Clock, Zap, Gift, Crown, Target, TrendingDown } from 'lucide-react';

interface GroupBuyProps {
  groupBuy: {
    id: string;
    product: {
      name: string;
      image: string;
      originalPrice: number;
      discountedPrice: number;
      category: string;
    };
    organizer: {
      name: string;
      avatar: string;
    };
    participants: Array<{
      id: string;
      name: string;
      avatar: string;
      joinedAt: Date;
    }>;
    targetCount: number;
    currentCount: number;
    deadline: Date;
    status: 'recruiting' | 'active' | 'completed';
  };
}

export default function GroupBuy({ groupBuy }: GroupBuyProps) {
  const [showParticipants, setShowParticipants] = useState(false);
  
  const timeLeft = Math.max(0, Math.ceil((groupBuy.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60)));
  const progressPercentage = (groupBuy.currentCount / groupBuy.targetCount) * 100;
  const discount = ((groupBuy.product.originalPrice - groupBuy.product.discountedPrice) / groupBuy.product.originalPrice) * 100;
  const spotsLeft = groupBuy.targetCount - groupBuy.currentCount;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recruiting': return 'text-blue-600 bg-blue-100';
      case 'active': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'recruiting': return 'Đang tuyển thành viên';
      case 'active': return 'Đang diễn ra';
      case 'completed': return 'Hoàn thành';
      default: return 'Không xác định';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Mua Chung Tiết Kiệm</h2>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(groupBuy.status)}`}>
            {getStatusText(groupBuy.status)}
          </div>
        </div>
        <p className="text-purple-100">Tập hợp bạn bè mua chung, giá tốt hơn cho tất cả</p>
      </div>

      <div className="p-6">
        {/* Product Card with Discount */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-6 border border-gray-200 relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            -{Math.round(discount)}%
          </div>
          <div className="flex items-start space-x-4">
            <img
              src={groupBuy.product.image}
              alt={groupBuy.product.name}
              className="w-24 h-24 rounded-xl object-cover shadow-md"
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{groupBuy.product.name}</h3>
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl font-bold text-red-600">{groupBuy.product.discountedPrice.toLocaleString()}đ</span>
                <span className="text-lg text-gray-500 line-through">{groupBuy.product.originalPrice.toLocaleString()}đ</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingDown className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">
                  Tiết kiệm {(groupBuy.product.originalPrice - groupBuy.product.discountedPrice).toLocaleString()}đ
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-900">Tiến độ tham gia</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-600">{groupBuy.currentCount}/{groupBuy.targetCount}</p>
              <p className="text-sm text-gray-500">thành viên</p>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500 relative"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            >
              {progressPercentage >= 100 && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {spotsLeft > 0 ? `Còn ${spotsLeft} suất` : 'Đã đủ thành viên'}
            </span>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-orange-600 font-medium">{timeLeft} giờ còn lại</span>
            </div>
          </div>
        </div>

        {/* Organizer */}
        <div className="bg-yellow-50 rounded-2xl p-4 mb-6 border border-yellow-200">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={groupBuy.organizer.avatar}
                alt={groupBuy.organizer.name}
                className="w-12 h-12 rounded-full border-2 border-yellow-300 shadow-md"
              />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <Crown className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <p className="font-bold text-yellow-800">{groupBuy.organizer.name}</p>
              <p className="text-sm text-yellow-700">Người tổ chức nhóm mua</p>
            </div>
            <div className="ml-auto">
              <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                ORGANIZER
              </div>
            </div>
          </div>
        </div>

        {/* Participants Preview */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-gray-900">Thành viên tham gia</h4>
            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm"
            >
              {showParticipants ? 'Thu gọn' : 'Xem tất cả'}
            </button>
          </div>
          
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex -space-x-2">
              {groupBuy.participants.slice(0, 5).map((participant, index) => (
                <img
                  key={participant.id}
                  src={participant.avatar}
                  alt={participant.name}
                  className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                  style={{ zIndex: 10 - index }}
                />
              ))}
              {groupBuy.participants.length > 5 && (
                <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-md flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-600">+{groupBuy.participants.length - 5}</span>
                </div>
              )}
            </div>
            <span className="text-sm text-gray-600">
              {groupBuy.participants.length} người đã tham gia
            </span>
          </div>

          {showParticipants && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {groupBuy.participants.map((participant) => (
                <div key={participant.id} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-8 h-8 rounded-full border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{participant.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(participant.joinedAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rewards for Organizer */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 border border-purple-200">
          <div className="flex items-center space-x-3 mb-4">
            <Gift className="w-6 h-6 text-purple-600" />
            <h4 className="text-lg font-bold text-purple-900">Phần thưởng người tổ chức</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-700">Thành công</p>
              <p className="text-lg font-bold text-purple-600">+200 điểm</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-700">Voucher tiếp theo</p>
              <p className="text-lg font-bold text-pink-600">5% OFF</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-700">Huy hiệu</p>
              <p className="text-lg font-bold text-orange-600">Leader</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {groupBuy.status === 'recruiting' && spotsLeft > 0 ? (
            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105">
              Tham gia nhóm mua ({groupBuy.product.discountedPrice.toLocaleString()}đ)
            </button>
          ) : progressPercentage >= 100 ? (
            <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-green-700 transition-all">
              Mua ngay - Deal đã kích hoạt!
            </button>
          ) : (
            <div className="w-full bg-gray-100 text-gray-500 py-4 px-6 rounded-xl font-semibold text-lg text-center">
              Nhóm mua đã đầy hoặc hết hạn
            </div>
          )}
          
          <button className="w-full border-2 border-purple-500 text-purple-600 py-3 px-6 rounded-xl font-semibold hover:bg-purple-50 transition-all">
            Chia sẻ với bạn bè
          </button>
        </div>
      </div>
    </div>
  );
}