import React, { useState } from 'react';
import { Share2, Users, Gift, Copy, Facebook, MessageCircle, Mail, Link2, Star, Heart, ShoppingCart, CheckCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  category: string;
}

interface ProductShareProps {
  product: Product;
  onShare: (product: Product, platform: string) => void;
}

export default function ProductShare({ product, onShare }: ProductShareProps) {
  const [shareUrl, setShareUrl] = useState(`https://shop.com/p/${product.id}?ref=friend_chain`);
  const [copied, setCopied] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const friends = [
    { id: '1', name: 'Minh Anh', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100&h=100&fit=crop', online: true },
    { id: '2', name: 'Thùy Linh', avatar: 'https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?w=100&h=100&fit=crop', online: false },
    { id: '3', name: 'Đức Minh', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100&h=100&fit=crop', online: true },
    { id: '4', name: 'Hương Giang', avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?w=100&h=100&fit=crop', online: true }
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sharePlatforms = [
    { name: 'Facebook', icon: Facebook, color: 'bg-blue-600', action: () => onShare(product, 'facebook') },
    { name: 'Zalo', icon: MessageCircle, color: 'bg-blue-500', action: () => onShare(product, 'zalo') },
    { name: 'Email', icon: Mail, color: 'bg-gray-600', action: () => onShare(product, 'email') },
    { name: 'Link', icon: Link2, color: 'bg-purple-600', action: copyToClipboard }
  ];

  const toggleFriend = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-white bg-opacity-20 rounded-lg">
            <Share2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold">Chia Sẻ & Nhận Thưởng</h2>
        </div>
        <p className="text-blue-100">Chia sẻ sản phẩm với bạn bè và cùng nhận điểm thưởng khi họ tương tác</p>
      </div>

      <div className="p-6">
        {/* Product Card */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-6 border border-gray-200">
          <div className="flex items-start space-x-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-24 h-24 rounded-xl object-cover shadow-md"
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product.rating})</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-blue-600">{product.price.toLocaleString()}đ</p>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {product.category}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Rewards Info */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 mb-6 border border-yellow-200">
          <div className="flex items-center space-x-3 mb-4">
            <Gift className="w-6 h-6 text-orange-600" />
            <h3 className="text-lg font-bold text-orange-800">Phần thưởng khi chia sẻ</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <Heart className="w-8 h-8 text-pink-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Yêu thích</p>
              <p className="text-xl font-bold text-pink-600">+50 điểm</p>
            </div>
            <div className="text-center">
              <ShoppingCart className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Thêm giỏ hàng</p>
              <p className="text-xl font-bold text-blue-600">+100 điểm</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Mua hàng</p>
              <p className="text-xl font-bold text-green-600">+500 điểm</p>
            </div>
          </div>
        </div>

        {/* Share URL */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Link chia sẻ</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700"
            />
            <button
              onClick={copyToClipboard}
              className={`px-4 py-3 rounded-xl font-medium transition-all ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {copied ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Share Platforms */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">Chia sẻ qua</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {sharePlatforms.map((platform, index) => {
              const Icon = platform.icon;
              return (
                <button
                  key={index}
                  onClick={platform.action}
                  className={`${platform.color} text-white p-4 rounded-xl hover:opacity-90 transition-all hover:scale-105 flex flex-col items-center space-y-2`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{platform.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Friends List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">Chọn bạn bè</label>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">{selectedFriends.length} đã chọn</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {friends.map((friend) => (
              <div
                key={friend.id}
                onClick={() => toggleFriend(friend.id)}
                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 ${
                  selectedFriends.includes(friend.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="relative inline-block mb-2">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                    />
                    {friend.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate">{friend.name}</p>
                </div>
                {selectedFriends.includes(friend.id) && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105">
            Gửi lời mời ({selectedFriends.length} bạn)
          </button>
        </div>
      </div>
    </div>
  );
}