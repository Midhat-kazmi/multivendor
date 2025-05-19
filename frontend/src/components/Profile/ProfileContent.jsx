import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProfileContent = ({ active, user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    zipCode: user?.zipCode || '',
    phoneNumber: user?.phoneNumber || '',
    address1: user?.address1 || '',
    address2: user?.address2 || '',
    cardNumber: '',
    expirationDate: '',
    cvv: '',
  });

  const [orderId, setOrderId] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = () => {
    console.log('Updated data:', formData);
  };

  const handleTrackOrder = () => {
    const mockResult = {
      id: orderId,
      status: 'In Transit',
      estimatedDelivery: 'May 12, 2025',
      lastLocation: 'Lahore Distribution Center',
    };
    setTrackingResult(mockResult);
  };

  const renderContent = () => {
    switch (active) {
      case 1:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">My Account</h2>
            {user?.avatar?.url && (
              <img
                src={`http://localhost:8000${user.avatar.url}`}
                alt="Profile"
                className="w-24 h-24 rounded-full border border-gray-300 mb-4 object-cover"
              />
            )}
            <div className="space-y-4">
              {['name', 'email', 'zipCode', 'phoneNumber', 'address1', 'address2'].map((field) => (
                <div key={field}>
                  <label className="block text-gray-700 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              ))}
              <button
                onClick={handleUpdate}
                className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-md"
              >
                Update
              </button>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border">Order ID</th>
                    <th className="py-2 px-4 border">Status</th>
                    <th className="py-2 px-4 border">Qty</th>
                    <th className="py-2 px-4 border">Total</th>
                    <th className="py-2 px-4 border">Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-center">
                    <td className="py-2 px-4 border">#123456</td>
                    <td className="py-2 px-4 border">Shipped</td>
                    <td className="py-2 px-4 border">3</td>
                    <td className="py-2 px-4 border">$150</td>
                    <td className="py-2 px-4 border">
                      <Link to={`/orders/${user?.id}`} className="text-blue-500 hover:underline">
                        ➜
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Wishlist</h2>
            <p>Items you've saved for later appear here.</p>
          </>
        );

      case 4:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Inbox</h2>
            <p>Messages and updates from the shop.</p>
          </>
        );

      case 5:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Refund Requests</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border">Order ID</th>
                    <th className="py-2 px-4 border">Status</th>
                    <th className="py-2 px-4 border">Reason</th>
                    <th className="py-2 px-4 border">Date</th>
                    <th className="py-2 px-4 border">Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-center">
                    <td className="py-2 px-4 border">#654321</td>
                    <td className="py-2 px-4 border">Pending</td>
                    <td className="py-2 px-4 border">Damaged item</td>
                    <td className="py-2 px-4 border">May 5, 2025</td>
                    <td className="py-2 px-4 border">
                      <Link to={`/refunds/${user?.id}`} className="text-blue-500 hover:underline">
                        ➜
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        );

      case 6:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Track Your Order</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Enter Order ID</label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. ORD123456"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <button
                onClick={handleTrackOrder}
                className="bg-blue-500 text-white py-2 px-6 rounded-md"
              >
                Track Order
              </button>

              {trackingResult && (
                <div className="mt-6 p-4 bg-gray-100 rounded-md border">
                  <h3 className="text-lg font-semibold mb-2">Tracking Details</h3>
                  <p><strong>Order ID:</strong> {trackingResult.id}</p>
                  <p><strong>Status:</strong> {trackingResult.status}</p>
                  <p><strong>Estimated Delivery:</strong> {trackingResult.estimatedDelivery}</p>
                  <p><strong>Last Location:</strong> {trackingResult.lastLocation}</p>
                </div>
              )}
            </div>
          </>
        );

      case 7:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Payment Methods</h2>
            <div className="space-y-4 mt-6">
              <div>
                <label className="block text-gray-700">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9876 5432"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700">Expiration Date</label>
                <input
                  type="text"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <button
                onClick={handleUpdate}
                className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-md"
              >
                Save Payment Method
              </button>
            </div>
          </>
        );

      case 8:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Address Details</h2>
            <div className="bg-gray-100 p-4 rounded-md shadow-sm space-y-2">
              <p><strong>Address 1:</strong> {formData.address1 || '123 Main Street'}</p>
              <p><strong>Address 2:</strong> {formData.address2 || 'Apartment 4B'}</p>
              <p><strong>Zip Code:</strong> {formData.zipCode || '12345'}</p>
              <p><strong>Phone Number:</strong> {formData.phoneNumber || '+9200000000'}</p>
            </div>
          </>
        );

      default:
        return <p>Select a section from the sidebar.</p>;
    }
  };

  return (
    <div className="flex-1 bg-white rounded-lg shadow-md p-4 sm:p-6 ml-0 sm:ml-6 min-h-[300px] w-full">
      {renderContent()}
    </div>
  );
};

export default ProfileContent;
