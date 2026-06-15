import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product, showToast, onAuthRequest }) => {
  const { user } = useAuth();
  const { cart, addToCart, removeFromCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const cartItem = cart.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  useEffect(() => {
    let timer;
    if (isAdded) {
      timer = setTimeout(() => {
        setIsAdded(false);
      }, 350);
    }
    return () => clearTimeout(timer); 
  }, [isAdded]);

  const handleIncrement = () => {
    addToCart(product);
    setIsAdded(true);
    if (showToast) showToast('Added to cart!', 'success');
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      removeFromCart(product.id);
      if (showToast) showToast('Removed from cart', 'error');
    }
  };

  return (
    <div className="product-card">
      
      <div className="card-image-stack">
        <img src={product.burstImage} alt="burst background" className="card-burst" />
        <img src={product.image} alt="fruit character" className="card-fruit" />
      </div>

      <br />
      <br />

      <h3 className="card-title" dangerouslySetInnerHTML={{ __html: product.title }}></h3>
      <p className="card-price">{product.price}</p>

      {user ? (
        isAdded && quantity === 1 ? (
          <button className="btn-add-cart" style={{ backgroundColor: '#2d6a4f', color: '#fff' }} disabled>
            ADDED
          </button>
        ) : quantity === 0 ? (
          <button className="btn-add-cart" onClick={handleIncrement}>
            ADD TO CART
          </button>
        ) : (
          <div className="cart-controls active">
            <button className="btn-qty" onClick={handleDecrement}>
              <RemoveIcon fontSize="small" />
            </button>
            <span className="qty-text">{quantity}</span>
            <button className="btn-qty" onClick={handleIncrement}>
              <AddIcon fontSize="small" />
            </button>
          </div>
        )
      ) : (
        <button className="btn-add-cart" onClick={onAuthRequest}>
          LOGIN TO BUY
        </button>
      )}
    </div>
  );
};

export default ProductCard;
