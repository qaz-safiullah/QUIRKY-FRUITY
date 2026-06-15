import React, { useState } from 'react';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import './CheckoutModal.css';

const CheckoutModal = ({ cart, onUpdateQuantity, onRemoveItem, onClose, onSubmitOrder, onContinueShopping }) => {
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState('');

  const total = cart
    .reduce((sum, item) => sum + parseFloat(item.price.replace('$', '')) * item.quantity, 0)
    .toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const items = cart.map((item) => ({
        productId: item.id,
        name: item.name || item.title?.replace(/<br\s*\/?>/gi, ' ') || '',
        price: item.price,
        quantity: item.quantity,
      }));
      await onSubmitOrder({ items });
      setOrderSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="checkout-overlay" onClick={handleOverlayClick}>
      <div className="checkout-modal">
        <button className="checkout-close" onClick={onClose}>&times;</button>

        {orderSuccess ? (
          <div className="checkout-success">
            <div className="success-icon">&#10003;</div>
            <h2>Order Placed!</h2>
            <p>Thank you for your purchase. Your order has been confirmed.</p>
            <button className="btn-black btn-submit" onClick={onContinueShopping}>
              CONTINUE SHOPPING
            </button>
          </div>
        ) : (
          <>
            <h2 className="checkout-title">Your Cart</h2>

            {cart.length === 0 ? (
              <div className="checkout-empty">
                <p>Your cart is empty.</p>
                <button className="btn-black btn-submit" onClick={onContinueShopping}>
                  START SHOPPING
                </button>
              </div>
            ) : (
              <form className="checkout-form" onSubmit={handleSubmit}>
                <div className="checkout-items">
                  {cart.map((item) => (
                    <div key={item.id} className="checkout-item">
                      <div className="checkout-item-image">
                        {item.image && (
                          <img src={item.image} alt={item.name || 'Product'} />
                        )}
                      </div>
                      <div className="checkout-item-info">
                        <h4>{item.name || item.title?.replace(/<br\s*\/?>/gi, ' ')}</h4>
                        <span className="checkout-item-price">{item.price}</span>
                      </div>
                      <div className="checkout-item-qty">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          <RemoveIcon fontSize="small" />
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <AddIcon fontSize="small" />
                        </button>
                      </div>
                      <div className="checkout-item-total">
                        ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                      </div>
                      <button
                        type="button"
                        className="checkout-item-remove"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="checkout-total-row">
                  <span>Total</span>
                  <span className="checkout-total-amount">${total}</span>
                </div>

                {error && <p className="checkout-error">{error}</p>}

                <button
                  type="submit"
                  className="btn-black btn-submit"
                  disabled={submitting}
                >
                  {submitting ? 'PLACING ORDER...' : 'PLACE ORDER'}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
