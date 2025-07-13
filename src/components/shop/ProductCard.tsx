import React from 'react';
import { Card, Button, Tag } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Product } from '../../types';

const { Meta } = Card;

interface ProductCardProps {
  product: Product;
  onBuyNow: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onBuyNow }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        hoverable
        className="h-full shadow-sm border-gray-200"
        cover={
          <div className="relative overflow-hidden">
            <img
              alt={product.name}
              src={product.image}
              className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
            />
            <Tag
              color="blue"
              className="absolute top-2 left-2"
            >
              {product.category}
            </Tag>
          </div>
        }
        actions={[
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={() => onBuyNow(product.id)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 border-none"
          >
            Mua ngay
          </Button>
        ]}
      >
        <Meta
          title={
            <div className="text-lg font-semibold text-gray-800 mb-2">
              {product.name}
            </div>
          }
          description={
            <div className="space-y-2">
              <p className="text-gray-600 text-sm line-clamp-2">
                {product.description}
              </p>
              <div className="text-xl font-bold text-blue-600">
                {formatPrice(product.price)}
              </div>
            </div>
          }
        />
      </Card>
    </motion.div>
  );
};

export default ProductCard;