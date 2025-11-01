import { useState } from 'react';
import { X, CreditCard, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { paymentsAPI } from '../utils/api';

const PaymentForm = ({ booking, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (paymentMethod === 'card' && (!cardNumber || !cardName || !expiryDate || !cvv)) {
      toast.error('Please fill all card details');
      return;
    }

    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create payment intent
      const { data } = await paymentsAPI.createPaymentIntent({
        bookingId: booking._id,
        paymentMethod,
      });

      const { paymentIntentId } = data;

      // Confirm payment on backend
      await paymentsAPI.confirmPayment({
        bookingId: booking._id,
        transactionId: paymentIntentId,
        paymentMethod,
      });

      toast.success('Payment successful!');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Method
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`p-3 border-2 rounded-lg flex items-center justify-center gap-2 ${
              paymentMethod === 'card' ? 'border-red-600 bg-red-50' : 'border-gray-300'
            }`}
          >
            <CreditCard className="h-5 w-5" />
            <span>Card</span>
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('upi')}
            className={`p-3 border-2 rounded-lg flex items-center justify-center gap-2 ${
              paymentMethod === 'upi' ? 'border-red-600 bg-red-50' : 'border-gray-300'
            }`}
          >
            <span>UPI</span>
          </button>
        </div>
      </div>

      {paymentMethod === 'card' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Number
            </label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim())}
              maxLength="19"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.length >= 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2, 4);
                  }
                  setExpiryDate(value);
                }}
                maxLength="5"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <input
                type="text"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                maxLength="3"
                className="input-field"
                required
              />
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'upi' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            UPI ID
          </label>
          <input
            type="text"
            placeholder="yourname@upi"
            className="input-field"
          />
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Booking Amount</span>
          <span className="font-semibold">₹{booking.totalAmount}</span>
        </div>
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total</span>
          <span className="text-red-600">₹{booking.totalAmount}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 btn-secondary"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 btn-primary flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ₹${booking.totalAmount}`
          )}
        </button>
      </div>
    </form>
  );
};

const PaymentModal = ({ booking, isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Payment</h2>

        <PaymentForm booking={booking} onSuccess={onSuccess} onClose={onClose} />
      </div>
    </div>
  );
};

export default PaymentModal;
