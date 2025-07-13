import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StreakBanner from '../components/shop/StreakBanner';
import ProductList from '../components/shop/ProductList';
import PurchaseModal from '../components/shop/PurchaseModal';
import DailyCheckinModal from '../components/streak/DailyCheckinModal';
import { useAppStore } from '../stores/appStore';
import { Product } from '../types';

const ShopPage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  
  const { 
    products, 
    showCheckinModal, 
    setShowCheckinModal, 
    checkShouldShowCheckinModal 
  } = useAppStore();

  useEffect(() => {
    // Check if should show checkin modal when page loads
    const shouldShow = checkShouldShowCheckinModal();
    if (shouldShow) {
      // Delay to show modal after page loads
      setTimeout(() => {
        setShowCheckinModal(true);
      }, 1000);
    }
  }, [checkShouldShowCheckinModal, setShowCheckinModal]);

  const handleBuyNow = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setShowPurchaseModal(true);
    }
  };

  const handleClosePurchaseModal = () => {
    setShowPurchaseModal(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Streak Banner */}
          <StreakBanner />

          {/* Products Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Sản phẩm nổi bật
              </h2>
              <p className="text-gray-600">
                Khám phá các sản phẩm chất lượng và duy trì streak để nhận ưu đãi đặc biệt
              </p>
            </div>

            <ProductList
              products={products}
              onBuyNow={handleBuyNow}
            />
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <DailyCheckinModal
        visible={showCheckinModal}
        onClose={() => setShowCheckinModal(false)}
      />

      <PurchaseModal
        visible={showPurchaseModal}
        product={selectedProduct}
        onClose={handleClosePurchaseModal}
      />
    </>
  );
};

export default ShopPage;