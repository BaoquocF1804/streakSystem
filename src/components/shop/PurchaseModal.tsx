import React, { useState } from 'react';
import { Modal, Button, message, Divider } from 'antd';
import { ShoppingCartOutlined, GiftOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import confetti from 'react-confetti';
import { Product } from '../../types';
import { useAppStore } from '../../stores/appStore';

interface PurchaseModalProps {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ visible, product, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const { placeOrder, shoppingStreak } = useAppStore();

  if (!product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handlePurchase = async () => {
    setLoading(true);
    
    setTimeout(() => {
      const oldStreak = shoppingStreak.currentStreak;
      placeOrder(product.id);
      
      // Show confetti
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      // Check if reached milestone
      const newStreak = oldStreak + 1;
      const reachedMilestone = shoppingStreak.rewards.some(r => r.day === newStreak && !r.claimed);
      
      if (reachedMilestone) {
        setShowReward(true);
      }
      
      message.success('🎉 Đặt hàng thành công! Shopping streak tăng!');
      setLoading(false);
      
      setTimeout(() => {
        onClose();
        setShowReward(false);
      }, 2000);
    }, 1500);
  };

  return (
    <>
      {showConfetti && (
        <confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={150}
        />
      )}
      
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <ShoppingCartOutlined className="text-blue-500" />
            <span>Xác nhận đặt hàng</span>
          </div>
        }
        open={visible}
        onCancel={onClose}
        footer={null}
        width={500}
      >
        <div className="space-y-6">
          {/* Product Info */}
          <div className="flex space-x-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                {product.description}
              </p>
              <div className="text-xl font-bold text-blue-600">
                {formatPrice(product.price)}
              </div>
            </div>
          </div>

          <Divider />

          {/* Streak Info */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
              <GiftOutlined className="mr-2" />
              Shopping Streak Bonus
            </h4>
            <div className="text-sm text-purple-700">
              <p>• Streak hiện tại: <strong>{shoppingStreak.currentStreak} ngày</strong></p>
              <p>• Sau khi mua: <strong>{shoppingStreak.currentStreak + 1} ngày</strong></p>
              {shoppingStreak.rewards.find(r => r.day === shoppingStreak.currentStreak + 1 && !r.claimed) && (
                <p className="text-purple-800 font-medium mt-2">
                  🎁 Bạn sẽ nhận được phần thưởng đặc biệt!
                </p>
              )}
            </div>
          </div>

          {showReward && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-2 border-yellow-300"
            >
              <div className="text-center">
                <div className="text-3xl mb-2">🎉</div>
                <h4 className="font-bold text-yellow-800 mb-1">
                  Chúc mừng! Bạn đã đạt mốc streak!
                </h4>
                <p className="text-yellow-700 text-sm">
                  Nhận thưởng đặc biệt cho shopping streak của bạn!
                </p>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={onClose}
              className="flex-1"
              size="large"
            >
              Hủy
            </Button>
            <Button
              type="primary"
              loading={loading}
              onClick={handlePurchase}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 border-none"
              size="large"
            >
              Xác nhận mua hàng
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PurchaseModal;