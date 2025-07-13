import React from 'react';
import { Row, Col } from 'antd';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { Product } from '../../types';

interface ProductListProps {
  products: Product[];
  onBuyNow: (productId: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onBuyNow }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
            <motion.div variants={itemVariants}>
              <ProductCard
                product={product}
                onBuyNow={onBuyNow}
              />
            </motion.div>
          </Col>
        ))}
      </Row>
    </motion.div>
  );
};

export default ProductList;