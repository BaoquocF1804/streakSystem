import React, { useState } from 'react';
import { MessageSquare, Users, Trophy, Clock, Camera, FileText, Star, CheckCircle, AlertCircle, Gift } from 'lucide-react';

interface ReviewChallengeProps {
  challenge: {
    id: string;
    product: {
      name: string;
      image: string;
      price: number;
    };
    participants: Array<{
      id: string;
      name: string;
      avatar: string;
    }>;
    deadline: Date;
    status: 'pending' | 'in_progress' | 'completed';
    progress: Array<{
      userId: string;
      reviewCompleted: boolean;
      imagesUploaded: number;
      textLength: number;
    }>;
  };
}

export default function ReviewChallenge({ challenge }: ReviewChallengeProps) {
  const [currentTab, setCurrentTab] = useState<'overview' | 'progress' | 'rewards'>('overview');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);

  const timeLeft = Math.max(0, Math.ceil((challenge.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
  const totalProgress = challenge.progress.reduce((acc, p) => acc + (p.reviewCompleted ? 1 : 0), 0);
  const progressPercentage = (totalProgress / challenge.participants.length) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'in_progress': return 'Đang thực hiện';
      case 'completed': return 'Hoàn thành';
      default: return 'Không xác định';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Review Song Hành</h2>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(challenge.status)}`}>
            {getStatusText(challenge.status)}
          </div>
        </div>
        <p className="text-green-100">Cùng bạn bè review sản phẩm và nhận thưởng đặc biệt</p>
      </div>

      <div className="p-6">
        {/* Product Info */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-6 border border-gray-200">
          <div className="flex items-center space-x-4">
            <img
              src={challenge.product.image}
              alt={challenge.product.name}
              className="w-20 h-20 rounded-xl object-cover shadow-md"
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{challenge.product.name}</h3>
              <p className="text-2xl font-bold text-green-600">{challenge.product.price.toLocaleString()}đ</p>
            </div>
            <div className="text-center">
              <div className="flex items-center space-x-1 mb-1">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-600">Còn lại</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">{timeLeft}</p>
              <p className="text-sm text-gray-500">ngày</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Tiến độ thử thách</span>
            <span className="text-sm text-gray-500">{totalProgress}/{challenge.participants.length} hoàn thành</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-green-500 to-teal-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-xl p-1">
          {[
            { id: 'overview', label: 'Tổng quan', icon: MessageSquare },
            { id: 'progress', label: 'Tiến độ', icon: Users },
            { id: 'rewards', label: 'Phần thưởng', icon: Gift }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                  currentTab === tab.id
                    ? 'bg-white text-green-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {currentTab === 'overview' && (
          <div className="space-y-6">
            {/* Participants */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4">Người tham gia</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challenge.participants.map((participant, index) => {
                  const progress = challenge.progress.find(p => p.userId === participant.id);
                  return (
                    <div key={participant.id} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                      <img
                        src={participant.avatar}
                        alt={participant.name}
                        className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{participant.name}</p>
                        <div className="flex items-center space-x-2">
                          {progress?.reviewCompleted ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-yellow-500" />
                          )}
                          <span className="text-sm text-gray-600">
                            {progress?.reviewCompleted ? 'Đã hoàn thành' : 'Đang thực hiện'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Review Form */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h4 className="text-lg font-bold text-blue-900 mb-4">Viết review của bạn</h4>
              
              {/* Rating */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá sao</label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-colors"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung review</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
                <p className="text-sm text-gray-500 mt-1">{reviewText.length}/500 ký tự (tối thiểu 100)</p>
              </div>

              {/* Upload Images */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Thêm hình ảnh</label>
                <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer">
                  <div className="text-center">
                    <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Nhấn để tải lên hình ảnh</p>
                    <p className="text-xs text-gray-500">Tối thiểu 2 ảnh, tối đa 5 ảnh</p>
                  </div>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all">
                Gửi review
              </button>
            </div>
          </div>
        )}

        {currentTab === 'progress' && (
          <div className="space-y-4">
            {challenge.participants.map((participant) => {
              const progress = challenge.progress.find(p => p.userId === participant.id);
              return (
                <div key={participant.id} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={participant.avatar}
                      alt={participant.name}
                      className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{participant.name}</h4>
                      <p className="text-sm text-gray-600">
                        {progress?.reviewCompleted ? 'Đã hoàn thành review' : 'Đang viết review'}
                      </p>
                    </div>
                    {progress?.reviewCompleted && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <FileText className={`w-6 h-6 mx-auto mb-1 ${progress?.textLength && progress.textLength > 100 ? 'text-green-500' : 'text-gray-400'}`} />
                      <p className="text-xs text-gray-600">Văn bản</p>
                      <p className="text-sm font-medium">{progress?.textLength || 0}/100</p>
                    </div>
                    <div className="text-center">
                      <Camera className={`w-6 h-6 mx-auto mb-1 ${progress?.imagesUploaded && progress.imagesUploaded >= 2 ? 'text-green-500' : 'text-gray-400'}`} />
                      <p className="text-xs text-gray-600">Hình ảnh</p>
                      <p className="text-sm font-medium">{progress?.imagesUploaded || 0}/2</p>
                    </div>
                    <div className="text-center">
                      <Star className={`w-6 h-6 mx-auto mb-1 ${progress?.reviewCompleted ? 'text-green-500' : 'text-gray-400'}`} />
                      <p className="text-xs text-gray-600">Đánh giá</p>
                      <p className="text-sm font-medium">{progress?.reviewCompleted ? '✓' : '○'}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {currentTab === 'rewards' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
              <div className="flex items-center space-x-3 mb-4">
                <Trophy className="w-8 h-8 text-orange-600" />
                <h4 className="text-xl font-bold text-orange-800">Phần thưởng khi hoàn thành</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h5 className="font-bold text-gray-900 mb-2">Huy hiệu "Reviewer Đồng Hành"</h5>
                  <p className="text-sm text-gray-600">Huy hiệu độc quyền hiển thị trên profile</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Gift className="w-8 h-8 text-white" />
                  </div>
                  <h5 className="font-bold text-gray-900 mb-2">600 điểm thưởng</h5>
                  <p className="text-sm text-gray-600">Gấp đôi so với review thông thường</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
              <h4 className="text-lg font-bold text-purple-900 mb-4">Phần thưởng tương tác</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Mỗi lượt "Thích" trên review</span>
                  <span className="font-bold text-purple-600">+10 điểm</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Mỗi lượt "Hữu ích" trên review</span>
                  <span className="font-bold text-purple-600">+20 điểm</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Khi review đạt top 10 hữu ích</span>
                  <span className="font-bold text-purple-600">+500 điểm</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}